/* =========================================================
   Stackly Preschool - forms.js
   Client-side validation for the Admission enquiry form and
   the Contact / Tour booking form. This is a front-end demo:
   no data leaves the browser. See the on-page note about
   connecting a backend endpoint.

   Markup contract:
     <form data-form="admission" novalidate>
       <div class="form-status" data-status aria-live="polite"></div>
       <div class="field">
         <label for="x">Label <span class="req">*</span></label>
         <input id="x" name="x" type="email" required />
         <span class="error" data-error></span>
       </div>
       <button type="submit">...</button>
     </form>
   ========================================================= */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^[+]?[\d\s().-]{7,18}$/;

  function getFieldParts(input) {
    return input.closest(".field");
  }

  function setError(input, message) {
    var field = getFieldParts(input);
    if (!field) return;
    var errEl = field.querySelector("[data-error]");
    if (message) {
      field.classList.add("invalid");
      field.classList.remove("valid");
      input.setAttribute("aria-invalid", "true");
      if (errEl) errEl.textContent = message;
    } else {
      field.classList.remove("invalid");
      field.classList.add("valid");
      input.removeAttribute("aria-invalid");
      if (errEl) errEl.textContent = "";
    }
  }

  function labelOf(input) {
    return input.getAttribute("data-label") ||
      (input.labels && input.labels[0] ? input.labels[0].textContent.replace("*", "").trim() : "This field");
  }

  function validateInput(input) {
    var value = (input.value || "").trim();
    var type = (input.type || "").toLowerCase();
    var tag = input.tagName.toLowerCase();
    var label = labelOf(input);

    // Required
    if (input.hasAttribute("required")) {
      if (type === "checkbox") {
        if (!input.checked) return "Please accept the " + label.toLowerCase() + ".";
      } else if (value === "") {
        return label + " is required.";
      }
    }

    if (value === "" && type !== "checkbox") return "";

    // Length
    if (input.hasAttribute("minlength")) {
      var min = parseInt(input.getAttribute("minlength"), 10);
      if (!isNaN(min) && value.length < min) {
        return label + " must be at least " + min + " characters.";
      }
    }

    // Email
    if (type === "email" && !EMAIL_RE.test(value)) {
      return "Please enter a valid email address.";
    }

    // Phone
    if (type === "tel" && !PHONE_RE.test(value)) {
      return "Please enter a valid phone number.";
    }

    // Must match another field (e.g. confirm password)
    if (input.hasAttribute("data-match")) {
      var target = document.querySelector(input.getAttribute("data-match"));
      if (target && value !== target.value) {
        return input.getAttribute("data-match-msg") || "Passwords do not match.";
      }
    }

    // Number range
    if (type === "number") {
      var num = Number(value);
      if (isNaN(num)) return "Please enter a valid number for " + label.toLowerCase() + ".";
      if (input.hasAttribute("min") && num < Number(input.getAttribute("min"))) {
        return label + " is too low.";
      }
      if (input.hasAttribute("max") && num > Number(input.getAttribute("max"))) {
        return label + " is too high.";
      }
    }

    // Date not in the past
    if (type === "date" && input.hasAttribute("data-no-past")) {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(value) < today) return "Please choose today or a future date.";
    }

    // Select with a placeholder option
    if (tag === "select" && input.hasAttribute("required") && value === "") {
      return "Please " + label.toLowerCase() + ".";
    }

    return "";
  }

  function validateForm(form) {
    var inputs = form.querySelectorAll("input, select, textarea");
    var firstInvalid = null;
    var valid = true;

    inputs.forEach(function (input) {
      if (input.type === "hidden" || input.disabled) return;
      var msg = validateInput(input);
      setError(input, msg);
      if (msg) {
        valid = false;
        if (!firstInvalid) firstInvalid = input;
      }
    });

    return { valid: valid, firstInvalid: firstInvalid };
  }

  function showStatus(form, message, type) {
    var status = form.querySelector("[data-status]");
    if (!status) return;
    status.textContent = message;
    status.className = "form-status show " + type;
  }

  function initForm(form) {
    var inputs = form.querySelectorAll("input, select, textarea");

    inputs.forEach(function (input) {
      // Validate on blur; clear errors as the user fixes them
      input.addEventListener("blur", function () {
        if (input.type === "checkbox" || input.value.trim() !== "") {
          setError(input, validateInput(input));
        }
      });
      input.addEventListener("input", function () {
        var field = getFieldParts(input);
        if (field && field.classList.contains("invalid")) {
          setError(input, validateInput(input));
        }
      });
      input.addEventListener("change", function () {
        if (input.tagName.toLowerCase() === "select" || input.type === "checkbox") {
          setError(input, validateInput(input));
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var result = validateForm(form);

      if (!result.valid) {
        showStatus(form, "Please correct the highlighted fields and try again.", "error");
        if (result.firstInvalid) {
          result.firstInvalid.focus();
          result.firstInvalid.scrollIntoView({ block: "center", behavior: "smooth" });
        }
        return;
      }

      // Simulate a successful submission (demo only)
      var type = form.getAttribute("data-form");
      var messages = {
        admission: "Thank you! Your admission enquiry has been sent. Our team will contact you within 1–2 working days.",
        contact: "Thank you! Your message has been sent. Our team will contact you within 1–2 working days.",
        login: "Welcome back! You have signed in successfully.",
        register: "Welcome to Stackly! Your account has been created successfully."
      };
      var message = messages[type] || "Thank you! Your form has been submitted.";
      if (type === "login" || type === "register") {
        message += " (Demo only — no data is sent.)";
      } else {
        message += " (Demo only — connect a backend to store submissions.)";
      }

      // Reset first (the reset handler clears fields/errors and the status),
      // then show the success message so it is not wiped out.
      form.reset();
      form.querySelectorAll(".field").forEach(function (f) {
        f.classList.remove("valid", "invalid");
      });
      form.querySelectorAll("[data-error]").forEach(function (e2) { e2.textContent = ""; });

      showStatus(form, message, "success");

      var status = form.querySelector("[data-status]");
      if (status) status.scrollIntoView({ block: "center", behavior: "smooth" });
    });

    form.addEventListener("reset", function () {
      form.querySelectorAll(".field").forEach(function (f) {
        f.classList.remove("valid", "invalid");
      });
      form.querySelectorAll("[data-error]").forEach(function (e2) { e2.textContent = ""; });
      var status = form.querySelector("[data-status]");
      if (status) { status.textContent = ""; status.className = "form-status"; }
    });
  }

  ready(function () {
    document.querySelectorAll("form[data-form]").forEach(initForm);
  });
})();
