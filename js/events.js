/* =========================================================
   Stackly Preschool - events.js
   Category filtering for the Events page.

   Markup contract:
     <div data-filter-group="events">
       <button class="filter-btn active" data-filter="all">All</button>
       <button class="filter-btn" data-filter="celebrations">Celebrations</button>
     </div>
     <div class="grid grid-3" data-filter-items="events">
       <article class="filter-item" data-category="celebrations">...</article>
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

  function applyFilter(value) {
    var container = document.querySelector('[data-filter-items="events"]');
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

    var live = document.querySelector('[data-filter-live="events"]');
    if (live) live.textContent = shown + (shown === 1 ? " event shown" : " events shown");

    var empty = document.querySelector('[data-filter-empty="events"]');
    if (empty) empty.hidden = shown !== 0;
  }

  function init() {
    var group = document.querySelector('[data-filter-group="events"]');
    if (!group) return;
    var buttons = group.querySelectorAll(".filter-btn");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
        applyFilter(btn.getAttribute("data-filter") || "all");
      });
    });
  }

  ready(init);
})();
