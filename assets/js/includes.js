/* ==========================================================
   includes.js – FINAL CLEAN VERSION
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
   Global Search Overlay (SINGLE SOURCE)
------------------------- */
function initGlobalSearch() {

  const openBtn = document.getElementById("openSearch");
  const closeBtn = document.getElementById("closeSearch");
  const overlay = document.getElementById("searchOverlay");

  if (!overlay) return;

  // تأكد أن overlay مغلق عند التحميل
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
   DOM Ready
------------------------- */
document.addEventListener("DOMContentLoaded", async () => {

  await loadPartial("#site-header", "partials/header.html");
  fixHeaderLinks();

  await loadPartial("#site-footer", "partials/footer.html");

  setActiveNav();
  initGlobalSearch();
  enableGlobalSearch();

  const main = document.getElementById("site-main");
  if (main && main.dataset.main) {
    await loadPartial("#site-main", main.dataset.main);
  }

});

/* -------------------------
   search bar
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
        results.push(text);
      }
    });

    results = [...new Set(results)];

    let html = `<div class="search-count">عدد النتائج: ${results.length}</div>`;

    if (results.length === 0) {
      html += `<div class="search-empty">لا توجد نتائج</div>`;
      resultsBox.innerHTML = html;
      return;
    }

    results.slice(0, 10).forEach(text => {

      const regex = new RegExp(`(${query})`, "gi");
      const highlighted = text.replace(regex, `<span class="highlight">$1</span>`);

      const element = Array.from(document.querySelectorAll("h1, h2, h3, a"))
        .find(el => el.textContent.trim() === text);

      let link = "#";

      if (element) {

        if (element.tagName.toLowerCase() === "a" && element.href) {
          link = element.href;
        } else {

          if (!element.id) {
            element.id = "search-target-" + Math.random().toString(36).substr(2,5);
          }

          link = window.location.pathname + "#" + element.id;
        }
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

