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
});

// BC Provincial Climate Risk Briefing: reveal the sticky section bar once
// the hero (or, on a sub-page, the page head) scrolls past, offset it below
// the masthead when the masthead itself is sticky, and highlight the
// current section on the long page as the reader scrolls. The chain order,
// labels and URLs all come from site/data/bc-pcrb.yaml via the templates —
// this only handles what can't be done server-side.
document.addEventListener("DOMContentLoaded", () => {
  const stickybar = document.querySelector("[data-pcrb-stickybar]");
  if (!stickybar) return;

  const masthead = document.querySelector(".masthead");
  const setStickyOffset = () => {
    const sticky = masthead && window.matchMedia("(min-width: 62.01rem)").matches;
    document.documentElement.style.setProperty(
      "--pcrb-sticky-offset",
      `${sticky ? masthead.offsetHeight : 0}px`
    );
  };
  setStickyOffset();
  window.addEventListener("resize", setStickyOffset);

  const revealTrigger = document.querySelector(".pcrb-hero, .page-head");
  if (revealTrigger && "IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => stickybar.classList.toggle("is-visible", !entry.isIntersecting),
      { threshold: 0 }
    ).observe(revealTrigger);
  } else {
    stickybar.classList.add("is-visible");
  }

  // Scrollspy only applies to the long page — a sub-page's single content
  // block carries no id, so this selector returns nothing there and the
  // server-rendered "current" item (from chain_id in front matter) stands.
  const sections = document.querySelectorAll(".pcrb-section[id]");
  if (sections.length > 1 && "IntersectionObserver" in window) {
    const links = stickybar.querySelectorAll("[data-pcrb-id]");
    const setCurrent = (id) => {
      links.forEach((link) => link.classList.toggle("is-current", link.dataset.pcrbId === id));
    };
    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setCurrent(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sections.forEach((section) => spy.observe(section));
  }
});

// Say hello
// eslint-disable-next-line no-console
console.log("🦊 Hello! Edit me in src/index.js");
