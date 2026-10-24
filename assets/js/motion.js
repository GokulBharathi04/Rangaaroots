/* Rangaa Roots — motion (GSAP + ScrollTrigger, synced to Lenis in scroll.js)
 *
 * Opt in from markup:
 *   data-reveal            rises 40px and fades in as it enters; neighbours entering together stagger
 *   data-curtain           image frame wipes up while its picture counter-moves and settles from 1.15x
 *   data-parallax="12"     drifts through the viewport by that many percent of its own height
 *   data-glow              slow golden light swells once when scrolled into view
 *   data-count="40"        counts up (data-count="25,30" + data-join="–" for a range; data-prefix / data-suffix)
 *   data-magnetic          button drifts a few px toward the pointer
 *
 * <html class="motion"> is set in <head> before first paint; CSS hides animated parts only
 * under that class. Without GSAP, under prefers-reduced-motion, or if anything here throws,
 * the class is removed and every element shows in its final state.
 */
window.Motion = (() => {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const G = !reduce && window.Scroll?.hasGsap;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const EASE = "expo.out";

  const showAll = () => root.classList.remove("motion");
  if (!G) showAll();

  /* ---------- Arrival: one IntersectionObserver for every one-shot entrance ----------
   * An entrance only needs to know when something arrives, which the browser reports
   * without any layout work; ScrollTrigger is kept for what follows the scroll position
   * (parallax, the pinned process). Elements arriving together with the same handler are
   * handed over as one group, in page order, so the group can stagger. */
  const arrivals = new Map();
  const arrivalIO = G && new IntersectionObserver((entries) => {
    const groups = new Map();
    entries.filter((e) => e.isIntersecting).forEach(({ target }) => {
      arrivalIO.unobserve(target);
      (arrivals.get(target) || []).forEach((fn) => groups.set(fn, [...(groups.get(fn) || []), target]));
      arrivals.delete(target);
    });
    groups.forEach((els, fn) => fn(els.sort((a, b) => (a.compareDocumentPosition(b) & 4 ? -1 : 1))));
  }, { rootMargin: "0px 0px -12% 0px" });
  // one element can carry several entrances (a ghee frame is both a curtain parent and a glow)
  const onArrive = (el, fn) => { arrivals.set(el, [...(arrivals.get(el) || []), fn]); arrivalIO.observe(el); };

  /* Run a motion step; if it throws, fall back to the static page rather than leave things hidden. */
  const safe = (fn) => (...args) => {
    if (!G) return;
    try { fn(...args); } catch (err) { console.error(err); showAll(); }
  };

  /* ---------- Reveal: batched so things entering together stagger ---------- */
  const revealGroup = (batch) => gsap.fromTo(batch,
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.15, ease: EASE, stagger: 0.09, overwrite: true, clearProps: "transform" });
  const reveals = safe((root = document) => {
    $$("[data-reveal]:not([data-revealed])", root).forEach((el) => {
      el.dataset.revealed = "";
      onArrive(el, revealGroup);
    });
  });

  /* ---------- Curtain: transform-only image wipe ---------- */
  const curtains = safe(() => {
    $$("[data-curtain]").forEach((frame) => {
      const pic = frame.firstElementChild;
      // built on arrival, so nothing is written to the page at start-up (CSS holds the
      // frame at opacity 0 until then). Watch the parent: the frame itself moves.
      onArrive(frame.parentElement, () => gsap.timeline()
        .fromTo(frame, { yPercent: 100, opacity: 1 }, { yPercent: 0, duration: 1.4, ease: "expo.inOut" }, 0)
        .fromTo(pic, { yPercent: -100, scale: 1.15 }, { yPercent: 0, duration: 1.4, ease: "expo.inOut" }, 0)
        .to(pic, { scale: 1, duration: 1.8, ease: EASE }, 0.9));
    });
  });

  /* ---------- Parallax drift ---------- */
  const parallax = safe(() => {
    $$("[data-parallax]").forEach((el) => {
      const v = +el.dataset.parallax || 10;
      gsap.fromTo(el, { yPercent: -v / 2 }, {
        yPercent: v / 2, ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
  });

  /* ---------- Golden glow ---------- */
  const glows = safe(() => {
    $$("[data-glow]").forEach((el) => {
      onArrive(el, () => el.classList.add("is-glowing"));
    });
  });

  /* ---------- Line reveal: each rendered line rises from behind its own mask ----------
   * Lines are measured after fonts load; once the reveal finishes the original nodes go
   * back, so later resizes re-wrap the text naturally. */
  const lines = safe((el) => {
    const original = [...el.childNodes];
    const words = el.textContent.trim().split(/\s+/);
    const probes = words.map((w) => Object.assign(document.createElement("span"), { textContent: w, style: "display:inline-block" }));
    el.replaceChildren(...probes.flatMap((p, i) => (i ? [" ", p] : [p])));
    const rows = [];
    let top = null;
    probes.forEach((p) => {
      if (p.offsetTop !== top) { rows.push([]); top = p.offsetTop; }
      rows[rows.length - 1].push(p.textContent);
    });
    const inners = rows.map((row) => {
      const mask = Object.assign(document.createElement("span"), { className: "ln" });
      const inner = Object.assign(document.createElement("span"), { className: "ln__i", textContent: row.join(" ") });
      mask.append(inner);
      return inner;
    });
    el.replaceChildren(...inners.map((i) => i.parentElement));
    el.dataset.split = "";   // CSS shows the element from here on
    gsap.set(inners, { yPercent: 108 });
    onArrive(el, () => gsap.to(inners, {
      yPercent: 0, duration: 1.3, ease: EASE, stagger: 0.12,
      onComplete: () => el.replaceChildren(...original),
    }));
  });

  /* ---------- Count up (text is final in the DOM; a ghost keeps the box from resizing) ---------- */
  function prepCount(el) {
    const ends = el.dataset.count.split(",").map(Number);
    const fmt = (p) => (el.dataset.prefix || "") + ends.map((n) => Math.round(n * p)).join(el.dataset.join || "") + (el.dataset.suffix || "");
    const span = (cls, text) => Object.assign(document.createElement("span"), { className: cls, textContent: text || "" });
    const final = fmt(1);
    const box = span("count");
    const val = span("count__val", final);
    box.setAttribute("aria-hidden", "true");
    box.append(span("count__ghost", final), val);
    el.replaceChildren(span("sr-only", final), box);
    return { val, fmt };
  }
  const countUp = safe((el, delay = 0) => {
    const { val, fmt } = prepCount(el);
    const o = { p: 0 };
    val.textContent = fmt(0);
    gsap.to(o, { p: 1, duration: 2.2, delay, ease: "power3.out", onUpdate: () => (val.textContent = fmt(o.p)) });
  });

  /* ---------- Hero: count-up and temple parallax ----------
   * The entrance itself is CSS (styles.css, "hero entrance") so it starts on first paint.
   * The stats fade in at about 1.3s; count up only if the script arrived in time to
   * start from zero, otherwise leave the final values alone. */
  const hero = safe(() => {
    const elapsed = performance.now() / 1000;
    if (elapsed < 1.2) {
      $$(".hero__stats [data-count]").forEach((el, i) => countUp(el, 1.3 - elapsed + i * 0.12));
    }
    // the temple drifts down at a fraction of scroll speed while the hero leaves; its
    // top edge only uncovers once that part of the hero is already off screen
    gsap.to("#heroMedia", { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  });

  /* ---------- Bilona process: a gold line runs through five stages ----------
   * Desktop: the section pins under the header and the scroll scrubs one timeline
   * (line draws across, each stage's dot fills and its text rises as the line arrives).
   * Smaller or short screens: no pin; the line fills down the left as you scroll. */
  const process = safe((section) => {
    const fill = $(".process__fill", section);
    const steps = $$(".step", section);
    const parts = (s) => s.querySelectorAll(".step__n, .ic, h3, p");
    const dot = (s) => $(".step__dot i", s);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1081px) and (min-height: 640px)", () => {
      section.classList.add("is-pinnable");
      const header = () => $("#nav").offsetHeight;
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: section, start: () => `top ${header()}`, end: () => "+=" + innerHeight * 1.6,
          scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
          refreshPriority: 1,   // created after the reveals below it: measure the pin first so they include its length
        },
      });
      // stage i sits about i/5 along the line, so it lights up at time i
      tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: steps.length }, 0);
      steps.forEach((s, i) => {
        tl.fromTo(dot(s), { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2)" }, i + 0.02)
          .fromTo(parts(s), { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, i + 0.05);
      });
      tl.to({}, { duration: 0.6 });   // a short hold on the finished line before the pin releases
      return () => section.classList.remove("is-pinnable");
    });

    mm.add("(max-width: 1080px), (max-height: 639px)", () => {
      const axis = matchMedia("(max-width: 1080px)").matches ? "scaleY" : "scaleX";
      gsap.fromTo(fill, { [axis]: 0 }, {
        [axis]: 1, ease: "none",
        scrollTrigger: { trigger: $(".process__track", section), start: "top 75%", end: "bottom 65%", scrub: 0.6 },
      });
      steps.forEach((s) => {
        gsap.set(dot(s), { scale: 0 });
        gsap.set(parts(s), { y: 32, opacity: 0 });
        onArrive(s, () => gsap.timeline()
          .to(dot(s), { scale: 1, duration: 0.5, ease: "back.out(2)" }, 0)
          .to(parts(s), { y: 0, opacity: 1, duration: 1, ease: EASE, stagger: 0.08 }, 0.1));
      });
    });
  });

  /* ---------- Marquee: steady drift, speeds up with scroll velocity, eases to a stop on hover ----------
   * The drift is a CSS animation, so it runs on the compositor with no per-frame work on the
   * main thread; GSAP only eases its playbackRate when the visitor scrolls or hovers. */
  const marquee = safe((el) => {
    const loop = $(".marquee__track", el).getAnimations()[0];
    if (!loop) return;
    const rate = { v: 1 };
    const apply = () => (loop.playbackRate = rate.v);
    let hovering = false;
    const ease = (to, d) => gsap.to(rate, { v: to, duration: d, ease: "power2.out", overwrite: true, onUpdate: apply });
    el.addEventListener("pointerenter", () => { hovering = true; ease(0, 1); });
    el.addEventListener("pointerleave", () => { hovering = false; ease(1, 1.2); });
    window.Scroll.lenis?.on("scroll", ({ velocity }) => {
      if (hovering) return;
      gsap.to(rate, { v: 1 + Math.min(Math.abs(velocity) * 0.25, 4), duration: 0.25, overwrite: true, onUpdate: apply });
      gsap.to(rate, { v: 1, duration: 1.2, delay: 0.25, ease: "power2.out", onUpdate: apply });
    });
  });

  /* ---------- Magnetic buttons ---------- */
  function magnetic(el, strength = 0.25, limit = 7) {
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

  /* ---------- Reading progress bar ---------- */
  function scrollFx({ progressEl } = {}) {
    if (!progressEl) return;
    // the scrollable height is cached and re-read only when the page resizes: reading it
    // per frame would force a layout right after GSAP's per-frame style writes
    let max = 0, ticking = false;
    const measure = () => { max = root.scrollHeight - innerHeight; update(); };
    const update = () => {
      ticking = false;
      progressEl.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    new ResizeObserver(measure).observe(document.body);
    addEventListener("resize", measure);
    measure();
  }

  /* ---------- Sliding tab indicator ---------- */
  function tabIndicator(container, indicator, activeSel = '[aria-selected="true"]') {
    const place = (instant) => {
      const a = container.querySelector(activeSel);
      if (!a) return;
      if (instant) indicator.style.transition = "none";
      // tabs may wrap onto two rows on phones, so follow the active tab's row as well
      indicator.style.width = a.offsetWidth + "px";
      indicator.style.height = a.offsetHeight + "px";
      indicator.style.transform = `translate(${a.offsetLeft}px, ${a.offsetTop}px)`;
      if (instant) requestAnimationFrame(() => (indicator.style.transition = ""));
    };
    addEventListener("resize", () => place(true));
    document.fonts?.ready.then(() => place(true));
    place(true);
    return place;
  }

  /* ---------- FLIP: animate items to their new grid positions ---------- */
  function flip(items, mutate, { duration = 600, easing = "cubic-bezier(.16,1,.3,1)" } = {}) {
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
          [{ opacity: 0, transform: "translateY(16px) scale(.97)" }, { opacity: 1, transform: "none" }],
          { duration, easing, delay: Math.min(i, 8) * 35, fill: "backwards" }
        );
      }
    });
    if (G) ScrollTrigger.refresh();
  }

  /* ---------- Start-up: run set-up steps one per task ----------
   * Each step measures the page; run back to back they make one long task that blocks
   * taps on a slow phone. A macrotask between steps lets the browser respond in between. */
  function run(steps) {
    const next = () => {
      const step = steps.shift();
      if (!step) return;
      step();
      if (steps.length) setTimeout(next, 0);
    };
    next();
  }

  /* ---------- Bind everything declared in markup ---------- */
  function bind(extra = []) {
    run([
      ...extra,
      () => reveals(),
      () => curtains(),
      () => parallax(),
      () => glows(),
      () => $$("[data-magnetic]").forEach((el) => magnetic(el)),
      // line breaks depend on the loaded fonts, so split only once they are in.
      // ScrollTrigger refreshes itself on load; refresh once more if fonts land after that.
      () => (document.fonts?.ready || Promise.resolve()).then(() => {
        $$("[data-lines]").forEach((el) => lines(el));
        if (G && document.readyState === "complete") ScrollTrigger.refresh();
      }),
    ]);
  }

  return { reduce, G, safe, reveals, countUp, hero, process, marquee, magnetic, scrollFx, tabIndicator, flip, bind };
})();
