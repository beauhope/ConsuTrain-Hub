/* articles.js
   - Load articles from assets/data/articles.json
   - Render as professional accordion
   - Single-open behavior (close others when one opens)
*/

async function loadArticles() {
  const holder = document.getElementById("articlesAcc");
  if (!holder) return;

  try {
    const res = await fetch("assets/data/articles.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("Cannot load articles.json");
    const data = await res.json();

    const articles = (data.articles || []);
    if (!articles.length) {
      holder.innerHTML = `<div class="card"><p class="card__p">لا توجد مقالات حاليًا.</p></div>`;
      return;
    }

    holder.innerHTML = articles.map((a, idx) => {
      const paragraphs = (a.content || []).map(p => `<p class="art__p">${p}</p>`).join("");
      const tags = (a.tags || []).map(t => `<span class="tag">${t}</span>`).join("");

      return `
        <details class="art" ${idx === 0 ? "open" : ""}>
          <summary class="art__sum">
            <div class="art__head">
              <div class="art__title">${a.title}</div>
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

  } catch (e) {
    holder.innerHTML = `
      <div class="card">
        <p class="card__p">تعذر تحميل المقالات. تأكد من وجود الملف: <strong>assets/data/articles.json</strong></p>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", loadArticles);
