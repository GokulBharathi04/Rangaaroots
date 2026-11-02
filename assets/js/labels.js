/* Rangaa Roots — product label + container renderer
 * Two label styles, both drawn from the brand's printed jars:
 *   "wrap"  — the Coconut Sugar label: dark side panels, a light centre panel with the
 *             round logo, a two-tone condensed name, a tagline, a coloured sketch and an
 *             engraved landscape band along the bottom.
 *   "cream" — the A2 Cow Ghee label: cream stock between copper bands, logo on top,
 *             heavy black-sans name, italic subline, a sketch and the net quantity.
 * Every label is an SVG string, so it stays sharp at any size and can be downloaded for print.
 * Containers (squat jar, tall jar, pouch, bottles) are drawn around the label.
 */
(() => {
  const INK = "#3b2418";
  // resolved from this script's own URL, so pages in subfolders (films/) find the logo too
  const ROOT = typeof document !== "undefined" && document.currentScript ? document.currentScript.src.replace(/assets\/js\/labels\.js.*$/, "") : "";
  const LOGO = `${ROOT}assets/img/logo-round-240.webp`;
  let uid = 0;

  /* ---------- small sketches, drawn in a 100 x 70 box ---------- */
  const stroke = `stroke="${INK}" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"`;
  const leaf = (x, y, r, l = 18, f = "#6a9a3a") =>
    `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 0 Q${l / 2} ${-l / 3.2} ${l} 0 Q${l / 2} ${l / 3.2} 0 0Z M0 0 L${l * 0.9} 0" fill="${f}" ${stroke}/>`;
  const heap = (f, x = 50, w = 64) =>
    `<path d="M${x - w / 2} 62 Q${x - w / 4} 40 ${x} 38 Q${x + w / 4} 40 ${x + w / 2} 62Z" fill="${f}" ${stroke}/>` +
    Array.from({ length: 14 }, (_, i) => `<circle cx="${x - w / 3 + ((i * 37) % (w * 0.66))}" cy="${46 + ((i * 13) % 14)}" r=".8" fill="${INK}" opacity=".45"/>`).join("");
  const bowl = (f, x = 50) =>
    `<path d="M${x - 30} 42h60q-4 22-30 22t-30-22z" fill="#c98f5a" ${stroke}/><ellipse cx="${x}" cy="42" rx="30" ry="6" fill="${f}" ${stroke}/>`;
  const steam = (x = 50) =>
    [-10, 0, 10].map((d) => `<path d="M${x + d} 34q-4-6 0-11t0-11" fill="none" stroke="${INK}" stroke-width="1" opacity=".55" stroke-linecap="round"/>`).join("");
  const coconutHalf = (x, y, s = 1) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="15" ry="11" fill="#7a4a2a" ${stroke}/><ellipse rx="11.5" ry="8" fill="#fbf7ee" ${stroke}/><ellipse rx="7" ry="4.5" fill="#efe7d4"/></g>`;
  const coconut = (x, y, s = 1) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><circle r="13" fill="#8a5530" ${stroke}/><path d="M-8-6q6-4 12 1M-9 2q8-3 16 3" fill="none" stroke="${INK}" stroke-width=".8" opacity=".6"/></g>`;
  const drop = (x, y, s = 1, f = "#f2e7b8") =>
    `<path transform="translate(${x} ${y}) scale(${s})" d="M0-12C4-6 7-2 7 2a7 7 0 0 1-14 0c0-4 3-8 7-14z" fill="${f}" ${stroke}/>`;
  const chilli = (x, y, r) =>
    `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 0q10 2 20 10q-12 0-21-6z" fill="#c0392b" ${stroke}/><path transform="translate(${x} ${y}) rotate(${r})" d="M0 0l-4-3" ${stroke} fill="none"/>`;
  const tomato = (x, y, s = 1) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><circle r="11" fill="#d4432f" ${stroke}/><path d="M-5-10l5 3 5-3-2 4 4 1-7 1-7-1 4-1z" fill="#5c8a32" ${stroke}/><path d="M-6-3q-1 4 2 7" stroke="#fff" stroke-width="1.4" fill="none" opacity=".5"/></g>`;
  const onion = (x, y, s = 1) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0-12q10 8 9 15a9 9 0 0 1-18 0q-1-7 9-15z" fill="#a8445a" ${stroke}/><path d="M0-12q4 9 0 21M0-12q-4 9 0 21" fill="none" stroke="${INK}" stroke-width=".7" opacity=".5"/></g>`;
  const stalk = (x, y, r, f = "#c9a24a", n = 7) =>
    `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0v-34" ${stroke} fill="none"/>` +
    Array.from({ length: n }, (_, i) => `<ellipse cx="${i % 2 ? 3 : -3}" cy="${-8 - i * 3.8}" rx="2.4" ry="4" transform="rotate(${i % 2 ? 25 : -25} ${i % 2 ? 3 : -3} ${-8 - i * 3.8})" fill="${f}" ${stroke}/>`).join("") + `</g>`;
  const grains = (f, x = 50, n = 22) =>
    Array.from({ length: n }, (_, i) => `<ellipse cx="${x - 26 + ((i * 29) % 52)}" cy="${54 + ((i * 7) % 10)}" rx="2.6" ry="1.6" transform="rotate(${(i * 47) % 180} ${x - 26 + ((i * 29) % 52)} ${54 + ((i * 7) % 10)})" fill="${f}" stroke="${INK}" stroke-width=".5"/>`).join("");
  const flower = (x, y, f = "#f2c12e", s = 1) =>
    `<g transform="translate(${x} ${y}) scale(${s})">` +
    [0, 72, 144, 216, 288].map((a) => `<ellipse cy="-6" rx="3.6" ry="6" transform="rotate(${a})" fill="${f}" ${stroke}/>`).join("") + `<circle r="2.6" fill="#b5651d" ${stroke}/></g>`;
  const roundLeaf = (x, y, s = 1, f = "#6aa040") =>
    `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0a8 8 0 1 1 1 0z" fill="${f}" ${stroke}/><path d="M0 0v12" ${stroke} fill="none"/></g>`;
  const crystal = (x, y, s = 1) =>
    `<path transform="translate(${x} ${y}) scale(${s})" d="M0-9l7 4v9l-7 4-7-4v-9z" fill="#f4ecd8" ${stroke}/><path transform="translate(${x} ${y}) scale(${s})" d="M0-9v17M-7-5l7 4 7-4" fill="none" stroke="${INK}" stroke-width=".6" opacity=".5"/>`;
  const pot = (x = 50) =>
    `<path d="M${x - 20} 34q-6 14 2 24h36q8-10 2-24z" fill="#a8743f" ${stroke}/><ellipse cx="${x}" cy="34" rx="20" ry="5" fill="#e7c25a" ${stroke}/>` +
    `<path d="M${x - 16} 44h32M${x - 18} 50h36" stroke="${INK}" stroke-width=".7" opacity=".5"/><path d="M${x + 6} 34l10-26" ${stroke} fill="none"/><path d="M${x + 16} 8q6 2 4 8" fill="none" ${stroke}/>` +
    `<path d="M${x - 40} 58h14q-2 6-7 6t-7-6zM${x + 26} 58h14q-2 6-7 6t-7-6z" fill="#e9d9b8" ${stroke}/>`;
  const cup = (f, x = 50) =>
    `<path d="M${x - 16} 34h32l-4 26h-24z" fill="#efe4cf" ${stroke}/><path d="M${x + 15} 40q9 0 8 7t-10 6" fill="none" ${stroke}/><ellipse cx="${x}" cy="34" rx="16" ry="3.4" fill="${f}" ${stroke}/>`;
  const sprout = (x, y, r = 0) =>
    `<g transform="translate(${x} ${y}) rotate(${r})"><ellipse rx="5" ry="3.4" fill="#e8d28a" ${stroke}/><path d="M3-1q6-6 3-13" fill="none" stroke="#4f8a2b" stroke-width="1.4" stroke-linecap="round"/>${leaf(6, -14, -70, 7)}</g>`;
  const bananaFlower = (x, y) =>
    `<path transform="translate(${x} ${y})" d="M0-22q14 10 10 26q-4 8-10 8t-10-8q-4-16 10-26z" fill="#7b2d4f" ${stroke}/><path transform="translate(${x} ${y})" d="M-7 0q7-6 14 0M-8 6q8-5 16 0" fill="none" stroke="#e8b4c8" stroke-width="1"/>`;
  const saffron = (x, y) =>
    `<g transform="translate(${x} ${y})">` + [-30, 0, 30].map((a) => `<ellipse cy="-9" rx="5" ry="10" transform="rotate(${a})" fill="#9b6bc4" ${stroke}/>`).join("") +
    `<path d="M0-4l-6-14M0-4l0-16M0-4l6-14" stroke="#c8261c" stroke-width="1.6" stroke-linecap="round"/><path d="M0-2v18" ${stroke}/></g>`;
  const bottle = (f) =>
    `<path d="M44 14h12v8q8 4 8 12v24q0 4-4 4H40q-4 0-4-4V34q0-8 8-12z" fill="${f}" ${stroke}/><rect x="43" y="8" width="14" height="7" rx="1.5" fill="#3b2418"/>`;
  const herbSprig = (x, y, f = "#5c8a32") => `<path d="M${x} ${y}v-28" ${stroke} fill="none"/>` + [0, 1, 2, 3].map((i) => leaf(x, y - 6 - i * 6, i % 2 ? -40 : 220, 10, f)).join("");

  const ART = {
    ghee: () => pot(),
    coconutSugar: () => heap("#a8703f") + coconutHalf(30, 40) + coconut(68, 36, 0.9) + leaf(56, 26, -40, 20) + leaf(58, 28, -10, 16),
    palmSugar: () => heap("#7a4a26") + leaf(22, 30, -60, 22) + leaf(78, 30, 240, 22) + leaf(50, 22, -90, 16),
    kalkandu: () => [[34, 52], [50, 48], [66, 53], [42, 40], [58, 40], [50, 31]].map(([x, y]) => crystal(x, y, 1.15)).join(""),
    countrySugar: () => heap("#b88a52") + stalk(26, 50, -18, "#7aa04a", 5) + stalk(76, 50, 18, "#7aa04a", 5),
    coconutOil: () => coconutHalf(32, 44) + coconut(64, 46, 0.9) + drop(52, 26, 1.1),
    abc: () => cup("#b0503a") + `<circle cx="22" cy="52" r="8" fill="#c8323a" ${stroke}/>` + `<path d="M74 40l8 22-6-1z" fill="#e07a24" ${stroke}/>` + leaf(22, 44, -80, 8),
    biotin: () => cup("#c9a46a") + [[20, 54], [26, 58], [74, 56], [80, 52]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="2.6" fill="#d9b98a" ${stroke}/>`).join(""),
    choco: () => cup("#4a2c22") + grains("#2a2220", 50, 10) + `<rect x="72" y="48" width="14" height="10" rx="1" fill="#5a3426" ${stroke}/>`,
    ragi: () => cup("#8a5b4a") + stalk(20, 64, -10, "#8a4a3a", 6) + grains("#f2ece0", 70, 6),
    uradfit: () => cup("#6b5a50") + grains("#2a2220", 50, 12) + leaf(80, 50, -40, 12, "#8a7a3a"),
    blackboozt: () => cup("#3a2e2a") + grains("#1e1a18", 50, 14) + `<ellipse cx="80" cy="54" rx="6" ry="4" fill="#b5835a" ${stroke}/>`,
    chukku: () => cup("#5a3a22") + steam() + `<path d="M76 50q6-6 10 0q-2 6-10 4z" fill="#d9b06a" ${stroke}/>`,
    karuveppilai: () => bowl("#3f5a2a") + herbSprig(20, 62) + herbSprig(82, 62),
    vallaraiThokku: () => bowl("#4a6a2a") + roundLeaf(18, 40, 1.1) + roundLeaf(84, 42, 1),
    onionThokku: () => bowl("#8a3a22") + onion(18, 50) + onion(84, 52, 0.9),
    vazhaipoo: () => bowl("#5a3f3a") + bananaFlower(84, 46),
    tomatoThokku: () => bowl("#b8321e") + tomato(16, 50) + tomato(86, 52, 0.9) + chilli(60, 24, 10),
    thoothuvalai: () => bowl("#6a7a3a") + steam() + leaf(14, 50, -60, 18, "#4f7a2a") + leaf(86, 52, 240, 18, "#4f7a2a"),
    bananaStem: () => bowl("#c9c48a") + steam() + `<circle cx="16" cy="52" r="9" fill="#efeac8" ${stroke}/><circle cx="16" cy="52" r="4" fill="none" ${stroke}/>`,
    aavarampoo: () => bowl("#d4b02a") + steam() + flower(16, 46) + flower(86, 50, "#f2c12e", 0.85),
    vallaraiSoup: () => bowl("#5a7a2a") + steam() + roundLeaf(16, 42, 1) + roundLeaf(86, 44, 0.9),
    mudakathan: () => bowl("#6a8a3a") + steam() + `<path d="M8 50q4-12 10-6q4-10 10 0q-2 10-10 10z" fill="#5c8a32" ${stroke}/>`,
    moringa: () => bowl("#4f7a2a") + steam() + `<path d="M84 64q-2-20 6-34" stroke="#3a6a24" stroke-width="1.6" stroke-linecap="round"/>`,
    millet: (f) => grains(f, 50, 26) + stalk(30, 50, -14, f) + stalk(50, 46, 0, f) + stalk(70, 50, 14, f),
    rice: (f) => grains(f, 50, 26) + stalk(34, 50, -12, "#c9a24a", 8) + stalk(66, 50, 12, "#c9a24a", 8),
    sproutedDal: () => sprout(34, 52, -10) + sprout(52, 56, 8) + sprout(66, 50, -20) + grains("#e8d28a", 50, 8),
    riceWater: () => grains("#f4efe2", 50, 18) + drop(50, 34, 1.4, "#dfeef2"),
    coconutMilk: () => coconutHalf(34, 46) + drop(64, 40, 1.3, "#fbf7ee"),
    hairOil: () => bottle("#c9a02a") + herbSprig(22, 62) + flower(80, 50, "#d8434f", 0.8),
    serum: () => saffron(50, 44) + drop(78, 46, 0.8, "#e8a33a"),
  };

  /* ---------- text fitting ---------- */
  const fit = (text, maxW, maxSize, em) => Math.min(maxSize, maxW / (Math.max(text.length, 1) * em));
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const vegMark = (x, y, s) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#fff" stroke="#2e7d32" stroke-width="${s * 0.1}"/><circle cx="${x + s / 2}" cy="${y + s / 2}" r="${s * 0.26}" fill="#2e7d32"/>`;
  const logo = (cx, cy, d) => `<image href="${LOGO}" x="${cx - d / 2}" y="${cy - d / 2}" width="${d}" height="${d}"/>`;

  /* ---------- "wrap" label: the Coconut Sugar format ---------- */
  function wrapLabel(p, w, h) {
    const id = `w${++uid}`;
    const t = p.theme;
    const px = w * 0.13, pw = w - px * 2, ph = h * 0.82;
    const cx = w / 2;
    const ld = Math.min(pw * 0.5, ph * 0.3);
    const ly = ph * 0.04 + ld / 2;
    const [l1, l2 = ""] = p.lines;
    const s1 = fit(l1, pw * 0.86, ph * 0.14, 0.56), s2 = fit(l2, pw * 0.86, ph * 0.12, 0.56);
    const y1 = ly + ld / 2 + ph * 0.03 + s1 * 0.82, y2 = y1 + s2 * 0.98;
    const tag = esc(p.tagline || t.tagline).toUpperCase();
    const ts = fit(tag, pw * 0.92, ph * 0.034, 0.62);
    const artTop = y2 + ts + ph * 0.05, artH = ph - artTop - ph * 0.02;
    const artS = Math.min(pw / 100, artH / 70);
    // faint text lines on the side panels: the wrap's back copy, seen edge-on
    const sideLines = (x0) => Array.from({ length: 9 }, (_, i) => `<rect x="${x0 + w * 0.012}" y="${h * 0.28 + i * h * 0.045}" width="${px * (0.5 + ((i * 7) % 5) / 10)}" height="${h * 0.012}" rx="${h * 0.006}" fill="${t.sideInk}" opacity=".55"/>`).join("");
    const hills = `<g fill="none" stroke="${t.sideInk}" stroke-width="${w * 0.004}" opacity=".7">
      <path d="M0 ${h * 0.95} Q${w * 0.2} ${h * 0.88} ${w * 0.4} ${h * 0.93} T${w} ${h * 0.9}"/>
      <path d="M0 ${h * 0.985} Q${w * 0.3} ${h * 0.93} ${w * 0.6} ${h * 0.97} T${w} ${h * 0.95}"/>
      <path d="M${w * 0.78} ${h * 0.93} q${w * 0.01} -${h * 0.05} 0 -${h * 0.08} m0 0 q-${w * 0.04} 0 -${w * 0.06} ${h * 0.02} m${w * 0.06} -${h * 0.02} q${w * 0.04} 0 ${w * 0.06} ${h * 0.02} m-${w * 0.06} -${h * 0.02} q-${w * 0.01} -${h * 0.03} -${w * 0.04} -${h * 0.03} m${w * 0.04} ${h * 0.03} q${w * 0.02} -${h * 0.03} ${w * 0.05} -${h * 0.02}"/>
      <path d="M${w * 0.2} ${h * 0.93} v-${h * 0.035} h${w * 0.05} v${h * 0.035} M${w * 0.19} ${h * 0.9} l${w * 0.035} -${h * 0.02} l${w * 0.035} ${h * 0.02}"/></g>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <defs><clipPath id="${id}c"><rect width="${w}" height="${h}"/></clipPath>
        <linearGradient id="${id}g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${t.center}"/><stop offset="1" stop-color="${t.center2}"/></linearGradient></defs>
      <g clip-path="url(#${id}c)">
        <rect width="${w}" height="${h}" fill="${t.side}"/>
        ${sideLines(0)}${sideLines(w - px)}
        <rect x="${px}" width="${pw}" height="${ph}" fill="url(#${id}g)"/>
        ${[0.18, 0.55, 0.8].map((f, i) => `<g opacity=".07">${leaf(px + pw * (i % 2 ? 0.82 : 0.12), ph * f, i * 70, pw * 0.22, t.side)}</g>`).join("")}
        ${hills}
        ${vegMark(px + pw * 0.05, ph * 0.03, pw * 0.08)}
        <text x="${px + pw * 0.93}" y="${ph * 0.07}" font-family="Manrope, sans-serif" font-weight="800" font-size="${pw * 0.05}" fill="${INK}" text-anchor="end">TM</text>
        <circle cx="${cx}" cy="${ly}" r="${ld / 2 + ld * 0.025}" fill="#fff" opacity=".9"/>
        ${logo(cx, ly, ld)}
        <text x="${cx}" y="${y1}" font-family="Oswald, 'Arial Narrow', sans-serif" font-weight="700" font-size="${s1}" fill="${t.name}" text-anchor="middle" letter-spacing="${-s1 * 0.01}">${esc(l1).toUpperCase()}</text>
        ${l2 ? `<text x="${cx}" y="${y2}" font-family="Oswald, 'Arial Narrow', sans-serif" font-weight="700" font-size="${s2}" fill="${t.accent}" text-anchor="middle">${esc(l2).toUpperCase()}</text>` : ""}
        <text x="${cx}" y="${(l2 ? y2 : y1) + ts * 1.7}" font-family="Manrope, sans-serif" font-weight="700" font-size="${ts}" fill="${t.name}" text-anchor="middle" letter-spacing="${ts * 0.04}">${tag}</text>
        <g transform="translate(${cx - 50 * artS} ${artTop}) scale(${artS})">${ART[p.art](p.fill)}</g>
      </g></svg>`;
  }

  /* ---------- "cream" label: the A2 Cow Ghee format ---------- */
  function creamLabel(p, w, h) {
    const id = `c${++uid}`;
    const cx = w / 2;
    const band = (y, flip) => `<rect y="${y}" width="${w}" height="${h * 0.035}" fill="url(#${id}cu)"/><rect y="${flip ? y - h * 0.018 : y + h * 0.045}" width="${w}" height="${h * 0.007}" fill="url(#${id}cu)"/>`;
    const ld = Math.min(h * 0.27, w * 0.3);
    const ly = h * 0.1 + ld / 2;
    const name = p.lines.join(" ");
    const ns = fit(name, w * 0.84, h * 0.11, 0.7);
    const ny = ly + ld / 2 + ns * 1.05;
    const sub = esc(p.tagline);
    const ss = fit(sub, w * 0.9, h * 0.045, 0.47);
    const sy = ny + ss * 1.5;
    const artTop = sy + h * 0.02, artH = h * 0.86 - artTop;
    const artS = Math.min((w * 0.6) / 100, artH / 70);
    const net = esc(`${p.kind === "liquid" ? "Net Vol" : "Net Wt"} ${p.size}`);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <defs><linearGradient id="${id}cu" x1="0" x2="1"><stop offset="0" stop-color="#9c5a2c"/><stop offset=".3" stop-color="#e8b07a"/><stop offset=".55" stop-color="#b87333"/><stop offset=".8" stop-color="#f0c28e"/><stop offset="1" stop-color="#9c5a2c"/></linearGradient>
        <radialGradient id="${id}bg" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#fdf9f0"/><stop offset="1" stop-color="#f4ead6"/></radialGradient></defs>
      <rect width="${w}" height="${h}" fill="url(#${id}bg)"/>
      ${band(h * 0.025)}${band(h * 0.94, true)}
      ${p.food ? vegMark(w * 0.87, h * 0.12, Math.min(w, h) * 0.06) : ""}
      ${logo(cx, ly, ld)}
      <text x="${cx}" y="${ny}" font-family="'Arial Black', 'Archivo Black', Manrope, sans-serif" font-weight="900" font-size="${ns}" fill="${INK}" text-anchor="middle">${esc(name).toUpperCase()}</text>
      <text x="${cx}" y="${sy}" font-family="Arial, Manrope, sans-serif" font-style="italic" font-size="${ss}" fill="#5a4a3a" text-anchor="middle">${sub}</text>
      <g transform="translate(${cx - 50 * artS} ${artTop}) scale(${artS})">${ART[p.art](p.fill)}</g>
      <text x="${w * 0.05}" y="${h * 0.9}" font-family="Arial, Manrope, sans-serif" font-weight="700" font-size="${Math.min(w, h) * 0.055}" fill="${INK}">${net}</text>
    </svg>`;
  }

  const label = (p, w, h) => (p.style === "cream" ? creamLabel : wrapLabel)(p, w, h);
  const inner = (svg) => svg.replace(/^<svg[^>]*>|<\/svg>\s*$/g, "");

  /* ---------- containers: viewBox 0 0 300 380, label placed into a fixed window ---------- */
  const glass = (id) => `<linearGradient id="${id}gl" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".12" stop-color="#fff" stop-opacity=".05"/><stop offset=".85" stop-color="#000" stop-opacity=".04"/><stop offset=".95" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient>`;
  const shade = (id) => `<linearGradient id="${id}sh" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".18" stop-color="#000" stop-opacity="0"/><stop offset=".8" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>`;
  const lid = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h * 0.22}" fill="#1c1a19"/>` +
    Array.from({ length: Math.floor(w / 7) }, (_, i) => `<rect x="${x + 4 + i * 7}" y="${y + h * 0.15}" width="2" height="${h * 0.7}" fill="#fff" opacity=".06"/>`).join("") +
    `<rect x="${x + w * 0.06}" y="${y + h * 0.1}" width="${w * 0.25}" height="${h * 0.18}" rx="2" fill="#fff" opacity=".12"/>`;
  const placed = (p, x, y, w, h) => `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner(label(p, w, h))}</svg>`;

  const CONTAINERS = {
    squat(p, id) { // 500 ml ghee-style jar
      return `${lid(42, 58, 216, 46)}
        <path d="M50 104h200v8q16 8 16 30v170q0 26-26 26H60q-26 0-26-26V142q0-22 16-30z" fill="${p.fill}"/>
        <path d="M50 104h200v8q16 8 16 30v6H34v-6q0-22 16-30z" fill="#fff" opacity=".18"/>
        ${placed(p, 34, 150, 232, 152)}
        <path d="M34 150h232v152H34z" fill="url(#${id}sh)"/>
        <path d="M50 104h200v8q16 8 16 30v170q0 26-26 26H60q-26 0-26-26V142q0-22 16-30z" fill="url(#${id}gl)" stroke="#000" stroke-opacity=".12"/>`;
    },
    tall(p, id) { // 250 g coconut-sugar-style jar
      return `${lid(72, 30, 156, 40)}
        <path d="M80 70h140v6q12 6 12 20v228q0 22-22 22H90q-22 0-22-22V96q0-14 12-20z" fill="#fff" opacity=".22"/>
        <path d="M68 110h164v214q0 22-22 22H90q-22 0-22-22z" fill="${p.fill}"/>
        ${placed(p, 68, 128, 164, 200)}
        <path d="M68 128h164v200H68z" fill="url(#${id}sh)"/>
        <path d="M80 70h140v6q12 6 12 20v228q0 22-22 22H90q-22 0-22-22V96q0-14 12-20z" fill="url(#${id}gl)" stroke="#000" stroke-opacity=".12"/>`;
    },
    pouch(p, id) { // stand-up kraft pouch, label printed on the front
      return `<path d="M58 40h184l8 290q-2 14-16 14H66q-14 0-16-14z" fill="#c9a77a"/>
        <path d="M58 40h184v14H58z" fill="#b8956a"/><path d="M62 66h176" stroke="#8a6a44" stroke-width="2" stroke-dasharray="1 0" opacity=".6"/>
        <circle cx="228" cy="50" r="4" fill="#f2ede4"/>
        ${placed(p, 76, 84, 148, 214)}
        <path d="M58 40h184l8 290q-2 14-16 14H66q-14 0-16-14z" fill="url(#${id}sh)"/>
        <path d="M62 330q88 12 176 0" stroke="#000" stroke-opacity=".15" fill="none"/>`;
    },
    oilBottle(p, id) { // 500 ml glass bottle
      return `<rect x="128" y="22" width="44" height="30" rx="5" fill="#1c1a19"/>
        <path d="M134 52h32v26q40 18 40 56v190q0 20-20 20h-72q-20 0-20-20V134q0-38 40-56z" fill="${p.fill}"/>
        ${placed(p, 98, 168, 104, 140)}
        <path d="M134 52h32v26q40 18 40 56v190q0 20-20 20h-72q-20 0-20-20V134q0-38 40-56z" fill="url(#${id}gl)" stroke="#000" stroke-opacity=".14"/>
        <path d="M94 168h112v140H94z" fill="url(#${id}sh)"/>`;
    },
    pumpBottle(p, id) { // shampoo
      return `<path d="M140 18h40v8h-22v20h-18z" fill="#2a2725"/><rect x="132" y="44" width="36" height="24" rx="4" fill="#2a2725"/>
        <path d="M96 68h108q8 0 8 10v250q0 16-16 16H104q-16 0-16-16V78q0-10 8-10z" fill="${p.fill}"/>
        ${placed(p, 98, 110, 104, 180)}
        <path d="M96 68h108q8 0 8 10v250q0 16-16 16H104q-16 0-16-16V78q0-10 8-10z" fill="url(#${id}sh)"/>
        <rect x="98" y="80" width="10" height="240" rx="5" fill="#fff" opacity=".25"/>`;
    },
    dropper(p, id) { // 30 ml serum
      return `<path d="M138 30q12-18 24 0v30h-24z" fill="#2a2725"/><rect x="128" y="58" width="44" height="34" rx="4" fill="#c9a24a"/>
        <path d="M112 92h76q14 0 14 14v206q0 18-18 18h-68q-18 0-18-18V106q0-14 14-14z" fill="${p.fill}"/>
        ${placed(p, 104, 140, 92, 150)}
        <path d="M112 92h76q14 0 14 14v206q0 18-18 18h-68q-18 0-18-18V106q0-14 14-14z" fill="url(#${id}gl)" stroke="#000" stroke-opacity=".14"/>`;
    },
  };

  function product(p) {
    const id = `k${++uid}`;
    return `<svg class="pack" viewBox="0 0 300 380" role="img" aria-label="${esc(p.lines.join(" "))} pack">
      <defs>${glass(id)}${shade(id)}<radialGradient id="${id}fl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="150" cy="350" rx="118" ry="12" fill="url(#${id}fl)"/>
      ${CONTAINERS[p.pack](p, id)}
    </svg>`;
  }

  // flat label artwork for print/download (front panel at a print-friendly ratio)
  const flat = (p) => (p.style === "cream" ? label(p, 900, 560) : label(p, 600, 760));

  window.RRLabels = { product, flat };
})();
