/* Rangaa Roots — motion components (no dependencies)
 *
 * Opt in from markup:
 *   data-reveal            fade + 12px rise when scrolled into view
 *   data-stagger           on a parent: its [data-reveal] children enter one after another
 *   data-split             headline words rise in sequence (short headlines only)
 *   data-tilt              paper sheet tilts toward the pointer and lifts
 *   data-magnetic          button drifts a few px toward the pointer
 *   data-parallax="0.2"    layer moves at a fraction of scroll speed
 *   data-count="40"        number counts up when visible (data-prefix / data-suffix)
 *
 * Every component is skipped (final state shown) under prefers-reduced-motion.
 * Tilt and magnetic only run on fine pointers (mouse / trackpad).
 */
window.Motion = (() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Reveal ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      revealIO.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  function reveal(root = document) {
    $$("[data-reveal]:not(.is-in)", root).forEach((el) => {
      const group = el.parentElement?.closest("[data-stagger]");
      if (group) {
        const i = $$(":scope > [data-reveal]", el.parentElement).indexOf(el);
        el.style.setProperty("--rd", Math.min(Math.max(i, 0), 6) * 80 + "ms");
      }
      if (reduce) el.classList.add("is-in"); else revealIO.observe(el);
    });
  }

  /* ---------- Split headline into words ---------- */
  function splitWords(el) {
    if (reduce || el.dataset.splitDone) return;
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    let wi = 0;
    $$(".line", el).forEach((line) => {
      line.setAttribute("aria-hidden", "true");
      const words = line.textContent.trim().split(/\s+/);
      line.textContent = "";
      words.forEach((word, n) => {
        const outer = document.createElement("span");
        const inner = document.createElement("span");
        outer.className = "w";
        inner.className = "w__i";
        inner.style.setProperty("--wi", wi++);
        inner.textContent = word;
        outer.append(inner);
        line.append(outer, n < words.length - 1 ? " " : "");
      });
    });
    el.dataset.splitDone = "1";
    requestAnimationFrame(() => el.classList.add("is-split"));
  }

  /* ---------- Tilt (paper lifts toward the pointer) ---------- */
  function tilt(el, max = 5) {
    if (reduce || !finePointer || el.dataset.tiltBound) return;
    el.dataset.tiltBound = "1";
    let raf = 0;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--ry", (px * max).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-py * max).toFixed(2) + "deg");
      });
    };
    el.addEventListener("pointerenter", () => el.classList.add("is-lifted"));
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", () => {   // always reverse on exit
      cancelAnimationFrame(raf);
      el.classList.remove("is-lifted");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  }

  /* ---------- Magnetic buttons ---------- */
  function magnetic(el, strength = 0.28, limit = 8) {
    if (reduce || !finePointer || el.dataset.magBound) return;
    el.dataset.magBound = "1";
    const clamp = (v) => Math.max(-limit, Math.min(limit, v));
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", clamp((e.clientX - r.left - r.width / 2) * strength) + "px");
      el.style.setProperty("--my", clamp((e.clientY - r.top - r.height / 2) * strength) + "px");
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    });
  }

  /* ---------- Scroll-linked: parallax + progress bar ---------- */
  function scrollFx({ progressEl } = {}) {
    const layers = reduce ? [] : $$("[data-parallax]");
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = scrollY;
      if (progressEl) {
        const max = document.documentElement.scrollHeight - innerHeight;
        progressEl.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      }
      if (y < innerHeight * 1.2) layers.forEach((l) => {
        l.style.transform = `translate3d(0, ${(y * +l.dataset.parallax).toFixed(1)}px, 0)`;
      });
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener("resize", update);
    update();
  }

  /* ---------- Count up ---------- */
  function countUp(el, dur = 1600) {
    const end = +el.dataset.count, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
    if (reduce) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = pre + Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
  }

  /* ---------- Sliding tab indicator ---------- */
  function tabIndicator(container, indicator, activeSel = '[aria-selected="true"]') {
    const place = (instant) => {
      const a = container.querySelector(activeSel);
      if (!a) return;
      if (instant) indicator.style.transition = "none";
      indicator.style.width = a.offsetWidth + "px";
      indicator.style.transform = `translateX(${a.offsetLeft}px)`;
      if (instant) requestAnimationFrame(() => (indicator.style.transition = ""));
    };
    addEventListener("resize", () => place(true));
    document.fonts?.ready.then(() => place(true));
    place(true);
    return place;
  }

  /* ---------- FLIP: animate items to their new grid positions ---------- */
  function flip(items, mutate, { duration = 450, easing = "cubic-bezier(.2,.8,.2,1)" } = {}) {
    if (reduce) { mutate(); return; }
    const first = new Map(items.filter((el) => !el.hidden).map((el) => [el, el.getBoundingClientRect()]));
    mutate();
    items.forEach((el, i) => {
      if (el.hidden) return;
      const last = el.getBoundingClientRect();
      const prev = first.get(el);
      if (prev) {
        const dx = prev.left - last.left, dy = prev.top - last.top;
        if (dx || dy) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration, easing });
      } else {
        el.animate(
          [{ opacity: 0, transform: "translateY(12px) scale(.97)" }, { opacity: 1, transform: "none" }],
          { duration, easing, delay: Math.min(i, 8) * 30, fill: "backwards" }
        );
      }
    });
  }

  /* ---------- Bind everything declared in markup ---------- */
  function bind(root = document) {
    reveal(root);
    $$("[data-split]", root).forEach(splitWords);
    $$("[data-tilt]", root).forEach((el) => tilt(el));
    $$("[data-magnetic]", root).forEach((el) => magnetic(el));
    $$("[data-count]", root).forEach((el) => countUp(el));
  }

  return { reduce, reveal, splitWords, tilt, magnetic, scrollFx, countUp, tabIndicator, flip, bind };
})();
