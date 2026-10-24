/* Rangaa Roots — smooth scrolling
 *
 * Lenis smooths the native scroll. When GSAP + ScrollTrigger are on the page,
 * Lenis is driven by gsap.ticker (autoRaf off) so pinned and scrubbed scenes
 * read the same scroll position on the same frame; without GSAP it runs itself
 * (autoRaf on). Under prefers-reduced-motion Lenis is not started at all.
 *
 * In-page links (#ghee, #shop …) scroll through Lenis with an offset for the
 * fixed header.
 */
window.Scroll = (() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ autoRaf: !hasGsap, lerp: 0.08, wheelMultiplier: 0.9 });
    if (hasGsap) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  const headerHeight = () => document.getElementById("nav")?.offsetHeight || 0;

  function to(target, opts = {}) {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (!el) return;
    if (lenis) {
      // A numeric target: given an element, Lenis would also subtract html's
      // scroll-padding-top, doubling the header offset.
      const y = el.getBoundingClientRect().top + lenis.scroll - headerHeight();
      lenis.scrollTo(y, { duration: 1.6, ...opts });
    } else {
      // native jump; html { scroll-padding-top } keeps it clear of the header
      el.scrollIntoView({ block: "start" });
    }
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains("skip")) return;   // the skip link keeps its native focus jump
    const hash = a.getAttribute("href");
    const el = hash.length > 1 && document.getElementById(hash.slice(1));
    if (!el) return;
    e.preventDefault();
    to(el);
    history.pushState(null, "", hash);
  });

  return {
    reduce,
    hasGsap,
    lenis,
    to,
    stop: () => lenis?.stop(),
    start: () => lenis?.start(),
  };
})();
