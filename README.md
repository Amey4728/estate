# Mitesh Real Estate Solution

Single-file React site for **Mitesh Real Estate Solution**, Indore — an M.P. RERA
registered property advisory (Reg. A-IND-24-1732).

Everything lives in [`mitesh-realestate.jsx`](mitesh-realestate.jsx): styles, data,
illustrations, sections and routing. Drop it into any React app and render the
default export.

## Requirements

| Dependency | Why |
|---|---|
| `react` 18+ | the component itself |
| `lucide-react` | icons (brand marks are inline SVG — lucide dropped those) |
| Tailwind CSS | layout utilities; the file only ships its own custom classes |

## Usage

```jsx
import MiteshRealEstateApp from "./mitesh-realestate.jsx";

export default function App() {
  return <MiteshRealEstateApp />;
}
```

Fonts (Marcellus + Archivo) are pulled from Google Fonts by the embedded
stylesheet, so no extra setup is needed.

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
