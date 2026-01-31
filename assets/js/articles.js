async function fetchArticles() {
  const res = await fetch("assets/data/articles.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("Failed to load articles.json");
  const data = await res.json();

  // ترتيب من الأحدث للأقدم حسب التاريخ
  data.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return data;
}

function getLang() {
  return localStorage.getItem("cth_lang") || "ar";
}

function truncate(text, max = 140) {
  const clean = (text || "").replace(/<[^>]*>/g, ""); // remove HTML tags
  return clean.length > max ? clean.slice(0, max).trim() + "…" : clean;
}

/* ====== Home: latest 3 ====== */
async function renderHomeArticles() {
  const el = document.getElementById("home-articles");
  if (!el) return;

  const lang = getLang();
  const articles = await fetchArticles();
  const latest = articles.slice(0, 3);

  el.innerHTML = latest.map(a => {
    const title = a.title?.[lang] || a.title?.ar || "";
    const excerpt = a.excerpt?.[lang] || a.excerpt?.ar || "";
    return `
      <article class="card">
        <h3 class="card__h">${title}</h3>
        <p class="card__p">${truncate(excerpt, 160)}</p>
        <a class="link" href="articles.html#${a.id}" data-i18n="learn_more">اقرأ المزيد</a>
      </article>
    `;
  }).join("");
}

/* ====== Articles page: accordion ====== */
async function renderArticlesAccordion() {
  const root = document.getElementById("articles-accordion");
  if (!root) return;

  const lang = getLang();
  const articles = await fetchArticles();

  root.innerHTML = articles.map(a => {
    const title = a.title?.[lang] || a.title?.ar || "";
    const excerpt = a.excerpt?.[lang] || a.excerpt?.ar || "";
    const content = a.content?.[lang] || a.content?.ar || "";
    const date = a.date ? `<span class="acc__date">${a.date}</span>` : "";

    return `
      <details class="acc" id="${a.id}">
        <summary class="acc__sum">
          <div class="acc__head">
            <span class="acc__title">${title}</span>
            ${date}
          </div>
          <span class="acc__chev" aria-hidden="true">▾</span>
        </summary>
        <div class="acc__body">
          <p class="acc__excerpt">${truncate(excerpt, 220)}</p>
          <div class="acc__content">${content}</div>
        </div>
      </details>
    `;
  }).join("");
}

/* Run */
document.addEventListener("DOMContentLoaded", () => {
  renderHomeArticles().catch(console.error);
  renderArticlesAccordion().catch(console.error);
});
