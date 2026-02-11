/* ==========================================================
   includes.js – CLEAN STABLE VERSION
   Works:
   - Local server
   - GitHub Pages
   - Any hosting
========================================================== */

/* -------------------------
   Load partial
------------------------- */
async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;

  try {
    const base = window.PARTIALS_BASE || "";
    const finalUrl = base + url;

    const res = await fetch(finalUrl, { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);

    el.innerHTML = await res.text();

  } catch (err) {
    console.error("Partial load failed:", url);
  }
}

/* -------------------------
   Fix header links
------------------------- */
function fixHeaderLinks() {
  const base = window.PARTIALS_BASE || "";

  document.querySelectorAll(".header-nav a, .header-brand").forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;
    if (href.startsWith("http") || href.startsWith("#")) return;

    link.setAttribute("href", base + href);
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
   DOM Ready
------------------------- */
document.addEventListener("DOMContentLoaded", async () => {

  /* Load Header */
  await loadPartial("#site-header", "partials/header.html");

  /* Fix header links */
  fixHeaderLinks();

  /* Load Footer */
  await loadPartial("#site-footer", "partials/footer.html");

  /* Helpers */
  setActiveNav();
    /* maininedex */
  const main = document.getElementById("site-main");
if (main && main.dataset.main) {
  await loadPartial("#site-main", main.dataset.main);
}


});
