/* Rangaa Roots — the intro film, played once a session before the hero.
 *
 * The head script decides whether it runs (html.intro-on). This file loads right after the
 * overlay, without defer, so the film starts as early as possible. The site must never wait
 * on it: if the film cannot play, the overlay leaves straight away.
 *
 * The film ends mid push-in. Rather than cutting on that moment, the same push carries on
 * (fast, then settling) as the layer blurs and dissolves, with the hero released just after.
 *
 * Intro.released resolves when the page takes over; motion.js starts the hero count-up from
 * it and main.js restarts Lenis from it.
 */
window.Intro = (() => {
  const root = document.documentElement;
  const el = document.getElementById("intro");
  const state = { active: root.classList.contains("intro-on"), releasedAt: 0, released: null };
  let resolve;
  state.released = new Promise((r) => (resolve = r));

  if (!state.active) { el?.remove(); resolve(); return state; }

  const video = document.getElementById("introVideo");
  const PUSH = "cubic-bezier(.16, 1, .3, 1)";      // starts at speed, like the film's last frames
  const DISSOLVE = "cubic-bezier(.77, 0, .175, 1)";
  let leaving = false, startGuard, capGuard;

  const release = () => {
    state.releasedAt = performance.now();
    root.classList.remove("intro-on");
    resolve();
  };

  function leave(seamless) {
    if (leaving) return;
    leaving = true;
    clearTimeout(startGuard);
    clearTimeout(capGuard);
    try { sessionStorage.setItem("rr-intro", "1"); } catch (e) {}
    el.classList.add("is-leaving");   // keeps the overlay up once html.intro-on goes

    if (!seamless) {   // skipped or failed: step aside quickly
      release();
      el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, easing: "ease-out", fill: "both" }).onfinish = () => el.remove();
      return;
    }
    setTimeout(release, 220);
    video.animate(
      [{ transform: "scale(1)", filter: "blur(0px)" }, { transform: "scale(1.6)", filter: "blur(16px)" }],
      { duration: 1500, easing: PUSH, fill: "both" });
    el.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 1200, delay: 200, easing: DISSOLVE, fill: "both" }).onfinish = () => el.remove();
  }

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  video.addEventListener("ended", () => leave(true));
  video.addEventListener("error", () => leave(false));
  document.getElementById("introSkip").addEventListener("click", () => leave(false));
  // a slow connection should not hold anyone at a still frame
  startGuard = setTimeout(() => leave(false), 2500);
  video.addEventListener("playing", () => clearTimeout(startGuard), { once: true });
  capGuard = setTimeout(() => leave(false), 9000);

  video.src = "assets/video/intro.mp4";
  video.play().catch(() => leave(false));
  return state;
})();
