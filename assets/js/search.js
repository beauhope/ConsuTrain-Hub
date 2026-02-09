/* search.js
   - Search overlay for site pages + articles.json
   - Works with injected header via includes.js (partials:loaded)
*/

function getBase() {
  return (window.PARTIALS_BASE || "").trim();
}
function withBase(path) {
  return `${getBase()}${path}`;
}

/* ===== Static pages index ===== */
const SITE_PAGES = [
  { title: "محاور التميز", url: "topics.html", keywords: "تميز محاور التميز المؤسسي" },
  { title: "المقالات", url: "articles.html", keywords: "مقالات مقالة" },
  { title: "القاموس", url: "glossary.html", keywords: "قاموس مصطلحات" },
  { title: "الأدوات والنماذج", url: "tools.html", keywords: "أدوات نماذج قوالب" },
  { title: "المهارات الناعمة", url: "SoftSkill.html", keywords: "مهارات ناعمة تواصل" },
  { title: "تواصل معنا", url: "contact.html", keywords: "تواصل واتساب ايميل" },
  { title: "من نحن", url: "about.html", keywords: "تعريف نبذة" },
];

async function fetchArticles() {
  const res = await fetch(withBase("assets/data/articles.json"), { cache: "no-cache" });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : (data.articles || []);
}

function escapeHtml(s = "") {
  return s.replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));
}

function highlight(text, q) {
  const safe = escapeHtml(text || "");
  const query = (q || "").trim();
  if (!query) return safe;

  // highlight all tokens
  const tokens = query.split(/\s+/).filter(Boolean).slice(0, 6);
  let out = safe;
  tokens.forEach(t => {
    const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    out = out.replace(re, `<mark>$1</mark>`);
  });
  return out;
}

function scoreText(haystack, query) {
  const h = (haystack || "").toLowerCase();
  const q = (query || "").toLowerCase().trim();
  if (!q) return 0;

  const tokens = q.split(/\s+/).filter(Boolean);
  let score = 0;

  tokens.forEach(t => {
    if (!t) return;
    if (h.includes(t)) score += 10;
  });

  // bonus for full query
  if (h.includes(q)) score += 15;

  return score;
}

function buildResultItem({ title, url, desc }, q) {
  const t = highlight(title, q);
  const d = desc ? `<div class="search__desc">${highlight(desc, q)}</div>` : "";
  return `
    <a class="search__item" href="${withBase(url)}">
      <div class="search__title">${t}</div>
      ${d}
      <div class="search__url">${escapeHtml(url)}</div>
    </a>
  `;
}

async function initSearch() {
  const openBtn = document.getElementById("openSearch");
  const overlay = document.getElementById("searchOverlay");
  const closeBtn = document.getElementById("closeSearch");
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");

  // لو الهيدر لم يُحقن بعد
  if (!openBtn || !overlay || !closeBtn || !input || !results) return;

  // Prevent duplicate init if partials loaded multiple times
  if (overlay.dataset.ready === "1") return;
  overlay.dataset.ready = "1";

  let articlesCache = null;

  function open() {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    setTimeout(() => input.focus(), 30);
  }

  function close() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    input.value = "";
    results.innerHTML = "";
  }

  async function searchNow(q) {
    const query = (q || "").trim();
    if (!query || query.length < 2) {
      results.innerHTML = `<div class="search__empty">اكتب حرفين على الأقل للبحث…</div>`;
      return;
    }

    // pages
    const pageHits = SITE_PAGES
      .map(p => {
        const hay = `${p.title} ${p.keywords || ""} ${p.url}`;
        const s = scoreText(hay, query);
        return { ...p, score: s };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    // articles
    if (!articlesCache) articlesCache = await fetchArticles();

    const articleHits = (articlesCache || [])
      .map(a => {
        const hay = `${a.title || ""} ${(a.excerpt || "")} ${(a.tags || []).join(" ")} ${(a.content || []).join(" ")}`;
        const s = scoreText(hay, query);
        return { a, score: s };
      })
      .filter(x => x.score > 0)
      .sort((x, y) => y.score - x.score)
      .slice(0, 8);

    // render
    let html = "";

    if (pageHits.length) {
      html += `<div class="search__sectionTitle">الصفحات</div>`;
      html += pageHits.map(p => buildResultItem({
        title: p.title,
        url: p.url,
        desc: "انتقال مباشر إلى الصفحة"
      }, query)).join("");
    }

    if (articleHits.length) {
      html += `<div class="search__sectionTitle">المقالات</div>`;
      html += articleHits.map(({ a }) => {
        const id = a.id ? `#${a.id}` : "";
        return buildResultItem({
          title: a.title || "مقال",
          url: `articles.html${id}`,
          desc: a.excerpt || (a.date ? `بتاريخ: ${a.date}` : "")
        }, query);
      }).join("");
    }

    if (!pageHits.length && !articleHits.length) {
      html = `<div class="search__empty">لا توجد نتائج مطابقة.</div>`;
    }

    results.innerHTML = html;
  }

  // Events
  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);

  overlay.addEventListener("click", (e) => {
    // click outside panel closes
    if (e.target === overlay) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
  });

  let t = null;
  input.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => searchNow(input.value), 150);
  });
}

/* Boot: works with partial injection */
document.addEventListener("DOMContentLoaded", initSearch);
window.addEventListener("partials:loaded", initSearch);
