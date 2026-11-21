/* [Commit 5] Bonus: live countdown to the event start that stops at zero */
(function () {
  const el = document.getElementById("countdown");
  if (!el) return;

  const start = new Date(el.dataset.start).getTime();
  if (Number.isNaN(start)) return;

  let timer;

  function tick() {
    const diff = start - Date.now();

    if (diff <= 0) {
      el.textContent = "TechFest 2026 has started!";
      clearInterval(timer); // stop updating
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    el.textContent = "Starts in " + days + "d " + hours + "h " + minutes + "m " + seconds + "s";
  }

  timer = setInterval(tick, 1000);
  tick();
})();
