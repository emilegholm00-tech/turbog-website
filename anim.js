// Starter animationerne på forsiden, når en sektion rulles ind på skærmen,
// og tæller tallene op. Ønsker brugeren mindre bevægelse, vises slutbilledet med det samme.
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = (n, dec) => n.toLocaleString("da-DK", { minimumFractionDigits: dec, maximumFractionDigits: dec });

  function count(el) {
    const target = Number(el.dataset.count);
    const dec = Number(el.dataset.dec || 0);
    if (reduce) { el.textContent = fmt(target, dec); return; }
    const start = performance.now();
    const ms = 1400;
    (function tick(now) {
      const t = Math.min(1, (now - start) / ms);
      el.textContent = fmt(target * (1 - Math.pow(1 - t, 3)), dec);
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  function show(el) {
    el.classList.add("is-in");
    el.querySelectorAll("[data-count]").forEach((c) => setTimeout(() => count(c), reduce ? 0 : 500));
  }

  const items = document.querySelectorAll("[data-anim]");
  if (reduce || !("IntersectionObserver" in window)) { items.forEach(show); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.3 });
  items.forEach((el) => io.observe(el));
})();
