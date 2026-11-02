/* Rangaa Roots — All Products page: render the listing, family tabs, card entrance, label viewer. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const { families, products } = window.RRCatalog;
  const { product: pack, flat } = window.RRLabels;
  const WA = "https://wa.me/919597927712?text=";
  const title = (p) => p.lines.join(" ");

  /* ---------- listing ---------- */
  $("#familyNav").innerHTML = families.map((f) =>
    `<a class="pl-tab" href="#${f.id}">${f.name} <span>${products.filter((p) => p.family === f.id).length}</span></a>`).join("");

  $("#listing").innerHTML = families.map((f, i) => {
    const items = products.filter((p) => p.family === f.id);
    return `<section class="pl-family" id="${f.id}" aria-labelledby="${f.id}-h">
      <header class="pl-family__head">
        <span class="pl-family__num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
        <h2 class="pl-family__name" id="${f.id}-h">${f.name}</h2>
        <p class="pl-family__blurb">${f.blurb}</p>
      </header>
      <div class="pl-grid">${items.map((p) => `
        <article class="pl-card" data-id="${p.id}">
          <div class="pl-card__shelf">${pack(p)}</div>
          <div class="pl-card__body">
            <h3 class="pl-card__name">${title(p)}</h3>
            <p class="pl-card__note">${p.note}</p>
            <div class="pl-card__foot">
              <span class="pl-size">${p.size}</span>
              <button class="pl-mini" data-label="${p.id}"><svg class="ic" aria-hidden="true"><use href="#i-tag"/></svg>Label</button>
              <a class="pl-mini pl-mini--solid" href="${WA}${encodeURIComponent(`Hi Rangaa Roots, I'd like to order ${title(p)} (${p.size}).`)}" target="_blank" rel="noopener">Enquire</a>
            </div>
          </div>
        </article>`).join("")}
      </div>
    </section>`;
  }).join("");

  /* ---------- family tab follows the section in view ---------- */
  const tabs = [...document.querySelectorAll(".pl-tab")];
  const track = $("#familyNav");
  // scroll only the tab strip (scrollIntoView would also move the page)
  const setTab = (id) => tabs.forEach((t) => {
    const on = t.hash === `#${id}`;
    t.setAttribute("aria-current", on);
    if (on && (t.offsetLeft < track.scrollLeft || t.offsetLeft + t.offsetWidth > track.scrollLeft + track.clientWidth))
      track.scrollTo({ left: t.offsetLeft - 16, behavior: "smooth" });
  });
  const spy = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setTab(e.target.id)), { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll(".pl-family").forEach((s) => spy.observe(s));
  setTab(families[0].id);

  /* ---------- cards enter once, staggered along each row ---------- */
  if (document.documentElement.classList.contains("motion")) {
    const io = new IntersectionObserver((entries) => {
      const arriving = entries.filter((e) => e.isIntersecting).map((e) => e.target);
      arriving.forEach((el, i) => { el.style.setProperty("--d", `${Math.min(i, 5) * 50}ms`); el.classList.add("is-in"); io.unobserve(el); });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".pl-card").forEach((c) => io.observe(c));
  }

  /* ---------- label viewer ---------- */
  const dlg = $("#labelDialog");
  let current;
  const open = (id) => {
    current = products.find((p) => p.id === id);
    $("#labelFamily").textContent = families.find((f) => f.id === current.family).name;
    $("#labelTitle").textContent = title(current);
    $("#labelArt").innerHTML = flat(current);
    $("#labelMeta").textContent = `${current.style === "cream" ? "Ghee-style cream label" : "Coconut-Sugar-style wrap label"} · ${current.size}`;
    dlg.showModal();
  };
  const close = () => {
    if (!dlg.open || dlg.classList.contains("is-closing")) return;
    dlg.classList.add("is-closing");
    dlg.addEventListener("animationend", () => { dlg.classList.remove("is-closing"); dlg.close(); }, { once: true });
  };
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-label]"); if (b) open(b.dataset.label); });
  $("#labelClose").addEventListener("click", close);
  dlg.addEventListener("cancel", (e) => { e.preventDefault(); close(); });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });

  // A downloaded SVG must stand alone: inline the logo and the label fonts as data URIs.
  const dataUri = (url) => fetch(url).then((r) => r.blob()).then((b) => new Promise((ok) => { const fr = new FileReader(); fr.onload = () => ok(fr.result); fr.readAsDataURL(b); }));
  let assets;
  $("#labelDownload").addEventListener("click", async () => {
    assets ||= Promise.all(["assets/img/logo-round-640.png", "assets/fonts/oswald-var-latin.woff2", "assets/fonts/manrope-var-latin.woff2"].map(dataUri));
    const [logo, oswald, manrope] = await assets;
    const fonts = `<style>@font-face{font-family:Oswald;font-weight:500 700;src:url(${oswald})}@font-face{font-family:Manrope;font-weight:200 800;src:url(${manrope})}</style>`;
    const svg = flat(current).replace(/href="[^"]*logo-round-240\.webp"/g, `href="${logo}"`).replace(/(<svg[^>]*>)/, `$1${fonts}`);
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })), download: `rangaa-roots-${current.id}-label.svg` });
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  /* ---------- nav menu (phones) + year ---------- */
  const nav = $("#nav"), menuBtn = $("#menuBtn");
  const setMenu = (on) => { nav.classList.toggle("menu-open", on); menuBtn.setAttribute("aria-expanded", on); menuBtn.setAttribute("aria-label", on ? "Close menu" : "Open menu"); };
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("menu-open")));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("menu-open")) setMenu(false); });
  $("#year").textContent = new Date().getFullYear();
})();
