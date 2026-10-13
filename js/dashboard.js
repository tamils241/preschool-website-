/* =========================================================
   Stackly Preschool - dashboard.js
   Interactions for the admin & parent portals:
     - Off-canvas sidebar toggle (tablet / mobile)
     - Sidebar nav active state
     - Simple child switcher (parent portal)
   ========================================================= */
(function () {
  "use strict";

  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add("revealed");
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseInt(el.getAttribute("data-reveal-delay"), 10) || 0;
          window.setTimeout(function () { el.classList.add("revealed"); }, delay);
          obs.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    for (var j = 0; j < items.length; j++) observer.observe(items[j]);
  }

  function boot() {
    initReveal();

    var side = document.getElementById("dashSide");
    var toggle = document.getElementById("dashToggle");
    var scrim = document.getElementById("dashScrim");

    /* ---------------------------------------------
       Off-canvas sidebar
       --------------------------------------------- */
    if (side && toggle) {
      function openSide() {
        side.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close menu");
        if (scrim) {
          scrim.hidden = false;
          requestAnimationFrame(function () { scrim.classList.add("open"); });
        }
        document.body.style.overflow = "hidden";
      }

      function closeSide() {
        side.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        if (scrim) {
          scrim.classList.remove("open");
          window.setTimeout(function () { scrim.hidden = true; }, 300);
        }
        document.body.style.overflow = "";
      }

      function toggleSide() {
        if (side.classList.contains("open")) closeSide();
        else openSide();
      }

      toggle.addEventListener("click", toggleSide);
      if (scrim) scrim.addEventListener("click", closeSide);

      side.addEventListener("click", function (e) {
        if (window.innerWidth > 991) return;
        if (e.target.closest("a")) closeSide();
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && side.classList.contains("open")) closeSide();
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth > 991 && side.classList.contains("open")) closeSide();
      });
    }

    /* ---------------------------------------------
       Sidebar nav active state (demo)
       --------------------------------------------- */
    var links = Array.prototype.slice.call(document.querySelectorAll(".dash-nav .dash-link"));
    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href");
        if (!href || href === "#") e.preventDefault();
        links.forEach(function (l) {
          l.classList.remove("is-active");
          l.removeAttribute("aria-current");
        });
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      });
    });

    /* ---------------------------------------------
       Child switcher (parent portal)
       --------------------------------------------- */
    var chips = Array.prototype.slice.call(document.querySelectorAll(".child-switch .child-chip"));
    if (chips.length) {
      chips.forEach(function (chip) {
        chip.addEventListener("click", function (e) {
          e.preventDefault();
          chips.forEach(function (c) { c.classList.remove("is-active"); });
          chip.classList.add("is-active");
          var name = chip.getAttribute("data-child");
          var label = document.querySelector("[data-child-name]");
          if (name && label) label.textContent = name;
        });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
