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

  /* Run a motion step; if it throws, fall back to the static page rather than leave things hidden. */
  const safe = (fn) => (...args) => {
    if (!G) return;
    try { fn(...args); } catch (err) { console.error(err); showAll(); }
  };

  /* ---------- Reveal: batched so things entering together stagger ---------- */
  const reveals = safe((root = document) => {
    const els = $$("[data-reveal]:not([data-revealed])", root);
    els.forEach((el) => (el.dataset.revealed = ""));
    ScrollTrigger.batch(els, {
      start: "top 88%",
      once: true,
      onEnter: (batch) => gsap.fromTo(batch,
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.15, ease: EASE, stagger: 0.09, overwrite: true, clearProps: "transform" }),
    });
  });

  /* ---------- Curtain: transform-only image wipe ---------- */
  const curtains = safe(() => {
    $$("[data-curtain]").forEach((frame) => {
      const pic = frame.firstElementChild;
      // trigger on the parent: the frame itself starts translated a full height down
      gsap.timeline({ scrollTrigger: { trigger: frame.parentElement, start: "top 85%", once: true } })
        .fromTo(frame, { yPercent: 100, autoAlpha: 1 }, { yPercent: 0, duration: 1.4, ease: "expo.inOut" }, 0)
        .fromTo(pic, { yPercent: -100, scale: 1.15 }, { yPercent: 0, duration: 1.4, ease: "expo.inOut" }, 0)
        .to(pic, { scale: 1, duration: 1.8, ease: EASE }, 0.9);
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
      ScrollTrigger.create({ trigger: el, start: "top 75%", once: true, onEnter: () => el.classList.add("is-glowing") });
    });
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

  /* ---------- Hero entrance + temple parallax ---------- */
  const hero = safe(() => {
    const bg = $("#heroBg");
    const tl = gsap.timeline({ defaults: { ease: EASE } });
    tl.fromTo(bg, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 2.6, ease: "power2.out" }, 0)
      .fromTo(".hero .eyebrow", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1 }, 0.25)
      .fromTo(".hero__title .line__i", { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.4, stagger: 0.16 }, 0.35)
      .fromTo(".hero__lead", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.3 }, 0.85)
      .fromTo(".hero__cta .btn", { y: 18, scale: 0.94, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 1.2, stagger: 0.12 }, 1.05)
      .fromTo(".hero__stats .stat", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.12 }, 1.25);
    $$(".hero__stats [data-count]").forEach((el, i) => countUp(el, 1.3 + i * 0.12));

    // the temple drifts down at a fraction of scroll speed while the hero leaves; its
    // top edge only uncovers once that part of the hero is already off screen
    gsap.to(bg, { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
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
          trigger: section, start: () => `top ${header()}`, end: () => "+=" + innerHeight * 2.4,
          scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
        },
      });
      // stage i sits about i/5 along the line, so it lights up at time i
      tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: steps.length }, 0);
      steps.forEach((s, i) => {
        tl.fromTo(dot(s), { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2)" }, i + 0.02)
          .fromTo(parts(s), { y: 48, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08 }, i + 0.05);
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
        gsap.timeline({ scrollTrigger: { trigger: s, start: "top 82%", once: true } })
          .fromTo(dot(s), { scale: 0 }, { scale: 1, duration: 0.5, ease: "back.out(2)" }, 0)
          .fromTo(parts(s), { y: 32, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: EASE, stagger: 0.08 }, 0.1);
      });
    });
  });

  /* ---------- Marquee: steady drift, speeds up with scroll velocity, eases to a stop on hover ---------- */
  const marquee = safe((el) => {
    const track = $(".marquee__track", el);
    const loop = gsap.to(track, { xPercent: -50, duration: 55, ease: "none", repeat: -1 });
    let hovering = false;
    const ease = (to, d = 0.8) => gsap.to(loop, { timeScale: to, duration: d, ease: "power2.out", overwrite: true });
    el.addEventListener("pointerenter", () => { hovering = true; ease(0, 1); });
    el.addEventListener("pointerleave", () => { hovering = false; ease(1, 1.2); });
    window.Scroll.lenis?.on("scroll", ({ velocity }) => {
      if (hovering) return;
      gsap.to(loop, { timeScale: 1 + Math.min(Math.abs(velocity) * 0.25, 4), duration: 0.25, overwrite: true });
      gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.25, ease: "power2.out" });
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
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = root.scrollHeight - innerHeight;
      progressEl.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener("resize", update);
    update();
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

  /* ---------- Bind everything declared in markup ---------- */
  function bind() {
    reveals();
    curtains();
    parallax();
    glows();
    $$("[data-magnetic]").forEach((el) => magnetic(el));
    if (G) {
      // pinned and scrubbed scenes measure the page; measure again once fonts and images settle
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      addEventListener("load", () => ScrollTrigger.refresh());
    }
  }

  return { reduce, G, safe, reveals, countUp, hero, process, marquee, magnetic, scrollFx, tabIndicator, flip, bind };
})();
