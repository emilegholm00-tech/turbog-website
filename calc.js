// Beregner for skattefri kørselsgodtgørelse 2026. Satserne er de samme som i appen.
(function () {
  const RATE_HIGH = 3.94;
  const RATE_LOW = 2.28;
  const LIMIT = 20000;
  const kr = new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK", maximumFractionDigits: 0 });
  const num = new Intl.NumberFormat("da-DK", { maximumFractionDigits: 0 });

  document.querySelectorAll("[data-calc]").forEach(function (root) {
    const input = root.querySelector("input[type=number]");
    const slider = root.querySelector("input[type=range]");
    const out = (name) => root.querySelector("[data-out=" + name + "]");

    function update(source) {
      const monthKm = Math.max(0, Number(source.value) || 0);
      if (source === input) slider.value = Math.min(monthKm, slider.max);
      else input.value = monthKm;
      const yearKm = monthKm * 12;
      const year = Math.min(yearKm, LIMIT) * RATE_HIGH + Math.max(0, yearKm - LIMIT) * RATE_LOW;
      out("month").textContent = kr.format(year / 12);
      out("year").textContent = kr.format(year);
      out("yearkm").textContent = num.format(yearKm) + " km";
      out("note").textContent = yearKm > LIMIT
        ? "Over 20.000 km om året gælder den lave sats på 2,28 kr./km for resten af året."
        : "Hele året til den høje sats på 3,94 kr./km.";
    }

    input.addEventListener("input", () => update(input));
    slider.addEventListener("input", () => update(slider));
    update(input);
  });
})();
