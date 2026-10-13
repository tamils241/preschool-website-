/* =========================================================
   Stackly Preschool - slider.js
   Two reusable sliders built with vanilla JS:
     - Hero image carousel  [data-slider]
     - Testimonials slider  [data-testi]
   Both support autoplay, arrows, dots, keyboard and swipe.
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
     Hero carousel
     --------------------------------------------------------- */
  function initHeroSlider(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll(".slide"));
    if (slides.length <= 1) {
      if (slides[0]) slides[0].classList.add("active");
      return;
    }

    var prevBtn = root.querySelector(".slider__arrow.prev");
    var nextBtn = root.querySelector(".slider__arrow.next");
    var dotsWrap = root.querySelector("[data-slider-dots]");
    var caption = root.querySelector("[data-slider-caption]");
    var captions = slides.map(function (s) { return s.getAttribute("data-caption") || ""; });
    var index = slides.findIndex(function (s) { return s.classList.contains("active"); });
    if (index < 0) index = 0;

    var timer = null;
    var delay = parseInt(root.getAttribute("data-autoplay"), 10) || 5000;
    var paused = false;

    // Build dots
    var dots = [];
    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      slides.forEach(function (_, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Go to slide " + (i + 1));
        b.addEventListener("click", function () { goTo(i); restart(); });
        dotsWrap.appendChild(b);
        dots.push(b);
      });
    }

    function render() {
      slides.forEach(function (s, i) { s.classList.toggle("active", i === index); });
      dots.forEach(function (d, i) {
        d.classList.toggle("active", i === index);
        d.setAttribute("aria-current", i === index ? "true" : "false");
      });
      if (caption && captions[index]) caption.textContent = captions[index];
      slides.forEach(function (s, i) {
        s.setAttribute("aria-hidden", i === index ? "false" : "true");
      });
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function start() {
      if (prefersReduced || paused) return;
      stop();
      timer = window.setInterval(next, delay);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    function restart() { stop(); start(); }

    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });

    root.addEventListener("mouseenter", function () { paused = true; stop(); });
    root.addEventListener("mouseleave", function () { paused = false; start(); });
    root.addEventListener("focusin", function () { paused = true; stop(); });
    root.addEventListener("focusout", function () { paused = false; start(); });

    // Pause when the tab is hidden
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });

    // Touch swipe
    var startX = 0;
    root.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    root.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) { dx < 0 ? next() : prev(); restart(); }
    }, { passive: true });

    render();
    start();
  }

  /* ---------------------------------------------------------
     Testimonials slider
     --------------------------------------------------------- */
  function initTestiSlider(root) {
    var track = root.querySelector("[data-testi-track]");
    if (!track) return;
    var slides = Array.prototype.slice.call(track.children);
    if (!slides.length) return;

    var nextBtn = root.querySelector("[data-testi-next]");
    var prevBtn = root.querySelector("[data-testi-prev]");
    var dotsWrap = root.querySelector("[data-testi-dots]");
    var index = 0;
    var timer = null;
    var delay = parseInt(root.getAttribute("data-autoplay"), 10) || 6000;
    var paused = false;

    var dots = [];
    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      slides.forEach(function (_, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Show testimonial " + (i + 1));
        b.addEventListener("click", function () { goTo(i); restart(); });
        dotsWrap.appendChild(b);
        dots.push(b);
      });
    }

    function render() {
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      dots.forEach(function (d, i) {
        d.classList.toggle("active", i === index);
        d.setAttribute("aria-current", i === index ? "true" : "false");
      });
      slides.forEach(function (s, i) {
        s.setAttribute("aria-hidden", i === index ? "false" : "true");
      });
    }

    function goTo(i) { index = (i + slides.length) % slides.length; render(); }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function start() {
      if (prefersReduced || paused || slides.length <= 1) return;
      stop();
      timer = window.setInterval(next, delay);
    }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });

    root.addEventListener("mouseenter", function () { paused = true; stop(); });
    root.addEventListener("mouseleave", function () { paused = false; start(); });
    root.addEventListener("focusin", function () { paused = true; stop(); });
    root.addEventListener("focusout", function () { paused = false; start(); });

    var startX = 0;
    root.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) { dx < 0 ? next() : prev(); restart(); }
    }, { passive: true });

    render();
    start();
  }

  ready(function () {
    document.querySelectorAll("[data-slider]").forEach(initHeroSlider);
    document.querySelectorAll("[data-testi]").forEach(initTestiSlider);
  });
})();
