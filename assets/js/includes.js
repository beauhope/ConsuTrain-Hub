/* ==========================================================
   includes.js – AUTO ROOT PROFESSIONAL VERSION
========================================================== */

/* -------------------------
   Detect root path automatically
------------------------- */
function getRootPath() {

  const origin = window.location.origin;
  const path = window.location.pathname;

  // detect if inside a GitHub project subfolder
  const segments = path.split("/").filter(Boolean);

  // if project page (like /RepoName/...)
  if (origin.includes("github.io") && segments.length > 0) {
    return "/" + segments[0] + "/";
  }

  return "/";
}


const ROOT = getRootPath();

/* -------------------------
   Load partial
------------------------- */
async function loadPartial(selector, url) {

  const el = document.querySelector(selector);
  if (!el) return;

  try {

    const finalUrl = ROOT + url;
    /*const res = await fetch(finalUrl);    لإلغاء الفلاش لكن لم ينفع*/

    const res = await fetch(finalUrl, { cache: "no-cache" }); 
    if (!res.ok) throw new Error(res.status);

    el.innerHTML = await res.text();

    // after loading header fix links
    if (selector === "#site-header") {
      fixHeaderLinks();
      setActiveNav();
    }

  } catch (err) {
    console.error("Partial load failed:", url);
  }
}

/* -------------------------
   Fix header links automatically
------------------------- */
function fixHeaderLinks() {

  document.querySelectorAll(".header-nav a, .header-brand").forEach(link => {

    const href = link.getAttribute("href");
    if (!href) return;

    // ignore external or anchor
    if (href.startsWith("http") || href.startsWith("#")) return;

    link.setAttribute("href", ROOT + href);

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
   Global Search Overlay
------------------------- */
function initGlobalSearch() {

  const openBtn = document.getElementById("openSearch");
  const closeBtn = document.getElementById("closeSearch");
  const overlay = document.getElementById("searchOverlay");

  if (!overlay) return;

  overlay.classList.remove("is-open");
  document.body.style.overflow = "";

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  });

}

/* -------------------------
   Global Search Engine
------------------------- */
function enableGlobalSearch() {

  const input = document.getElementById("globalSearchInput");
  const resultsBox = document.getElementById("searchResults");

  if (!input || !resultsBox) return;

  input.addEventListener("input", function () {

    const query = this.value.trim().toLowerCase();

    if (query.length < 2) {
      resultsBox.innerHTML = "";
      return;
    }

    const elements = document.querySelectorAll("h1, h2, h3, a");

    let results = [];

    elements.forEach(el => {
      const text = el.textContent.trim();
      if (text.toLowerCase().includes(query)) {
        results.push({ text, element: el });
      }
    });

    // remove duplicates
    results = results.filter(
      (v, i, a) => a.findIndex(t => t.text === v.text) === i
    );

    let html = `<div class="search-count">عدد النتائج: ${results.length}</div>`;

    if (results.length === 0) {
      html += `<div class="search-empty">لا توجد نتائج</div>`;
      resultsBox.innerHTML = html;
      return;
    }

    results.slice(0, 10).forEach(r => {

      const regex = new RegExp(`(${query})`, "gi");
      const highlighted = r.text.replace(regex, `<span class="highlight">$1</span>`);

      let link = "#";

      if (r.element.tagName.toLowerCase() === "a" && r.element.href) {
        link = r.element.href;
      } else {
        if (!r.element.id) {
          r.element.id = "search-target-" +
            Math.random().toString(36).substr(2,5);
        }
        link = location.pathname + "#" + r.element.id;
      }

      html += `
        <a href="${link}" class="search-result-item"
           onclick="document.getElementById('searchOverlay').classList.remove('is-open')">
          ${highlighted}
        </a>
      `;

    });

    resultsBox.innerHTML = html;

  });

}

/* -------------------------
   DOM Ready
------------------------- */
document.addEventListener("DOMContentLoaded", async () => {

  await loadPartial("#site-header", "partials/header.html");
  await loadPartial("#site-footer", "partials/footer.html");

  initGlobalSearch();
  enableGlobalSearch();

  const main = document.getElementById("site-main");
  if (main && main.dataset.main) {
    await loadPartial("#site-main", main.dataset.main);
  }

});
