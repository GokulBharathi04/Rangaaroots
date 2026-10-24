# Rangaa Roots — Website Prototype

An editorial brand showcase for **Rangaa Roots**: A2 Bilona Ghee and traditional organic foods from Tamil Nadu.
It's a static site (HTML, CSS and vanilla JS) with no build step. The only libraries, GSAP and Lenis, are vendored into `assets/vendor/`, so nothing is fetched from a CDN.

> **Showcase, not a shop.** No prices, cart or checkout. Every product links to a pre-filled WhatsApp enquiry (`+91 95979 27712`).

## Project structure

```
rangaa-roots-website/
├── index.html              # single page, all sections
├── .nojekyll               # tells GitHub Pages to serve files as-is
├── assets/
│   ├── css/styles.css      # theme: colour + type tokens, sections, hero entrance
│   ├── js/scroll.js        # Lenis smooth scrolling + header-offset anchor links
│   ├── js/data.js          # products, reviews, batch records (edit content here)
│   ├── js/motion.js        # GSAP motion components (see below)
│   ├── js/main.js          # renders content: filters, search, tracer
│   ├── fonts/              # Cormorant Garamond + Manrope (Google Fonts, SIL OFL), Latin subset
│   ├── vendor/             # lenis 1.3.27 (lenis.min.js, lenis.css), gsap 3.13.0 + ScrollTrigger
│   └── img/                # logo, hero gopuram, ghee photos, product artwork (.jpg + .webp)
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
| `--forest` | `#143823` | calyx base | headings, primary buttons, Process / Reviews / CTA fields |
| `--lotus-deep` / `--lotus` | `#C22956` / `#D84473` | petals | eyebrows, hero italic line, seal |
| `--gold` | `#C59B27` | ring & root curl | process line, underlines, stars, glow |
| `--leaf` | `#388E3C` | calyx highlight | check marks, icons |
| `--paper` / `--desk` / `--kraft` | `#FFFDF8` / `#F2EDE4` / `#E9DFCD` | emblem disc | page and section grounds |

Every colour value is unchanged from the original site; all of them now live as tokens in `:root`.
The temple background (`gopuram.jpg`, with the same framing, tint and fade) and `logo.svg` are untouched.

**Type:** Cormorant Garamond for headings, quotes and figures; Manrope for text and UI. Both are self-hosted
(`assets/fonts/`) so the first paint does not wait on another server.

### Motion (`assets/js/motion.js`, GSAP + ScrollTrigger, synced to Lenis)

| Attribute / function | Behaviour |
|---|---|
| hero (CSS) | temple settles from 1.08×, headline lines rise from masks, CTAs and stats fade in, stats count up |
| `data-reveal` | rises 40px and fades in on arrival; things arriving together stagger |
| `data-curtain` | image frame wipes up while the picture counter-moves and settles |
| `data-parallax="8"` | drifts through the viewport by that % of its height (temple, ghee photos, founder) |
| `data-glow` | slow golden light swells on arrival, then breathes |
| `data-lines` | each rendered line rises from its own mask (founder quote, CTA) |
| `data-count` | counts up; `data-count="25,30" data-join="–"` for a range |
| `data-magnetic` | button drifts toward the pointer (mouse only) |
| `Motion.process` | desktop: section pins while a gold line draws through the five stages; tablet/phone: the line fills down the left |
| `Motion.marquee` | CSS drift that speeds up with scroll velocity and eases to a stop on hover |

One-shot entrances use a single `IntersectionObserver`; ScrollTrigger is used only for scroll-linked
effects (parallax, the pin), which keeps start-up work small on phones.
With **`prefers-reduced-motion`**, Lenis is not started, nothing pins, and every element shows in its final state.
If GSAP fails to load, the `motion` class is removed from `<html>` and the page shows fully.

## Editing content

- **Products:** `assets/js/data.js → products`. `size` is optional. Images live in `assets/img/products/`.
- **Contact / WhatsApp number:** `assets/js/data.js → brand`, plus the hard-coded `wa.me` links in `index.html`.
- **Trace batches:** `assets/js/data.js → batches`. `RR-GHEE-2026-011` is marked `sample: true` and shows a "Sample record" label. Replace it with a real ghee batch before launch.
- After changing CSS/JS, bump the `?v=` number (currently 18) on the `<link>`/`<script>` tags in `index.html` so returning visitors get the new files.

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

Fonts: Cormorant Garamond and Manrope, SIL Open Font License 1.1. Libraries: GSAP 3.13 (GreenSock standard license, free), Lenis 1.3.27 (MIT).
