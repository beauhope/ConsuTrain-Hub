/* articles.js
   - Load articles from assets/data/articles.json
   - Render:
     (1) Articles page accordion داخل #articlesAcc
     (2) Home latest 3 cards داخل #latestArticles
   - Single-open behavior (close others when one opens)
   - Works with injected partials: listens to "partials:loaded"
*/

function getBase() {
  return (window.PARTIALS_BASE || "").trim();
}

function withBase(path) {
  return `${getBase()}${path}`;
}

async function fetchArticles() {
  const res = await fetch(withBase("assets/data/articles.json"), { cache: "no-cache" });
  if (!res.ok) throw new Error("Cannot load articles.json");
  const data = await res.json();

  // يدعم شكلين:
  // 1) [{...}, {...}]
  // 2) { articles: [...] }
  const articles = Array.isArray(data) ? data : (data.articles || []);
  return articles;
}

/* =========================
   (A) Articles page accordion
   ========================= */
async function loadArticlesAccordion() {
  const holder = document.getElementById("articlesAcc");
  if (!holder) return; // ليس صفحة المقالات

  try {
    const articles = await fetchArticles();

    if (!articles.length) {
      holder.innerHTML = `<div class="card"><p class="card__p">لا توجد مقالات حاليًا.</p></div>`;
      return;
    }

    holder.innerHTML = articles.map((a, idx) => {
      const paragraphs = (a.content || []).map(p => `<p class="art__p">${p}</p>`).join("");
      const tags = (a.tags || []).map(t => `<span class="tag">${t}</span>`).join("");

      return `
        <details class="art" ${idx === 0 ? "open" : ""} id="${a.id ? a.id : ""}">
          <summary class="art__sum">
            <div class="art__head">
              <div class="art__title">${a.title || ""}</div>
              <div class="art__meta">
                <span class="art__date">${a.date || ""}</span>
                <span class="art__sep">•</span>
                <span class="art__excerpt">${a.excerpt || ""}</span>
              </div>
            </div>
            <span class="art__icon" aria-hidden="true"></span>
          </summary>

          <div class="art__body">
            <div class="art__tags">${tags}</div>
            <div class="art__content">
              ${paragraphs}
            </div>
          </div>
        </details>
      `;
    }).join("");

    // Single-open behavior
    const all = holder.querySelectorAll("details.art");
    all.forEach(d => {
      d.addEventListener("toggle", () => {
        if (d.open) {
          all.forEach(other => {
            if (other !== d) other.open = false;
          });
        }
      });
    });

    // لو دخل المستخدم من رابط فيه #id افتح المقال المقصود
    const hash = (location.hash || "").replace("#", "").trim();
    if (hash) {
      const target = holder.querySelector(`details.art#${CSS.escape(hash)}`);
      if (target) {
        all.forEach(other => (other.open = false));
        target.open = true;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

  } catch (e) {
    holder.innerHTML = `
      <div class="card">
        <p class="card__p">تعذر تحميل المقالات. تأكد من وجود الملف: <strong>assets/data/articles.json</strong></p>
      </div>
    `;
    console.error(e);
  }
}

/* =========================
   (B) Home page latest 3 cards
   ========================= */
async function loadLatestArticlesCards() {
  const mount = document.getElementById("latestArticles");
  if (!mount) return; // ليس في الصفحة الرئيسية (أو لم يتم حقن mainIndex بعد)

  try {
    const articles = await fetchArticles();
    if (!articles.length) {
      mount.innerHTML = "";
      return;
    }

    // ترتيب: لو عندك الأحدث أولاً في JSON اتركها كما هي
    // لو عندك الأقدم أولاً استخدم .slice(-3).reverse()
    const latest = articles.slice(0, 3);

    mount.innerHTML = latest.map(a => {
      const id = a.id ? `#${a.id}` : "";
      const cover = a.cover || "assets/images/golden-triangle-excellence.png";

      return `
        <article class="article-card">
          <a class="article-thumb" href="articles.html${id}" aria-label="${a.title || ""}">
            <img src="${withBase(cover)}" alt="">
          </a>

          <div class="article-body">
            <div class="article-meta">${a.date || ""}</div>

            <h3 class="article-title">
              <a href="articles.html${id}">${a.title || ""}</a>
            </h3>

            <p class="article-excerpt">${a.excerpt || ""}</p>

            <a class="article-link" href="articles.html${id}">قراءة المقال</a>
          </div>
        </article>
      `;
    }).join("");

  } catch (e) {
    // لا نعرض رسالة خطأ كبيرة في الصفحة الرئيسية — فقط نخفي القسم لو تحب
    console.error(e);
  }
}

/* =========================
   Boot (works with partial injection)
   ========================= */
function bootArticles() {
  loadArticlesAccordion();
  loadLatestArticlesCards();
}

document.addEventListener("DOMContentLoaded", bootArticles);

// ✅ مهم للصفحة الرئيسية لأن mainIndex.html قد يُحقن بعد DOMContentLoaded
window.addEventListener("partials:loaded", bootArticles);
