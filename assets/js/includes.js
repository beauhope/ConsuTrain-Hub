async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;

  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) {
    console.error("Failed to load partial:", url, res.status);
    return;
  }

  el.innerHTML = await res.text();
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadPartial("#site-header", "partials/header.html");
  await loadPartial("#site-footer", "partials/footer.html");

  // زر أعلى (بعد تحميل الفوتر)
  const toTop = document.getElementById("toTop");
  if (toTop) {
    toTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 🔑 تفعيل اللغات بعد تحميل الهيدر/الفوتر
  if (window.initLanguage) window.initLanguage();
});
