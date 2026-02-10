

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
function fixHeaderLinks() {
  const header = document.getElementById("site-header");
  if (!header) return;

  // أي رابط يبدأ بـ "/" نحوله لمسار مناسب داخل المشروع
  header.querySelectorAll('a[href^="/"]').forEach(a => {
    const raw = a.getAttribute("href");
    a.setAttribute("href", withBase(raw.replace(/^\//, "")));
  });

  // لو عندك home مكتوب ../../index.html خلّه يعتمد على base
  header.querySelectorAll('a[href*="index.html"]').forEach(a => {
    const raw = a.getAttribute("href") || "";
    if (raw.includes("../")) a.setAttribute("href", withBase("index.html"));
  });
}


const navToggle = document.getElementById("navToggle");
const headerNav = document.getElementById("headerNav");
if (navToggle && headerNav) {
  navToggle.addEventListener("click", () => headerNav.classList.toggle("is-open"));
}

// فتح/إغلاق البحث
const openSearch = document.getElementById("openSearch");
const closeSearch = document.getElementById("closeSearch");
const overlay = document.getElementById("searchOverlay");

if (openSearch && closeSearch && overlay) {
  openSearch.addEventListener("click", () => {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.getElementById("searchInput")?.focus();
  });

  closeSearch.addEventListener("click", () => {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
    }
  });
}
// Floating scroll to top
const btn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  btn.style.display = window.scrollY > 300 ? "block" : "none";
});

btn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


