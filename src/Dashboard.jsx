import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Download, LogOut, Mail, MessageCircle, Phone, RefreshCw, Search, Undo2 } from "lucide-react";
import { CSS, SUPABASE } from "../mitesh-realestate.jsx";

/* Leads dashboard — lives at /#/dashboard.

   The public site talks to Supabase with the publishable key, which may only
   INSERT enquiries. Reading them back needs the one super admin recorded in
   public.admins (see add-dashboard.sql), so this page signs in through Supabase
   Auth and sends that user's token instead. */

/* ---------- session ---------- */
const KEY = "mrs-admin-session";
const stored = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } };

let session = stored();
let refreshing = null;

const setSession = (s) => {
  session = s;
  try { s ? localStorage.setItem(KEY, JSON.stringify(s)) : localStorage.removeItem(KEY); } catch { /* private mode */ }
};

const toSession = (d) => ({
  access: d.access_token,
  refresh: d.refresh_token,
  expiresAt: Date.now() + d.expires_in * 1000,
  email: d.user?.email || "",
});

const call = async (url, { method = "GET", body, headers, token } = {}) => {
  const res = await fetch(`${SUPABASE.url}${url}`, {
    method,
    headers: {
      apikey: SUPABASE.anonKey,
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = new Error(data?.msg || data?.error_description || data?.message || `Supabase ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
};

const signIn = async (email, password) =>
  setSession(toSession(await call("/auth/v1/token?grant_type=password", { method: "POST", body: { email, password } })));

const signOut = () => {
  const token = session?.access;
  setSession(null);
  if (token) call("/auth/v1/logout", { method: "POST", token }).catch(() => {});
};

/* Access tokens last an hour. Refresh tokens are single-use, so concurrent
   callers share one refresh instead of racing each other. */
const freshToken = async () => {
  if (!session) throw Object.assign(new Error("Signed out"), { status: 401 });
  if (session.expiresAt - Date.now() > 60_000) return session.access;
  refreshing ??= call("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: { refresh_token: session.refresh } })
    .then((d) => setSession(toSession(d)))
    .catch((err) => { if (err.status) { err.status = 401; setSession(null); } throw err; })
    .finally(() => { refreshing = null; });
  await refreshing;
  return session.access;
};

const rest = async (path, opts = {}) => call(`/rest/v1/${path}`, { ...opts, token: await freshToken() });

/* ---------- helpers ---------- */
/* enquiries_inbox returns received_ist as a zone-less IST timestamp with
   microseconds; trim to milliseconds and pin the offset so it parses anywhere. */
const receivedAt = (r) => new Date(`${String(r.received_ist).replace(" ", "T").replace(/(\.\d{3})\d+/, "$1")}+05:30`);

const formatWhen = (d) => d.toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit",
});

// the view shows "—" when the enquiry wasn't about a particular listing
const aboutOf = (r) => (r.enquired_about === "—" ? "General enquiry" : r.enquired_about);

const waLink = (phone) => `https://wa.me/91${phone.replace(/\D/g, "").slice(-10)}`;

const CSV_COLS = [
  ["Received (IST)", (r) => formatWhen(receivedAt(r))],
  ["Ref", (r) => r.ref],
  ["Name", (r) => r.name],
  ["Phone", (r) => r.phone],
  ["Email", (r) => r.email],
  ["Enquired about", aboutOf],
  ["Budget", (r) => r.budget],
  ["Preferred area", (r) => r.preferred_area],
  ["Message", (r) => r.message],
  ["Handled", (r) => (r.handled ? "Yes" : "No")],
];

/* Visitors type these values, so neutralise anything a spreadsheet would run
   as a formula before quoting it. */
const csvCell = (v) => {
  const s = v == null ? "" : String(v);
  return `"${(/^[=+\-@\t\r]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

const downloadCsv = (rows) => {
  const lines = [CSV_COLS.map(([h]) => csvCell(h)), ...rows.map((r) => CSV_COLS.map(([, get]) => csvCell(get(r))))];
  // the BOM makes Excel read the file as UTF-8, which the Hindi names need
  const blob = new Blob(["﻿" + lines.map((l) => l.join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
};

/* ---------- sign in ---------- */
const SignIn = ({ onDone }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try { await signIn(email.trim(), password); onDone(); }
    catch (err) { setError(err.status ? err.message : "Couldn't reach the server. Check your connection and try again."); }
    finally { setBusy(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <form onSubmit={onSubmit} className="bg-card border-line w-full max-w-sm rounded-2xl border p-7 shadow-sm">
        <span className="eyebrow">Admin only</span>
        <h1 className="font-display mt-3 text-2xl">Admin dashboard</h1>
        <p className="text-muted mt-2 text-sm">Sign in to see the enquiries sent from the website.</p>
        <div className="mt-6">
          <label className="label" htmlFor="dash-email">Email</label>
          <input id="dash-email" type="email" autoComplete="username" required className="field"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mt-4">
          <label className="label" htmlFor="dash-password">Password</label>
          <input id="dash-password" type="password" autoComplete="current-password" required className="field"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="err" role="alert">{error}</p>}
        <button type="submit" disabled={busy} className="btn btn-dark mt-6 w-full py-3 text-sm disabled:opacity-60">
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <a href="#" className="tap-inline text-muted mt-5 gap-1.5 text-sm hover:underline">
          <ArrowLeft size={14} /> Back to the website
        </a>
      </form>
    </div>
  );
};

/* ---------- leads ---------- */
const Stat = ({ label, value }) => (
  <div className="bg-card border-line rounded-2xl border px-5 py-4">
    <div className="overline-xs text-muted">{label}</div>
    <div className="font-display mt-1 text-3xl">{value}</div>
  </div>
);

const Detail = ({ label, children }) => (
  <div>
    <dt className="overline-xs text-muted">{label}</dt>
    <dd className="t-14 mt-1">{children || "—"}</dd>
  </div>
);

const LeadCard = ({ lead, busy, onToggle }) => (
  <article className="bg-card border-line rounded-2xl border p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="font-display text-xl">{lead.name}</h2>
        <p className="text-muted t-13 mt-1">{formatWhen(receivedAt(lead))} · {lead.ref}</p>
      </div>
      <span className="overline-xs rounded-full px-3 py-1.5"
        style={lead.handled ? { background: "rgba(21,36,32,.07)", color: "var(--muted)" } : { background: "var(--brass)", color: "#231A05" }}>
        {lead.handled ? "Handled" : "New"}
      </span>
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      <a href={`tel:${lead.phone.replace(/\s/g, "")}`} className="btn btn-ghost px-4 py-2 text-sm"><Phone size={14} /> {lead.phone}</a>
      <a href={waLink(lead.phone)} target="_blank" rel="noreferrer" className="btn btn-ghost px-4 py-2 text-sm"><MessageCircle size={14} /> WhatsApp</a>
      <a href={`mailto:${lead.email}`} className="btn btn-ghost break-all px-4 py-2 text-sm"><Mail size={14} /> {lead.email}</a>
    </div>

    <dl className="mt-5 grid gap-4 sm:grid-cols-3">
      <Detail label="Enquired about">
        {aboutOf(lead)}
        {lead.location && <span className="text-muted block t-13">{lead.location}</span>}
      </Detail>
      <Detail label="Budget">{lead.budget}</Detail>
      <Detail label="Preferred area">{lead.preferred_area}</Detail>
    </dl>

    {lead.message && (
      <p className="t-14 border-line mt-5 whitespace-pre-wrap break-words border-t pt-4">{lead.message}</p>
    )}

    <div className="mt-5">
      <button type="button" disabled={busy} onClick={() => onToggle(lead)}
        className={`btn px-4 py-2 text-sm disabled:opacity-60 ${lead.handled ? "btn-ghost" : "btn-dark"}`}>
        {lead.handled ? <><Undo2 size={14} /> Mark as new</> : <><Check size={14} /> Mark as handled</>}
      </button>
    </div>
  </article>
);

const TABS = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "handled", label: "Handled" },
];

const Leads = ({ onSignedOut }) => {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | denied | error
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fail = useCallback((err) => {
    if (err.status === 401) return onSignedOut();
    setError(err.message);
    setStatus("error");
  }, [onSignedOut]);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const [admin, data] = await Promise.all([
        rest("rpc/is_admin", { method: "POST", body: {} }),
        rest("enquiries_inbox?select=*&order=id.desc"),
      ]);
      setRows(data);
      setStatus(admin ? "ready" : "denied");
    } catch (err) { fail(err); }
  }, [fail]);

  useEffect(() => { load(); }, [load]);

  const onToggle = async (lead) => {
    const handled = !lead.handled;
    setBusyId(lead.id);
    try {
      await rest(`enquiries?id=eq.${lead.id}`, { method: "PATCH", body: { handled }, headers: { Prefer: "return=minimal" } });
      setRows((list) => list.map((r) => (r.id === lead.id ? { ...r, handled } : r)));
    } catch (err) { fail(err); }
    finally { setBusyId(null); }
  };

  const stats = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return {
      total: rows.length,
      fresh: rows.filter((r) => !r.handled).length,
      week: rows.filter((r) => receivedAt(r) >= weekAgo).length,
    };
  }, [rows]);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (tab === "new" && r.handled) return false;
      if (tab === "handled" && !r.handled) return false;
      if (!needle) return true;
      return [r.name, r.phone, r.email, r.ref, r.enquired_about, r.preferred_area, r.message]
        .some((v) => v && String(v).toLowerCase().includes(needle));
    });
  }, [rows, tab, q]);

  return (
    <>
      <header className="bg-deep text-ivory">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <div className="logo-sub text-brass">Mitesh Real Estate Solution</div>
            <h1 className="font-display text-2xl">Admin dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="t-13 mr-1 opacity-80">{session?.email}</span>
            <button type="button" onClick={load} disabled={status === "loading"} className="btn btn-ghost-ivory px-4 py-2 text-sm disabled:opacity-60">
              <RefreshCw size={14} /> Refresh
            </button>
            <button type="button" onClick={() => { signOut(); onSignedOut(); }} className="btn btn-ghost-ivory px-4 py-2 text-sm">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {status === "denied" && (
          <div className="bg-card border-line rounded-2xl border p-6">
            <h2 className="font-display text-xl">This account isn't the admin</h2>
            <p className="text-muted t-14 mt-2">
              Only the super admin can see enquiries, and {session?.email} isn't that account. Sign out
              and use the admin login — or, to make this the admin, put its email at the bottom of
              add-dashboard.sql and run that in the Supabase SQL editor.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="bg-card border-line rounded-2xl border p-6" role="alert">
            <h2 className="font-display text-xl">Couldn't load the enquiries</h2>
            <p className="err">{error}</p>
            <p className="text-muted t-14 mt-2">If this is the first time you're opening the dashboard, run add-dashboard.sql in the Supabase SQL editor first.</p>
            <button type="button" onClick={load} className="btn btn-dark mt-4 px-4 py-2 text-sm"><RefreshCw size={14} /> Try again</button>
          </div>
        )}

        {status === "loading" && !rows.length && <p className="text-muted">Loading enquiries…</p>}

        {(status === "ready" || (status === "loading" && rows.length > 0)) && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Total" value={stats.total} />
              <Stat label="New" value={stats.fresh} />
              <Stat label="Past week" value={stats.week} />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="relative min-w-0 flex-1" style={{ minWidth: "14rem" }}>
                <Search size={16} className="text-muted pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="search" aria-label="Search enquiries" placeholder="Search name, phone, email, property…"
                  className="field" style={{ paddingLeft: "2.4rem" }} value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <div className="flex gap-1.5">
                {TABS.map((t) => (
                  <button key={t.id} type="button" aria-pressed={tab === t.id} onClick={() => setTab(t.id)}
                    className={`btn px-4 py-2 text-sm ${tab === t.id ? "btn-dark" : "btn-ghost"}`}>
                    {t.label}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => downloadCsv(visible)} disabled={!visible.length} className="btn btn-ghost px-4 py-2 text-sm disabled:opacity-60">
                <Download size={14} /> Export CSV
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              {visible.map((lead) => <LeadCard key={lead.id} lead={lead} busy={busyId === lead.id} onToggle={onToggle} />)}
              {!visible.length && (
                <p className="text-muted bg-card border-line rounded-2xl border p-6 text-center">
                  {rows.length ? "No enquiries match this search or filter." : "No enquiries yet — they'll appear here as soon as someone submits the form on the website."}
                </p>
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default function Dashboard() {
  const [signedIn, setSignedIn] = useState(Boolean(session));

  useEffect(() => {
    const title = document.title;
    document.title = "Admin dashboard — Mitesh Real Estate Solution";
    return () => { document.title = title; };
  }, []);

  const onSignedOut = useCallback(() => setSignedIn(false), []);

  return (
    <div className="mrs min-h-screen">
      <style>{CSS}</style>
      {signedIn ? <Leads onSignedOut={onSignedOut} /> : <SignIn onDone={() => setSignedIn(true)} />}
    </div>
  );
}
