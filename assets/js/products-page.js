/* Rangaa Roots — All Products page: render the listing, family tabs, card entrance. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const { families, products } = window.RRCatalog;
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
          <div class="pl-card__shelf"><picture>
            <source srcset="assets/img/products/${p.photo.replace(/\.jpg$/, "-480.webp")} 480w, assets/img/products/${p.photo.replace(/\.jpg$/, ".webp")} 900w"
              sizes="(max-width: 520px) 92vw, (max-width: 1080px) 46vw, 300px" type="image/webp">
            <img src="assets/img/products/${p.photo}" alt="${title(p)}" loading="lazy" width="600" height="750">
          </picture></div>
          <div class="pl-card__body">
            <h3 class="pl-card__name">${title(p)}</h3>
            <p class="pl-card__note">${p.note}</p>
            <div class="pl-card__foot">
              <span class="pl-size">${p.size}</span>
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

  /* ---------- nav menu (phones) + year ---------- */
  const nav = $("#nav"), menuBtn = $("#menuBtn");
  const setMenu = (on) => { nav.classList.toggle("menu-open", on); menuBtn.setAttribute("aria-expanded", on); menuBtn.setAttribute("aria-label", on ? "Close menu" : "Open menu"); };
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("menu-open")));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("menu-open")) setMenu(false); });
  $("#year").textContent = new Date().getFullYear();
})();
