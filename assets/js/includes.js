

/* ==========================================================
   includes.js
   ----------------------------------------------------------
   وظيفته:
   1) تحميل (حقن) header و footer في أي صفحة.
   2) تحميل محتوى main (اختياري) في الصفحات التي تستخدم site-main.
   3) تفعيل الـ active link في الهيدر حسب الصفحة الحالية.
   4) استدعاء i18n بعد تحميل الهيدر/الفوتر.

   ملاحظة مهمة:
   - لو كانت الصفحة داخل مجلد فرعي (مثل tools/feasibility/):
     ضع قبل includes.js هذا السطر:
     window.PARTIALS_BASE = "../../";
   ========================================================== */

/* -------------------------
   Helpers: Base Paths
   ------------------------- */
function getBase() {
  // مثال: "../../" أو "" (في الصفحات الموجودة بالجذر)
  return (window.PARTIALS_BASE || "").trim();
}

function withBase(url) {
  return `${getBase()}${url}`; // يركّب المسار النهائي
}

/* -------------------------
   Load partial into selector
   ------------------------- */
async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;

  const res = await fetch(withBase(url), { cache: "no-cache" });
  if (!res.ok) {
    console.error(`Partial load failed: ${withBase(url)} (${res.status})`);
    return;
  }
  el.innerHTML = await res.text();
}

/* -------------------------
   Active nav highlighting
   ------------------------- */
function setActiveNav() {
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  document.querySelectorAll(".nav__link").forEach((a) => {
    const hrefRaw = (a.getAttribute("href") || "").toLowerCase();

    // نأخذ فقط اسم الملف من الرابط (حتى لو كان الرابط يحتوي مسارات)
    const hrefFile = hrefRaw.split("/").pop();

    a.classList.toggle("is-active", hrefFile === current);
  });
}

/* -------------------------
   Init “to top” button
   ------------------------- */
function initToTop() {
  const footerLink = document.getElementById("toTop");
  if (!footerLink) return;

  // أنشئ زر عائم جديد
  const floatBtn = document.createElement("a");
  floatBtn.href = "#";
  floatBtn.className = "toTop toTop--float";
  floatBtn.textContent = footerLink.textContent || "أعلى";
  floatBtn.setAttribute("data-i18n", footerLink.getAttribute("data-i18n") || "to_top");

  document.body.appendChild(floatBtn);

  // إظهار/إخفاء أثناء التمرير
  function toggle() {
    if (window.scrollY > 300) floatBtn.classList.add("is-visible");
    else floatBtn.classList.remove("is-visible");
  }
  window.addEventListener("scroll", toggle, { passive: true });
  toggle();

  floatBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}



/* -------------------------
   DOM Ready
   ------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  /* 1) Header */
  await loadPartial("#site-header", "partials/header.html");

  /* 2) Optional Main (only if you use site-main pattern) */
    const mainEl = document.getElementById("site-main");
  const mainUrl = mainEl?.getAttribute("data-main");

  // ✅ لا تحمل شيء افتراضياً — فقط لو data-main موجود
  if (mainEl && mainUrl) {
    await loadPartial("#site-main", mainUrl);
  }


  /* 3) Footer */
  await loadPartial("#site-footer", "partials/footer.html");

  /* 4) Helpers */
  initToTop();
  setActiveNav();

  /* 5) i18n */
  if (window.initLanguage) window.initLanguage();
  else if (window.initI18n) window.initI18n(); // alias احتياطي

  window.dispatchEvent(new Event("partials:loaded"));

});
