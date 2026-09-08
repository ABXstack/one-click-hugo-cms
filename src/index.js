// JS Goes here - ES6 supported

import "./css/main.scss";

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");
  const toggleLabel = toggle?.querySelector(".nav-toggle-label");
  const submenuToggles = document.querySelectorAll(".sub-toggle");

  if (toggle && menu) {
    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      if (toggleLabel) toggleLabel.textContent = "Menu";
      toggle.setAttribute("aria-label", "Open menu");
      submenuToggles.forEach((submenuToggle) => {
        submenuToggle.setAttribute("aria-expanded", "false");
        submenuToggle.closest(".has-sub")?.classList.remove("is-expanded");
      });
    };

    toggle.addEventListener("click", () => {
      const willOpen = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(willOpen));
      menu.classList.toggle("is-open", willOpen);
      if (toggleLabel) toggleLabel.textContent = willOpen ? "Close" : "Menu";
      toggle.setAttribute("aria-label", willOpen ? "Close menu" : "Open menu");
    });

    submenuToggles.forEach((submenuToggle) => {
      submenuToggle.addEventListener("click", () => {
        const willExpand = submenuToggle.getAttribute("aria-expanded") !== "true";
        submenuToggle.setAttribute("aria-expanded", String(willExpand));
        submenuToggle.closest(".has-sub")?.classList.toggle("is-expanded", willExpand);
      });
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
        toggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 62.01rem)").matches) closeMenu();
    });
  }

  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", (user) => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
});

// Say hello
// eslint-disable-next-line no-console
console.log("🦊 Hello! Edit me in src/index.js");
