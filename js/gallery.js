/* =========================================================
   Stackly Preschool - gallery.js
   Gallery / activity style category filtering + a fully
   accessible image lightbox with next, previous and close.

   Markup contract:
     <div data-filter-group="gallery">
       <button class="filter-btn active" data-filter="all">All</button>
       <button class="filter-btn" data-filter="classrooms">Classrooms</button>
     </div>
     <div class="gallery-grid" data-filter-items="gallery">
       <figure class="gallery-item filter-item" data-category="classrooms"
               tabindex="0" role="button" aria-label="Open image: ...">
         <img src="..." alt="..." data-caption="...">
       </figure>
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

  /* ---------------------------------------------------------
     Filtering (also used by activities.js / events.js patterns)
     --------------------------------------------------------- */
  function applyFilter(groupName, value) {
    var container = document.querySelector('[data-filter-items="' + groupName + '"]');
    if (!container) return;
    var items = container.querySelectorAll(".filter-item");

    items.forEach(function (item) {
      var cats = (item.getAttribute("data-category") || "").split(/\s+/);
      var show = value === "all" || cats.indexOf(value) !== -1;
      item.classList.toggle("is-hidden", !show);
      if (show) {
        item.classList.remove("reveal-in");
        // force reflow so the animation can replay
        void item.offsetWidth;
        if (!prefersReduced) item.classList.add("reveal-in");
      }
    });
  }

  function initFilters() {
    var groups = document.querySelectorAll("[data-filter-group]");
    groups.forEach(function (group) {
      var name = group.getAttribute("data-filter-group");
      var buttons = group.querySelectorAll(".filter-btn");

      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          buttons.forEach(function (b) {
            b.classList.remove("active");
            b.setAttribute("aria-pressed", "false");
          });
          btn.classList.add("active");
          btn.setAttribute("aria-pressed", "true");
          applyFilter(name, btn.getAttribute("data-filter") || "all");
        });
      });

      // set initial aria-pressed state
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", b.classList.contains("active") ? "true" : "false");
      });
    });
  }

  /* ---------------------------------------------------------
     Lightbox
     --------------------------------------------------------- */
  function buildLightbox() {
    if (document.getElementById("lightbox")) return document.getElementById("lightbox");

    var lb = document.createElement("div");
    lb.id = "lightbox";
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Image viewer");
    lb.setAttribute("aria-hidden", "true");
    lb.innerHTML =
      '<div class="lightbox__figure">' +
        '<img id="lightboxImg" src="" alt="" />' +
        '<p class="lightbox__caption" id="lightboxCaption"></p>' +
        '<p class="lightbox__count" id="lightboxCount"></p>' +
      "</div>" +
      '<button class="lightbox__btn lightbox__close" type="button" aria-label="Close image viewer">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<button class="lightbox__btn lightbox__prev" type="button" aria-label="Previous image">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>' +
      '<button class="lightbox__btn lightbox__next" type="button" aria-label="Next image">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>';

    document.body.appendChild(lb);
    return lb;
  }

  function initLightbox() {
    var triggers = document.querySelectorAll("[data-lightbox]");
    if (!triggers.length) return;

    var lb = buildLightbox();
    var imgEl = lb.querySelector("#lightboxImg");
    var capEl = lb.querySelector("#lightboxCaption");
    var countEl = lb.querySelector("#lightboxCount");
    var closeBtn = lb.querySelector(".lightbox__close");
    var prevBtn = lb.querySelector(".lightbox__prev");
    var nextBtn = lb.querySelector(".lightbox__next");

    var current = 0;
    var lastFocused = null;

    function size() {
      return triggers.length;
    }

    function visibleTriggerList() {
      // only cycle through images currently visible after filtering
      var list = [];
      triggers.forEach(function (t) {
        if (!t.classList.contains("is-hidden") && !t.closest(".is-hidden")) list.push(t);
      });
      return list.length ? list : Array.prototype.slice.call(triggers);
    }

    function show(trigger) {
      if (!trigger) return;
      var img = trigger.querySelector("img");
      if (!img) return;
      var list = visibleTriggerList();
      current = list.indexOf(trigger);
      imgEl.src = img.getAttribute("data-full") || img.currentSrc || img.src;
      imgEl.alt = img.getAttribute("alt") || "";
      capEl.textContent = img.getAttribute("data-caption") || img.getAttribute("alt") || "";
      countEl.textContent = (current + 1) + " / " + list.length;
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function close() {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    }

    function move(dir) {
      var list = visibleTriggerList();
      if (!list.length) return;
      var pos = list.findIndex(function (t) { return t === triggers[current]; });
      if (pos < 0) pos = current;
      pos = (pos + dir + list.length) % list.length;
      var img = list[pos].querySelector("img");
      if (!img) return;
      current = Array.prototype.indexOf.call(triggers, list[pos]);
      imgEl.src = img.getAttribute("data-full") || img.currentSrc || img.src;
      imgEl.alt = img.getAttribute("alt") || "";
      capEl.textContent = img.getAttribute("data-caption") || img.getAttribute("alt") || "";
      countEl.textContent = (pos + 1) + " / " + list.length;
    }

    triggers.forEach(function (t) {
      t.addEventListener("click", function () { lastFocused = t; show(t); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          lastFocused = t;
          show(t);
        }
      });
    });

    closeBtn.addEventListener("click", close);
    nextBtn.addEventListener("click", function () { move(1); });
    prevBtn.addEventListener("click", function () { move(-1); });

    lb.addEventListener("click", function (e) {
      if (e.target === lb) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") move(1);
      else if (e.key === "ArrowLeft") move(-1);
    });
  }

  ready(function () {
    initFilters();
    initLightbox();
  });
})();
