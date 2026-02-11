/* ==========================================================
   includes.js – TRUE UNIVERSAL VERSION
   Works:
   - Local server
   - GitHub Pages (repo name included)
   - Root pages
   - Subfolder pages
========================================================== */
/* ================================
   SITE BASE (GitHub Safe)
================================ */
window.SITE_BASE = location.hostname.includes("github.io")
  ? "/ConsuTrain-Hub"
  : "";


/* -------------------------
   Calculate dynamic base
------------------------- */
function getBasePath() {
  const path = window.location.pathname;

  // مثال:
  // /ConsuTrain-Hub/index.html
  // /ConsuTrain-Hub/knowledge/topics.html

  const segments = path.split("/").filter(Boolean);

  // لو نحن في:
  // domain.com/RepoName/   → root
  if (segments.length <= 2) return "";

  // لو نحن داخل مجلد:
  // domain.com/RepoName/knowledge/file.html
  return "../";
}

const BASE = getBasePath();

/* -------------------------
   Load partial
------------------------- */
async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;

  try {
    const res = await fetch(BASE + url, { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error("Partial load failed:", BASE + url);
  }
}

/* -------------------------
   Fix header links
------------------------- */
function fixHeaderLinks() {
  document.querySelectorAll(".header-nav a, .header-brand").forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;

    if (href.startsWith("http") || href.startsWith("#")) return;

    link.setAttribute("href", BASE + href);
  });
}

/* -------------------------
   Active nav
------------------------- */
function setActiveNav() {
  const current =
    (location.pathname.split("/").pop() || "index.html").toLowerCase();

  document.querySelectorAll(".header-nav a").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    const file = href.split("/").pop();
    if (file === current) {
      a.classList.add("active");
    }
  });
}

/* -------------------------
   Scroll To Top
------------------------- */
function initToTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.style.display = window.scrollY > 300 ? "block" : "none";
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function fixNavLinks() {
  document.querySelectorAll(".header-nav a, .header-brand").forEach(a => {
    const href = a.getAttribute("href");
    if (href && href.startsWith("/")) {
      a.setAttribute("href", window.SITE_BASE + href);
    }
  });
}

/* -------------------------
   DOM Ready
------------------------- */
document.addEventListener("DOMContentLoaded", async () => {

  /* Header */
  await loadPartial("#site-header", "partials/header.html");

  /* Fix absolute links */
  fixNavLinks();

  /* Footer */
  await loadPartial("#site-footer", "partials/footer.html");

  /* Helpers */
  setActiveNav();
  initToTop();

});
