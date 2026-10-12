#!/usr/bin/env bash
# Probes the live site and the Supabase backend. Prints one line per check that
# is down and nothing when everything is healthy. Run by
# .github/workflows/uptime.yml; also runs locally:
#
#   SITE_URL=https://example.com bash scripts/uptime-check.sh
set -u

# Same values as SUPABASE in mitesh-realestate.jsx. The publishable key is
# already shipped to every browser, so it is not a secret.
SUPABASE_URL="${SUPABASE_URL:-https://jlhhdpbxpwdwwqwycdtf.supabase.co}"
SUPABASE_KEY="${SUPABASE_KEY:-sb_publishable_Kn0vxJgLxX1gltzRTNbBEA_XDNW_7vD}"
SITE_URL="${SITE_URL:-}"

ATTEMPTS="${ATTEMPTS:-3}"     # a check is only "down" if every attempt fails
RETRY_WAIT="${RETRY_WAIT:-10}" # seconds between attempts

# probe <name> <url> [extra curl args…] — healthy means HTTP 200.
probe() {
  local name=$1 url=$2 code=000 i
  shift 2
  for ((i = 1; i <= ATTEMPTS; i++)); do
    code=$(curl -s -o /dev/null -m 20 -w '%{http_code}' "$@" "$url")
    [ "$code" = 200 ] && return 0
    [ "$i" -lt "$ATTEMPTS" ] && sleep "$RETRY_WAIT"
  done
  if [ "$code" = 000 ]; then
    echo "$name: no response (timeout or connection failed) - $url"
  else
    echo "$name: HTTP $code - $url"
  fi
}

if [ -n "$SITE_URL" ]; then
  probe "Website" "$SITE_URL" -L
else
  echo "SITE_URL is not set - skipping the website check" >&2
fi

# Goes through the API gateway, PostgREST and Postgres - the path listings and
# the enquiry form use.
probe "Supabase database API" "$SUPABASE_URL/rest/v1/properties?select=id&limit=1" \
  -H "apikey: $SUPABASE_KEY"

# The admin dashboard signs in through this.
probe "Supabase auth" "$SUPABASE_URL/auth/v1/health" -H "apikey: $SUPABASE_KEY"

exit 0
