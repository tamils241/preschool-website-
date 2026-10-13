/* =========================================================
   Stackly Preschool - activities.js
   Category filtering for the Activities page.
   Reuses the same [data-filter-group] / [data-filter-items]
   convention as the gallery for a consistent pattern.

   Markup contract:
     <div data-filter-group="activities">
       <button class="filter-btn active" data-filter="all">All</button>
       ...
     </div>
     <div class="grid grid-3" data-filter-items="activities">
       <article class="filter-item" data-category="art music">...</article>
     </div>
   ========================================================= */
(function () {
  "use strict";

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function applyFilter(groupName, value) {
    var container = document.querySelector('[data-filter-items="' + groupName + '"]');
    if (!container) return;

    var items = container.querySelectorAll(".filter-item");
    var shown = 0;

    items.forEach(function (item) {
      var cats = (item.getAttribute("data-category") || "").split(/\s+/);
      var show = value === "all" || cats.indexOf(value) !== -1;
      item.classList.toggle("is-hidden", !show);
      if (show) {
        shown++;
        item.classList.remove("reveal-in");
        void item.offsetWidth;
        if (!prefersReduced) item.classList.add("reveal-in");
      }
    });

    // Announce result count for screen readers
    var live = document.querySelector('[data-filter-live="' + groupName + '"]');
    if (live) {
      live.textContent = shown + (shown === 1 ? " activity shown" : " activities shown");
    }

    // Optional empty state
    var empty = document.querySelector('[data-filter-empty="' + groupName + '"]');
    if (empty) empty.hidden = shown !== 0;
  }

  function init() {
    var groups = document.querySelectorAll('[data-filter-group="activities"]');
    groups.forEach(function (group) {
      var buttons = group.querySelectorAll(".filter-btn");
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          buttons.forEach(function (b) {
            b.classList.remove("active");
            b.setAttribute("aria-pressed", "false");
          });
          btn.classList.add("active");
          btn.setAttribute("aria-pressed", "true");
          applyFilter("activities", btn.getAttribute("data-filter") || "all");
        });
      });
    });
  }

  ready(init);
})();
