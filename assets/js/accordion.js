/* accordion.js
   ============================================
   هدف الملف:
   - جعل Accordion "واحد مفتوح فقط" داخل كل Wrapper يحمل:
     data-accordion="single"
   - يعمل مع <details>/<summary> بدون preventDefault
   - يثبت التمرير بعد الفتح حتى لا "يقفز" لآخر الصفحة
   ============================================
*/

document.addEventListener("DOMContentLoaded", () => {
  const wrappers = document.querySelectorAll('[data-accordion="single"]');
  if (!wrappers.length) return;

  wrappers.forEach((wrap) => {
    // داخل كل Wrapper: العناصر التي نعتبرها "أخوة" (siblings)
    // إذا كان wrapper هو pillars-acc -> نغلق فقط details.pillar
    // إذا كان wrapper هو sub-acc -> نغلق فقط details.acc
    const isPillars = wrap.classList.contains("pillars-acc");
    const selector = isPillars ? "details.pillar" : "details.acc";

    const items = Array.from(wrap.querySelectorAll(selector));

    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        // عند الإغلاق: لا نعمل شيء
        if (!item.open) return;

        // 1) إغلاق البقية داخل نفس الـ wrapper فقط
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });

        // 2) تثبيت التمرير على الـ summary المفتوح (بدون قفزات)
        // (الهيدر ثابت، فنحسب offset)
        const header = document.querySelector(".topbar");
        const offset = (header?.offsetHeight || 0) + 14;

        const summary = item.querySelector(":scope > summary");
        if (!summary) return;

        // نؤجل التمرير Tick بسيط حتى ينتهي الـ layout بعد فتح/إغلاق الآخرين
        requestAnimationFrame(() => {
          const top =
            summary.getBoundingClientRect().top + window.scrollY - offset;

          window.scrollTo({ top, behavior: "smooth" });
        });
      });
    });
  });
});
