# Mitesh Real Estate Solution

Single-file React site for **Mitesh Real Estate Solution**, Indore — an M.P. RERA
registered property advisory (Reg. A-IND-24-1732).

Everything lives in [`mitesh-realestate.jsx`](mitesh-realestate.jsx): styles, data,
illustrations, sections and routing. Drop it into any React app and render the
default export.

## Running it

Vite + React + Tailwind. Node 18 or newer.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the production build
```

Deploys to Vercel as-is: build command `npm run build`, output directory `dist`.

| Dependency | Why |
|---|---|
| `react` 18 | the component itself |
| `lucide-react` | icons (brand marks are inline SVG — lucide dropped those) |
| `tailwindcss` 3 | layout utilities; the component only ships its own custom classes |

Tailwind scans `mitesh-realestate.jsx` at the repo root — see `tailwind.config.js`.
Fonts (Marcellus + Archivo) come from Google Fonts via the embedded stylesheet.

## Reusing the component elsewhere

```jsx
import MiteshRealEstateApp from "./mitesh-realestate.jsx";

export default function App() {
  return <MiteshRealEstateApp />;
}
```

Tailwind must be present in the host app; the file supplies only its own
custom classes.

## Supabase

`SUPABASE` in section 2c holds the project URL and the **publishable** key —
that key is meant to ship in client code and is guarded by row-level security.
Never put the `service_role` / secret key there.

`supabase-schema.sql` creates both tables and their policies:

- **`enquiries`** — anon may insert leads but cannot read them back. View them in
  the dashboard, or from a server using the secret key.
- **`properties`** — anon may read published rows only; no anon write path.

Listings load from `properties` at runtime. If the fetch fails for any reason —
no key, missing table, network down — the site falls back to the listings
bundled in the file, so it never renders empty.

## Where to edit things

The file is sectioned with numbered markers — search for them:

| Marker | Contains |
|---|---|
| `1. STYLES` | brand colour tokens, type scale, motion |
| `2. SITE CONFIG` | `CONTACT` — phones, email, office address, RERA no., hours |
| `2b. IMAGE ASSETS` | `IMG` — logo and project creatives as data URIs |
| `3. DATA` | `PROPERTIES`, `SERVICES`, `TESTIMONIALS` |
| `4. HELPERS` | price/area formatting, validation, `submitEnquiry` |
| `5. ILLUSTRATIONS` | the SVG "architect's elevation" art |
| `6. UI PRIMITIVES` | eyebrow, buttons, badges, stars |
| `7. SECTIONS` | header, hero, filter, cards, details, forms, footer |
| `8. APP` | routing + state |

`IMG` **must stay above `PROPERTIES`** — the listings reference it while the module
is still evaluating.

### Adding a property

Append to `PROPERTIES`. Everything else — the filter dropdowns, footer links,
locality list and hero counters — derives from that array.

```js
{
  id: "MRS-000",
  title: "…",
  location: "Locality, Indore",
  price: 5000000,            // null renders "Price on request"
  type: "Residential Plot",
  area: 1200,                // sq ft, used by the size filter
  sizeLabel: "1,200 sq ft",
  bedrooms: 0, bathrooms: 0,
  status: "Available",       // or "Sold"
  featured: false,
  art: "plot",               // plot | towers | villa | row | office | penthouse | skyline
  images: [{ src: "…", fit: "cover", label: "Photo 1" }],  // omit to use the SVG art
  description: "…",
  amenities: ["…"],
}
```

## Before going live

- `submitEnquiry` is a stub that resolves after a delay and logs the payload.
  Point it at a real endpoint.
- Property photos are referenced from the existing `rei.wlimg.com` CDN. Self-host
  them if that CDN may go away.
- Social links in the footer are placeholders (`href="#"`).
