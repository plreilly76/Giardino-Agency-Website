// Nav toggle (mobile)
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
    });
  }
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
    });
  });

  // FAQ accordion
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    q.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      item.parentElement.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });

  // Checklist email gate — posts to Web3Forms, unlocks content on success
  const WEB3FORMS_ACCESS_KEY = "469802d4-bdfb-4f7a-98dc-f453a2e61388";
  document.querySelectorAll(".gate-form").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const gateBox = form.closest(".gate-box");
      const errorNote = gateBox.querySelector(".gate-error");
      const button = form.querySelector("button");
      const email = form.querySelector('input[type="email"]').value;
      const resource = form.dataset.resource || document.title;

      errorNote.hidden = true;
      button.disabled = true;
      button.textContent = "Unlocking…";

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            email: email,
            subject: `Checklist request: ${resource}`,
            message: `${email} unlocked "${resource}" on giardinoagency.io`,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error("Web3Forms submission failed");

        gateBox.hidden = true;
        const content = document.getElementById(form.dataset.reveals);
        if (content) {
          content.hidden = false;
          content.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (err) {
        errorNote.hidden = false;
        button.disabled = false;
        button.textContent = "Unlock the Checklist";
      }
    });
  });

  // Contact form — posts to Web3Forms
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const success = document.querySelector("#contact-success");
      const errorNote = document.querySelector("#contact-error");
      const button = contactForm.querySelector('button[type="submit"]');
      const originalText = button.textContent;

      errorNote.hidden = true;
      button.disabled = true;
      button.textContent = "Sending…";

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: "New contact request — Giardino Agency",
            name: document.querySelector("#name").value,
            organization: document.querySelector("#org").value,
            email: document.querySelector("#email").value,
            organization_segment: document.querySelector("#segment").value,
            interested_in: document.querySelector("#service").value,
            message: document.querySelector("#message").value,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error("Web3Forms submission failed");

        contactForm.style.display = "none";
        if (success) success.style.display = "block";
      } catch (err) {
        errorNote.hidden = false;
        button.disabled = false;
        button.textContent = originalText;
      }
    });
  }
});
