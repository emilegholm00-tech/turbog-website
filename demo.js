// Den animerede telefon på forsiden. Tallene passer med appens eksempeldata:
// 10,8 km × 3,94 kr. = 42,55 kr., og november går fra 387,8 km / 1.527,87 kr. til 398,6 km / 1.570,42 kr.
(function () {
  const phone = document.querySelector(".demo");
  if (!phone) return;
  const km = phone.querySelector(".km");
  const monthKm = phone.querySelector("[data-month-km]");
  const monthKr = phone.querySelector("[data-month-kr]");
  const n1 = new Intl.NumberFormat("da-DK", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const n2 = new Intl.NumberFormat("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const set = (...names) => { phone.className = "phone demo " + names.join(" "); };

  function count(from, to, ms, draw) {
    return new Promise((done) => {
      const start = performance.now();
      (function step(now) {
        const t = Math.min(1, (now - start) / ms);
        draw(from + (to - from) * (1 - Math.pow(1 - t, 3)));
        t < 1 ? requestAnimationFrame(step) : done();
      })(start);
    });
  }

  function placeTap() {
    // Fingeren rammer midt på "Erhverv"-knappen, uanset hvor stor telefonen er.
    const btn = phone.querySelector(".btn-b").getBoundingClientRect();
    const screen = phone.querySelector(".screen").getBoundingClientRect();
    const tap = phone.querySelector(".tap");
    tap.style.left = btn.left - screen.left + btn.width / 2 + "px";
    tap.style.top = btn.top - screen.top + btn.height / 2 + "px";
  }

  async function loop() {
    for (;;) {
      set();
      km.textContent = "0,0 km";
      await wait(900);
      set("driving");
      await wait(500);
      await count(0, 10.8, 2600, (v) => (km.textContent = n1.format(v) + " km"));
      await wait(700);
      set();
      await wait(600);
      set("notify");
      await wait(1500);
      placeTap();
      set("notify", "pressed");
      await wait(450);
      set("counted");
      await wait(350);
      set("counted", "saved");
      await Promise.all([
        count(387.8, 398.6, 1400, (v) => (monthKm.textContent = n1.format(v))),
        count(1527.87, 1570.42, 1400, (v) => (monthKr.textContent = n2.format(v))),
      ]);
      await wait(2600);
      set("counted");
      await wait(900);
    }
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) loop();
})();
