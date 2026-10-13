import React, { createContext, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Menu, X, MapPin, BedDouble, Bath, Ruler, Phone, Mail, Clock, Star,
  Building2, Home, KeyRound, TrendingUp, Handshake, ShieldCheck,
  ArrowRight, ArrowLeft, Search, RotateCcw, CheckCircle2, Loader2,
  MessageCircle, CalendarDays, Landmark
} from "lucide-react";
import crescentRender from "./src/assets/crescent-render.jpg";
import crescentPoster from "./src/assets/crescent-poster.jpg";
import gatewayRender from "./src/assets/gateway-render.jpg";
import gatewayPoster from "./src/assets/gateway-poster.jpg";
import aashrayRender from "./src/assets/aashray-render.jpg";
import aashrayPoster from "./src/assets/aashray-poster.jpg";
import forumRender from "./src/assets/forum-render.jpg";
import forumPoster from "./src/assets/forum-poster.jpg";
import bizCard from "./src/assets/biz-card.jpg";
import brandLogo from "./src/assets/brand-logo.jpg";

/* =========================================================================
   MITESH REALESTATE SOLUTION — single-file React app
   ---------------------------------------------------------------
   Structure (search these markers):
   1. STYLES ........... brand tokens, type, motion
   2. SITE CONFIG ...... contact info & nav (replace placeholders here)
   2b. IMAGE ASSETS .... project creatives (files in src/assets)
   3. DATA ............. properties / services / testimonials
   4. HELPERS .......... price & validation utilities
   5. ILLUSTRATIONS .... SVG "architect's elevation" art per property
   6. UI PRIMITIVES .... Eyebrow, buttons, badges, stars
   7. SECTIONS ......... Header, Hero, Filter, Cards, Details, Forms…
   8. APP .............. routing + state
   ========================================================================= */

/* 1. ===================== STYLES ===================== */
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Archivo:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap');

:root{
  --paper:#FAF7F0;        /* warm page ground */
  --card:#FFFFFF;
  --ink:#152420;          /* near-black green ink */
  --muted:#5C6B62;
  --deep:#0E2A23;         /* estate green */
  --deep-2:#143B30;
  --brass:#B9902F;        /* nameplate brass */
  --brass-soft:#D8B45E;
  --ivory:#EDE3CE;        /* elevation stone */
  --line:rgba(21,36,32,.14);
}
.mrs{ background:var(--paper); color:var(--ink);
  /* Archivo has no Devanagari glyphs — Noto catches the Hindi reviews so they
     don't fall back to a mismatched system font */
  font-family:'Archivo','Noto Sans Devanagari',ui-sans-serif,system-ui,sans-serif; }
.mrs ::selection{ background:var(--brass-soft); color:var(--deep); }
.font-display{ font-family:'Marcellus','Noto Sans Devanagari',Georgia,'Times New Roman',serif; letter-spacing:.005em; }
.text-muted{ color:var(--muted); }
.text-brass{ color:var(--brass); }
.text-ivory{ color:var(--ivory); }
.bg-deep{ background:var(--deep); }
.bg-card{ background:var(--card); }
.border-line{ border-color:var(--line); }

.eyebrow{ display:inline-flex; align-items:center; gap:.6rem; font-size:11px; font-weight:600;
  letter-spacing:.24em; text-transform:uppercase; color:var(--brass); }
.eyebrow::before{ content:""; width:26px; height:1px; background:var(--brass); }
.eyebrow--center::after{ content:""; width:26px; height:1px; background:var(--brass); }

.btn{ display:inline-flex; align-items:center; justify-content:center; gap:.5rem; font-weight:600;
  border-radius:9999px; transition:transform .25s ease, box-shadow .25s ease, background-color .25s ease,
  color .25s ease, border-color .25s ease; cursor:pointer; }
.btn:active{ transform:translateY(1px); }
.btn-primary{ background:var(--brass); color:#231A05; }
.btn-primary:hover{ background:var(--brass-soft); box-shadow:0 10px 24px -12px rgba(185,144,47,.7); }
.btn-dark{ background:var(--deep); color:var(--ivory); }
.btn-dark:hover{ background:var(--deep-2); box-shadow:0 10px 24px -12px rgba(14,42,35,.6); }
.btn-ghost{ background:transparent; color:var(--deep); border:1px solid var(--line); }
.btn-ghost:hover{ border-color:var(--deep); }
.btn-ghost-ivory{ background:transparent; color:var(--ivory); border:1px solid rgba(237,227,206,.35); }
.btn-ghost-ivory:hover{ border-color:var(--ivory); }
.btn .arrow{ transition:transform .25s ease; }
.btn:hover .arrow{ transform:translateX(3px); }

.lift{ transition:transform .35s ease, box-shadow .35s ease; }
.lift:hover{ transform:translateY(-6px); box-shadow:0 24px 48px -24px rgba(14,42,35,.35); }

.field{ width:100%; border:1px solid var(--line); border-radius:.75rem; background:#fff;
  padding:.7rem .9rem; font-size:.925rem; color:var(--ink); transition:border-color .2s, box-shadow .2s; }
.field::placeholder{ color:#9AA69F; }
.field:focus{ outline:none; border-color:var(--brass); box-shadow:0 0 0 3px rgba(185,144,47,.18); }
.field[aria-invalid="true"]{ border-color:#B4432F; }
select.field{ appearance:none; background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' fill='none' stroke='%235C6B62' stroke-width='1.6' stroke-linecap='round'/></svg>");
  background-repeat:no-repeat; background-position:right .9rem center; padding-right:2.4rem; }
.label{ display:block; font-size:.8rem; font-weight:600; letter-spacing:.02em; margin-bottom:.35rem; color:var(--ink); }
.err{ color:#B4432F; font-size:.78rem; margin-top:.35rem; }

.mrs a, .mrs button, .mrs input, .mrs select, .mrs textarea{ -webkit-tap-highlight-color:transparent; }
.mrs :focus-visible{ outline:2px solid var(--brass); outline-offset:2px; border-radius:4px; }

@keyframes riseIn{ from{ opacity:0; transform:translateY(18px);} to{ opacity:1; transform:none;} }
.rise{ animation:riseIn .7s ease both; }
.rise-1{ animation-delay:.08s } .rise-2{ animation-delay:.16s } .rise-3{ animation-delay:.24s }

/* Testimonials marquee — the track holds the reviews twice over, so translating
   it exactly half its width lands back on the start and the loop is seamless. */
@keyframes tmarquee{ from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
.tmarquee{ overflow:hidden; }
.tmarquee-track{ display:flex; animation:tmarquee var(--tm-duration,180s) linear infinite; will-change:transform; }
.tmarquee:hover .tmarquee-track,
.tmarquee:focus-within .tmarquee-track{ animation-play-state:paused; }
/* fade the cards into the section edges instead of clipping them dead */
.tmarquee-mask{ -webkit-mask-image:linear-gradient(to right,transparent,#000 6%,#000 94%,transparent);
  mask-image:linear-gradient(to right,transparent,#000 6%,#000 94%,transparent); }

/* type & layout utilities (replace Tailwind arbitrary values) */
.t-13{font-size:13.5px;} .t-14{font-size:14.5px;} .t-15{font-size:15.5px;} .t-17{font-size:17px;}
.overline{font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;}
.overline-xs{font-size:10.5px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;}
.logo-sub{font-size:10px;font-weight:600;letter-spacing:.28em;text-transform:uppercase;}
.hero-title{font-size:2.45rem;line-height:1.12;}
.ar-4x3{aspect-ratio:4/3;} .ar-3x2{aspect-ratio:3/2;}
.hero-grid{display:grid;} .filter-grid{display:grid;} .detail-grid{display:grid;}
.contact-grid{display:grid;} .footer-grid{display:grid;}
@media(min-width:640px){ .hero-title{font-size:3rem;line-height:1.08;} }
@media(min-width:768px){
  .filter-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
  .footer-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
}
@media(min-width:1024px){
  .hero-title{font-size:3.55rem;}
  .hero-grid{grid-template-columns:1.05fr 1fr;}
  .detail-grid{grid-template-columns:1.25fr 1fr;}
  .contact-grid{grid-template-columns:1.35fr 1fr;}
  .footer-grid{grid-template-columns:1.4fr 1fr 1fr 1.2fr;}
}
@media(min-width:1280px){
  .filter-grid{grid-template-columns:1.6fr repeat(5,minmax(0,1fr)) auto;}
}

/* touch screens: text links get a 44px hit area, and fields are 16px so iOS
   Safari doesn't zoom the page when one is focused */
.tap{ display:block; } .tap-inline{ display:inline-flex; align-items:center; }
@media (pointer:coarse){
  .tap{ display:flex; align-items:center; min-height:44px; }
  .tap-inline{ min-height:44px; }
  /* the taller rows already space a stacked list — drop the gap between them */
  .mrs .tap + .tap{ margin-top:0; }
  .field{ font-size:16px; }
}

html{ scroll-behavior:smooth; }
@media (prefers-reduced-motion:reduce){
  html{ scroll-behavior:auto; }
  .mrs *, .mrs *::before, .mrs *::after{ animation:none!important; transition:none!important; }
  /* with the animation off the track would sit frozen and clipped — let it be
     scrolled by hand instead */
  .tmarquee{ overflow-x:auto; }
}
`;

/* 2. ===================== SITE CONFIG =====================
   Placeholder values — replace with real business details later. */
const CONTACT = {
  brand: "Mitesh Real Estate Solution",
  owner: "Mitesh Raghuvanshi",
  tagline: "Authorised Channel Partner · Indore",
  /* both lines from the company logo — phones[0] is the primary / WhatsApp number */
  phones: [
    { label: "94066 22244", href: "tel:+919406622244" },
  ],
  whatsapp: "https://wa.me/919406622244",
  email: "meetesh24365@yahoo.com",
  office: "10 Godbole Colony, opp. Annapurna Temple, Indore, Madhya Pradesh 452009",
  established: 2020,
  hours: [
    { d: "Mon – Sat", t: "10:00 am – 7:00 pm" },
    { d: "Sunday", t: "By appointment" },
  ],
  rera: "A-IND-24-1732", // M.P. RERA agent registration
};

const NAV_LINKS = [
  { label: "Home", target: "home" },
  { label: "Properties", target: "properties" },
  { label: "Services", target: "services" },
  { label: "About Us", target: "about" },
  { label: "Contact Us", target: "contact" },
];

/* 2c. ===================== SUPABASE =====================
   Paste the project's ANON / publishable key below — it is meant to ship in
   client code and is guarded by row-level security. Never put the service_role
   key here; it bypasses RLS.

   Run supabase-schema.sql in the SQL editor to create the tables and policies.
   Leave anonKey empty and the site still works: enquiries fall back to a console
   log and the listings bundled in this file are used. */
export const SUPABASE = {
  url: "https://jlhhdpbxpwdwwqwycdtf.supabase.co",
  anonKey: "sb_publishable_Kn0vxJgLxX1gltzRTNbBEA_XDNW_7vD",
};
const dbReady = () => Boolean(SUPABASE.url && SUPABASE.anonKey);

/* Minimal PostgREST client — avoids a dependency so this stays a single file. */
const db = async (path, { method = "GET", body, headers } = {}) => {
  const res = await fetch(`${SUPABASE.url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SUPABASE.anonKey,
      Authorization: `Bearer ${SUPABASE.anonKey}`,
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.message || `Supabase ${res.status}`);
  return data;
};

/* 2b. ===================== IMAGE ASSETS =====================
   Project creatives, imported from src/assets so the browser loads each one
   only when it is shown instead of all of them inside the JS bundle.
   Must stay above PROPERTIES — the listings reference IMG at module load. */
const IMG = {
  crescentRender,
  crescentPoster,
  gatewayRender,
  gatewayPoster,
  aashrayRender,
  aashrayPoster,
  forumRender,
  forumPoster,
  bizCard,
  brandLogo,
};

/* 3. ===================== DATA =====================
   Add / edit / remove properties here — the UI renders from this list. */
const PROPERTIES = [
  {
    id: "MRS-201",
    title: "Crescent by Emerald Select",
    location: "Mayakhedi (AB Bypass), Indore",
    price: null,
    type: "Residential Plot",
    area: 2400,
    sizeLabel: "1,500 – 2,400 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: true,
    art: "plot",
    rera: "P-IND-25-5789",
    images: [
      { src: IMG.crescentRender, fit: "cover", label: "Entrance render" },
      { src: IMG.crescentPoster, fit: "contain", label: "Project poster" },
    ],
    description:
      "'Live the precious' — a plotted community with a distinctive architectural identity, by Emerald Select at Mayakhedi on the AB Bypass. Premium residential plots of 1,500–2,400 sq ft in a landscaped, amenity-rich layout.",
    amenities: ["Eco gym", "Cricket pitch", "Club house access", "Water fountain", "Gazebo", "Tennis court", "Open sitting area"],
  },
  {
    id: "MRS-202",
    title: "Emerald Gateway",
    location: "Sula Khedi, Indore",
    price: null,
    type: "Residential Plot",
    area: 2000,
    sizeLabel: "1,000 – 2,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: true,
    art: "plot",
    rera: "P-SWR-24-4573",
    images: [
      { src: IMG.gatewayRender, fit: "cover", label: "Gateway render" },
      { src: IMG.gatewayPoster, fit: "contain", label: "Project poster" },
    ],
    description:
      "'A secure foundation for personal living spaces' — premium residential plots of 1,000–2,000 sq ft at Sula Khedi, entered through a landmark illuminated gateway with a landscaped arrival plaza.",
    amenities: ["Landmark gated entrance", "Landscaped arrival plaza", "Street-lit internal roads", "Secured boundary with barrier entry"],
  },
  {
    id: "MRS-203",
    title: "Emerald Aashray",
    location: "Rau, Indore",
    price: null,
    type: "Residential Plot",
    area: 1800,
    sizeLabel: "800 – 1,800 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: true,
    art: "plot",
    rera: "P-IND-24-4705",
    images: [
      { src: IMG.aashrayRender, fit: "cover", label: "Entrance render" },
      { src: IMG.aashrayPoster, fit: "contain", label: "Project poster" },
    ],
    description:
      "'Elegance redefined' — residential plots designed with a natural light focus, ranging from 800 to 1,800 sq ft, minutes from IIM Indore at Rau.",
    amenities: ["Amphitheatre", "Water bodies", "Kids' play area", "Jogging track", "Gazebo", "Open garden"],
  },
  {
    id: "MRS-204",
    title: "Emerald Forum",
    location: "Indore",
    price: null,
    type: "Commercial",
    area: 1600,
    sizeLabel: "Sizes on request",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: true,
    art: "office",
    rera: "P-IND-26-6485",
    images: [
      { src: IMG.forumRender, fit: "cover", label: "Tower render" },
      { src: IMG.forumPoster, fit: "contain", label: "Project poster" },
    ],
    description:
      "'Premium spaces for business' — Emerald Forum is now RERA-approved. A glass-façade commercial tower of ground-floor showrooms and office floors lined with green planter balconies. Sizes and rates on request.",
    amenities: ["Ground-floor showrooms", "Office floors above retail", "Planter-lined green balconies", "By the Emerald group"],
  },
  {
    id: "MRS-1206598",
    title: "2 BHK Apartment in Bhawrasla, Indore",
    location: "Bhawrasla, Indore",
    price: null,
    type: "Apartment",
    area: 1025,
    sizeLabel: "1,025 sq ft",
    bedrooms: 2,
    bathrooms: 2,
    status: "Available",
    featured: false,
    art: "towers",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1206598_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1206598_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1206598_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1206598_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1206598_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1206598_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1206598_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1206598_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1206598_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    transaction: "New Property",
    description:
      "Well designed 2 BHK Flats & Apartments, 1150 Sq.ft. Built Up Area, is available for sale at Bhawrasla, Indore at a reasonable price of INR 58 Lac. This property highlights are several amenities like Power Back Up, Lift, Reserved Parking, Security, Maintenance Staff. This property has very basic…",
    amenities: ["Power Back Up", "Lift", "Reserved Parking", "Security", "Maintenance Staff"],
  },
  {
    id: "MRS-1472601",
    title: "Apartment in Kanadia Road, Indore",
    location: "Kanadia Road, Indore",
    price: 22500000,
    type: "Apartment",
    area: 2438,
    sizeLabel: "2,438 sq ft",
    bedrooms: 3,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "towers",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1472601_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1472601_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1472601_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1472601_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1472601_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1472601_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1472601_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1472601_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1472601_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 9229,
    transaction: "New Property",
    facing: "East",
    description:
      "Flats / Apartments is available for sale in Kanadia Road, Indore only in Rs. 2.25 Cr. This flat for sale has a prime location. This premium furnished 3 BHK Flats / Apartments spells quality and comfort at a competitive price under Rs. 2.25 Cr. Family friendly location with close proximity to…",
    amenities: ["Power Back Up", "Reserved Parking", "Security"],
  },
  {
    id: "MRS-1483796",
    title: "3 BHK Apartment in Kanadiya, Indore",
    location: "Kanadiya, Indore",
    price: 24400000,
    type: "Apartment",
    area: 2438,
    sizeLabel: "2,438 sq ft",
    bedrooms: 3,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "towers",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1483796_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1483796_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1483796_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1483796_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1483796_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1483796_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1483796_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1483796_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1483796_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 10000,
    transaction: "New Property",
    facing: "East",
    description:
      "Located in the sought-after area of Kanadiya, Indore, this spacious 3 BHK flat offers a perfect blend of modern living and convenience. Situated on the 4th floor of a 21-storey building, this new property spans a generous 2438 sq. ft. The flat boasts an East-facing orientation, allowing for…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1314393",
    title: "Showrooms in Indrapuri Colony, Indore",
    location: "Indrapuri Colony, Indore",
    price: 9200000,
    type: "Commercial",
    area: 950,
    sizeLabel: "950 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "office",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1314393_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1314393_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1314393_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1314393_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1314393_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1314393_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1314393_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1314393_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1314393_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 9684,
    transaction: "New Property",
    description:
      "A 950 sq ft showroom at Rajiv Gandhi Square, Indrapuri Colony — ground-floor frontage on the BRTS corridor, close to Choitram Square and Bhawarkua. Call for the floor plan and current rate.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1197825",
    title: "Unity One — office space at Rajiv Gandhi Square",
    location: "Indrapuri Colony, Indore",
    price: 9000000,
    type: "Commercial",
    area: 975,
    sizeLabel: "975 sq ft built-up · 1,400 sq ft super",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: true,
    art: "office",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1197825_3.jpg", fit: "cover", label: "Photo 1" },
    ],
    rate: 9231,
    rera: "P-IND-21-3082",
    description:
      "A 975 sq ft office floor in Unity One — a seven-storey mixed-use tower at Rajiv Gandhi Square with three basement parking levels. Showrooms and shops occupy the ground and first floors, offices sit around an Origami garden on the second, and larger office plates run from the third to the sixth. On the BRTS corridor, 300 m from Choitram Square and 1.4 km from Bhawarkua Square.",
    amenities: ["Power Back Up", "Water Storage", "Five lifts with a spacious lobby", "Reserved Parking", "Security", "Maintenance Staff", "High-tech fire detection", "CCTV surveillance", "Dedicated electric substation"],
  },
  {
    id: "MRS-1315219",
    title: "Commercial Shops in Indrapuri Colony, Indore",
    location: "Indrapuri Colony, Indore",
    price: 4000000,
    type: "Commercial",
    area: 521,
    sizeLabel: "521 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "office",
    rate: 7678,
    transaction: "New Property",
    description:
      "Economic shop showroom & offices starting range 40,00,000",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1310596",
    title: "Office Space in MR 10, Indore",
    location: "MR 10, Indore",
    price: 6500000,
    type: "Commercial",
    area: 1000,
    sizeLabel: "1,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "office",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1310596_1.jpg", fit: "cover", label: "Photo 1" },
    ],
    rate: 6500,
    transaction: "New Property",
    description:
      "OFFICES for IT company INDORE Near MR 10 near ISBT connectivity ISBT, metro station, Airport, Indian Railways, Economic corridor",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1320748",
    title: "Luxurious Offices 4 Ways Connectivity Near Metro Stations Isbt Proposal, Near Airport",
    location: "MR 10, Indore",
    price: 4610000,
    type: "Commercial",
    area: 0,
    sizeLabel: "Size on request",
    bedrooms: 0,
    bathrooms: 1,
    status: "Available",
    featured: false,
    art: "office",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1320748_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1320748_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1320748_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1320748_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1320748_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1320748_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1320748_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1320748_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1320748_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 10000,
    transaction: "New Property",
    description:
      "Furnished Office Space in MR 10, Indore ready to use, available for sale at a very affordable price. Along with carpet area 361 Sq.ft.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1311101",
    title: "Commercial Land in Panchderiya, Indore",
    location: "Panchderiya, Indore",
    price: 9000000,
    type: "Commercial Land",
    area: 2000,
    sizeLabel: "2,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    rate: 4500,
    transaction: "New Property",
    description:
      "Suitable 2000 Sq.ft. Commercial Plots is available for sale in the prime location of Panchderiya, Indore with all types of basic amenities and facilities in Rs. 90 Lac affordable rate for more please contact in given number. Commercial plot with comfort plot area 2000 sqft",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1494088",
    title: "Commercial Land in Sula Khedi, Indore",
    location: "Sula Khedi, Indore",
    price: 15400000,
    type: "Commercial Land",
    area: 2200,
    sizeLabel: "2,200 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1494088_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1494088_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1494088_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1494088_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1494088_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1494088_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1494088_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1494088_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1494088_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 7000,
    transaction: "New Property",
    description:
      "Located in the bustling area of Sula Khedi, Indore, this spacious commercial land spans over 2200 sq.ft. and is ideal for various business ventures. Situated in a prime location, this new property is perfect for investors looking to establish their presence in a rapidly growing commercial hub.…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1328170",
    title: "Residential-cum-commercial land at Junarda Puwarda",
    location: "Super Corridor, Indore",
    price: null,
    type: "Commercial Land",
    area: 0,
    sizeLabel: "Size on request",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1328170_4.jpg", fit: "cover", label: "Photo 1" },
    ],
    transaction: "New Property",
    description:
      "Residential-cum-commercial land at Junarda Puwarda, close to the proposed Ahilya Path and fronting a 100 ft road. Connected to Palia, Ujjain Road, Hatod and TCS Square on the Super Corridor, with the railway station, metro line and airport all within reach.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1359342",
    title: "Individual Houses in Mhow, Indore",
    location: "Mhow, Indore",
    price: 8200000,
    type: "Independent House",
    area: 2100,
    sizeLabel: "2,100 sq ft",
    bedrooms: 3,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "villa",
    rate: 3905,
    transaction: "New Property",
    facing: "East",
    description:
      "This attractive 3 BHK Independent House for sale Mhow, Indore. This ready to move House is sold at a fair selling price of Rs. 82 Lac. The Independent House is fully-furnished. This beautiful 3 BHK Independent House is area of 2100 Sq.ft.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1408421",
    title: "2 BHK Independent House in Sudama Nagar, Indore",
    location: "Sudama Nagar, Indore",
    price: 13500000,
    type: "Independent House",
    area: 925,
    sizeLabel: "925 sq ft",
    bedrooms: 2,
    bathrooms: 2,
    status: "Available",
    featured: false,
    art: "villa",
    rate: 14595,
    transaction: "Resale Property",
    facing: "West",
    description:
      "18*50 dismental house size Annapurna road k backside",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1352686",
    title: "Individual Houses in Sudama Nagar, Indore",
    location: "Sudama Nagar, Indore",
    price: 12200000,
    type: "Independent House",
    area: 900,
    sizeLabel: "900 sq ft",
    bedrooms: 3,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "villa",
    rate: 13556,
    transaction: "Resale Property",
    description:
      "This attractive 3 BHK Independent House for sale Sudama Nagar, Indore. This ready to move House is sold at a fair selling price of Rs. 1.22 Cr. The Independent House is fully-furnished. This beautiful 3 BHK Independent House is area of 900 Sq.ft.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1496570",
    title: "Residential Plot in Bada Bangarda, Indore",
    location: "Bada Bangarda, Indore",
    price: 4600000,
    type: "Residential Plot",
    area: 1000,
    sizeLabel: "1,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1496570_7.jpg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4600,
    transaction: "New Property",
    description:
      "Located in the thriving city of Indore, this Residential Plot on Bada Bangarda is a prime investment opportunity. With a generous plot size of 1000 Sq.ft., this new property is perfect for building your dream home in a well-established neighborhood. Situated in a sought-after area, this plot…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1491204",
    title: "Residential Plot in Bada Bangarda, Indore",
    location: "Bada Bangarda, Indore",
    price: 3650000,
    type: "Residential Plot",
    area: 800,
    sizeLabel: "800 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1491204_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1491204_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1491204_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1491204_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1491204_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1491204_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1491204_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1491204_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1491204_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 4563,
    transaction: "Resale Property",
    description:
      "Located in the prime location of Bada Bangarda in Indore, this 800 sq.ft. residential plot is now available for resale. Situated in a peaceful and well-connected neighborhood, this property offers the perfect opportunity to build your dream home in a desirable area. This freehold property is…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1491432",
    title: "Residential Plot in Bada Bangarda, Indore",
    location: "Bada Bangarda, Indore",
    price: 3400000,
    type: "Residential Plot",
    area: 750,
    sizeLabel: "750 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1491432_1.jpg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4533,
    transaction: "Resale Property",
    description:
      "The residential plot located in Bada Bangarda, Indore offers a prime location for those looking to build their dream home in a peaceful and conveniently located neighborhood. Situated on a 750 sq.ft. plot of land, this property is ideal for individuals or families seeking to customize their…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1486808",
    title: "Residential Plot in By Pass Road, Indore",
    location: "By Pass Road, Indore",
    price: 40000000,
    type: "Residential Plot",
    area: 10000,
    sizeLabel: "10,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1486808_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486808_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486808_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486808_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486808_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486808_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486808_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486808_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486808_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 4000,
    transaction: "New Property",
    description:
      "Located in the prime area of By Pass Road in Indore, this residential plot spans over 10,000 square feet and is ideal for those looking to build their dream home in a conveniently located and rapidly developing neighborhood. The plot is a new property and is being offered for sale on a freehold…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1434898",
    title: "Residential Plot in By Pass Road, Indore",
    location: "By Pass Road, Indore",
    price: 35000000,
    type: "Residential Plot",
    area: 10000,
    sizeLabel: "10,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1434898_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434898_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434898_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434898_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434898_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434898_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434898_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434898_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434898_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 3500,
    transaction: "New Property",
    description:
      "Exclusive! Residential Land / Plots for sale in By Pass Road, Indore. The land is available for sale at an affordable price of Rs. 3.50 Cr. Call & enjoy the freedom of space on this vast 10000 Sq.ft. plot located on By Pass Road, Indore.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1486807",
    title: "Residential Plot in By Pass Road, Indore",
    location: "By Pass Road, Indore",
    price: 32000000,
    type: "Residential Plot",
    area: 8000,
    sizeLabel: "8,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1486807_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486807_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486807_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486807_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486807_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486807_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486807_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486807_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486807_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 4000,
    transaction: "New Property",
    description:
      "Located on By Pass Road in Indore, this residential plot offers a prime opportunity for those looking to build their dream home in a bustling urban setting. With a spacious land area of 8000 sq.ft., this new property is available for sale on a freehold basis. Situated in a sought-after area of…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1486811",
    title: "Residential Plot in By Pass Road, Indore",
    location: "By Pass Road, Indore",
    price: 16000000,
    type: "Residential Plot",
    area: 4000,
    sizeLabel: "4,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1486811_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486811_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486811_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486811_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486811_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486811_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486811_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486811_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486811_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 4000,
    transaction: "New Property",
    description:
      "Located on By Pass Road in Indore, this 4000 sq.ft. residential plot offers a great opportunity for those looking to build their dream home in a well-connected and rapidly developing area. The plot is part of a new property listing, making it a blank canvas for the buyer to design and construct…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1439771",
    title: "Residential Plot in Dewas Naka, Indore",
    location: "Dewas Naka, Indore",
    price: 36000000,
    type: "Residential Plot",
    area: 9000,
    sizeLabel: "9,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1439771_1.jpeg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4000,
    description:
      "A 9,000 sq ft residential plot at Dewas Naka, Indore, available at ₹3.6 Cr (₹4,000/sq ft). Clear title and ready for registry — call to check current availability and arrange a site visit.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1439770",
    title: "Residential Plot in Dewas Naka, Indore",
    location: "Dewas Naka, Indore",
    price: 32000000,
    type: "Residential Plot",
    area: 8000,
    sizeLabel: "8,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1439770_1.jpeg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4000,
    description:
      "A 8,000 sq ft residential plot at Dewas Naka, Indore, available at ₹3.2 Cr (₹4,000/sq ft). Clear title and ready for registry — call to check current availability and arrange a site visit.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1439769",
    title: "Residential Plot in Dewas Naka, Indore",
    location: "Dewas Naka, Indore",
    price: 28000000,
    type: "Residential Plot",
    area: 7000,
    sizeLabel: "7,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1439769_1.jpeg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4000,
    description:
      "A 7,000 sq ft residential plot at Dewas Naka, Indore, available at ₹2.8 Cr (₹4,000/sq ft). Clear title and ready for registry — call to check current availability and arrange a site visit.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1439768",
    title: "Residential Plot in Dewas Naka, Indore",
    location: "Dewas Naka, Indore",
    price: 24000000,
    type: "Residential Plot",
    area: 6000,
    sizeLabel: "6,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1439768_1.jpeg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4000,
    description:
      "A 6,000 sq ft residential plot at Dewas Naka, Indore, available at ₹2.4 Cr (₹4,000/sq ft). Clear title and ready for registry — call to check current availability and arrange a site visit.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1439767",
    title: "Residential Plot in Dewas Naka, Indore",
    location: "Dewas Naka, Indore",
    price: 20000000,
    type: "Residential Plot",
    area: 5000,
    sizeLabel: "5,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1439767_1.jpeg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4000,
    description:
      "A 5,000 sq ft residential plot at Dewas Naka, Indore, available at ₹2 Cr (₹4,000/sq ft). Clear title and ready for registry — call to check current availability and arrange a site visit.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1439766",
    title: "Residential Plot in Dewas Naka, Indore",
    location: "Dewas Naka, Indore",
    price: 16000000,
    type: "Residential Plot",
    area: 4000,
    sizeLabel: "4,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1439766_1.jpeg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4000,
    description:
      "A 4,000 sq ft residential plot at Dewas Naka, Indore, available at ₹1.6 Cr (₹4,000/sq ft). Clear title and ready for registry — call to check current availability and arrange a site visit.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1439765",
    title: "Residential Plot in Dewas Naka, Indore",
    location: "Dewas Naka, Indore",
    price: 14000000,
    type: "Residential Plot",
    area: 3500,
    sizeLabel: "3,500 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1439765_1.jpeg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4000,
    description:
      "A 3,500 sq ft residential plot at Dewas Naka, Indore, available at ₹1.4 Cr (₹4,000/sq ft). Clear title and ready for registry — call to check current availability and arrange a site visit.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1434878",
    title: "Residential Plot in Mayakhedi, Indore",
    location: "Mayakhedi, Indore",
    price: 20000000,
    type: "Residential Plot",
    area: 5000,
    sizeLabel: "5,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1434878_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434878_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434878_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434878_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434878_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434878_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434878_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434878_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434878_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 4000,
    transaction: "New Property",
    description:
      "Exclusive! Residential Land / Plots for sale in Mayakhedi, Indore. The land is available for sale at an affordable price of Rs. 2 Cr. Call & enjoy the freedom of space on this vast 5000 Sq.ft. plot located on Mayakhedi, Indore.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1434093",
    title: "Residential Plot in Mayakhedi, Indore",
    location: "Mayakhedi, Indore",
    price: 16000000,
    type: "Residential Plot",
    area: 4000,
    sizeLabel: "4,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1434093_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434093_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434093_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434093_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434093_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434093_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434093_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434093_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434093_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 4000,
    transaction: "New Property",
    description:
      "4000 Sq.ft. Residential Plots is available for sale well-located Residential Land / Plots in Mayakhedi, Indore. At a very affordable price. This Residential Land / Plots is located near a schools, hospitals, ATMs etc. Luxurious township rich look",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1434866",
    title: "Residential Plot in Mayakhedi, Indore",
    location: "Mayakhedi, Indore",
    price: 15200000,
    type: "Residential Plot",
    area: 3800,
    sizeLabel: "3,800 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1434866_2.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434866_3.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434866_4.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434866_5.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434866_6.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434866_7.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434866_8.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434866_9.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1434866_10.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 4000,
    transaction: "New Property",
    description:
      "A Residential Land / Plots is available for sale at Mayakhedi, Indore. It is located in a very good area. The plot is measures 3800 Sq.ft. and priced Rs. 1.52 Cr. / negotiable will disclose after contact",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1486728",
    title: "Residential Plot in Mayakhedi, Indore",
    location: "Mayakhedi, Indore",
    price: 14400000,
    type: "Residential Plot",
    area: 1800,
    sizeLabel: "1,800 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1486728_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486728_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486728_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486728_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486728_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486728_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486728_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486728_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486728_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 8000,
    transaction: "New Property",
    description:
      "Located in the serene neighborhood of Mayakhedi in Indore, this residential plot spans 1800 square feet and is available for sale as a new property. The plot is freehold, ensuring that the new owner has complete ownership and rights over the land. The property is situated in a well-developed…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1486726",
    title: "Residential Plot in Mayakhedi, Indore",
    location: "Mayakhedi, Indore",
    price: 12000000,
    type: "Residential Plot",
    area: 1500,
    sizeLabel: "1,500 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1486726_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486726_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486726_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486726_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486726_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486726_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486726_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486726_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486726_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 8000,
    transaction: "New Property",
    description:
      "Located in the bustling city of Indore, this residential plot is situated in the peaceful neighborhood of Mayakhedi. With a land area of 1500 sq.ft., this new property is ideal for those looking to build their dream home in a prime location. The plot is freehold, providing the buyer with…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1486632",
    title: "Residential Plot in Mayakhedi, Indore",
    location: "Mayakhedi, Indore",
    price: 9600000,
    type: "Residential Plot",
    area: 1200,
    sizeLabel: "1,200 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1486632_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486632_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486632_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486632_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486632_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486632_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486632_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486632_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486632_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 8000,
    transaction: "New Property",
    description:
      "Nestled in the peaceful locality of Mayakhedi in Indore, this residential plot offers an excellent opportunity for anyone looking to build their dream home. With a land area of 1200 sq. ft., this new property is available for sale on a freehold basis. Located in a well-developed area, the plot…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1492381",
    title: "Residential Plot in Nainod, Indore",
    location: "Nainod, Indore",
    price: 4200000,
    type: "Residential Plot",
    area: 1000,
    sizeLabel: "1,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1492381_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1492381_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1492381_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1492381_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1492381_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1492381_6.jpg", fit: "cover", label: "Photo 6" },
    ],
    rate: 4200,
    transaction: "New Property",
    description:
      "Located in the up-and-coming neighborhood of Nainod in Indore, this residential plot offers an ideal opportunity for those looking to build their dream home in a peaceful and well-connected area. With a land area of 1000 sq.ft., this new property is perfect for anyone looking to design and…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1195124",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Panchderiya, Indore",
    price: 8400000,
    type: "Residential Plot",
    area: 800,
    sizeLabel: "800 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1195124_1.jpeg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4200,
    description:
      "A commercial Plot is available for sale pamchderia road, Ujjain Road, Indore. It is located in a very good area. The plot is measures 2000 Sq.ft. and priced 84,00,000 negotiable/ will disclose after contact This property has very basic facilities like School 2 Km.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1284243",
    title: "Residential Plot in Panchderiya, Indore",
    location: "Panchderiya, Indore",
    price: 3500000,
    type: "Residential Plot",
    area: 2000,
    sizeLabel: "2,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1284243_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1284243_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1284243_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1284243_4.jpg", fit: "cover", label: "Photo 4" },
    ],
    rate: 3500,
    transaction: "New Property",
    description:
      "Residential plot with mazimum Amenities good connectivity",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1284116",
    title: "Residential Plot in Panchderiya, Indore",
    location: "Panchderiya, Indore",
    price: 2912000,
    type: "Residential Plot",
    area: 850,
    sizeLabel: "850 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1284116_7.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1284116_8.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1284116_9.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1284116_10.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1284116_11.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1284116_12.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1284116_13.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1284116_14.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1284116_15.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 3425,
    transaction: "New Property",
    description:
      "Panchderiya near Universities good connectivity mangliya connectivity Ujjain road MR10 square connectivity",
    amenities: ["Reserved Parking", "Gymnasium", "Club House", "Maintenance Staff", "Vastu Compliant", "Swimming Pool"],
  },
  {
    id: "MRS-1357655",
    title: "Residential Plot in Panchderiya, Indore",
    location: "Panchderiya, Indore",
    price: 2400000,
    type: "Residential Plot",
    area: 600,
    sizeLabel: "600 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1357655_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1357655_3.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1357655_4.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1357655_5.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1357655_6.jpg", fit: "cover", label: "Photo 5" },
    ],
    rate: 4000,
    transaction: "New Property",
    description:
      "600 Sq.ft. Residential Plots is available for sale well-located Residential Land / Plots in Panchderiya, Indore. At a very affordable price. This Residential Land / Plots is located near a schools, hospitals, ATMs etc.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1343724",
    title: "Residential Plot in Panchderiya, Indore",
    location: "Panchderiya, Indore",
    price: 2268000,
    type: "Residential Plot",
    area: 600,
    sizeLabel: "600 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1343724_1.jpg", fit: "cover", label: "Photo 1" },
    ],
    rate: 3780,
    transaction: "New Property",
    description:
      "This well-located Residential Land / Plots in a plot area of 600 Sq.ft. in Panchderiya, Indore is a beautiful green land. It is available on sale at a reasonable price of Rs. 22.68 Lac.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1486812",
    title: "Residential Plot in Rau Pithampur Road, Indore",
    location: "Rau Pithampur Road, Indore",
    price: 4750000,
    type: "Residential Plot",
    area: 1000,
    sizeLabel: "1,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1486812_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486812_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486812_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486812_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486812_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486812_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486812_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486812_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486812_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 4750,
    transaction: "New Property",
    description:
      "Located on the bustling Rau Pithampur Road in Indore, this residential plot offers a prime opportunity for those looking to build their dream home in a sought-after area. With a land area of 1000 sq.ft., this new property is perfect for those looking to design a custom living space tailored to…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1422778",
    title: "Residential Plot in Rau Pithampur Road, Indore",
    location: "Rau Pithampur Road, Indore",
    price: 3200000,
    type: "Residential Plot",
    area: 1500,
    sizeLabel: "1,500 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1422778_1.jpg", fit: "cover", label: "Photo 1" },
    ],
    rate: 2133,
    transaction: "New Property",
    description:
      "Rau Pithampur Road near sanjay jhalashya near hotel manal investment mode peoperty",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1341348",
    title: "Residential Plot in Rau Road, Indore",
    location: "Rau Road, Indore",
    price: 9350000,
    type: "Residential Plot",
    area: 1375,
    sizeLabel: "1,375 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1341348_2.jpg", fit: "cover", label: "Photo 1" },
    ],
    rate: 6800,
    transaction: "New Property",
    description:
      "1375 Sq.ft. Residential Plots is available for sale well-located Residential Land / Plots in Rau Road, Indore. At a very affordable price. This Residential Land / Plots is located near a schools, hospitals, ATMs etc.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1341352",
    title: "Residential Plot in Rau, Indore",
    location: "Rau, Indore",
    price: 9350000,
    type: "Residential Plot",
    area: 1375,
    sizeLabel: "1,375 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1341352_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1341352_3.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1341352_5.jpg", fit: "cover", label: "Photo 3" },
    ],
    rate: 6800,
    transaction: "New Property",
    description:
      "We have 1375 Sq.ft., Residential Land / Plots for sale. The land is a freehold, and would be suitable for your needs. The viewing address of this Residential Land / Plots on sale is Rau, Indore.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1492343",
    title: "Residential Plot in Ringnodiya, Indore",
    location: "Ringnodiya, Indore",
    price: 2900000,
    type: "Residential Plot",
    area: 850,
    sizeLabel: "850 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1492343_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1492343_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1492343_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1492343_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1492343_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1492343_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1492343_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1492343_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1492343_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 3412,
    transaction: "New Property",
    description:
      "This 850 sq.ft. residential plot is located in a prime area, perfect for building your dream home. The property is a new development and is being offered for sale as a freehold. The plot is ideal for those looking to customize their home to their liking and create a space that suits their…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1486906",
    title: "Residential Plot in Sula Khedi, Indore",
    location: "Sula Khedi, Indore",
    price: 9000000,
    type: "Residential Plot",
    area: 1500,
    sizeLabel: "1,500 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1486906_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486906_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486906_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486906_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486906_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486906_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486906_7.jpg", fit: "cover", label: "Photo 7" },
    ],
    rate: 6000,
    transaction: "New Property",
    description:
      "Located in the serene and developing area of Sula Khedi in Indore, this residential plot offers an excellent opportunity for those looking to build their dream home in a peaceful yet well-connected neighborhood. The plot spans 1500 sq.ft. and is being offered as a new property for sale on a…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1486910",
    title: "Residential Plot in Sula Khedi, Indore",
    location: "Sula Khedi, Indore",
    price: 7200000,
    type: "Residential Plot",
    area: 1200,
    sizeLabel: "1,200 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1486910_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486910_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486910_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486910_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486910_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486910_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486910_7.jpg", fit: "cover", label: "Photo 7" },
    ],
    rate: 6000,
    transaction: "New Property",
    description:
      "Nestled in the serene suburb of Sula Khedi in Indore, this residential plot spans across 1200 square feet of freehold land, offering a remarkable opportunity for those looking to build their dream home in a peaceful and well-connected locality. Situated in a coveted residential area, the plot…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1486899",
    title: "Residential Plot in Sula Khedi, Indore",
    location: "Sula Khedi, Indore",
    price: 6600000,
    type: "Residential Plot",
    area: 1100,
    sizeLabel: "1,100 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1486899_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486899_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486899_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486899_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486899_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486899_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1486899_7.jpg", fit: "cover", label: "Photo 7" },
    ],
    rate: 6000,
    transaction: "New Property",
    description:
      "Located in the serene and peaceful neighborhood of Sula Khedi in Indore, this residential plot offers a perfect opportunity to build your dream home. The plot spans across 1100 square feet of freehold land, providing ample space for construction and landscaping. Situated in a well-established…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1258076",
    title: "Residential Plot in Super Corridor, Indore",
    location: "Super Corridor, Indore",
    price: 4400000,
    type: "Residential Plot",
    area: 1000,
    sizeLabel: "1,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    rate: 4400,
    transaction: "New Property",
    description:
      "Residential Land / Plots available at a reasonable price is a located in the prime area of Super Corridor, Indore. It has an area of 1000 Sq.ft. and very affordable priced at Rs. 32 Lac feel free to connect with us for price details. Super corridor 4.5 km away",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1415581",
    title: "Residential Plot in Super Corridor, Indore",
    location: "Super Corridor, Indore",
    price: 3400000,
    type: "Residential Plot",
    area: 800,
    sizeLabel: "800 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1415581_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1415581_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1415581_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1415581_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1415581_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1415581_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1415581_7.jpg", fit: "cover", label: "Photo 7" },
    ],
    rate: 4250,
    transaction: "Resale Property",
    description:
      "This well-located Residential Land / Plots in a plot area of 800 Sq.ft. The land is available for sale in prime location at Super Corridor, Indore. In Residential Land / Plots point Indore is best location.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1415580",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 42500000,
    type: "Residential Plot",
    area: 10000,
    sizeLabel: "10,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1415580_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1415580_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1415580_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1415580_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1415580_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1415580_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1415580_7.jpg", fit: "cover", label: "Photo 7" },
    ],
    rate: 4250,
    transaction: "New Property",
    description:
      "Cropped Residential Land / Plots for multipurpose use land are available at Ujjain Road, Indore, approx 10000 Sq.ft. Residential Land / Plots available for sale in best price Rs. 4.25 Cr. and essential for food production. Main ujjain Road Touch project",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1439751",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 18000000,
    type: "Residential Plot",
    area: 4235,
    sizeLabel: "4,235 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1439751_1.jpg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4250,
    description:
      "A 4,235 sq ft residential plot at Ujjain Road, Indore, available at ₹1.8 Cr (₹4,250/sq ft). Clear title and ready for registry — call to check current availability and arrange a site visit.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1395715",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 8350000,
    type: "Residential Plot",
    area: 1500,
    sizeLabel: "1,500 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1395715_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1395715_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1395715_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1395715_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1395715_5.jpg", fit: "cover", label: "Photo 5" },
    ],
    rate: 5567,
    description:
      "Mitesh Real Estate has come up with a new Residential Property project Godrej Greenview Estate in Indore. The Residential Land / Plots size starts with 1500 Sq.ft. and have many more sizes. Located in one of the best Location of Indore",
    amenities: ["Club House", "Cafeteria", "CCTV Camera", "Gymnasium", "Intercom", "Indoor Games", "Jogging Track", "Kids Play Area", "Landspace Garden", "Meditation Area", "Power Back Up", "Park", "Play Area", "Reserved Parking", "Swimming Pool", "Security"],
  },
  {
    id: "MRS-1395718",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 7250000,
    type: "Residential Plot",
    area: 1250,
    sizeLabel: "1,250 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1395718_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1395718_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1395718_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1395718_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1395718_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1395718_7.jpg", fit: "cover", label: "Photo 6" },
    ],
    rate: 5800,
    description:
      "Mitesh Real Estate has come up with a new Residential Property project Godrej Greenview Estate in Indore. The Residential Land / Plots size starts with 1250 Sq.ft. and have many more sizes. Located in one of the best Location of Indore",
    amenities: ["Club House", "Cafeteria", "CCTV Camera", "Gymnasium", "Intercom", "Indoor Games", "Jogging Track", "Kids Play Area", "Landspace Garden", "Meditation Area", "Power Back Up", "Park", "Play Area", "Reserved Parking", "Swimming Pool", "Security"],
  },
  {
    id: "MRS-1395716",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 5550000,
    type: "Residential Plot",
    area: 1000,
    sizeLabel: "1,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1395716_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1395716_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1395716_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1395716_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1395716_5.jpg", fit: "cover", label: "Photo 5" },
    ],
    rate: 5550,
    description:
      "Mitesh Real Estate has come up with a new Residential Property project Godrej Greenview Estate in Indore. The Residential Land / Plots size starts with 1000 Sq.ft. and have many more sizes. Located in one of the best Location of Indore",
    amenities: ["Club House", "Cafeteria", "CCTV Camera", "Gymnasium", "Intercom", "Indoor Games", "Jogging Track", "Kids Play Area", "Landspace Garden", "Meditation Area", "Power Back Up", "Park", "Play Area", "Reserved Parking", "Swimming Pool", "Security"],
  },
  {
    id: "MRS-1488128",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 5500000,
    type: "Residential Plot",
    area: 1000,
    sizeLabel: "1,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1488128_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1488128_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1488128_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1488128_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1488128_5.jpg", fit: "cover", label: "Photo 5" },
    ],
    rate: 5500,
    transaction: "New Property",
    description:
      "Located in a prime area of Indore, this residential plot on Ujjain Road offers a great opportunity for those looking to build their dream home in a well-established neighborhood. With a plot size of 1000 sq.ft., this new property is ideal for those who value space and privacy. Situated in a…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1485121",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 4500000,
    type: "Residential Plot",
    area: 1250,
    sizeLabel: "1,250 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1485121_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1485121_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1485121_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1485121_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1485121_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1485121_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1485121_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1485121_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1485121_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 3600,
    transaction: "New Property",
    description:
      "Located in the bustling city of Indore, this residential plot on Ujjain Road is a rare find in the real estate market. Spanning an area of 1250 sq.ft., this new property offers a blank canvas for you to build the home of your dreams. Situated in a prime location, this plot on Ujjain Road boasts…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1439752",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 4488000,
    type: "Residential Plot",
    area: 1056,
    sizeLabel: "1,056 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1439752_1.jpg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4250,
    description:
      "A 1,056 sq ft residential plot at Ujjain Road, Indore, available at ₹44.9 Lakh (₹4,250/sq ft). Clear title and ready for registry — call to check current availability and arrange a site visit.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1488169",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 4400000,
    type: "Residential Plot",
    area: 1000,
    sizeLabel: "1,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1488169_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1488169_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1488169_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1488169_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1488169_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1488169_6.jpg", fit: "cover", label: "Photo 6" },
    ],
    rate: 4400,
    transaction: "New Property",
    description:
      "Located on the bustling Ujjain Road in Indore, this 1000 sq.ft. residential plot is a new property available for sale. The plot is perfect for anyone looking to build their dream home in a prime location with easy access to all necessary amenities. Situated in a desirable neighborhood, the…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1480128",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 4250000,
    type: "Residential Plot",
    area: 1000,
    sizeLabel: "1,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1480128_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1480128_3.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1480128_4.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1480128_5.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1480128_6.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1480128_7.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1480128_8.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1480128_9.jpg", fit: "cover", label: "Photo 8" },
    ],
    rate: 4250,
    transaction: "New Property",
    description:
      "Located on Ujjain Road in the bustling city of Indore, this residential plot presents a unique opportunity for those seeking to build their dream home in a prime location. The 1000 sq. ft. plot is available for sale as a new property, offering a blank canvas for potential buyers to create a…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1161758",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 4070000,
    type: "Residential Plot",
    area: 1100,
    sizeLabel: "1,100 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1161758_1.jpeg", fit: "cover", label: "Photo 1" },
    ],
    rate: 3700,
    transaction: "Resale Property",
    description:
      "Prime location plot 40*60 2400 sqft corner plot suitable for residencial & commercial",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1439753",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 3778000,
    type: "Residential Plot",
    area: 889,
    sizeLabel: "889 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1439753_1.jpeg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4250,
    description:
      "A 889 sq ft residential plot at Ujjain Road, Indore, available at ₹37.8 Lakh (₹4,250/sq ft). Clear title and ready for registry — call to check current availability and arrange a site visit.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1439759",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 3506000,
    type: "Residential Plot",
    area: 825,
    sizeLabel: "825 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1439759_1.jpg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4250,
    description:
      "A 825 sq ft residential plot at Ujjain Road, Indore, available at ₹35.1 Lakh (₹4,250/sq ft). Clear title and ready for registry — call to check current availability and arrange a site visit.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1439754",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 3264000,
    type: "Residential Plot",
    area: 768,
    sizeLabel: "768 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1439754_1.jpg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4250,
    description:
      "A 768 sq ft residential plot at Ujjain Road, Indore, available at ₹32.6 Lakh (₹4,250/sq ft). Clear title and ready for registry — call to check current availability and arrange a site visit.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1439755",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 3030000,
    type: "Residential Plot",
    area: 713,
    sizeLabel: "713 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1439755_1.jpeg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4250,
    description:
      "A 713 sq ft residential plot at Ujjain Road, Indore, available at ₹30.3 Lakh (₹4,250/sq ft). Clear title and ready for registry — call to check current availability and arrange a site visit.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1439756",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 2988000,
    type: "Residential Plot",
    area: 703,
    sizeLabel: "703 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1439756_1.jpg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4250,
    description:
      "A 703 sq ft residential plot at Ujjain Road, Indore, available at ₹29.9 Lakh (₹4,250/sq ft). Clear title and ready for registry — call to check current availability and arrange a site visit.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1439757",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 2916000,
    type: "Residential Plot",
    area: 686,
    sizeLabel: "686 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1439757_1.jpg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4250,
    description:
      "A 686 sq ft residential plot at Ujjain Road, Indore, available at ₹29.2 Lakh (₹4,250/sq ft). Clear title and ready for registry — call to check current availability and arrange a site visit.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1439758",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 2720000,
    type: "Residential Plot",
    area: 640,
    sizeLabel: "640 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1439758_1.jpeg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4250,
    description:
      "A 640 sq ft residential plot at Ujjain Road, Indore, available at ₹27.2 Lakh (₹4,250/sq ft). Clear title and ready for registry — call to check current availability and arrange a site visit.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1439760",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 1819000,
    type: "Residential Plot",
    area: 428,
    sizeLabel: "428 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1439760_1.jpg", fit: "cover", label: "Photo 1" },
    ],
    rate: 4250,
    description:
      "A 428 sq ft residential plot at Ujjain Road, Indore, available at ₹18.2 Lakh (₹4,250/sq ft). Clear title and ready for registry — call to check current availability and arrange a site visit.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1482765",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: 1637000,
    type: "Residential Plot",
    area: 461,
    sizeLabel: "461 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1482765_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1482765_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1482765_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1482765_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1482765_5.jpg", fit: "cover", label: "Photo 5" },
      { src: "https://rei.wlimg.com/prop_images/884036/1482765_6.jpg", fit: "cover", label: "Photo 6" },
      { src: "https://rei.wlimg.com/prop_images/884036/1482765_7.jpg", fit: "cover", label: "Photo 7" },
      { src: "https://rei.wlimg.com/prop_images/884036/1482765_8.jpg", fit: "cover", label: "Photo 8" },
      { src: "https://rei.wlimg.com/prop_images/884036/1482765_9.jpg", fit: "cover", label: "Photo 9" },
    ],
    rate: 3550,
    transaction: "New Property",
    description:
      "Located on Ujjain Road in Indore, this residential plot spans across 461 sq.ft. and is now available for sale. The property is a new development, offering a blank canvas for potential homeowners to design and build their dream home from scratch. This freehold plot is situated in a prime…",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1195120",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: null,
    type: "Residential Plot",
    area: 1800,
    sizeLabel: "1,800 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1195120_1.jpeg", fit: "cover", label: "Photo 1" },
    ],
    description:
      "2000Sq.ft. Residential Plot available for sale at prime locatio of panchderiya road, Ujjain Road, Indore 84 Lac INR/ Interested person can send mail or cotact for more details.",
    amenities: ["Clear-title documentation", "Site visit arranged on a call", "Registry & loan guidance included"],
  },
  {
    id: "MRS-1395717",
    title: "Residential Plot in Ujjain Road, Indore",
    location: "Ujjain Road, Indore",
    price: null,
    type: "Residential Plot",
    area: 2000,
    sizeLabel: "2,000 sq ft",
    bedrooms: 0,
    bathrooms: 0,
    status: "Available",
    featured: false,
    art: "plot",
    images: [
      { src: "https://rei.wlimg.com/prop_images/884036/1395717_1.jpg", fit: "cover", label: "Photo 1" },
      { src: "https://rei.wlimg.com/prop_images/884036/1395717_2.jpg", fit: "cover", label: "Photo 2" },
      { src: "https://rei.wlimg.com/prop_images/884036/1395717_3.jpg", fit: "cover", label: "Photo 3" },
      { src: "https://rei.wlimg.com/prop_images/884036/1395717_4.jpg", fit: "cover", label: "Photo 4" },
      { src: "https://rei.wlimg.com/prop_images/884036/1395717_5.jpg", fit: "cover", label: "Photo 5" },
    ],
    description:
      "Mitesh Real Estate has come up with a new Residential Property project Godrej Greenview Estate in Indore. The Residential Land / Plots size starts with 2000 Sq.ft. and have many more sizes. Located in one of the best Location of Indore",
    amenities: ["Club House", "Cafeteria", "CCTV Camera", "Gymnasium", "Intercom", "Indoor Games", "Jogging Track", "Kids Play Area", "Landspace Garden", "Meditation Area", "Power Back Up", "Park", "Play Area", "Reserved Parking", "Swimming Pool", "Security"],
  },
];

const SERVICES = [
  { icon: Home, title: "Residential Properties", text: "Apartments, villas, row houses and plots across Indore — shortlisted against your budget, commute and family plans." },
  { icon: Building2, title: "Commercial Properties", text: "Grade-A offices, retail frontage and pre-leased assets, evaluated on tenancy quality and rental yield." },
  { icon: KeyRound, title: "Property Buying", text: "Site visits, price benchmarking and negotiation handled end-to-end, from first shortlist to key handover." },
  { icon: Handshake, title: "Property Selling", text: "Realistic pricing, professional listing and qualified buyers — most mandates close within 60 days." },
  { icon: TrendingUp, title: "Investment Advisory", text: "Micro-market data on appreciation and rental yield, so your capital goes where Indore is growing next." },
  { icon: Landmark, title: "Rental Income Properties", text: "Rent-ready homes and pre-leased commercial units — matched to the monthly income you're targeting, tenant and agreement included." },
  { icon: KeyRound, title: "Renting & Leasing", text: "Tenant sourcing, rent benchmarking, agreement drafting and police verification for owners letting out property in Indore." },
];

const TESTIMONIALS = [
  {
    name: "Rohit & Sneha Kulkarni",
    role: "Bought a plot near Rau",
    rating: 5,
    text: "We had visited eleven layouts on our own and were exhausted. Mitesh ji shortlisted three, explained exactly why, and negotiated well below the quoted rate. Our registry was done before the possession date.",
  },
  {
    name: "राजेश पाटीदार",
    role: "उज्जैन रोड पर प्लॉट खरीदा",
    rating: 5,
    text: "उज्जैन रोड पर प्लॉट लेना था, पर कागज़ों की समझ नहीं थी। मितेश जी ने रजिस्ट्री, नामांतरण और लोन तक सब खुद संभाला। रेट भी एकदम सही लगवाया — भरोसे का नाम है।",
  },
  {
    name: "Priya Sharma",
    role: "Bought a plot on the Super Corridor",
    rating: 5,
    text: "As a first-time buyer I had a hundred questions. They answered every one patiently, showed me the T&CP approvals themselves, and never pushed me toward a bigger budget. My registry was done in three weeks.",
  },
  {
    name: "सुनीता व अनिल चौहान",
    role: "एबी बायपास पर प्लॉट लिया",
    rating: 5,
    text: "हमें घर बनाने के लिए साफ़ टाइटल वाला प्लॉट चाहिए था। तीन लेआउट दिखाए और हर एक की कमी-खूबी साफ़ बताई। कहीं भी जल्दबाज़ी नहीं करवाई — आज हम पूरी तरह निश्चिंत हैं।",
  },
  {
    name: "Vikram Rathore",
    role: "Commercial investor",
    rating: 4,
    text: "I compare every deal hard, and their rental and appreciation numbers were the most honest I heard in Indore. Took a commercial space through them and the possession paperwork was flawless.",
  },
  {
    name: "दीपक मालवीय",
    role: "पिथमपुर रोड पर निवेश",
    rating: 5,
    text: "साइट विज़िट से लेकर रजिस्ट्री तक पूरा साथ दिया। RERA और T&CP के सारे कागज़ पहले ही जाँच कर दिखाए। यहाँ दलाली नहीं, सलाह मिलती है।",
  },
  {
    name: "अर्जुन यादव",
    role: "देवास बायपास पर प्लॉट",
    rating: 5,
    text: "देवास बायपास पर तीन लेआउट दिखाए, हर प्लॉट का रेट और अप्रूवल खुलकर बताया। बिना किसी दबाव के फ़ैसला करने दिया — ऐसी ईमानदारी कम मिलती है।",
  },
  {
    name: "Kavita Verma",
    role: "Bought a plot on AB Bypass",
    rating: 4,
    text: "They arranged site visits on a Sunday for our whole family, shared the layout map and rate list openly, and helped with the loan file too. Everything was done in one clean, transparent process.",
  },
  {
    name: "मनोज शर्मा",
    role: "सुपर कॉरिडोर निवेशक",
    rating: 5,
    text: "निवेश के लिए सुपर कॉरिडोर चुनने में इन्होंने मेट्रो और आईटी बेल्ट का पूरा गणित समझाया। जो प्लॉट सही नहीं था, उसके लिए साफ़ मना भी किया। यही फ़र्क है सलाहकार और दलाल में।",
  },
  {
    name: "Amit & Pooja Dubey",
    role: "Building a home at Rau",
    rating: 5,
    text: "From shortlisting the plot to the naamantaran after registry, one desk handled everything. Six months later they still pick up the phone for every small question. Highly recommended in Indore.",
  },
  {
    name: "मुकेश सोलंकी",
    role: "सुला खेड़ी में प्लॉट बुक किया",
    rating: 4,
    text: "गेटवे की एंट्री देखकर ही मन बन गया था, पर मितेश जी ने पहले सारे अप्रूवल दिखाए, फिर बुकिंग करवाई। पैसों की पूरी पारदर्शिता — हर रसीद समय पर मिली।",
  },
  {
    name: "Dr. Nitin Vyas",
    role: "Bought a plot at Mayakhedi, AB Bypass",
    rating: 5,
    text: "With hospital duties I had no time for paperwork. Their team collected documents from my clinic, completed the registry, and handed me the file with every approval in order. Completely hassle-free.",
  },
  {
    name: "सीमा सिसोदिया",
    role: "पहली बार प्रॉपर्टी खरीदी",
    rating: 5,
    text: "अकेली महिला होने के नाते थोड़ी झिझक थी, पर यहाँ हर बात इज़्ज़त और धैर्य से समझाई गई। बजट से बाहर का प्लॉट दिखाया ही नहीं — यही बात सबसे अच्छी लगी।",
  },
  {
    name: "Ankit Agrawal",
    role: "Investor · 3 plots via MRS",
    rating: 5,
    text: "I have bought three plots through them across the Ujjain Road and Pithampur belts. Rate history, layout comparisons, resale outlook — everything on paper before I pay a rupee. That discipline is rare.",
  },
  {
    name: "रमेशचंद्र जोशी",
    role: "रिटायरमेंट के बाद प्लॉट लिया",
    rating: 5,
    text: "पेंशन की जमा-पूँजी थी, इसलिए सौ बार सोच रहा था। इन्होंने बेटे की तरह सलाह दी, दो किफ़ायती विकल्प खुद बताए और रजिस्ट्री तक साथ खड़े रहे। भगवान भला करे।",
  },
  {
    name: "Shraddha & Gaurav Tiwari",
    role: "Plot near Rau for our first home",
    rating: 4,
    text: "We compared six dealers before choosing MRS. Only they showed us the actual T&CP map and walked the plot boundary with us. Booking to registry took 26 days flat.",
  },
  {
    name: "विनोद कुशवाह",
    role: "देवास बायपास पर निवेश",
    rating: 4,
    text: "प्लॉट और पेपर वर्क दोनों बढ़िया। बस साइट विज़िट के लिए एक हफ़्ते इंतज़ार करना पड़ा क्योंकि डिमांड बहुत है। बाकी सेवा में कोई कमी नहीं।",
  },
  {
    name: "CA Rohini Khandelwal",
    role: "Commercial space enquiry",
    rating: 5,
    text: "As a CA I audit every claim. Their yield calculations for the commercial project matched the market data I verified independently. Refreshingly honest numbers in this industry.",
  },
  {
    name: "ओमप्रकाश पटेल",
    role: "उज्जैन रोड पर प्लॉट",
    rating: 4,
    text: "गाँव से आकर शहर में ज़मीन लेना आसान नहीं था। इन्होंने नक्शा, नामांतरण, डायवर्सन — सब सरल भाषा में समझाया और पूरा काम खुद करवाया।",
  },
  {
    name: "Neha Saxena",
    role: "Bought remotely from Bangalore",
    rating: 5,
    text: "I did the entire Super Corridor purchase from Bangalore — video site visits, documents on email, registry through my father. Updates came on WhatsApp at every step. Felt completely safe.",
  },
  {
    name: "संजय परमार",
    role: "पिथमपुर रोड पर प्लॉट",
    rating: 4,
    text: "फ़ैक्टरी पिथमपुर में है तो पास ही प्लॉट चाहिए था। तीन दिन में चार लेआउट दिखाए, रेट की तुलना करके सबसे सही सौदा करवाया। सीधा और साफ़ काम।",
  },
  {
    name: "Harsh & Payal Mishra",
    role: "Plot at Sula Khedi",
    rating: 5,
    text: "The gateway project photos looked too good to be true, so we visited unannounced. The site matched the promise. MRS handled our home-loan file too — sanctioned in twelve days.",
  },
  {
    name: "कैलाश नागर",
    role: "अपना प्लॉट बिकवाया",
    rating: 5,
    text: "मेरा पुराना प्लॉट डेढ़ महीने में सही दाम पर बिकवा दिया। ख़रीदार भी जाँचे-परखे लाए, और रजिस्ट्री वाले दिन तक पूरा साथ दिया। बेचने वालों के लिए भी उतने ही भरोसेमंद।",
  },
  {
    name: "Aditya Thakur",
    role: "First-time buyer, Dewas Bypass",
    rating: 4,
    text: "Good guidance and genuine layouts. I would have liked more photos on WhatsApp before my first visit, but once on site, everything was exactly as described. Registry support was excellent.",
  },
  {
    name: "वंदना त्रिवेदी",
    role: "एबी बायपास पर प्लॉट",
    rating: 5,
    text: "वास्तु के हिसाब से पूर्वमुखी प्लॉट चाहिए था। बिना झुंझलाए आठ प्लॉट दिखाए और आख़िर में वही दिलवाया जो हमें चाहिए था। धैर्य और समझ दोनों हैं इनमें।",
  },
  {
    name: "Er. Sachin Chaturvedi",
    role: "Site engineer · bought at Rau",
    rating: 4,
    text: "I checked the internal road width, drainage lines and boundary markings myself — all as per the sanctioned layout. When an engineer cannot find faults, that says enough.",
  },
  {
    name: "मीना व राजेंद्र गौर",
    role: "बेटी के भविष्य के लिए निवेश",
    rating: 5,
    text: "पाँच साल का नज़रिया रखकर प्लॉट लिया है। इन्होंने ग्रोथ वाले इलाक़े गिनकर बताए और काग़ज़ पक्के करवाए। अब निश्चिंत हैं कि सही जगह पैसा लगा है।",
  },
  {
    name: "Pankaj Panwar",
    role: "Plot on Ujjain Road",
    rating: 4,
    text: "Booked during a Sunday site-visit camp. The rate list was printed and public — no whisper pricing, no special-discount drama. Straightforward dealing from start to finish.",
  },
  {
    name: "स्वाति पांडे",
    role: "सुपर कॉरिडोर पर प्लॉट",
    rating: 4,
    text: "प्लॉट, पेपर और सर्विस — तीनों अच्छे। रजिस्ट्री की तारीख़ एक बार आगे बढ़ी थी, पर वजह पहले ही बता दी गई थी। ईमानदारी से काम करने वाली टीम।",
  },
  {
    name: "Mahesh & Sushila Choudhary",
    role: "Built our retirement home at Rau",
    rating: 5,
    text: "Two years ago they helped us buy the plot; this year they connected us to a reliable contractor and even came for the griha pravesh. That is not business, that is relationship.",
  },
];

const localitiesOf = (list) => [...new Set(list.map((p) => p.location.split(",")[0].trim()))];
const typesOf = (list) => [...new Set(list.map((p) => p.type))];

const LOCALITIES = localitiesOf(PROPERTIES);
const TYPES = typesOf(PROPERTIES);

/* The listings above are the shipped fallback. When Supabase is reachable the
   app swaps in whatever is in the properties table; every dropdown, footer link
   and hero counter reads from this context so they stay in step. */
const CatalogueCtx = createContext({
  properties: PROPERTIES, localities: LOCALITIES, types: TYPES, testimonials: TESTIMONIALS,
});
const useCatalogue = () => useContext(CatalogueCtx);

/* DB row (snake_case) -> the shape the components expect */
const fromRow = (row) => {
  const bundled = PROPERTIES.find((p) => p.id === row.id);
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    price: row.price == null ? null : Number(row.price),
    type: row.type,
    area: row.area ?? 0,
    sizeLabel: row.size_label || "",
    bedrooms: row.bedrooms ?? 0,
    bathrooms: row.bathrooms ?? 0,
    status: row.status || "Available",
    featured: Boolean(row.featured),
    art: row.art || "plot",
    rate: row.rate ?? undefined,
    rera: row.rera ?? undefined,
    transaction: row.transaction ?? undefined,
    facing: row.facing ?? undefined,
    description: row.description || "",
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    // rows seeded with null images keep the creatives bundled with the site
    images: row.images || bundled?.images,
  };
};

const fetchProperties = async () => {
  const rows = await db("properties?select=*&published=eq.true&order=sort_order.asc");
  return Array.isArray(rows) ? rows.map(fromRow) : [];
};

const fetchTestimonials = async () => {
  const rows = await db("testimonials?select=*&published=eq.true&order=sort_order.asc");
  return Array.isArray(rows)
    ? rows.map((r) => ({ id: r.id, name: r.name, role: r.role || "", rating: r.rating ?? 5, text: r.text }))
    : [];
};
/* footer link wording — the mass nouns don't take a plain "s" */
const PLURAL = {
  Commercial: "Commercial spaces",
  Industrial: "Industrial property",
  "Commercial Land": "Commercial land",
  "Agricultural Land": "Agricultural land",
};

const PRICE_BANDS = [
  { label: "Any budget", min: 0, max: Infinity },
  { label: "Under ₹30 Lakh", min: 0, max: 3000000 },
  { label: "₹30 – ₹60 Lakh", min: 3000000, max: 6000000 },
  { label: "₹60 Lakh – ₹1.2 Cr", min: 6000000, max: 12000000 },
  { label: "₹1.2 Cr – ₹2.5 Cr", min: 12000000, max: 25000000 },
  { label: "Above ₹2.5 Cr", min: 25000000, max: Infinity },
];

const BUDGET_OPTIONS = ["Under ₹50 Lakh", "₹50 Lakh – ₹1 Cr", "₹1 Cr – ₹2 Cr", "₹2 Cr – ₹4 Cr", "Above ₹4 Cr", "Not decided yet"];

/* 4. ===================== HELPERS ===================== */
const formatPrice = (n) => {
  if (n == null) return "Price on request";
  if (n >= 10000000) {
    const v = n / 10000000;
    return `₹${Number.isInteger(v) ? v : v.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")} Cr`;
  }
  const l = n / 100000;
  return `₹${Number.isInteger(l) ? l : l.toFixed(1)} Lakh`;
};
const formatArea = (n) => `${n.toLocaleString("en-IN")} sq ft`;
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const isPhone = (v) => /^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/\s/g, ""));
const cx = (...c) => c.filter(Boolean).join(" ");

/* Simulated submit — swap the body of this function for a real API call later.
   e.g.  return fetch("/api/enquiries", { method:"POST", body: JSON.stringify(payload) }) */
const newRef = () => `MRS-${Math.floor(1000 + Math.random() * 9000)}`;

/* Writes the lead to Supabase. With no anon key configured it degrades to the
   old console-log stub so the form still works in local previews. */
const submitEnquiry = async (payload) => {
  const ref = newRef();
  if (!dbReady()) {
    console.log("Enquiry payload → (no Supabase key set)", payload);
    await new Promise((r) => setTimeout(r, 900));
    return { ok: true, ref };
  }
  try {
    await db("enquiries", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: [{
        ref,
        name: payload.name.trim(),
        email: payload.email.trim(),
        phone: payload.phone.trim(),
        property_id: payload.propertyId || null,
        location: payload.location || null,
        budget: payload.budget || null,
        message: payload.message?.trim() || null,
      }],
    });
    return { ok: true, ref };
  } catch (err) {
    console.error("Enquiry submit failed →", err);
    return { ok: false, error: err.message };
  }
};

/* 5. ===================== ILLUSTRATIONS =====================
   Every listing renders an "architect's elevation" — a duotone SVG scene in
   estate green + brass. Swap for photography later by replacing <Elevation/>
   with an <img src={property.image}/> in ArtFrame. */
const TONES = {
  day:   { skyA: "#16443A", skyB: "#0E2A23", disc: "#D8B45E", discGlow: "rgba(216,180,94,.22)", ground: "#0A211B", lit: "#D8B45E" },
  dusk:  { skyA: "#33402C", skyB: "#122A20", disc: "#C08A3E", discGlow: "rgba(192,138,62,.25)", ground: "#0A1D17", lit: "#E4B96A" },
  night: { skyA: "#0C231D", skyB: "#061510", disc: "#EDE3CE", discGlow: "rgba(237,227,206,.14)", ground: "#04110D", lit: "#E9C979" },
};
const STONE = "#EDE3CE";
const STONE_SHADE = "#D9C9A8";
const STONE_DARK = "#C4B18C";

const Windows = ({ x, y, cols, rows, w = 7, h = 9, gx = 6, gy = 6, tone, seed = 0 }) => (
  <g>
    {Array.from({ length: rows }).map((_, r) =>
      Array.from({ length: cols }).map((__, c) => (
        <rect
          key={`${r}-${c}`}
          x={x + c * (w + gx)}
          y={y + r * (h + gy)}
          width={w}
          height={h}
          rx="1"
          fill={(r * 7 + c * 13 + seed) % 5 === 0 ? tone.lit : "#0E2A23"}
          opacity={(r * 7 + c * 13 + seed) % 5 === 0 ? 0.95 : 0.8}
        />
      ))
    )}
  </g>
);

const Tree = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x="-2" y="-6" width="4" height="14" fill="#0A211B" />
    <circle cx="0" cy="-16" r="13" fill="#1C4A3B" />
    <circle cx="-9" cy="-9" r="9" fill="#215543" />
    <circle cx="9" cy="-10" r="8" fill="#184334" />
  </g>
);

const Birds = ({ x, y }) => (
  <g stroke={STONE} strokeWidth="1.4" fill="none" opacity=".7" strokeLinecap="round">
    <path d={`M${x} ${y} q4 -4 8 0 q4 -4 8 0`} />
    <path d={`M${x + 26} ${y - 9} q3 -3 6 0 q3 -3 6 0`} />
  </g>
);

const Elevation = ({ variant = "towers", tone = "day", className = "", label }) => {
  const uid = useId().replace(/[:]/g, "");
  const t = TONES[tone] || TONES.day;
  const sky = `${uid}-sky`;
  return (
    <svg viewBox="0 0 480 320" role="img" aria-label={label || "Architectural elevation illustration"} className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.skyA} />
          <stop offset="1" stopColor={t.skyB} />
        </linearGradient>
      </defs>
      <rect width="480" height="320" fill={`url(#${sky})`} />
      {/* celestial disc */}
      <circle cx={variant === "plot" ? 96 : 384} cy="74" r="46" fill={t.discGlow} />
      <circle cx={variant === "plot" ? 96 : 384} cy="74" r="26" fill={t.disc} />
      {tone === "night" && <circle cx={variant === "plot" ? 104 : 392} cy="68" r="22" fill={t.skyB} opacity=".9" />}
      <Birds x={variant === "plot" ? 300 : 120} y={86} />

      {variant === "towers" && (
        <g>
          <rect x="52" y="150" width="86" height="140" fill={STONE_SHADE} />
          <Windows x={62} y={162} cols={5} rows={8} tone={t} seed={1} />
          <rect x="168" y="96" width="104" height="194" fill={STONE} />
          <rect x="168" y="96" width="104" height="8" fill={t.disc} opacity=".85" />
          <Windows x={180} y={116} cols={6} rows={10} tone={t} seed={3} />
          <rect x="300" y="176" width="120" height="114" fill={STONE_DARK} />
          <Windows x={312} y={188} cols={7} rows={6} tone={t} seed={6} />
          <Tree x={36} y={288} s={0.9} />
          <Tree x={444} y={290} s={1.05} />
        </g>
      )}

      {variant === "penthouse" && (
        <g>
          <rect x="120" y="230" width="70" height="60" fill={STONE_DARK} opacity=".8" />
          <Windows x={128} y={240} cols={4} rows={3} tone={t} seed={2} />
          <rect x="206" y="70" width="96" height="220" fill={STONE} />
          <Windows x={217} y={118} cols={6} rows={11} tone={t} seed={4} />
          {/* crown + terrace */}
          <rect x="198" y="58" width="112" height="14" fill={t.disc} opacity=".9" />
          <rect x="214" y="78" width="80" height="26" fill={STONE_SHADE} />
          <path d="M214 78 h80" stroke={t.disc} strokeWidth="2" />
          <g stroke={STONE_DARK} strokeWidth="2">
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={i} x1={216 + i * 9.5} y1="66" x2={216 + i * 9.5} y2="58" />
            ))}
          </g>
          <rect x="320" y="204" width="86" height="86" fill={STONE_SHADE} opacity=".85" />
          <Windows x={330} y={214} cols={5} rows={4} tone={t} seed={8} />
          <Tree x={92} y={290} s={0.9} />
          <Tree x={434} y={290} s={0.85} />
        </g>
      )}

      {variant === "villa" && (
        <g>
          <path d="M96 176 L240 108 L384 176 Z" fill={STONE_SHADE} />
          <path d="M96 176 L240 108 L384 176" fill="none" stroke={t.disc} strokeWidth="2.5" />
          <rect x="116" y="176" width="248" height="114" fill={STONE} />
          <rect x="150" y="206" width="34" height="44" rx="2" fill="#0E2A23" opacity=".85" />
          <rect x="296" y="206" width="34" height="44" rx="2" fill="#0E2A23" opacity=".85" />
          <rect x="153" y="209" width="28" height="18" fill={t.lit} opacity=".9" />
          <rect x="222" y="216" width="36" height="74" rx="2" fill="#123A2E" />
          <circle cx="251" cy="254" r="2.4" fill={t.disc} />
          <rect x="204" y="176" width="6" height="114" fill={STONE_SHADE} />
          <rect x="270" y="176" width="6" height="114" fill={STONE_SHADE} />
          <rect x="106" y="286" width="268" height="6" fill={STONE_DARK} />
          <Tree x={62} y={288} s={1.15} />
          <Tree x={416} y={288} s={1.3} />
          <Tree x={452} y={292} s={0.8} />
        </g>
      )}

      {variant === "row" && (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${64 + i * 92},0)`}>
              <path d="M0 168 L42 132 L84 168 Z" fill={i % 2 ? STONE_SHADE : STONE_DARK} />
              <rect x="4" y="168" width="76" height="122" fill={i % 2 ? STONE : STONE_SHADE} />
              <rect x="14" y="184" width="20" height="24" rx="1" fill="#0E2A23" opacity=".85" />
              <rect x="48" y="184" width="20" height="24" rx="1" fill={i % 3 === 0 ? t.lit : "#0E2A23"} opacity=".9" />
              <rect x="30" y="242" width="24" height="48" rx="1" fill="#123A2E" />
              <path d="M0 168 L42 132 L84 168" fill="none" stroke={t.disc} strokeWidth="2" opacity=".9" />
            </g>
          ))}
          <rect x="52" y="288" width="380" height="4" fill={STONE_DARK} />
          <Tree x={30} y={288} s={0.85} />
        </g>
      )}

      {variant === "office" && (
        <g>
          <rect x="96" y="86" width="230" height="204" fill={STONE} />
          <rect x="96" y="86" width="230" height="10" fill={t.disc} opacity=".9" />
          <Windows x={108} y={108} cols={12} rows={9} w={11} h={11} gx={7} gy={7} tone={t} seed={5} />
          <rect x="326" y="180" width="96" height="110" fill={STONE_SHADE} />
          <Windows x={336} y={192} cols={5} rows={5} tone={t} seed={9} />
          <rect x="150" y="252" width="60" height="38" fill="#0E2A23" opacity=".9" />
          <rect x="154" y="256" width="52" height="30" fill={t.lit} opacity=".35" />
          <Tree x={64} y={290} s={1.0} />
          <Tree x={452} y={290} s={0.9} />
        </g>
      )}

      {variant === "plot" && (
        <g>
          <path d="M0 250 Q120 226 240 244 T480 238 V320 H0 Z" fill="#12362B" />
          <path d="M0 276 Q140 258 300 272 T480 268 V320 H0 Z" fill={t.ground} />
          <g stroke={t.disc} strokeWidth="2" strokeDasharray="10 8" fill="none" opacity=".95">
            <path d="M120 300 L200 236 L392 252 L352 312" />
          </g>
          {[
            [120, 300], [200, 236], [392, 252], [352, 312],
          ].map(([x, y], i) => (
            <rect key={i} x={x - 4} y={y - 10} width="8" height="14" fill={STONE} />
          ))}
          <Tree x={78} y={252} s={1.5} />
          <Tree x={438} y={240} s={1.0} />
          <path d="M240 320 L262 250 l6 0 L292 320 Z" fill="#0A211B" opacity=".6" />
        </g>
      )}

      {variant === "skyline" && (
        <g>
          <g opacity=".45">
            <rect x="18" y="150" width="52" height="140" fill="#1B4A3B" />
            <rect x="360" y="132" width="46" height="158" fill="#1B4A3B" />
            <rect x="418" y="168" width="52" height="122" fill="#173F32" />
          </g>
          <rect x="84" y="118" width="78" height="172" fill={STONE_SHADE} />
          <Windows x={94} y={130} cols={4} rows={9} tone={t} seed={2} />
          <rect x="178" y="66" width="96" height="224" fill={STONE} />
          <rect x="178" y="66" width="96" height="9" fill={t.disc} opacity=".9" />
          <Windows x={190} y={88} cols={5} rows={12} tone={t} seed={4} />
          <path d="M292 290 V170 L348 148 V290 Z" fill={STONE_DARK} />
          <Windows x={302} y={182} cols={3} rows={6} tone={t} seed={7} />
          {/* crane */}
          <g stroke={t.disc} strokeWidth="2.5" fill="none" opacity=".9">
            <line x1="330" y1="148" x2="330" y2="64" />
            <line x1="286" y1="72" x2="396" y2="64" />
            <line x1="330" y1="64" x2="286" y2="72" />
            <line x1="386" y1="65" x2="386" y2="92" />
          </g>
          <rect x="382" y="92" width="9" height="12" fill={t.disc} />
          <Tree x={40} y={290} s={1.0} />
          <Tree x={452} y={290} s={1.1} />
        </g>
      )}

      {/* ground line */}
      <rect x="0" y="290" width="480" height="30" fill={t.ground} />
      <line x1="0" y1="290" x2="480" y2="290" stroke={t.disc} strokeWidth="1.5" opacity=".5" />
    </svg>
  );
};

const STATUS_STYLE = {
  Available: { bg: "#1C4A3B", fg: "#EDE3CE", dot: "#7FC8A4" },
  Featured: { bg: "#B9902F", fg: "#231A05", dot: "#231A05" },
  Sold: { bg: "#5C4A45", fg: "#F3E9E6", dot: "#E0A79A" },
};

const StatusBadge = ({ status, featured }) => {
  const items = [];
  if (featured) items.push("Featured");
  items.push(status);
  return (
    <div className="absolute left-3 top-3 flex gap-2">
      {items.map((s) => {
        const st = STATUS_STYLE[s] || STATUS_STYLE.Available;
        return (
          <span key={s} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide"
            style={{ background: st.bg, color: st.fg }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: st.dot }} />
            {s}
          </span>
        );
      })}
    </div>
  );
};

const ArtFrame = ({ property, tone = "day", className = "", rounded = "rounded-2xl", showBadge = true }) => (
  <div className={cx("relative overflow-hidden", rounded, className)}>
    {property.images && property.images.length > 0 ? (
      <img src={property.images[0].src} alt={property.title + " — " + property.images[0].label}
        className="h-full w-full object-cover" loading="lazy" />
    ) : (
      <Elevation variant={property.art} tone={tone} label={"Elevation sketch of " + property.title} className="h-full w-full object-cover" />
    )}
    {showBadge && <StatusBadge status={property.status} featured={property.featured} />}
  </div>
);

/* 6. ===================== UI PRIMITIVES ===================== */
const Eyebrow = ({ children, center = false, light = false }) => (
  <span className={cx("eyebrow", center && "eyebrow--center")} style={light ? { color: "var(--brass-soft)" } : undefined}>
    {children}
  </span>
);

const SectionHead = ({ eyebrow, title, sub, center = false, light = false }) => (
  <div className={cx("max-w-2xl", center && "mx-auto text-center")}>
    <Eyebrow center={center} light={light}>{eyebrow}</Eyebrow>
    <h2 className={cx("font-display mt-3 text-3xl leading-tight sm:text-4xl", light ? "text-ivory" : "")}>{title}</h2>
    {sub && <p className={cx("mt-3 t-15 leading-relaxed", light ? "text-ivory" : "text-muted")} style={light ? { opacity: 0.75 } : undefined}>{sub}</p>}
  </div>
);

const Stars = ({ n }) => (
  <div className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} size={15} className={i <= n ? "text-brass" : ""} fill={i <= n ? "var(--brass)" : "none"} stroke={i <= n ? "var(--brass)" : "var(--line)"} />
    ))}
  </div>
);

const Spec = ({ icon: Icon, children }) => (
  <span className="inline-flex items-center gap-1.5 t-13 text-muted">
    <Icon size={15} strokeWidth={1.8} className="text-brass" /> {children}
  </span>
);

/* 7. ===================== SECTIONS ===================== */

/* ---------- Header ---------- */
const Logo = ({ light = false, onClick }) => (
  <button type="button" onClick={onClick} className="flex items-center gap-2.5 text-left" aria-label="Mitesh Real Estate Solution — go to home">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-deep">
      <svg viewBox="0 0 48 48" width="26" height="26" fill="none" stroke="var(--brass)" strokeWidth="3.4" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
        <path d="M9 43 V19 L24 7 L39 19 V43" />
        <path d="M16 43 V25 L24 33 L32 25 V43" />
      </svg>
    </span>
    <span className="leading-none">
      <span className={cx("font-display block t-17 tracking-wide", light ? "text-ivory" : "")}>Mitesh Raghuvanshi</span>
      <span className="mt-1 block logo-sub text-brass">Real Estate Solution</span>
    </span>
  </button>
);

const Header = ({ go, onEnquire }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const nav = (t) => { setOpen(false); go(t); };
  return (
    <header className={cx("sticky top-0 z-50 border-b transition-shadow", scrolled ? "shadow-sm" : "")}
      style={{ background: "rgba(250,247,240,.92)", backdropFilter: "blur(10px)", borderColor: "var(--line)" }}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo onClick={() => nav("home")} />
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <button key={l.target} type="button" onClick={() => nav(l.target)}
              className="tap-inline t-13 font-medium text-muted transition-colors hover:text-brass">
              {l.label}
            </button>
          ))}
          <button type="button" onClick={onEnquire} className="btn btn-primary px-5 py-2.5 text-sm">
            Enquire Now <ArrowRight size={15} className="arrow" />
          </button>
        </nav>
        <button type="button" className="grid h-10 w-10 place-items-center rounded-lg border border-line md:hidden"
          aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-line px-4 pb-5 pt-2 md:hidden" aria-label="Mobile" style={{ background: "var(--paper)" }}>
          {NAV_LINKS.map((l) => (
            <button key={l.target} type="button" onClick={() => nav(l.target)}
              className="block w-full border-b border-line py-3 text-left t-15 font-medium">
              {l.label}
            </button>
          ))}
          <button type="button" onClick={() => { setOpen(false); onEnquire(); }} className="btn btn-primary mt-4 w-full py-3 text-sm">
            Enquire Now <ArrowRight size={15} className="arrow" />
          </button>
        </nav>
      )}
    </header>
  );
};

/* ---------- Hero ---------- */
const heroStats = ({ properties, localities }) => [
  { k: `${properties.length}`, v: "Properties live right now" },
  { k: `${localities.length}`, v: "Indore localities & corridors" },
  { k: "M.P. RERA", v: `Reg. ${CONTACT.rera}` },
];

const HeroStats = () => (
  <>
    {heroStats(useCatalogue()).map((s) => (
      <div key={s.v}>
        <dt className="font-display text-2xl sm:text-3xl">{s.k}</dt>
        <dd className="mt-1 text-xs leading-snug text-muted">{s.v}</dd>
      </div>
    ))}
  </>
);

const Hero = ({ go, onEnquire }) => (
  <section id="home" className="relative overflow-hidden">
    <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-10 pt-12 sm:px-6 hero-grid lg:gap-14 lg:px-8 lg:pb-16 lg:pt-20">
      <div className="rise">
        <Eyebrow>Residential · Investment · Commercial · Rental Income</Eyebrow>
        <h1 className="font-display hero-title mt-4">
          Trusted property solutions in <span className="text-brass">Indore, Madhya Pradesh.</span>
        </h1>
        <p className="mt-5 max-w-xl t-15 leading-relaxed text-muted">
          Mitesh Real Estate Solution is an authorised channel partner for leading builders in Indore —
          plots, homes, commercial spaces and rental-income assets from RERA-approved projects, with honest
          advice and paperwork handled end to end.
        </p>
        <p className="mt-3 max-w-xl t-14 leading-relaxed text-muted" style={{ fontStyle: "italic" }}>
          Reliable property solutions for living, investment and steady rental income.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button type="button" onClick={() => go("properties")} className="btn btn-dark px-6 py-3 text-sm">
            Browse properties <ArrowRight size={16} className="arrow" />
          </button>
          <button type="button" onClick={onEnquire} className="btn btn-ghost px-6 py-3 text-sm">
            Get in touch
          </button>
        </div>
        <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
          <HeroStats />
        </dl>
      </div>
      <div className="rise rise-2 relative">
        <div className="overflow-hidden rounded-3xl shadow-xl" style={{ boxShadow: "0 32px 64px -32px rgba(14,42,35,.5)", background: "#fff" }}>
          <img src={IMG.brandLogo} alt={`${CONTACT.brand} — logo`} className="ar-4x3 w-full object-contain" style={{ padding: "6%" }} />
        </div>
        <div className="absolute -bottom-4 -left-3 hidden items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-lg sm:flex"
          style={{ border: "1px solid var(--line)" }}>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-deep"><ShieldCheck size={17} className="text-brass" /></span>
          <span className="text-xs leading-tight"><strong className="block font-semibold">M.P. RERA registered</strong><span className="text-muted">Reg. No. {CONTACT.rera}</span></span>
        </div>
      </div>
    </div>
  </section>
);

/* ---------- Property filter / search ---------- */
const DEFAULT_FILTERS = { q: "", location: "All locations", type: "All types", band: 0, bedrooms: "Any", status: "Any status" };

const FilterBar = ({ filters, setFilters, count, total }) => {
  const { localities, types } = useCatalogue();
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
  const dirty = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);
  return (
    <div className="rise rise-3 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-card p-4 shadow-lg sm:p-5" style={{ border: "1px solid var(--line)", boxShadow: "0 24px 48px -32px rgba(14,42,35,.35)" }}>
        <div className="filter-grid gap-3">
          <div className="relative xl:col-span-1">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input className="field" style={{ paddingLeft: "2.4rem" }} type="search" placeholder="Search by name or area…" aria-label="Search properties"
              value={filters.q} onChange={(e) => set("q", e.target.value)} />
          </div>
          <select className="field" aria-label="Filter by location" value={filters.location} onChange={(e) => set("location", e.target.value)}>
            <option>All locations</option>
            {localities.map((l) => <option key={l}>{l}</option>)}
          </select>
          <select className="field" aria-label="Filter by property type" value={filters.type} onChange={(e) => set("type", e.target.value)}>
            <option>All types</option>
            {types.map((ty) => <option key={ty}>{ty}</option>)}
          </select>
          <select className="field" aria-label="Filter by price range" value={filters.band} onChange={(e) => set("band", +e.target.value)}>
            {PRICE_BANDS.map((b, i) => <option key={b.label} value={i}>{b.label}</option>)}
          </select>
          <select className="field" aria-label="Filter by bedrooms" value={filters.bedrooms} onChange={(e) => set("bedrooms", e.target.value)}>
            {["Any", "1", "2", "3", "4+"].map((b) => <option key={b} value={b}>{b === "Any" ? "Any BHK" : `${b} BHK`}</option>)}
          </select>
          <select className="field" aria-label="Filter by status" value={filters.status} onChange={(e) => set("status", e.target.value)}>
            {["Any status", "Available", "Featured", "Sold"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <button type="button" onClick={() => setFilters(DEFAULT_FILTERS)} disabled={!dirty}
            className={cx("btn px-4 py-2.5 text-sm", dirty ? "btn-ghost" : "btn-ghost opacity-40")}>
            <RotateCcw size={14} /> Reset
          </button>
        </div>
        <p className="mt-3 text-xs text-muted" role="status">
          Showing <strong className="font-semibold" style={{ color: "var(--ink)" }}>{count}</strong> of {total} properties
        </p>
      </div>
    </div>
  );
};

/* ---------- Property card & grid ---------- */
const PropertyCard = ({ property, onView, onEnquire }) => {
  const sold = property.status === "Sold";
  return (
    <article className="lift flex flex-col overflow-hidden rounded-2xl bg-card" style={{ border: "1px solid var(--line)" }}>
      <button type="button" onClick={() => onView(property.id)} className="block text-left" aria-label={`View details of ${property.title}`}>
        <ArtFrame property={property} rounded="rounded-none" className="ar-3x2" />
      </button>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="overline text-brass">{property.type}</p>
            <h3 className="font-display mt-1 text-lg leading-snug">{property.title}</h3>
            <p className="mt-1 inline-flex items-center gap-1 t-13 text-muted">
              <MapPin size={13} className="text-brass" /> {property.location}
            </p>
          </div>
          <p className={cx("font-display whitespace-nowrap", property.price ? "text-lg" : "t-13")} style={{ color: "var(--deep)" }}>{formatPrice(property.price)}</p>
        </div>
        <p className="mt-3 t-13 leading-relaxed text-muted" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {property.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-4">
          <Spec icon={Ruler}>{property.sizeLabel || formatArea(property.area)}</Spec>
          {property.bedrooms > 0 && <Spec icon={BedDouble}>{property.bedrooms} Bed</Spec>}
          {property.bathrooms > 0 && <Spec icon={Bath}>{property.bathrooms} Bath</Spec>}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button type="button" onClick={() => onView(property.id)} className="btn btn-ghost py-2.5 t-13">View Details</button>
          <button type="button" onClick={() => onEnquire(property.id)} disabled={sold}
            className={cx("btn py-2.5 t-13", sold ? "btn-ghost cursor-not-allowed opacity-45" : "btn-dark")}>
            {sold ? "Sold Out" : "Enquire Now"}
          </button>
        </div>
      </div>
    </article>
  );
};

const EmptyState = ({ onReset }) => (
  <div className="col-span-full rounded-2xl border border-dashed px-6 py-16 text-center" style={{ borderColor: "var(--line)" }}>
    <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-deep"><Search size={20} className="text-brass" /></span>
    <h3 className="font-display mt-4 text-xl">No properties match these filters</h3>
    <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
      Widen the budget or clear a filter to see more of our current portfolio — or send an enquiry and we'll source it for you.
    </p>
    <button type="button" onClick={onReset} className="btn btn-primary mt-6 px-5 py-2.5 text-sm"><RotateCcw size={14} /> Reset filters</button>
  </div>
);

const PAGE = 12;

const PropertyGrid = ({ list, onView, onEnquire, onReset }) => {
  const [shown, setShown] = useState(PAGE);
  // a new filter result starts from the top again
  useEffect(() => { setShown(PAGE); }, [list]);
  const visible = list.slice(0, shown);
  return (
    <>
      <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {list.length === 0 ? (
          <EmptyState onReset={onReset} />
        ) : (
          visible.map((p) => <PropertyCard key={p.id} property={p} onView={onView} onEnquire={onEnquire} />)
        )}
      </div>
      {shown < list.length && (
        <div className="mt-10 text-center">
          <button type="button" onClick={() => setShown((n) => n + PAGE)} className="btn btn-ghost px-7 py-3 text-sm">
            Show more properties
            <span className="text-muted">({list.length - shown} left)</span>
          </button>
        </div>
      )}
    </>
  );
};

/* ---------- Property details ---------- */
const DetailTile = ({ label, value }) => (
  <div className="rounded-xl bg-card p-4" style={{ border: "1px solid var(--line)" }}>
    <p className="overline-xs text-muted">{label}</p>
    <p className="font-display mt-1.5 text-lg leading-none">{value}</p>
  </div>
);

const PropertyDetails = ({ property, onBack, onEnquire, related, onView }) => {
  const [tone, setTone] = useState("day");
  const [imgIdx, setImgIdx] = useState(0);
  useEffect(() => { setTone("day"); setImgIdx(0); window.scrollTo({ top: 0, behavior: "auto" }); }, [property.id]);
  const imgs = property.images || [];
  const sold = property.status === "Sold";
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <button type="button" onClick={onBack} className="tap-inline gap-2 text-sm font-medium text-muted transition-colors hover:text-brass">
        <ArrowLeft size={16} /> Back to all properties
      </button>

      <div className="mt-6 detail-grid gap-10">
        {/* Gallery */}
        <div className="rise">
          {imgs.length > 0 ? (
            <>
              <div className="ar-3x2 relative overflow-hidden rounded-3xl bg-deep shadow-xl">
                <img src={imgs[imgIdx].src} alt={property.title + " — " + imgs[imgIdx].label}
                  className={cx("h-full w-full", imgs[imgIdx].fit === "contain" ? "object-contain" : "object-cover")} />
                <StatusBadge status={property.status} featured={property.featured} />
              </div>
              {imgs.length > 1 && (
                <div className="mt-3 grid grid-cols-3 gap-3" role="group" aria-label="Project images">
                  {imgs.map((im, i) => (
                    <button key={im.label} type="button" onClick={() => setImgIdx(i)}
                      className={cx("ar-3x2 overflow-hidden rounded-xl bg-deep transition-all", imgIdx === i ? "ring-2 ring-offset-2" : "opacity-70 hover:opacity-100")}
                      style={imgIdx === i ? { "--tw-ring-color": "var(--brass)", "--tw-ring-offset-color": "var(--paper)" } : undefined}
                      aria-pressed={imgIdx === i} aria-label={"View " + im.label}>
                      <img src={im.src} alt="" className={cx("h-full w-full", im.fit === "contain" ? "object-contain" : "object-cover")} loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-muted">Property photos — ask us for the full set, brochure and layout map.</p>
            </>
          ) : (
            <>
              <ArtFrame property={property} tone={tone} className="ar-3x2 shadow-xl" rounded="rounded-3xl" />
              <div className="mt-3 grid grid-cols-3 gap-3" role="group" aria-label="Choose lighting for the elevation sketch">
                {["day", "dusk", "night"].map((t) => (
                  <button key={t} type="button" onClick={() => setTone(t)}
                    className={cx("overflow-hidden rounded-xl transition-all", tone === t ? "ring-2 ring-offset-2" : "opacity-70 hover:opacity-100")}
                    style={tone === t ? { "--tw-ring-color": "var(--brass)", "--tw-ring-offset-color": "var(--paper)" } : undefined}
                    aria-pressed={tone === t} aria-label={t + " view"}>
                    <Elevation variant={property.art} tone={t} className="ar-3x2 w-full" label={property.title + " at " + t} />
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted">Illustrated impression — call us for the layout map and a site visit.</p>
            </>
          )}
        </div>

        {/* Facts */}
        <div className="rise rise-1">
          <p className="overline text-brass">{property.type} · {property.id}{property.rera ? " · RERA " + property.rera : ""}</p>
          <h1 className="font-display mt-2 text-3xl leading-tight sm:text-4xl">{property.title}</h1>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted"><MapPin size={15} className="text-brass" /> {property.location}</p>
          <p className="font-display mt-4 text-3xl" style={{ color: "var(--deep)" }}>
            {formatPrice(property.price)} <span className="text-sm text-muted" style={{ fontFamily: "'Archivo',sans-serif" }}>· {sold ? "recently sold" : property.price ? "all-inclusive guidance on final price" : "share your budget and we'll send current rates"}</span>
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <DetailTile label="Size" value={property.sizeLabel || formatArea(property.area)} />
            {property.bedrooms > 0
              ? <DetailTile label="Bedrooms" value={`${property.bedrooms} BHK`} />
              : <DetailTile label="Rate" value={property.rate ? `₹${property.rate.toLocaleString("en-IN")}/sq ft` : "On request"} />}
            {property.bedrooms > 0
              ? <DetailTile label="Bathrooms" value={property.bathrooms > 0 ? property.bathrooms : "—"} />
              : <DetailTile label="Listing" value={property.transaction || "For sale"} />}
            <DetailTile label="Status" value={property.featured && !sold ? "Featured" : property.status} />
            <DetailTile label="Type" value={property.type} />
            <DetailTile label="City" value={property.location.split(",").pop().trim()} />
          </div>

          <h2 className="font-display mt-8 text-xl">About this property</h2>
          <p className="mt-2 t-14 leading-relaxed text-muted">{property.description}</p>

          <h2 className="font-display mt-7 text-xl">Features & amenities</h2>
          <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {property.amenities.map((a) => (
              <li key={a} className="flex items-start gap-2 t-13">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brass" /> {a}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => onEnquire(property.id)} disabled={sold}
              className={cx("btn px-6 py-3 text-sm", sold ? "btn-ghost cursor-not-allowed opacity-45" : "btn-primary")}>
              {sold ? "This property is sold" : "Enquire about this property"} {!sold && <ArrowRight size={15} className="arrow" />}
            </button>
            <a href={CONTACT.phones[0].href} className="btn btn-ghost px-6 py-3 text-sm"><Phone size={15} /> {CONTACT.phones[0].label}</a>
          </div>
          {sold && (
            <p className="mt-3 t-13 text-muted">
              Similar homes come up in {property.location.split(",")[0]} often — <button type="button" className="font-semibold text-brass underline-offset-2 hover:underline" onClick={() => onEnquire(null)}>tell us what you need</button> and we'll alert you first.
            </p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <SectionHead eyebrow="You may also like" title="Similar properties" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <PropertyCard key={p.id} property={p} onView={onView} onEnquire={onEnquire} />)}
          </div>
        </div>
      )}
    </section>
  );
};

/* ---------- We deal in ---------- */
const WE_DEAL_IN = [
  { icon: Home, title: "Residential Properties", text: "Homes, flats and plots to live in." },
  { icon: TrendingUp, title: "Investment Properties", text: "Land and units bought for appreciation." },
  { icon: Building2, title: "Commercial Properties", text: "Showrooms, shops and office floors." },
  { icon: Landmark, title: "Rental Income Properties", text: "Pre-leased and rent-ready assets." },
];

const WeDealIn = () => (
  <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
    <div className="rounded-3xl bg-deep px-6 py-10 sm:px-10 lg:py-12">
      <div className="text-center">
        <Eyebrow center light>Buy · Sell · Invest · Rent</Eyebrow>
        <h2 className="font-display mt-4 text-2xl text-ivory sm:text-3xl">We deal in</h2>
      </div>
      <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WE_DEAL_IN.map((d) => (
          <li key={d.title} className="rounded-2xl px-5 py-6"
            style={{ background: "rgba(237,227,206,.06)", border: "1px solid rgba(237,227,206,.16)" }}>
            <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "rgba(185,144,47,.16)" }}>
              <d.icon size={19} className="text-brass" strokeWidth={1.7} />
            </span>
            <h3 className="font-display mt-4 text-ivory t-17">{d.title}</h3>
            <p className="mt-1.5 t-13 leading-relaxed" style={{ color: "rgba(237,227,206,.62)" }}>{d.text}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

/* ---------- Services ---------- */
const ServiceCard = ({ icon: Icon, title, text }) => (
  <div className="lift rounded-2xl bg-card p-6" style={{ border: "1px solid var(--line)" }}>
    <span className="grid h-11 w-11 place-items-center rounded-xl bg-deep"><Icon size={20} className="text-brass" strokeWidth={1.7} /></span>
    <h3 className="font-display mt-4 text-lg">{title}</h3>
    <p className="mt-2 t-13 leading-relaxed text-muted">{text}</p>
  </div>
);

const Services = () => (
  <section id="services" className="border-y border-line" style={{ background: "#FFFDF8" }}>
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <SectionHead center eyebrow="What we do" title="One desk for every property decision"
        sub="From the first shortlist to the last signature — buying, selling, leasing and investing, handled by one accountable team." />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => <ServiceCard key={s.title} {...s} />)}
      </div>
    </div>
  </section>
);

/* ---------- About ---------- */
const WHY_US = [
  "Honest advisory — we'll tell you when not to buy",
  "Every title and RERA record verified before your first visit",
  "Loan, legal and registration coordinated from one desk",
  "Support that continues after possession, not just till token",
];

const About = ({ go }) => (
  <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <SectionHead eyebrow="About us" title="Indore property, explained without the sales pitch"
          sub="Mitesh Real Estate Solution is an Indore-based advisory led by Mitesh Raghuvanshi — an authorised channel partner for leading builders and premium projects across the city, in residential, commercial and investment properties." />
        <p className="mt-4 max-w-xl t-15 leading-relaxed text-muted">
          Buying through a channel partner costs you nothing extra — you get developer pricing, plus one
          accountable desk from the first site visit to the registry. And we'll tell you plainly when a deal isn't worth your money.
        </p>
        <ul className="mt-6 space-y-3">
          {WHY_US.map((w) => (
            <li key={w} className="flex items-start gap-2.5 text-sm">
              <ShieldCheck size={17} className="mt-0.5 shrink-0 text-brass" /> {w}
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => go("contact")} className="btn btn-dark mt-8 px-6 py-3 text-sm">
          Talk to an advisor <ArrowRight size={15} className="arrow" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 overflow-hidden rounded-2xl shadow-lg" style={{ border: "1px solid var(--line)" }}>
          <img src={IMG.bizCard} alt="Mitesh Raghuvanshi — Real Estate Solution business card" className="w-full" loading="lazy" />
        </div>
        {[
          { k: "4", v: "RERA-approved projects live today" },
          { k: "800–2,400", v: "Plot sizes (sq ft) across projects" },
          { k: "4", v: "Growth corridors with plot options" },
          { k: "A-IND-24-1732", v: "M.P. RERA agent registration" },
        ].map((s, i) => (
          <div key={s.v} className={cx("rounded-2xl p-6", i === 0 ? "bg-deep" : "bg-card")}
            style={i === 0 ? undefined : { border: "1px solid var(--line)" }}>
            <p className={cx("font-display text-3xl", i === 0 ? "text-brass" : "")} style={i === 0 ? undefined : { color: "var(--deep)" }}>{s.k}</p>
            <p className={cx("mt-2 text-xs leading-snug", i === 0 ? "text-ivory" : "text-muted")} style={i === 0 ? { opacity: 0.8 } : undefined}>{s.v}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Testimonials ---------- */
/* Avatar initials. Works for any script — matching [A-Z] left every Devanagari
   name with an empty circle — and skips honorifics and joining words so
   "Dr. Nitin Vyas" reads NV, not DN. */
const HONORIFICS = /^(dr|mr|mrs|ms|shri|smt|prof|adv|ca|er|md|sh)\.?$/i;
const JOINERS = new Set(["&", "and", "व", "एवं", "और"]);

const initialsOf = (name) => {
  const words = (name || "")
    .split(/[\s.]+/)
    .filter((w) => w && !HONORIFICS.test(w) && !JOINERS.has(w));
  return words.slice(0, 2).map((w) => [...w][0]).join("");
};

const TestimonialCard = ({ t }) => (
  <figure className="flex h-full flex-col rounded-2xl p-6" style={{ background: "rgba(237,227,206,.06)", border: "1px solid rgba(237,227,206,.16)" }}>
    <Stars n={t.rating} />
    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ivory" style={{ opacity: 0.92 }}>
      "{t.text}"
    </blockquote>
    <figcaption className="mt-5 flex items-center gap-3 border-t pt-4" style={{ borderColor: "rgba(237,227,206,.16)" }}>
      <span className="font-display grid h-10 w-10 place-items-center rounded-full text-sm" style={{ background: "var(--brass)", color: "#231A05" }}>
        {initialsOf(t.name)}
      </span>
      <span>
        <span className="block t-13 font-semibold text-ivory">{t.name}</span>
        <span className="block text-xs text-ivory" style={{ opacity: 0.65 }}>{t.role}</span>
      </span>
    </figcaption>
  </figure>
);

/* How many cards fit across, by breakpoint — drives the card width. */
const usePerView = () => {
  const [n, setN] = useState(3);
  useEffect(() => {
    const md = window.matchMedia("(min-width: 768px)");
    const lg = window.matchMedia("(min-width: 1024px)");
    const read = () => setN(lg.matches ? 3 : md.matches ? 2 : 1);
    read();
    md.addEventListener("change", read);
    lg.addEventListener("change", read);
    return () => { md.removeEventListener("change", read); lg.removeEventListener("change", read); };
  }, []);
  return n;
};

/* Seconds each review spends crossing the screen. Higher = slower drift. */
const SECONDS_PER_CARD = 6;

const Testimonials = () => {
  const { testimonials } = useCatalogue();
  const perView = usePerView();

  const n = testimonials.length;
  if (!n) return null;

  /* The track carries the list twice so the -50% keyframe wraps invisibly.
     Widths are percentages of the track, which is itself sized against the
     container, so a card always lands on exactly 1/perView of the viewport. */
  const trackWidthPct = (2 * n * 100) / perView;
  const cardWidthPct = 100 / (2 * n);
  const loop = [...testimonials, ...testimonials];

  return (
    <section className="bg-deep">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHead center light eyebrow="Client words" title="Trusted across Indore, one family at a time"
          sub="A few of the buyers, sellers and investors who've worked with Mitesh Real Estate Solution." />
      </div>

      <div className="tmarquee tmarquee-mask pb-16 lg:pb-20"
        role="region" aria-label="Client testimonials">
        <ul
          className="tmarquee-track list-none p-0"
          style={{ width: `${trackWidthPct}%`, "--tm-duration": `${n * SECONDS_PER_CARD}s` }}
        >
          {loop.map((t, idx) => (
            <li
              key={`${t.id ?? t.name}-${idx}`}
              className="px-2.5"
              style={{ flex: `0 0 ${cardWidthPct}%` }}
              /* the second pass is decorative — don't read every review twice */
              aria-hidden={idx >= n}
            >
              <TestimonialCard t={t} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

/* ---------- Enquiry form ---------- */
const EnquiryForm = ({ prefill }) => {
  const { properties, localities } = useCatalogue();
  const blank = { name: "", email: "", phone: "", propertyId: "", location: "", budget: "", message: "" };
  const [values, setValues] = useState(blank);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [ref, setRef] = useState("");
  const [sendError, setSendError] = useState("");
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (prefill && prefill.ts) {
      setStatus("idle");
      setValues((v) => ({ ...v, propertyId: prefill.id || "" }));
    }
  }, [prefill]);

  const errors = useMemo(() => {
    const e = {};
    if (!values.name.trim() || values.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!values.email.trim()) e.email = "Email is required.";
    else if (!isEmail(values.email)) e.email = "That email address doesn't look right.";
    if (!values.phone.trim()) e.phone = "Phone number is required.";
    else if (!isPhone(values.phone)) e.phone = "Enter a valid 10-digit Indian mobile number.";
    return e;
  }, [values]);

  const show = (k) => (touched[k] || attempted) && errors[k];
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setAttempted(true);
    if (Object.keys(errors).length) return;
    setStatus("submitting");
    setSendError("");
    const res = await submitEnquiry({ ...values, submittedAt: new Date().toISOString() });
    if (res.ok) { setRef(res.ref); setStatus("success"); }
    else { setSendError(res.error || "Something went wrong."); setStatus("error"); }
  };

  if (status === "success") {
    const prop = properties.find((p) => p.id === values.propertyId);
    return (
      <div className="rounded-2xl bg-card p-8 text-center" style={{ border: "1px solid var(--line)" }} role="status">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full" style={{ background: "rgba(28,74,59,.1)" }}>
          <CheckCircle2 size={28} style={{ color: "#1C6A4C" }} />
        </span>
        <h3 className="font-display mt-4 text-2xl">Enquiry received — thank you, {values.name.split(" ")[0]}.</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Reference <strong className="font-semibold" style={{ color: "var(--ink)" }}>{ref}</strong>.
          {prop ? ` An advisor will call you about ${prop.title} ` : " An advisor will call you "}
          within one working day on {values.phone}.
        </p>
        <button type="button" className="btn btn-ghost mt-6 px-5 py-2.5 text-sm"
          onClick={() => { setValues(blank); setTouched({}); setAttempted(false); setStatus("idle"); }}>
          Send another enquiry
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";
  return (
    <form className="rounded-2xl bg-card p-6 sm:p-8" style={{ border: "1px solid var(--line)" }} onSubmit={onSubmit} noValidate>
      <h3 className="font-display text-2xl">Send an enquiry</h3>
      <p className="mt-1.5 t-13 text-muted">Share a few details and an advisor will call you back within one working day.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="enq-name">Full name *</label>
          <input id="enq-name" className="field" placeholder="e.g. Aditi Sharma" value={values.name}
            onChange={set("name")} onBlur={blur("name")} aria-invalid={!!show("name")} aria-describedby="enq-name-err" autoComplete="name" />
          {show("name") && <p className="err" id="enq-name-err" role="alert">{errors.name}</p>}
        </div>
        <div>
          <label className="label" htmlFor="enq-phone">Phone number *</label>
          <input id="enq-phone" className="field" type="tel" placeholder="+91 98XXXXXX10" value={values.phone}
            onChange={set("phone")} onBlur={blur("phone")} aria-invalid={!!show("phone")} aria-describedby="enq-phone-err" autoComplete="tel" />
          {show("phone") && <p className="err" id="enq-phone-err" role="alert">{errors.phone}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="enq-email">Email *</label>
          <input id="enq-email" className="field" type="email" placeholder="you@example.com" value={values.email}
            onChange={set("email")} onBlur={blur("email")} aria-invalid={!!show("email")} aria-describedby="enq-email-err" autoComplete="email" />
          {show("email") && <p className="err" id="enq-email-err" role="alert">{errors.email}</p>}
        </div>
        <div>
          <label className="label" htmlFor="enq-prop">Interested property</label>
          <select id="enq-prop" className="field" value={values.propertyId} onChange={set("propertyId")}>
            <option value="">General enquiry</option>
            {properties.filter((p) => p.status !== "Sold").map((p) => (
              <option key={p.id} value={p.id}>{p.title}{p.price ? " — " + formatPrice(p.price) : ""}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="enq-loc">Preferred location</label>
          <select id="enq-loc" className="field" value={values.location} onChange={set("location")}>
            <option value="">Anywhere in Indore</option>
            {localities.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="enq-budget">Budget</label>
          <select id="enq-budget" className="field" value={values.budget} onChange={set("budget")}>
            <option value="">Select a range (optional)</option>
            {BUDGET_OPTIONS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="enq-msg">Message</label>
          <textarea id="enq-msg" className="field" rows={4} value={values.message} onChange={set("message")}
            placeholder="Tell us what you're looking for — timeline, must-haves, anything that helps." />
        </div>
      </div>
      {status === "error" && (
        <p className="err mt-5" role="alert">
          We couldn't send that just now — {sendError} Please try again, or call us on{" "}
          <a className="underline" href={CONTACT.phones[0].href}>{CONTACT.phones[0].label}</a>.
        </p>
      )}
      <button type="submit" disabled={submitting} className="btn btn-primary mt-6 w-full py-3.5 text-sm sm:w-auto sm:px-8">
        {submitting ? (<><Loader2 size={16} className="animate-spin" /> Sending…</>)
          : status === "error" ? (<>Try again <ArrowRight size={15} className="arrow" /></>)
          : (<>Submit enquiry <ArrowRight size={15} className="arrow" /></>)}
      </button>
      <p className="mt-3 text-xs text-muted">By submitting, you agree to be contacted by Mitesh Real Estate Solution about your enquiry. No spam, ever.</p>
    </form>
  );
};

/* ---------- Contact card ---------- */
const ContactRow = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-3.5">
    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: "rgba(237,227,206,.1)" }}>
      <Icon size={16} className="text-brass" />
    </span>
    <div>
      <p className="overline-xs" style={{ color: "var(--brass-soft)" }}>{label}</p>
      <div className="mt-1 text-sm leading-relaxed text-ivory" style={{ opacity: 0.92 }}>{children}</div>
    </div>
  </div>
);

const ContactCard = ({ onSchedule }) => (
  <aside className="flex h-full flex-col rounded-2xl bg-deep p-6 sm:p-8">
    <Eyebrow light>Contact us</Eyebrow>
    <h3 className="font-display mt-3 text-2xl text-ivory">{CONTACT.brand}</h3>
    <p className="mt-1 t-13 text-ivory" style={{ opacity: 0.65 }}>{CONTACT.tagline}</p>
    <div className="mt-7 flex-1 space-y-5">
      <ContactRow icon={Phone} label="Phone">
        {CONTACT.phones.map((p) => (
          <a key={p.href} className="tap hover:text-brass" href={p.href}>{p.label}</a>
        ))}
      </ContactRow>
      <ContactRow icon={Mail} label="Email"><a className="tap hover:text-brass" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></ContactRow>
      <ContactRow icon={MapPin} label="Office">{CONTACT.office}</ContactRow>
      <ContactRow icon={Clock} label="Business hours">
        {CONTACT.hours.map((h) => <span key={h.d} className="block">{h.d} · {h.t}</span>)}
      </ContactRow>
    </div>
    <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
      <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn btn-primary py-3 text-sm">
        <MessageCircle size={16} /> WhatsApp us
      </a>
      <button type="button" onClick={onSchedule} className="btn btn-ghost-ivory py-3 text-sm">
        <CalendarDays size={15} /> Schedule a call
      </button>
    </div>
  </aside>
);

const ContactSection = ({ prefill }) => (
  <section id="contact" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
    <SectionHead center eyebrow="Get in touch" title="Tell us what you're looking for"
      sub="An enquiry is free and carries no obligation — you'll simply hear an honest read on the market for your requirement." />
    <div className="mt-10 contact-grid gap-6">
      <div id="enquiry" className="scroll-mt-24"><EnquiryForm prefill={prefill} /></div>
      <ContactCard onSchedule={() => document.getElementById("enquiry")?.scrollIntoView({ behavior: "smooth", block: "start" })} />
    </div>
  </section>
);

/* ---------- Footer ---------- */
/* Brand marks as inline SVG — lucide-react dropped its brand icons, so importing
   Facebook/Instagram/Linkedin/Youtube from it renders undefined and crashes. */
const Brand = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={d} /></svg>
);
const SOCIALS = [
  { label: "Facebook", d: "M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5H16.7V4.6c-.29-.04-1.27-.12-2.41-.12-2.38 0-4.01 1.45-4.01 4.12v2.3H7.6V14h2.68v8h3.22z" },
  { label: "Instagram", d: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.96c-3.15 0-3.52.01-4.76.07-1.15.05-1.77.24-2.19.4-.55.22-.94.47-1.35.88-.41.41-.66.8-.88 1.35-.16.42-.35 1.04-.4 2.19-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.05 1.15.24 1.77.4 2.19.22.55.47.94.88 1.35.41.41.8.66 1.35.88.42.16 1.04.35 2.19.4 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c1.15-.05 1.77-.24 2.19-.4.55-.22.94-.47 1.35-.88.41-.41.66-.8.88-1.35.16-.42.35-1.04.4-2.19.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.05-1.15-.24-1.77-.4-2.19a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.42-.16-1.04-.35-2.19-.4-1.24-.06-1.61-.07-4.76-.07zM12 7.13a4.87 4.87 0 1 1 0 9.74 4.87 4.87 0 0 1 0-9.74zm0 8.03a3.16 3.16 0 1 0 0-6.32 3.16 3.16 0 0 0 0 6.32zm6.2-8.22a1.14 1.14 0 1 1-2.28 0 1.14 1.14 0 0 1 2.28 0z" },
  { label: "LinkedIn", d: "M6.94 8.5H3.56V21h3.38V8.5zM5.25 3a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92zM21 14.36c0-3.4-1.82-4.98-4.24-4.98-1.96 0-2.84 1.08-3.33 1.83V8.5H9.75c.04 1.13 0 12.5 0 12.5h3.68v-6.98c0-.33.02-.66.12-.9.27-.66.87-1.35 1.89-1.35 1.33 0 1.87 1.02 1.87 2.5V21H21v-6.64z" },
  { label: "YouTube", d: "M21.58 7.19a2.51 2.51 0 0 0-1.77-1.78C18.25 5 12 5 12 5s-6.25 0-7.81.41a2.51 2.51 0 0 0-1.77 1.78A26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.81 2.51 2.51 0 0 0 1.77 1.78C5.75 19 12 19 12 19s6.25 0 7.81-.41a2.51 2.51 0 0 0 1.77-1.78A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.42-4.81zM10 15.02V8.98L15.2 12 10 15.02z" },
];

const FooterCol = ({ title, children }) => (
  <div>
    <p className="overline" style={{ color: "var(--brass-soft)" }}>{title}</p>
    <div className="mt-4 space-y-2.5">{children}</div>
  </div>
);

const FooterLink = ({ onClick, children }) => (
  <button type="button" onClick={onClick} className="tap t-13 text-ivory transition-colors hover:text-brass" style={{ opacity: 0.85 }}>
    {children}
  </button>
);

const Footer = ({ go, onTypeFilter }) => {
  const { types } = useCatalogue();
  return (
  <footer className="bg-deep" style={{ borderTop: "2px solid var(--brass)" }}>
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 footer-grid lg:px-8">
      <div>
        <Logo light onClick={() => go("home")} />
        <p className="mt-4 max-w-xs t-13 leading-relaxed text-ivory" style={{ opacity: 0.7 }}>
          Led by Mitesh Raghuvanshi — authorised channel partner for leading builders and premium projects across Indore. Residential, commercial and investment properties.
        </p>
        <div className="mt-5 flex gap-2.5">
          {SOCIALS.map((s) => (
            <a key={s.label} href="#" onClick={(e) => e.preventDefault()} aria-label={`${s.label} (link coming soon)`}
              className="grid h-11 w-11 place-items-center rounded-lg transition-colors hover:text-brass text-ivory"
              style={{ background: "rgba(237,227,206,.08)" }}>
              <Brand d={s.d} />
            </a>
          ))}
        </div>
      </div>
      <FooterCol title="Quick links">
        {NAV_LINKS.map((l) => <FooterLink key={l.target} onClick={() => go(l.target)}>{l.label}</FooterLink>)}
      </FooterCol>
      <FooterCol title="Properties">
        {types.map((ty) => <FooterLink key={ty} onClick={() => onTypeFilter(ty)}>{PLURAL[ty] || `${ty}s`} in Indore</FooterLink>)}
      </FooterCol>
      <FooterCol title="Contact">
        <p className="t-13 leading-relaxed text-ivory" style={{ opacity: 0.85 }}>{CONTACT.office}</p>
        {CONTACT.phones.map((p) => (
          <a key={p.href} className="tap t-13 text-ivory hover:text-brass" style={{ opacity: 0.85 }} href={p.href}>{p.label}</a>
        ))}
        <a className="tap t-13 text-ivory hover:text-brass" style={{ opacity: 0.85 }} href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      </FooterCol>
    </div>
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 border-t px-4 py-5 text-xs sm:flex-row sm:px-6 lg:px-8"
      style={{ borderColor: "rgba(237,227,206,.14)", color: "rgba(237,227,206,.6)" }}>
      <p>© {new Date().getFullYear()} {CONTACT.brand}. All rights reserved. · M.P. RERA Reg. No.: {CONTACT.rera}</p>
      <div className="flex gap-5">
        <a href="#" onClick={(e) => e.preventDefault()} className="tap-inline hover:text-brass">Privacy Policy</a>
        <a href="#" onClick={(e) => e.preventDefault()} className="tap-inline hover:text-brass">Terms & Conditions</a>
      </div>
    </div>
  </footer>
  );
};

/* 8. ===================== APP ===================== */
export default function MiteshRealEstateApp() {
  const [route, setRoute] = useState({ name: "home" });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [prefill, setPrefill] = useState(null);
  const [pending, setPending] = useState(null);
  const [properties, setProperties] = useState(PROPERTIES);
  const [testimonials, setTestimonials] = useState(TESTIMONIALS);

  /* Swap in the Supabase content once it arrives. Any failure — no key, table
     missing, network down — leaves the bundled data in place, so the site never
     renders empty. */
  useEffect(() => {
    if (!dbReady()) return;
    let live = true;
    fetchProperties()
      .then((rows) => { if (live && rows.length) setProperties(rows); })
      .catch((err) => console.warn("Falling back to bundled listings →", err.message));
    fetchTestimonials()
      .then((rows) => { if (live && rows.length) setTestimonials(rows); })
      .catch((err) => console.warn("Falling back to bundled testimonials →", err.message));
    return () => { live = false; };
  }, []);

  const catalogue = useMemo(() => ({
    properties,
    localities: localitiesOf(properties),
    types: typesOf(properties),
    testimonials,
  }), [properties, testimonials]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const go = (target) => {
    if (route.name !== "home") { setRoute({ name: "home" }); setPending(target); }
    else if (target === "home") window.scrollTo({ top: 0, behavior: "smooth" });
    else scrollTo(target);
  };

  useEffect(() => {
    if (route.name === "home" && pending) {
      const id = pending;
      setPending(null);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (id === "home") window.scrollTo({ top: 0 });
        else scrollTo(id);
      }));
    }
  }, [route, pending]);

  const onView = (id) => setRoute({ name: "property", id });
  const onEnquire = (id) => { setPrefill({ id, ts: Date.now() }); go("enquiry"); };
  const onTypeFilter = (type) => { setFilters({ ...DEFAULT_FILTERS, type }); go("properties"); };

  const filtered = useMemo(() => {
    const band = PRICE_BANDS[filters.band];
    const q = filters.q.trim().toLowerCase();
    return properties.filter((p) => {
      if (q && !(p.title + " " + p.location + " " + p.type).toLowerCase().includes(q)) return false;
      if (filters.location !== "All locations" && !p.location.startsWith(filters.location)) return false;
      if (filters.type !== "All types" && p.type !== filters.type) return false;
      if (p.price != null && (p.price < band.min || p.price >= band.max)) return false;
      if (filters.bedrooms !== "Any") {
        const b = filters.bedrooms === "4+" ? 4 : +filters.bedrooms;
        if (filters.bedrooms === "4+" ? p.bedrooms < b : p.bedrooms !== b) return false;
      }
      if (filters.status === "Featured" && !p.featured) return false;
      if ((filters.status === "Available" || filters.status === "Sold") && p.status !== filters.status) return false;
      return true;
    });
  }, [filters, properties]);

  const current = route.name === "property" ? properties.find((p) => p.id === route.id) : null;
  const related = current
    ? properties.filter((p) => p.id !== current.id && (p.type === current.type || p.location === current.location)).slice(0, 3)
    : [];

  return (
    <CatalogueCtx.Provider value={catalogue}>
    <div className="mrs min-h-screen">
      <style>{CSS}</style>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:shadow-lg">
        Skip to content
      </a>
      <Header go={go} onEnquire={() => onEnquire(null)} />
      <main id="main">
        {current ? (
          <PropertyDetails property={current} related={related} onView={onView}
            onBack={() => { setRoute({ name: "home" }); setPending("properties"); }} onEnquire={onEnquire} />
        ) : (
          <>
            <Hero go={go} onEnquire={() => onEnquire(null)} />
            <FilterBar filters={filters} setFilters={setFilters} count={filtered.length} total={properties.length} />
            <section id="properties" className="scroll-mt-24 pb-16 pt-14 lg:pb-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHead eyebrow="Live inventory" title="Plots, homes & commercial space across Indore"
                  sub="Our current listings — plots, apartments, houses, offices and land across Indore and the Dhar–Pithampur belt. Rates and availability move fast, so call to confirm before a site visit." />
              </div>
              <PropertyGrid list={filtered} onView={onView} onEnquire={onEnquire} onReset={() => setFilters(DEFAULT_FILTERS)} />
            </section>
            <WeDealIn />
            <Services />
            <About go={go} />
            <Testimonials />
            <ContactSection prefill={prefill} />
          </>
        )}
      </main>
      <Footer go={go} onTypeFilter={onTypeFilter} />
    </div>
    </CatalogueCtx.Provider>
  );
}
