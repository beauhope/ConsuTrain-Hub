/* =========================================
   Global Search – ConsuTrain Hub
========================================= */

function getBase() {
  return (window.PARTIALS_BASE || "").trim();
}
function withBase(path) {
  return `${getBase()}${path}`;
}

/* ===== Static pages ===== */
const SITE_PAGES = [
  { title: "محاور التميز", url: "topics.html", keywords: "تميز مؤسسي" },
  { title: "المقالات", url: "articles.html", keywords: "مقالات" },
  { title: "القاموس", url: "glossary.html", keywords: "مصطلحات" },
  { title: "الأدوات والنماذج", url: "tools.html", keywords: "أدوات نماذج" },
  { title: "المهارات الناعمة", url: "SoftSkill.html", keywords: "مهارات" },
  { title: "تواصل معنا", url: "contact.html", keywords: "تواصل" },
  { title: "من نحن", url: "about.html", keywords: "تعريف" }
];

async function fetchArticles() {
  try {
    const res = await fetch(withBase("assets/data/articles.json"));
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function scoreText(text, q) {
  let score = 0;
  q.split(/\s+/).forEach(t => {
    if (text.includes(t)) score += 10;
  });
  return score;
}
function highlight(text, q) {
  const terms = q.split(/\s+/).filter(Boolean);
  let result = text;
  terms.forEach(t => {
    const re = new RegExp(`(${t})`, "gi");
    result = result.replace(re, `<span class="search-highlight">$1</span>`);
  });
  return result;
}

function initSearch() {
  const openBtn  = document.getElementById("openSearch");
  const overlay  = document.getElementById("searchOverlay");
  const closeBtn = document.getElementById("closeSearch");
  const input    = document.getElementById("globalSearchInput");
  const results  = document.getElementById("searchResults");

  if (!openBtn || !overlay || !closeBtn || !input || !results) return;

  if (overlay.dataset.ready) return;
  overlay.dataset.ready = "1";

  let articlesCache = null;

  function open(e) {
    if (e) e.preventDefault(); // ⬅️ يمنع النزول للفوتر
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    input.focus();
  }

  function close() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    input.value = "";
    results.innerHTML = "";
  }

  async function searchNow(q) {
    q = q.trim().toLowerCase();
    if (q.length < 2) {
      results.innerHTML = "<div class='search__empty'>اكتب حرفين على الأقل…</div>";
      return;
    }

    let html = "";

    SITE_PAGES.forEach(p => {
      if (scoreText(`${p.title} ${p.keywords}`, q)) {
        html += `<a class="search__item" href="${withBase(p.url)}">
  ${highlight(p.title, q)}
</a>`;
      }
    });

    if (!articlesCache) articlesCache = await fetchArticles();
    articlesCache.forEach(a => {
      if (scoreText(a.title || "", q)) {
        html += `<a class="search__item" href="articles.html#${a.id || ""}">
  ${highlight(a.title, q)}
</a>`;

      }
    });

    results.innerHTML = html || "<div class='search__empty'>لا نتائج.</div>";
  }

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", e => e.target === overlay && close());
  document.addEventListener("keydown", e => e.key === "Escape" && close());
  input.addEventListener("input", () => searchNow(input.value));
}

document.addEventListener("DOMContentLoaded", initSearch);
window.addEventListener("partials:loaded", initSearch);
