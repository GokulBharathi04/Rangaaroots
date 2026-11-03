/* Rangaa Roots — page behaviour (no dependencies)
 * Showcase site: products link to a WhatsApp enquiry, nothing is sold on-site.
 * Motion lives in motion.js; this file renders content and wires it up. */
(() => {
  const { brand, ghee, products, reviews } = window.RR;
  const { families, products: catalog } = window.RRCatalog;
  const M = window.Motion;
  // no scrolling under the intro film; it hands the page over when it lets go
  if (window.Intro.active) {
    window.Scroll.stop();
    window.Intro.released.then(() => {
      window.Scroll.start();
      window.Scroll.lenis?.scrollTo(0, { immediate: true });   // a stray key press under the film
    });
  }
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const icon = (id, cls = "ic") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const waLink = (text) => `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(text)}`;

  /**
   * The pre-filled WhatsApp text a visitor sends when tapping "Enquire".
   * It is the first thing the Rangaa Roots team reads, so tone and detail matter.
   *
   * @param {{name:string, size?:string}} product
   * @returns {string}
   */
  function buildEnquiryMessage(product) {
    // TODO(you): shape the enquiry message — see README "Your turn".
    return `Vanakkam Rangaa Roots! I'd like to know more about ${product.name}.`;
  }

  /* ---------- Nav ---------- */
  const nav = $("#nav");
  const menuBtn = $("#menuBtn");
  addEventListener("scroll", () => nav.classList.toggle("is-solid", scrollY > 40), { passive: true });
  nav.classList.toggle("is-solid", scrollY > 40);

  // full-screen menu on small screens; page scrolling pauses while it is open
  const setMenu = (open) => {
    nav.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    open ? window.Scroll.stop() : window.Scroll.start();
  };
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("menu-open")));
  $$("#navLinks a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("menu-open")) { setMenu(false); menuBtn.focus(); }
  });

  // gold underline glides to the link of the section in view
  const ink = $("#navInk");
  const placeInk = () => {
    const a = $("#navLinks a.is-active");
    ink.style.setProperty("--o", a ? 1 : 0);
    if (!a) return;
    ink.style.setProperty("--x", a.offsetLeft + 14 + "px");
    ink.style.setProperty("--w", a.offsetWidth - 28);
  };
  addEventListener("resize", placeInk);

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      $$("#navLinks a").forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
      placeInk();
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["ghee", "shop", "process", "story"].forEach((id) => sectionObs.observe(document.getElementById(id)));
  // leaving all tracked sections (back to the hero) clears the underline
  addEventListener("scroll", () => {
    if (scrollY >= innerHeight * 0.5) return;
    const active = $("#navLinks a.is-active");
    if (active) { active.classList.remove("is-active"); placeInk(); }
  }, { passive: true });

  /* ---------- Flagship ghee ---------- */
  $("#gheeSub").textContent = ghee.subtitle;
  $("#gheeFeatures").innerHTML = ghee.features.map((f) => `<li data-reveal>${icon("leaf")}<span>${f}</span></li>`).join("");
  $("#gheeWa").href = waLink(buildEnquiryMessage(ghee));

  /* ---------- Products: render once, filter with FLIP ---------- */
  // every catalogue family, plus the products only the home page lists
  const photoOf = new Map(products.filter((p) => p.of).map((p) => [p.of, p]));
  const shelves = families.map((f) => ({
    ...f,
    items: [
      ...catalog.filter((c) => c.family === f.id).map((c) => {
        const photo = photoOf.get(c.id);
        return photo ? { ...photo, family: f.id } : { id: c.id, family: f.id, name: c.lines.join(" "), note: c.note, size: c.size, img: c.photo };
      }),
      ...products.filter((p) => p.family === f.id),
    ],
  }));
  const allItems = shelves.flatMap((s) => s.items);

  const cardImage = (p) => `<div class="card__img">
        <picture>
          <source srcset="assets/img/products/${p.img.replace(/\.jpg$/, "-480.webp")} 480w, assets/img/products/${p.img.replace(/\.jpg$/, ".webp")} 900w"
            sizes="(max-width: 600px) 46vw, (max-width: 1080px) 31vw, 300px" type="image/webp">
          <img src="assets/img/products/${p.img}" alt="${p.name}" loading="lazy" width="600" height="750">
        </picture>
      </div>`;

  const shelfFilm = (s) => `
      <div class="film shelf__film" data-film data-curtain>
        <video src="assets/video/${s.film}.mp4" poster="assets/video/${s.film}-poster.webp" muted loop playsinline preload="none" width="848" height="478" aria-label="${s.filmLabel}"></video>
        <button class="film__toggle" type="button" aria-label="Play video"><svg class="ic film__pause" aria-hidden="true"><use href="#i-pause"/></svg><svg class="ic film__play" aria-hidden="true"><use href="#i-play"/></svg></button>
      </div>`;

  const grid = $("#grid");
  grid.innerHTML = shelves.map((s) => `
    <header class="shelf ${s.film ? "shelf--film" : ""}" id="family-${s.id}" data-family="${s.id}">
      <div>
        <h3 class="shelf__name">${s.name} <span>${s.items.length}</span></h3>
        <p class="shelf__blurb">${s.blurb}</p>
      </div>
      ${s.film ? shelfFilm(s) : ""}
    </header>
    ${s.items.map((p) => `
    <article class="card" data-id="${p.id}">
      ${cardImage(p)}
      <div class="card__body">
        ${p.size ? `<span class="card__size">${p.size}</span>` : ""}
        <h3>${p.name}</h3>
        <p class="card__note">${p.note}</p>
        <a class="enquire" href="${waLink(buildEnquiryMessage(p))}" target="_blank" rel="noopener" aria-label="Enquire about ${p.name} on WhatsApp">
          ${icon("chat")} <span>Enquire</span> ${icon("arrow", "ic ic--arrow")}
        </a>
      </div>
    </article>`).join("")}`).join("");
  const cards = $$(".card", grid);
  const shelfHeads = $$(".shelf", grid);
  // first appearance: each row of cards rises in sequence. Cards are never hidden by CSS,
  // so one filtered out before it was seen still shows normally when it comes back.
  if (!M.reduce) {
    const cardIO = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      cardIO.unobserve(e.target);
      e.target.animate([{ opacity: 0, translate: "0 40px" }, { opacity: 1, translate: "0 0" }],
        { duration: 1100, easing: "cubic-bezier(.16,1,.3,1)", delay: (cards.indexOf(e.target) % 4) * 90, fill: "backwards" });
    }), { threshold: 0.12 });
    cards.forEach((c) => cardIO.observe(c));
  }

  let activeCat = "all", query = "";
  const chips = $("#chips");
  chips.insertAdjacentHTML("beforeend", [{ id: "all", short: "All" }, ...families].map((c) =>
    `<button type="button" class="chip" role="tab" data-cat="${c.id}" aria-selected="${c.id === activeCat}">${c.short}</button>`).join(""));
  let placeIndicator = () => {};   // set once every section is rendered (see below)

  const applyFilter = () => {
    const q = query.trim().toLowerCase();
    M.flip(cards, () => {
      const shownIn = new Set();
      cards.forEach((c) => {
        const p = allItems.find((x) => x.id === c.dataset.id);
        const match = (activeCat === "all" || p.family === activeCat) &&
          (!q || (p.name + " " + p.note).toLowerCase().includes(q));
        c.hidden = !match;
        if (match) shownIn.add(p.family);
      });
      shelfHeads.forEach((h) => { h.hidden = !shownIn.has(h.dataset.family); });
      $("#empty").hidden = shownIn.size > 0;
    });
  };
  chips.addEventListener("click", (e) => {
    const c = e.target.closest(".chip");
    if (!c) return;
    activeCat = c.dataset.cat;
    $$(".chip", chips).forEach((b) => b.setAttribute("aria-selected", b === c));
    placeIndicator();
    c.scrollIntoView({ block: "nearest", inline: "nearest", behavior: M.reduce ? "auto" : "smooth" });
    applyFilter();
  });
  let searchTimer;
  $("#search").addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { query = e.target.value; applyFilter(); }, 160);
  });

  /* ---------- Reviews (paper notes) ---------- */
  $("#reviews").innerHTML = reviews.map((r, i) => `
    <article class="review" data-reveal>
      <span class="stars" role="img" aria-label="5 out of 5 stars">${icon("star").repeat(5)}</span>
      <h3>${r.title}</h3>
      <p>“${r.text}”</p>
      <footer><span class="avatar" aria-hidden="true">${r.name.replace(/^S\. /, "")[0]}</span><span><b>${r.name}</b>${r.place}</span></footer>
    </article>`).join("");

  /* ---------- Footer ---------- */
  $("#footAddr").textContent = brand.address;
  $("#year").textContent = new Date().getFullYear();

  // first measurement only after all the content above is in, so the page is laid out once
  placeIndicator = M.tabIndicator(chips, $("#chipIndicator"));

  /* ---------- Motion ---------- */
  // hero first (it is on screen), then the rest one step per task
  M.bind([
    () => M.hero(),
    () => M.marquee($("#marquee")),
    () => M.process($("#process")),
  ]);
  M.scrollFx({ progressEl: $("#progress") });
})();
