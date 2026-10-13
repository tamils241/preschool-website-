/* =========================================================
   Stackly Preschool - dash-menu.js
   Injects the shared dashboard sidebar and top bar into every
   portal page (mirrors navigation.js for the public site).

   Usage on a page:
     <body data-page="admin-enrolments">
       <div class="dash">
         <div data-dash-side></div>
         <div class="dash-body">
           <div data-dash-top
                data-title="Students"
                data-subtitle="248 enrolled · 12 classes"
                data-search="Search students…"></div>
           <main class="dash-main" id="dashMain"> … </main>
         </div>
       </div>

   The role (admin / client) is derived from data-page:
   any page starting with "admin" uses the admin menu.
   ========================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     Icons (inner markup only; wrapped by icon())
     --------------------------------------------------------- */
  var ICONS = {
    grid: '<rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"/>',
    staff: '<path d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M10 7V5h4v2"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    calendarCheck: '<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h4"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    chat: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    home: '<path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/>',
    child: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/>',
    activities: '<circle cx="13.5" cy="6.5" r="2.5"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/><path d="M11.5 8l-3 7M15 8l2.5 8"/>',
    photos: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
    bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>'
  };

  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
      (ICONS[name] || "") + "</svg>";
  }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function initials(name) {
    return name.split(/\s+/).map(function (w) { return w.charAt(0); }).join("").slice(0, 2).toUpperCase();
  }

  /* ---------------------------------------------------------
     Menu config
     --------------------------------------------------------- */
  var ADMIN = [
    { s: "Management", label: "Overview", href: "admin-dashboard.html", page: "admin-dashboard", icon: "grid" },
    { s: "Management", label: "Students", href: "admin-enrolments.html", page: "admin-enrolments", icon: "users", badge: "248" },
    { s: "Management", label: "Staff", href: "admin-staff.html", page: "admin-staff", icon: "staff" },
    { s: "Management", label: "Classes", href: "admin-classes.html", page: "admin-classes", icon: "book" },
    { s: "Management", label: "Attendance", href: "admin-attendance.html", page: "admin-attendance", icon: "calendarCheck" },
    { s: "Management", label: "Fees", href: "admin-fees.html", page: "admin-fees", icon: "card" },
    { s: "Engage", label: "Events", href: "admin-events.html", page: "admin-events", icon: "calendar" },
    { s: "Engage", label: "Messages", href: "admin-messages.html", page: "admin-messages", icon: "chat", badge: "5" },
    { s: "Engage", label: "Settings", href: "admin-settings.html", page: "admin-settings", icon: "gear" }
  ];

  var CLIENT = [
    { s: "My Family", label: "Overview", href: "clients-dashboard.html", page: "clients-dashboard", icon: "grid" },
    { s: "My Family", label: "My Child", href: "client-child.html", page: "client-child", icon: "child" },
    { s: "My Family", label: "Attendance", href: "client-attendance.html", page: "client-attendance", icon: "calendarCheck" },
    { s: "My Family", label: "Activities", href: "client-activities.html", page: "client-activities", icon: "activities", badge: "8" },
    { s: "My Family", label: "Photos", href: "client-photos.html", page: "client-photos", icon: "photos", badge: "3" },
    { s: "Account", label: "Fees", href: "client-fees.html", page: "client-fees", icon: "card" },
    { s: "Account", label: "Events", href: "client-events.html", page: "client-events", icon: "calendar" },
    { s: "Account", label: "Messages", href: "client-messages.html", page: "client-messages", icon: "chat" },
    { s: "Account", label: "Settings", href: "client-settings.html", page: "client-settings", icon: "gear" }
  ];

  var USERS = {
    admin: { name: "Ms. Rivera", role: "Administrator", av: "MR", avClass: "" },
    client: { name: "Sara Johnson", role: "Parent / Guardian", av: "SJ", avClass: "" }
  };

  /* ---------------------------------------------------------
     Builders
     --------------------------------------------------------- */
  function buildNav(items, activePage) {
    var groups = [];
    items.forEach(function (it) {
      if (!groups.length || groups[groups.length - 1].label !== it.s)
        groups.push({ label: it.s, items: [] });
      groups[groups.length - 1].items.push(it);
    });

    return groups.map(function (g) {
      var links = g.items.map(function (it) {
        var active = it.page === activePage;
        return '<a class="dash-link' + (active ? " is-active" : "") + '" href="' + it.href + '"' +
          (active ? ' aria-current="page"' : "") + ">" +
          icon(it.icon) + esc(it.label) +
          (it.badge ? '<span class="dash-badge">' + esc(it.badge) + "</span>" : "") +
          "</a>";
      }).join("");
      return '<p class="dash-nav__label">' + esc(g.label) + "</p>" + links;
    }).join("");
  }

  function buildSide(role, activePage) {
    var items = role === "admin" ? ADMIN : CLIENT;
    var user = USERS[role];
    return '' +
      '<aside class="dash-side" id="dashSide" aria-label="Dashboard navigation">' +
        '<a class="dash-brand" href="index.html" aria-label="Stackly Preschool home">' +
          '<img src="images/logo/logo-sky.webp" alt="Stackly Preschool" width="137" height="40" />' +
        "</a>" +
        '<nav class="dash-nav" aria-label="' + (role === "admin" ? "Admin sections" : "Parent sections") + '">' +
          buildNav(items, activePage) +
        "</nav>" +
        '<div class="dash-side__foot">' +
          '<a class="dash-link" href="index.html">' + icon("home") + "Back to website</a>" +
          '<div class="dash-user">' +
            '<span class="dash-user__av">' + esc(user.av) + "</span>" +
            "<div><strong>" + esc(user.name) + "</strong><small>" + esc(user.role) + "</small></div>" +
          "</div>" +
          '<a class="btn btn-outline btn-sm btn-block" href="login.html">Sign out</a>' +
        "</div>" +
      "</aside>";
  }

  function buildTop(role, opts) {
    var user = USERS[role];
    return '' +
      '<header class="dash-top">' +
        '<button class="dash-toggle" id="dashToggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="dashSide">' +
          icon("menu") +
        "</button>" +
        '<div class="dash-top__title">' +
          "<h1>" + esc(opts.title) + "</h1>" +
          (opts.subtitle ? "<p>" + esc(opts.subtitle) + "</p>" : "") +
        "</div>" +
        '<form class="dash-search" role="search" onsubmit="return false">' +
          icon("search") +
          '<label class="sr-only" for="dashSearchInput">Search</label>' +
          '<input type="search" id="dashSearchInput" placeholder="' + esc(opts.search || "Search…") + '" />' +
        "</form>" +
        '<div class="dash-top__actions">' +
          '<button class="dash-icon-btn" type="button" aria-label="Notifications">' + icon("bell") + '<span class="dot"></span></button>' +
          '<span class="dash-top__av" aria-hidden="true">' + esc(user.av) + "</span>" +
        "</div>" +
      "</header>";
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  function boot() {
    var page = (document.body && document.body.getAttribute("data-page")) || "";
    var role = page.indexOf("admin") === 0 ? "admin" : "client";

    var sideMount = document.querySelector("[data-dash-side]");
    if (sideMount) sideMount.outerHTML = buildSide(role, page);

    var topMount = document.querySelector("[data-dash-top]");
    if (topMount) {
      topMount.outerHTML = buildTop(role, {
        title: topMount.getAttribute("data-title") || "Dashboard",
        subtitle: topMount.getAttribute("data-subtitle") || "",
        search: topMount.getAttribute("data-search") || "Search…"
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
