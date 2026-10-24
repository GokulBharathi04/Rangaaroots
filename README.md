# Rangaa Roots — Website Prototype

A papermorphism-styled brand showcase for **Rangaa Roots**: A2 Bilona Ghee and traditional organic foods from Tamil Nadu.
It's a static site (HTML, CSS and vanilla JS) with no build step and no dependencies.

> **Showcase, not a shop.** No prices, cart or checkout. Every product links to a pre-filled WhatsApp enquiry (`+91 95979 27712`).

## Project structure

```
rangaa-roots-website/
├── index.html              # single page, all sections
├── .nojekyll               # tells GitHub Pages to serve files as-is
├── assets/
│   ├── css/styles.css      # papermorphism theme, elevation + motion tokens
│   ├── js/data.js          # products, reviews, batch records (edit content here)
│   ├── js/motion.js        # reusable motion components (see below)
│   ├── js/main.js          # renders content: filters, search, tracer
│   └── img/                # logo, hero gopuram, ghee photos, product artwork
└── README.md
```

## Deploy on GitHub Pages

```bash
cd rangaa-roots-website
git init
git add .
git commit -m "Rangaa Roots website prototype"
git branch -M main
git remote add origin https://github.com/<your-username>/rangaa-roots-website.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save**.
The site goes live at `https://<your-username>.github.io/rangaa-roots-website/` within a minute or two.

To preview locally: `python -m http.server 8000` in this folder, then open http://localhost:8000.

## Design system

| Token | Hex | From the logo | Used as |
|---|---|---|---|
| `--forest` | `#143823` | calyx base | text, primary buttons, dark card stock |
| `--lotus-deep` / `--lotus` | `#C22956` / `#D84473` | petals | accent, tabs, stacked sheets |
| `--gold` | `#C59B27` | ring & root curl | paper-cut layers, tape, progress bar |
| `--leaf` | `#388E3C` | calyx highlight | check marks, cut-paper edges |
| `--paper` / `--desk` / `--kraft` | `#FFFDF8` / `#F2EDE4` / `#E9DFCD` | emblem disc | sheets, page, card stock |

**Papermorphism:** every surface is a sheet of paper. An elevation scale (`--e1` to `--e3`) pairs a tight contact shadow with a soft ambient one, and each sheet has a lit top edge. Sheets stack (the hero disc stack, the "Farm Sourced" card, the CTA), sections meet at cut-paper edges, notes are taped, and the trace result hangs as a tag.

**Fonts:** Fraunces (display) + Plus Jakarta Sans (body), via Google Fonts.

### Motion components (`assets/js/motion.js`)

Each component opts in through a data attribute and needs no library:

| Attribute | Component | Behaviour |
|---|---|---|
| `data-reveal` | Reveal | 12px rise + fade on scroll into view |
| `data-stagger` | Stagger | children reveal 80ms apart |
| `data-split` | SplitWords | headline words rise in sequence |
| `data-tilt` | Tilt | sheet tilts ≤5° toward the pointer and lifts |
| `data-magnetic` | Magnetic | button drifts ≤8px toward the pointer |
| `data-parallax="0.18"` | Parallax | layer scrolls at a fraction of page speed |
| `data-count` | CountUp | number counts up when visible |
| — | `Motion.tabIndicator` | paper slip slides under the active filter |
| — | `Motion.flip` | product cards glide to new positions when filtered |
| — | `Motion.scrollFx` | gold reading-progress bar |

Rules: one duration scale (`--t-fast` 180ms, `--t-base` 320ms, `--t-slow` 700ms). Elements decelerate on entry, and every hover state reverses on exit. Tilt and magnetic run only on mouse or trackpad. Each component writes a different CSS property (`transform`, `translate`, `scale`), so they never overwrite each other.
With **`prefers-reduced-motion`**, every component is skipped and content shows in its final state.

## Editing content

- **Products:** `assets/js/data.js → products`. `size` is optional. Images live in `assets/img/products/`.
- **Contact / WhatsApp number:** `assets/js/data.js → brand`, plus the hard-coded `wa.me` links in `index.html`.
- **Trace batches:** `assets/js/data.js → batches`. `RR-GHEE-2026-011` is marked `sample: true` and shows a "Sample record" label. Replace it with a real ghee batch before launch.
- After changing CSS/JS, bump the `?v=` number (currently 7) on the `<link>`/`<script>` tags in `index.html` so returning visitors get the new files.

## Before going live — please verify

- **Ghee photos are stock stand-ins** (Wikimedia Commons). Replace `assets/img/ghee-dabba.jpg` and `ghee-jar.jpg` with Rangaa Roots' own product photography.
- Product images on rangaaroots.com had **mismatched filenames** (e.g. `fig-roll.jpg` showed Black Cumin). They've been renamed here to match their content. Fig Roll, Moringa Soup and Karuppu Kavuni were left out because no matching artwork exists yet.
- The "Sample record" ghee batch above.

## Image credits

All photos are licensed CC BY-SA 4.0 via Wikimedia Commons. Attribution is shown in the site footer.

- Srirangam Rajagopuram: *N. Vivekananthamoorthy*
- Homemade ghee (steel container): *Phadke09*
- Desi ghee jar: *Hartej.hundal*

Product artwork, logo and founder photo © Rangaa Roots (from rangaaroots.com).
