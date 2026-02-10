/* ==========================================================
   includes.js – CLEAN & SAFE
========================================================== */

/* -------------------------
   Helpers: Base Paths
------------------------- */
function getBase() {
  return (window.PARTIALS_BASE || "").trim();
}

function withBase(url) {
  return `${getBase()}${url}`;
}

/* -------------------------
   Load partial into selector
------------------------- */
async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;

  const res = await fetch(withBase(url), { cache: "no-cache" });
  if (!res.ok) {
    console.error(`Partial load failed: ${withBase(url)} (${res.status})`);
    return;
  }
  el.innerHTML = await res.text();
}

/* -------------------------
   Active nav highlighting
------------------------- */
function setActiveNav() {
  const current =
    (location.pathname.split("/").pop() || "index.html").toLowerCase();

  document.querySelectorAll(".nav__link").forEach((a) => {
    const hrefRaw = (a.getAttribute("href") || "").toLowerCase();
    const hrefFile = hrefRaw.split("/").pop();
    a.classList.toggle("is-active", hrefFile === current);
  });
}

/* -------------------------
   Scroll To Top (safe)
------------------------- */
function initToTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => {
      btn.style.display = window.scrollY > 300 ? "block" : "none";
    },
    { passive: true }
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* -------------------------
   DOM Ready
------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  /* Header */
  await loadPartial("#site-header", "partials/header.html");

  /* Optional Main */
  const mainEl = document.getElementById("site-main");
  const mainUrl = mainEl?.getAttribute("data-main");
  if (mainEl && mainUrl) {
    await loadPartial("#site-main", mainUrl);
  }

  /* Footer */
  await loadPartial("#site-footer", "partials/footer.html");

  /* Helpers */
  setActiveNav();
  initToTop();

  /* i18n */
  if (window.initLanguage) window.initLanguage();
  else if (window.initI18n) window.initI18n();

  window.dispatchEvent(new Event("partials:loaded"));
});
