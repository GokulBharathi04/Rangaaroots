/* Rangaa Roots — four brand films as GSAP timelines on a 1920x1080 stage.
 * 1. Bilona Ghee: the real jar photo, cut into layers: the lid unscrews, ghee pours and fills, the lid is screwed back down.
 * 2-4. Coconut, Thokku, Grains: Mixkit footage, then the products in their generated labels, then the end card.
 * Motion rules: transform/opacity/clip-path only; expo-out for things arriving, inOut for things moving.
 */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const stage = $("#stage"), screen = $("#screen"), play = $("#play"), bar = $("#progress"), reel = $("#reel");
  const { products } = window.RRCatalog;
  const pack = (id) => window.RRLabels.product(products.find((p) => p.id === id));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // the stage is authored at 1080p and scaled to the screen
  new ResizeObserver(([e]) => stage.style.setProperty("--s", e.contentRect.width / 1920)).observe(screen);

  /* ---------- shared pieces ---------- */
  const lines = (arr) => arr.map((l) => `<span class="f-line"><span>${l}</span></span>`).join("");
  const inLines = (tl, el, at) => tl.fromTo(el.querySelectorAll(".f-line > span"), { yPercent: 110 }, { yPercent: 0, duration: 1.15, ease: "expo.out", stagger: 0.12 }, at);
  const outLines = (tl, el, at) => tl.to(el.querySelectorAll(".f-line > span"), { yPercent: -110, duration: 0.6, ease: "power3.inOut", stagger: 0.06 }, at);
  const endCard = (title) => `<div class="f-end"><img src="../assets/img/logo-round-640.webp" alt=""><p>${title}<small>rangaaroots.com</small></p></div>`;
  const playEnd = (tl, at) => {
    const end = $(".f-end", stage);
    tl.to(end, { opacity: 1, duration: 0.8, ease: "power2.out" }, at)
      .fromTo($("img", end), { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: "expo.out" }, at + 0.2)
      .fromTo($("p", end), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out" }, at + 0.45);
  };
  // footage: fade up, start playback, and drift in slowly so the frame never sits dead still
  const footage = (tl, video, at, dur) => {
    tl.call(() => { video.currentTime = 0; video.play().catch(() => {}); }, null, at)
      .fromTo(video, { opacity: 0, scale: 1.08 }, { opacity: 1, duration: 0.9, ease: "power2.out" }, at)
      .to(video, { scale: 1, duration: dur, ease: "none" }, at);
  };

  /* ---------- 1. Bilona ghee ---------- */
  function ghee() {
    stage.innerHTML = `
      <div class="f-layer g-bg"></div>
      <div class="f-copy" id="copy"><p class="f-eyebrow">A2 Cow Ghee</p><div id="l1">${lines(["Hand-churned", "<em>at dawn.</em>"])}</div>
        <p class="f-sub" id="sub">Curd-churned the Bilona way from Kangayam &amp; Gir cow milk, simmered until granular and golden.</p></div>
      <div class="g-card" id="card">
        <img class="g-empty" src="../assets/img/jar/jar-empty.webp" alt="">
        <img class="g-full" src="../assets/img/jar/jar-full.webp" alt="">
        <span class="g-level"></span>
        <span class="g-pour"><span class="g-flow"></span></span>
        <span class="g-drip"></span>
        <span class="g-cap"><img src="../assets/img/jar/jar-lid.webp" alt=""><span class="g-sheen"><i></i></span></span>
        <img class="g-photo" src="../assets/img/jar/jar-sealed.webp" alt="Rangaa Roots A2 Cow Ghee, sealed">
      </div>
      <div class="f-layer f-grain"></div>
      ${endCard("Hand-churned A2 Cow Ghee")}`;
    const card = $("#card"), cap = $(".g-cap", stage), sheen = $(".g-sheen i", stage), pour = $(".g-pour", stage);
    const H = 900; // card height in stage px
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(card, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 1.3, ease: "expo.out" }, 0)
      .to(card, { scale: 1.035, duration: 11, ease: "sine.inOut" }, 1.2)
      .fromTo("#copy .f-eyebrow", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" }, 0.3);
    inLines(tl, $("#l1"), 0.45);
    tl.fromTo("#sub", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, ease: "expo.out" }, 0.9);

    // unscrew: two turns (a light sweep across the lid each turn), rising a little, then lift away
    [1.5, 1.95].forEach((t, i) => {
      tl.fromTo(sheen, { xPercent: -120 }, { xPercent: 380, duration: 0.45, ease: "power2.inOut" }, t)
        .to(cap, { y: -(i + 1) * 5, duration: 0.45, ease: "power2.inOut" }, t);
    });
    tl.to(cap, { yPercent: -190, rotation: -4, duration: 0.85, ease: "power3.inOut" }, 2.45)
      .set(cap, { opacity: 0 }, 3.3);

    // pour: the stream drops in, the column rises at a steady rate (quicker while hidden behind the label)
    tl.to(pour, { scaleY: 1, duration: 0.35, ease: "power2.out" }, 3.15)
      .fromTo(".g-flow", { y: 0 }, { y: 30, duration: 0.45, ease: "none", repeat: 7 }, 3.15)
      .to(".g-full", { keyframes: [
        { clipPath: "inset(88% 0% 0% 0%)", duration: 0.75, ease: "none" },
        { clipPath: "inset(27.4% 0% 0% 0%)", duration: 1.22, ease: "none" },
        { clipPath: "inset(10.6% 0% 0% 0%)", duration: 1.43, ease: "power1.out" } ] }, 3.3)
      .fromTo(".g-level", { y: H, opacity: 1 }, { immediateRender: false, keyframes: [
        { y: H * 0.88, duration: 0.75, ease: "none" },
        { opacity: 0, duration: 0.05 }, { y: H * 0.274, duration: 1.17, ease: "none" }, { opacity: 1, duration: 0.05 },
        { y: H * 0.106, duration: 1.38, ease: "power1.out" }, { opacity: 0, duration: 0.2 } ] }, 3.3)
      .to(pour, { transformOrigin: "50% 100%", scaleY: 0, duration: 0.3, ease: "power2.in" }, 6.55)
      .fromTo(".g-drip", { top: "20%", opacity: 1 }, { top: "30%", opacity: 0, duration: 0.45, ease: "power2.in", immediateRender: false }, 6.85);

    // close: the lid comes back, lands, and is screwed down with two turns
    tl.set(cap, { opacity: 1 }, 7.0)
      .fromTo(cap, { yPercent: -190, y: -10, rotation: -3 }, { yPercent: 0, rotation: 0, duration: 0.75, ease: "power3.out", immediateRender: false }, 7.0);
    [7.8, 8.25].forEach((t, i) => {
      tl.fromTo(sheen, { xPercent: -120 }, { xPercent: 380, duration: 0.45, ease: "power2.inOut", immediateRender: false }, t)
        .to(cap, { y: -5 + (i + 1) * 5, duration: 0.45, ease: "power2.inOut" }, t);
    });
    tl.to(".g-photo", { opacity: 1, duration: 0.6, ease: "power1.inOut" }, 8.9);

    // copy hands over, then the end card
    outLines(tl, $("#l1"), 8.9);
    tl.to("#sub", { opacity: 0, y: -10, duration: 0.5, ease: "power2.inOut" }, 8.9);
    const l2 = document.createElement("div");
    l2.innerHTML = lines(["Sealed in glass.", "<em>Rooted in tradition.</em>"]);
    l2.style.cssText = "position:absolute;left:0;top:52px;width:760px;font-size:0";
    l2.querySelectorAll(".f-line > span").forEach((s) => (s.style.fontSize = "96px"));
    $("#copy").appendChild(l2);
    gsap.set(l2.querySelectorAll(".f-line > span"), { yPercent: 110 });
    inLines(tl, l2, 9.45);
    playEnd(tl, 11.6);
    return tl.to({}, { duration: 2.2 }, 11.6);
  }

  /* ---------- 2-4. footage films ---------- */
  function footageFilm({ clips, captions, packs, end, eyebrow }) {
    return () => {
      stage.innerHTML = `
        ${clips.map((c, i) => `<video class="f-video" src="clips/${c}.mp4" data-start="${i * 4.4}" muted playsinline preload="auto"></video>`).join("")}
        <div class="f-shade" style="background:linear-gradient(180deg,rgba(11,34,22,.15) 0%,rgba(11,34,22,0) 40%,rgba(11,34,22,.75) 100%)"></div>
        <div class="f-shade" id="dim" style="background:rgba(11,34,22,.72);opacity:0"></div>
        ${captions.map((c, i) => `<div class="f-caption" id="c${i}">${i === 0 ? `<p class="f-eyebrow">${eyebrow}</p>` : ""}${lines(c)}</div>`).join("")}
        <div class="f-caption" id="cp" style="top:110px;bottom:auto">${lines(["<em>" + end + "</em>"])}</div>
        <div class="f-row" id="row">${packs.map(pack).join("")}</div>
        <div class="f-layer f-grain"></div>
        ${endCard(end)}`;
      const videos = [...stage.querySelectorAll("video")];
      const tl = gsap.timeline({ paused: true });
      gsap.set(stage.querySelectorAll(".f-line > span"), { yPercent: 110 });
      // two shots, 4.6s each, crossfading
      footage(tl, videos[0], 0, 5.6);
      footage(tl, videos[1], 4.4, 5.6);
      tl.fromTo("#c0 .f-eyebrow", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" }, 0.5);
      inLines(tl, $("#c0"), 0.7);
      outLines(tl, $("#c0"), 3.9);
      tl.to("#c0 .f-eyebrow", { opacity: 0, duration: 0.4 }, 3.9);
      inLines(tl, $("#c1"), 4.9);
      outLines(tl, $("#c1"), 8.2);
      // the range: footage dims, packs rise in one after another
      tl.to("#dim", { opacity: 1, duration: 0.8, ease: "power2.inOut" }, 8.4);
      inLines(tl, $("#cp"), 8.8);
      tl.fromTo("#row .pack", { y: 140, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.12 }, 8.9)
        .to("#row .pack", { y: -10, duration: 1.6, ease: "sine.inOut", stagger: 0.12, yoyo: true, repeat: 1 }, 10.1);
      playEnd(tl, 12.6);
      tl.call(() => videos.forEach((v) => v.pause()), null, 13.4);
      return tl.to({}, { duration: 2 }, 12.6);
    };
  }

  const FILMS = [
    { id: "ghee", title: "Bilona Ghee", meta: "Open · Fill · Seal", build: ghee },
    { id: "coconut", title: "The Coconut Range", meta: "Mixkit footage + 4 products", build: footageFilm({
      eyebrow: "Coconut range", clips: ["coconut-palms", "coconuts-opened"],
      captions: [["From the palms", "<em>of Pollachi.</em>"], ["Tapped, pressed,", "<em>never refined.</em>"]],
      packs: ["coconut-sugar", "virgin-coconut-oil", "palm-sugar", "coconut-milk-shampoo"], end: "The coconut range" }) },
    { id: "thokku", title: "Thokku", meta: "Mixkit footage + 5 products", build: footageFilm({
      eyebrow: "Thokku", clips: ["chili-powder", "small-onion"],
      captions: [["Slow-cooked", "<em>in gingelly oil.</em>"], ["Small batches,", "<em>stone-ground.</em>"]],
      packs: ["karuveppilai-thokku", "vallarai-thokku", "small-onion-thokku", "vazhaipoo-thokku", "tomato-thokku"], end: "Five thokku, one kitchen" }) },
    { id: "grains", title: "Native Grains", meta: "Mixkit footage + 5 products", build: footageFilm({
      eyebrow: "Millets & heritage rice", clips: ["rice-falling", "farmer-rice"],
      captions: [["Native grains,", "<em>single-polished.</em>"], ["Grown the old way,", "<em>by our farmers.</em>"]],
      packs: ["kodo-millet", "foxtail-millet", "emperors-rice", "bridegroom-rice", "sprouted-dal"], end: "Millets & heritage rice" }) },
  ];

  /* ---------- player ---------- */
  let tl, current = 0;
  reel.innerHTML = FILMS.map((f, i) => `<button role="tab" aria-selected="${i === 0}" data-i="${i}"><b>${f.title}</b><small>${f.meta}</small></button>`).join("");

  // rendered MP4s (films/renders), one per film; sizes are filled in from the server
  const mp4 = (f) => `renders/rangaa-roots-${f.id}.mp4`;
  $("#dlList").innerHTML = FILMS.map((f) => `<li><b>${f.title}</b><span data-size="${f.id}">MP4 · 1080p</span>
    <a class="dl-btn dl-btn--ghost" href="${mp4(f)}" download><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg> Download</a></li>`).join("");
  FILMS.forEach((f) => fetch(mp4(f), { method: "HEAD" }).then((r) => {
    const mb = +r.headers.get("content-length") / 1048576;
    if (r.ok && mb) $(`[data-size="${f.id}"]`).textContent = `MP4 · 1080p · ${mb.toFixed(1)} MB`;
  }).catch(() => {}));

  const load = (i, autoplay) => {
    tl?.kill();
    stage.querySelectorAll("video").forEach((v) => v.pause());
    current = i;
    reel.querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-selected", j === i));
    $("#nowTitle").textContent = FILMS[i].title;
    $("#nowDownload").href = mp4(FILMS[i]);
    tl = FILMS[i].build();
    tl.eventCallback("onUpdate", () => { bar.style.transform = `scaleX(${tl.progress()})`; });
    tl.eventCallback("onComplete", () => { play.hidden = false; play.setAttribute("aria-label", "Replay film"); });
    bar.style.transform = "scaleX(0)";
    if (autoplay) { play.hidden = true; tl.play(0); }
    else { play.hidden = false; tl.progress(0.0001).pause(); }
  };
  // resume a paused film; replay a finished one
  play.addEventListener("click", () => {
    play.hidden = true;
    if (tl.progress() > 0.001 && tl.progress() < 1) { tl.resume(); stage.querySelectorAll("video").forEach((v) => v.style.opacity > 0 && v.play().catch(() => {})); }
    else tl.restart();
  });
  window.RRFilms = { get timeline() { return tl; } }; // for frame-by-frame review in devtools
  reel.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) load(+b.dataset.i, true); });
  // pause with the tab: GSAP keeps time, the footage does not
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && tl?.isActive()) { tl.pause(); stage.querySelectorAll("video").forEach((v) => v.pause()); play.hidden = false; }
  });

  const start = new URLSearchParams(location.search).get("film");
  const idx = Math.max(0, FILMS.findIndex((f) => f.id === start));
  document.fonts.ready.then(() => load(idx, !reduce));
})();
