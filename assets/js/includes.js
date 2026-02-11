/* ==========================================================
   includes.js – FINAL STABLE VERSION
   Works in root + subfolders + local + GitHub
========================================================== */

/* -------------------------
   Detect correct base path
------------------------- */
function detectBasePath() {
  const path = window.location.pathname;

  // إذا كنا داخل مجلد مثل /knowledge/
  if (path.includes("/knowledge/")) {
    return "../";
  }

  if (path.includes("/tools/")) {
    return "../";
  }

  // الصفحة في الجذر
  return "";
}

const BASE = detectBasePath();

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
   Fix header links dynamically
------------------------- */
function fixHeaderLinks() {
  document.querySelectorAll(".header-nav a, .header-brand").forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;

    // لا نعدل الروابط الخارجية أو #
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

/* -------------------------
   DOM Ready
------------------------- */
document.addEventListener("DOMContentLoaded", async () => {

  await loadPartial("#site-header", "partials/header.html");
  await loadPartial("#site-footer", "partials/footer.html");

  fixHeaderLinks();
  setActiveNav();
  initToTop();

});
