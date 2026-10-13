/* =========================================================
   Stackly Preschool - auth.js
   Small enhancements for the login / register pages:
   a show/hide toggle for password fields. Validation and
   "confirm password" matching are handled by forms.js.

   Markup contract:
     <div class="pass-wrap">
       <input id="x" type="password" ... />
       <button type="button" class="pass-toggle" data-toggle-password
               aria-controls="x" aria-pressed="false">
         <svg .../>
       </button>
     </div>
   ========================================================= */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  var EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>';
  var EYE_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17.8 17.8 0 0 1-3.2 4.1"/><path d="M6.6 6.6A17.6 17.6 0 0 0 2 12s3.5 7 10 7a10.8 10.8 0 0 0 4.3-.9"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';

  function initToggle(btn) {
    var input = document.getElementById(btn.getAttribute("aria-controls"));
    if (!input) {
      var wrap = btn.closest(".pass-wrap");
      input = wrap ? wrap.querySelector("input") : null;
    }
    if (!input) return;

    btn.innerHTML = EYE;

    btn.addEventListener("click", function () {
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.setAttribute("aria-pressed", show ? "true" : "false");
      btn.setAttribute("aria-label", (show ? "Hide" : "Show") + " password");
      btn.innerHTML = show ? EYE_OFF : EYE;
      input.focus();
    });
  }

  ready(function () {
    document.querySelectorAll("[data-toggle-password]").forEach(initToggle);
  });
})();
