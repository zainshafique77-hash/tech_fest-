/* [Commit 4] Dark mode toggle that remembers the choice */
(function () {
  const KEY = "techfest-theme";
  const root = document.documentElement;

  // Apply the saved choice immediately to avoid a flash of the wrong theme
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") {
      root.dataset.theme = saved;
    }
  } catch (e) {
    /* localStorage can be blocked; fall back to the OS preference */
  }

  function isDark() {
    if (root.dataset.theme) return root.dataset.theme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("theme-toggle");
    if (!button) return;

    function updateLabel() {
      button.textContent = isDark() ? "Switch to light" : "Switch to dark";
    }

    button.addEventListener("click", function () {
      const next = isDark() ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem(KEY, next);
      } catch (e) {
        /* ignore */
      }
      updateLabel();
    });

    updateLabel();
  });
})();
