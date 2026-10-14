/* =========================================================
   Stackly Preschool - navigation.js
   Injects the shared announcement bar, header/navigation and
   footer into every page, then wires up the mobile menu,
   active-link highlighting and accessibility behaviour.

   Each page only needs two placeholders:
     <div data-component="header"></div>
     <div data-component="footer"></div>
   and a  <body data-page="home">  data attribute.
   ========================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     Shared config (single source of truth for all pages)
     --------------------------------------------------------- */
  var SITE = {
    name: "Stackly",
    tagline: "Early Learning",
    phone: "+1 (555) 012-3456",
    phoneHref: "tel:+15550123456",
    email: "hello@stacklypreschool.com",
    address: "128 Sunny Meadow Lane, Greenfield, CA 90210",
    hours: "Mon – Fri: 7:30 AM – 6:00 PM",
    programs: [
      { label: "Toddler Program", href: "programs.html#toddler" },
      { label: "Playgroup", href: "programs.html#playgroup" },
      { label: "Nursery", href: "programs.html#nursery" },
      { label: "Lower Kindergarten", href: "programs.html#lkg" },
      { label: "Upper Kindergarten", href: "programs.html#ukg" }
    ],
    legal: [
      { label: "Privacy Policy", href: "404.html" },
      { label: "Terms & Conditions", href: "404.html" }
    ]
  };

  var NAV_LINKS = [
    { label: "Home", href: "index.html", page: "home" },
    { label: "About", href: "about.html", page: "about" },
    { label: "Programs", href: "programs.html", page: "programs" },
    { label: "Admissions", href: "admissions.html", page: "admissions" },
    { label: "Facilities", href: "facilities.html", page: "facilities" },
    { label: "Activities", href: "activities.html", page: "activities" },
    { label: "Gallery", href: "gallery.html", page: "gallery" },
    { label: "Teachers", href: "teachers.html", page: "teachers" },
    { label: "Events", href: "events.html", page: "events" },
    { label: "Contact", href: "contact.html", page: "contact" }
  ];

  var SOCIALS = [
    { name: "Facebook", href: "404.html", path: "M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8v2.8h2.5V21h3z" },
    { name: "Instagram", href: "404.html", path: "M12 8.6A3.4 3.4 0 1 0 15.4 12 3.4 3.4 0 0 0 12 8.6zm0 5.6A2.2 2.2 0 1 1 14.2 12 2.2 2.2 0 0 1 12 14.2zM16.9 6.5a.8.8 0 1 0 .8.8.8.8 0 0 0-.8-.8zM12 4.6c1.9 0 2.1 0 2.9.1a3.9 3.9 0 0 1 1.3.2 2.3 2.3 0 0 1 1.3 1.3 3.9 3.9 0 0 1 .2 1.3c0 .8.1 1 .1 2.9s0 2.1-.1 2.9a3.9 3.9 0 0 1-.2 1.3 2.3 2.3 0 0 1-1.3 1.3 3.9 3.9 0 0 1-1.3.2c-.8 0-1 .1-2.9.1s-2.1 0-2.9-.1a3.9 3.9 0 0 1-1.3-.2 2.3 2.3 0 0 1-1.3-1.3 3.9 3.9 0 0 1-.2-1.3c0-.8-.1-1-.1-2.9s0-2.1.1-2.9a3.9 3.9 0 0 1 .2-1.3 2.3 2.3 0 0 1 1.3-1.3 3.9 3.9 0 0 1 1.3-.2c.8 0 1-.1 2.9-.1M12 3.4c-1.9 0-2.2 0-2.9.1a5.2 5.2 0 0 0-1.7.3 3.5 3.5 0 0 0-2 2 5.2 5.2 0 0 0-.3 1.7c0 .7-.1 1-.1 2.9s0 2.2.1 2.9a5.2 5.2 0 0 0 .3 1.7 3.5 3.5 0 0 0 2 2 5.2 5.2 0 0 0 1.7.3c.7 0 1 .1 2.9.1s2.2 0 2.9-.1a5.2 5.2 0 0 0 1.7-.3 3.5 3.5 0 0 0 2-2 5.2 5.2 0 0 0 .3-1.7c0-.7.1-1 .1-2.9s0-2.2-.1-2.9a5.2 5.2 0 0 0-.3-1.7 3.5 3.5 0 0 0-2-2 5.2 5.2 0 0 0-1.7-.3c-.7 0-1-.1-2.9-.1z" },
    { name: "YouTube", href: "404.html", path: "M21.6 8.2a2.5 2.5 0 0 0-1.7-1.8C18.3 6 12 6 12 6s-6.3 0-7.9.4a2.5 2.5 0 0 0-1.7 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 3.8 2.5 2.5 0 0 0 1.7 1.8C5.7 18 12 18 12 18s6.3 0 7.9-.4a2.5 2.5 0 0 0 1.7-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-3.8zM10 15V9l5.2 3z" },
    { name: "X", href: "404.html", path: "M17.5 4h2.9l-6.4 7.3L21.6 20h-5.9l-4.1-5.4L6.8 20H3.9l6.8-7.8L3 4h6l3.7 4.9zm-1 14h1.6L7.6 5.5H5.9z" }
  ];

  /* ---------------------------------------------------------
     Tiny helpers
     --------------------------------------------------------- */
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function svg(path, cls) {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"' +
      (cls ? ' class="' + cls + '"' : "") + '><path d="' + path + '"/></svg>';
  }

  function logoMarkup() {
    return '' +
      '<a href="index.html" class="logo" aria-label="' + SITE.name + " home\">" +
        '<img src="images/logo/logo.webp" alt="' + SITE.name + '" class="logo-img" width="151" height="44" />' +
      "</a>";
  }

  function socialsMarkup(cls) {
    return SOCIALS.map(function (s) {
      return '<a class="social" href="' + s.href + '" aria-label="' + esc(s.name) + '"' +
        (s.href === "#" ? ' rel="nofollow"' : "") + ">" + svg(s.path) + "</a>";
    }).join("");
  }

  /* ---------------------------------------------------------
     Build the header + mobile panel
     --------------------------------------------------------- */
  function buildHeader(page) {
    var desktopLinks = NAV_LINKS.map(function (l) {
      var active = l.page === page ? " active" : "";
      var current = l.page === page ? ' aria-current="page"' : "";
      return '<a href="' + l.href + '" class="' + active.trim() + '"' + current + ">" + l.label + "</a>";
    }).join("");

    var mobileLinks = NAV_LINKS.map(function (l) {
      var active = l.page === page ? " active" : "";
      var current = l.page === page ? ' aria-current="page"' : "";
      return '<a href="' + l.href + '" class="' + active.trim() + '"' + current + ">" +
        l.label +
        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>' +
        "</a>";
    }).join("");

    return '' +
      '<div class="announce" role="region" aria-label="School announcement">' +
        '<div class="container">' +
          '<span class="tag">Now Open</span>' +
          '<span>Admissions open for 2026 – 2027 · ' +
            '<span class="desktop-only">Book a tour &amp; save $50 on enrolment. </span>' +
            '<a href="admissions.html">Admissions</a></span>' +
        "</div>" +
      "</div>" +

      '<header class="site-header" id="siteHeader">' +
        '<div class="container nav">' +
          logoMarkup() +
          '<nav class="nav-links" aria-label="Primary">' + desktopLinks + "</nav>" +
          '<div class="nav-cta">' +
            '<a href="login.html" class="btn btn-primary btn-sm">Login</a>' +
            '<button class="hamburger" id="hamburger" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobilePanel">' +
              "<span></span><span></span><span></span>" +
            "</button>" +
          "</div>" +
        "</div>" +
      "</header>" +

      '<div class="nav-scrim" id="navScrim" hidden></div>' +
      '<aside class="mobile-panel" id="mobilePanel" aria-label="Mobile navigation" aria-hidden="true">' +
        '<div class="mobile-panel__head">' +
          logoMarkup() +
          '<button class="panel-close" id="panelClose" type="button" aria-label="Close navigation menu">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
          "</button>" +
        "</div>" +
        '<nav class="mobile-links" aria-label="Mobile">' + mobileLinks + "</nav>" +
        '<div class="panel-foot">' +
          '<a href="login.html" class="btn btn-primary btn-block" data-close-menu>Login</a>' +
          '<div class="panel-contact">' +
            "<span>" + esc(SITE.address) + "</span>" +
            '<a href="' + SITE.phoneHref + '">' + esc(SITE.phone) + "</a>" +
            '<a href="mailto:' + SITE.email + '">' + SITE.email + "</a>" +
          "</div>" +
          '<div class="socials">' + socialsMarkup() + "</div>" +
        "</div>" +
      "</aside>";
  }

  /* ---------------------------------------------------------
     Build the footer
     --------------------------------------------------------- */
  function buildFooter() {
    var quickLinks = NAV_LINKS.slice(0, 6).map(function (l) {
      return '<a href="' + l.href + '">' + l.label + "</a>";
    }).join("");

    var programLinks = SITE.programs.map(function (p) {
      return '<a href="' + p.href + '">' + p.label + "</a>";
    }).join("");

    var legalLinks = SITE.legal.map(function (l) {
      return '<a href="' + l.href + '">' + l.label + "</a>";
    }).join("");

    var pin = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
    var call = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"/></svg>';
    var mail = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M3 6l9 7 9-7"/></svg>';
    var clock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';

    return '' +
      '<footer class="site-footer">' +
        '<div class="container footer-grid">' +
          '<div class="footer-brand">' +
            logoMarkup() +
            "<p>Stackly Preschool is a joyful early-learning home where curious little minds play, create and grow into confident learners.</p>" +
            '<div class="socials footer-socials">' + socialsMarkup() + "</div>" +
          "</div>" +

          "<div>" +
            "<h3>Quick Links</h3>" +
            '<nav class="footer-links" aria-label="Footer quick links">' + quickLinks + "</nav>" +
          "</div>" +

          "<div>" +
            "<h3>Programs</h3>" +
            '<nav class="footer-links" aria-label="Footer programs">' + programLinks + "</nav>" +
          "</div>" +

          "<div>" +
            "<h3>Get in Touch</h3>" +
            '<ul class="footer-contact">' +
              "<li>" + pin + "<span>" + esc(SITE.address) + "</span></li>" +
              "<li>" + call + '<a href="' + SITE.phoneHref + '">' + esc(SITE.phone) + "</a></li>" +
              "<li>" + mail + '<a href="mailto:' + SITE.email + '">' + SITE.email + "</a></li>" +
              "<li>" + clock + "<span>" + esc(SITE.hours) + "</span></li>" +
            "</ul>" +
            '<form class="newsletter-form footer-newsletter" data-newsletter novalidate>' +
              '<label class="sr-only" for="footerNewsletter">Email address for newsletter</label>' +
              '<input type="email" id="footerNewsletter" name="newsletter" placeholder="Your email address" autocomplete="email" required />' +
              '<button type="submit" class="btn btn-yellow btn-sm">Subscribe</button>' +
            "</form>" +
            '<p class="newsletter-msg" data-newsletter-msg aria-live="polite"></p>' +
          "</div>" +
        "</div>" +

        '<div class="container footer-bottom">' +
          '<span>&copy; <span data-current-year>2026</span> Stackly Preschool. All rights reserved.</span>' +
          '<nav class="legal" aria-label="Legal">' + legalLinks + "</nav>" +
        "</div>" +
      "</footer>";
  }

  /* ---------------------------------------------------------
     Mobile menu behaviour
     --------------------------------------------------------- */
  function initMenu() {
    var header = document.getElementById("siteHeader");
    var hamburger = document.getElementById("hamburger");
    var panel = document.getElementById("mobilePanel");
    var scrim = document.getElementById("navScrim");
    var closeBtn = document.getElementById("panelClose");

    if (!hamburger || !panel || !scrim) return;

    var lastFocused = null;

    function openMenu() {
      lastFocused = document.activeElement;
      panel.classList.add("open");
      scrim.hidden = false;
      // allow the browser to paint before transitioning
      requestAnimationFrame(function () { scrim.classList.add("open"); });
      hamburger.classList.add("open");
      hamburger.setAttribute("aria-expanded", "true");
      hamburger.setAttribute("aria-label", "Close navigation menu");
      panel.setAttribute("aria-hidden", "false");
      document.body.classList.toggle("menu-open", true);
      var first = panel.querySelector(".panel-close");
      if (first) first.focus();
    }

    function closeMenu() {
      panel.classList.remove("open");
      scrim.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Open navigation menu");
      panel.setAttribute("aria-hidden", "true");
      document.body.classList.toggle("menu-open", false);
      window.setTimeout(function () { scrim.hidden = true; }, 320);
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    }

    function toggleMenu() {
      if (panel.classList.contains("open")) closeMenu();
      else openMenu();
    }

    hamburger.addEventListener("click", toggleMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    scrim.addEventListener("click", closeMenu);

    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("open")) closeMenu();
    });

    // Simple focus trap while the panel is open
    panel.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var focusables = panel.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // Reset when returning to desktop width
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1199 && panel.classList.contains("open")) closeMenu();
    });
  }

  /* ---------------------------------------------------------
     Sticky header shadow on scroll
     --------------------------------------------------------- */
  function initHeaderScroll() {
    var header = document.getElementById("siteHeader");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------
     Current year
     --------------------------------------------------------- */
  function initYear() {
    var year = new Date().getFullYear();
    var nodes = document.querySelectorAll("[data-current-year]");
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = year;
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  function boot() {
    var page = document.body.getAttribute("data-page") || "";

    var headerMount = document.querySelector('[data-component="header"]');
    if (headerMount) headerMount.innerHTML = buildHeader(page);

    var footerMount = document.querySelector('[data-component="footer"]');
    if (footerMount) footerMount.innerHTML = buildFooter();

    initMenu();
    initHeaderScroll();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // Expose shared config for forms.js and others (read-only use)
  window.STACKLY_SITE = SITE;
})();
