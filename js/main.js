/* =========================================================
   Stackly Preschool - main.js
   Global interactions shared by every page:
     - Scroll reveal (IntersectionObserver)
     - Animated statistics counters
     - FAQ accordion
     - Newsletter validation
     - Back-to-top + scroll progress
     - Sticky-header offset for in-page anchors
   Runs after navigation.js so injected markup exists.
   ========================================================= */
(function () {
  "use strict";

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  /* ---------------------------------------------------------
     1. Scroll reveal
     --------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (prefersReduced || !("IntersectionObserver" in window)) {
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
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    for (var j = 0; j < items.length; j++) observer.observe(items[j]);
  }

  /* ---------------------------------------------------------
     2. Animated statistics
     --------------------------------------------------------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = parseInt(el.getAttribute("data-duration"), 10) || 1600;
    var decimals = (el.getAttribute("data-decimals") && parseInt(el.getAttribute("data-decimals"), 10)) || 0;
    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = (target * eased).toFixed(decimals);
      el.textContent = Number(value).toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }) + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  function initStats() {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      for (var i = 0; i < nums.length; i++) {
        var t = parseFloat(nums[i].getAttribute("data-count")) || 0;
        var s = nums[i].getAttribute("data-suffix") || "";
        nums[i].textContent = t.toLocaleString() + s;
      }
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    for (var j = 0; j < nums.length; j++) observer.observe(nums[j]);
  }

  /* ---------------------------------------------------------
     3. FAQ accordion
     --------------------------------------------------------- */
  function initFaq() {
    var faqItems = document.querySelectorAll(".faq-item");
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var btn = item.querySelector(".faq-q");
      var answer = item.querySelector(".faq-a");
      if (!btn || !answer) return;

      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");

        // close others (single-open accordion)
        faqItems.forEach(function (other) {
          if (other !== item) {
            other.classList.remove("open");
            var a = other.querySelector(".faq-a");
            if (a) a.style.maxHeight = "";
            var b = other.querySelector(".faq-q");
            if (b) b.setAttribute("aria-expanded", "false");
          }
        });

        if (isOpen) {
          item.classList.remove("open");
          answer.style.maxHeight = "";
          btn.setAttribute("aria-expanded", "false");
        } else {
          item.classList.add("open");
          answer.style.maxHeight = answer.scrollHeight + "px";
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

    // Keep open panels sized correctly on resize
    window.addEventListener("resize", function () {
      document.querySelectorAll(".faq-item.open .faq-a").forEach(function (a) {
        a.style.maxHeight = a.scrollHeight + "px";
      });
    });
  }

  /* ---------------------------------------------------------
     4. Newsletter validation (footer + inline forms)
     --------------------------------------------------------- */
  function showNewsletterMsg(form, text, ok) {
    var msg = form.parentNode.querySelector("[data-newsletter-msg]");
    if (!msg) return;
    msg.textContent = text;
    msg.className = "newsletter-msg " + (ok ? "ok" : "err");
  }

  function initNewsletter() {
    var forms = document.querySelectorAll("[data-newsletter]");
    if (!forms.length) return;

    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    forms.forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        if (!input) return;
        var value = input.value.trim();

        if (!value) {
          showNewsletterMsg(form, "Please enter your email address.", false);
          input.focus();
          return;
        }
        if (!emailRe.test(value)) {
          showNewsletterMsg(form, "Please enter a valid email address.", false);
          input.focus();
          return;
        }

        showNewsletterMsg(form, "Thank you! You are subscribed to Stackly updates.", true);
        form.reset();
      });
    });
  }

  /* ---------------------------------------------------------
     5. Back-to-top + scroll progress
     --------------------------------------------------------- */
  function ensureBackToTop() {
    var btn = document.getElementById("backToTop");
    if (btn) return btn;
    btn = document.createElement("button");
    btn.id = "backToTop";
    btn.className = "back-to-top";
    btn.type = "button";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(btn);
    return btn;
  }

  function ensureProgressBar() {
    var bar = document.getElementById("scrollProgress");
    if (bar) return bar;
    bar = document.createElement("div");
    bar.id = "scrollProgress";
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    return bar;
  }

  function initScrollUi() {
    var btn = ensureBackToTop();
    var bar = ensureProgressBar();

    var ticking = false;

    function update() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + "%";
      btn.classList.toggle("show", scrollTop > 420);
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------------------
     6. Smooth in-page anchors with sticky-header offset
     --------------------------------------------------------- */
  function initAnchors() {
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var hash = link.getAttribute("href");
      if (!hash || hash === "#" || hash.length < 2) return;

      var target = document.getElementById(hash.slice(1));
      if (!target) return;

      e.preventDefault();
      var navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
        10
      ) || 76;
      var top = target.getBoundingClientRect().top + window.scrollY - navH - 14;
      window.scrollTo({ top: top, behavior: prefersReduced ? "auto" : "smooth" });

      if (history.replaceState) history.replaceState(null, "", hash);
    });
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  ready(function () {
    initReveal();
    initStats();
    initFaq();
    initNewsletter();
    initScrollUi();
    initAnchors();
  });
})();
