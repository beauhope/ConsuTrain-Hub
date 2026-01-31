/* app.js — GitHub Pages Friendly (No Server Needed)
   - Auto-save (LocalStorage) + Save Status
   - Import/Export JSON
   - Export PDF (print -> Save as PDF)
   - Export Word (.doc) Comprehensive report
   - Build 116 questions (from provided Excel) grouped by section
   - Search box filters questions live
*/

const LS_KEY = "feasibility_form_v1";

// ====== QUESTIONS (116) ======
const QUESTIONS = [
  {"id":1,"section":"بيانات المشروع","text":"ما هو اسم المشروع؟","notes":"اكتب الإسم المقترح في الخانة اليمين"},
  {"id":2,"section":"بيانات المشروع","text":"بأي منطقة سيتم المشروع ؟","notes":""},
  {"id":3,"section":"بيانات المشروع","text":"ما هو مجال المشروع","notes":"اكتب خيارك في الخانة اليمين"},
  {"id":4,"section":"بيانات المشروع","text":"تاريخ بداية المشروع","notes":"اكتب تاريخ البداية في الخانة اليمين"},
  {"id":5,"section":"بيانات المشروع","text":"تارخ نهاية المشروع","notes":"اكتب تاريخ النهاية في الخانة اليمين"},
  {"id":6,"section":"بيانات المشروع","text":"ما هي أهداف المشروع؟","notes":""},
  {"id":7,"section":"بيانات المشروع","text":"ما هي مرحلة المشروع الحالية؟","notes":""},
  {"id":8,"section":"بيانات المشروع","text":"ماهو حجم الاستثمار المطلوب؟ (تقديري)","notes":""},

  {"id":9,"section":"الفكرة","text":"ما هي الفكرة الرئيسية للمشروع؟","notes":""},
  {"id":10,"section":"الفكرة","text":"ما هي طبيعة المشروع؟","notes":""},
  {"id":11,"section":"الفكرة","text":"ما هي المنتجات أو الخدمات التي سيقدمها المشروع؟","notes":""},

  {"id":12,"section":"الشريحة المستهدفة من العملاء","text":"من هم العملاء الأساسيون الذين يستهدفهم المشروع؟","notes":""},
  {"id":13,"section":"الشريحة المستهدفة من العملاء","text":"ما هي احتياجات العملاء التي يسعى المشروع لتلبيتها؟","notes":""},
  {"id":14,"section":"الشريحة المستهدفة من العملاء","text":"ما هو حجم السوق المستهدف؟","notes":""},

  {"id":15,"section":"عرض القيمة","text":"ما هي القيمة التي يقدمها المشروع للعملاء؟","notes":""},
  {"id":16,"section":"عرض القيمة","text":"ما الذي يميز المشروع عن المنافسين؟","notes":""},
  {"id":17,"section":"عرض القيمة","text":"ما هي المزايا التنافسية الرئيسية؟","notes":""},
  {"id":18,"section":"عرض القيمة","text":"كيف سيحل المشروع مشكلات العملاء أو يحسن تجربتهم؟","notes":""},

  {"id":19,"section":"قنوات التوزيع","text":"كيف سيتم إيصال المنتج أو الخدمة إلى العملاء؟","notes":""},
  {"id":20,"section":"قنوات التوزيع","text":"ما هي القنوات التسويقية التي سيتم استخدامها؟","notes":""},
  {"id":21,"section":"قنوات التوزيع","text":"هل سيتم الاعتماد على قنوات توزيع مباشرة أم غير مباشرة؟ ولماذا؟","notes":""},
  {"id":22,"section":"قنوات التوزيع","text":"ما هو دور التكنولوجيا في تحسين قنوات التوزيع؟","notes":""},

  {"id":23,"section":"العلاقة مع العملاء","text":"كيف سيتم بناء علاقة مستدامة مع العملاء؟","notes":""},
  {"id":24,"section":"العلاقة مع العملاء","text":"ما هي استراتيجيات خدمة العملاء والدعم الفني؟","notes":""},
  {"id":25,"section":"العلاقة مع العملاء","text":"هل سيكون هناك برامج ولاء أو عروض خاصة لجذب العملاء والاحتفاظ بهم؟","notes":""},
  {"id":26,"section":"العلاقة مع العملاء","text":"كيف سيتم التعامل مع الشكاوى والملاحظات؟","notes":""},
  {"id":27,"section":"العلاقة مع العملاء","text":"ما هي مؤشرات قياس رضا العملاء؟","notes":""},

  {"id":28,"section":"مصادر الإيرادات","text":"ما هي المصادر الرئيسية لإيرادات المشروع؟","notes":""},
  {"id":29,"section":"مصادر الإيرادات","text":"ما هو نموذج التسعير الذي سيتم اتباعه؟","notes":""},
  {"id":30,"section":"مصادر الإيرادات","text":"هل سيتم الاعتماد على مصادر دخل متعددة؟","notes":""},
  {"id":31,"section":"مصادر الإيرادات","text":"ما هي التوقعات المالية للإيرادات على المدى القصير والطويل؟","notes":""},
  {"id":32,"section":"مصادر الإيرادات","text":"هل هناك خطط لزيادة الإيرادات من خلال توسع السوق أو تحسين المنتجات؟","notes":""},

  {"id":33,"section":"الموارد الرئيسية","text":"ما هي الموارد البشرية المطلوبة لإنجاح المشروع؟","notes":""},
  {"id":34,"section":"الموارد الرئيسية","text":"ما هي الموارد المالية اللازمة لتنفيذ المشروع؟","notes":""},
  {"id":35,"section":"الموارد الرئيسية","text":"ما هي الموارد التقنية أو التكنولوجية المطلوبة؟","notes":""},
  {"id":36,"section":"الموارد الرئيسية","text":"هل هناك أصول مادية أو معدات ضرورية لتنفيذ المشروع؟","notes":""},
  {"id":37,"section":"الموارد الرئيسية","text":"كيف سيتم تأمين هذه الموارد؟","notes":""},

  {"id":38,"section":"الأنشطة الرئيسية","text":"ما هي الأنشطة الأساسية لتشغيل المشروع؟","notes":""},
  {"id":39,"section":"الأنشطة الرئيسية","text":"ما هي العمليات التشغيلية الرئيسية؟","notes":""},
  {"id":40,"section":"الأنشطة الرئيسية","text":"كيف سيتم تحسين كفاءة الأنشطة لضمان تحقيق الأهداف؟","notes":""},

  {"id":41,"section":"هيكل التكاليف","text":"ما هي التكاليف الرئيسية لتشغيل المشروع؟","notes":""},
  {"id":42,"section":"هيكل التكاليف","text":"هل هناك تكاليف ثابتة ومتغيرة؟ اشرحها.","notes":""},
  {"id":43,"section":"هيكل التكاليف","text":"ما هي استراتيجيات تقليل التكاليف دون التأثير على الجودة؟","notes":""},
  {"id":44,"section":"هيكل التكاليف","text":"كيف سيتم تحديد الأولويات في الإنفاق؟","notes":""},

  {"id":45,"section":"الشراكات الرئيسية","text":"هل يحتاج المشروع إلى شركاء استراتيجيين؟ من هم؟","notes":""},
  {"id":46,"section":"الشراكات الرئيسية","text":"ما هي طبيعة العلاقة مع الشركاء (تعاون/تحالف/تعاقد)؟","notes":""},
  {"id":47,"section":"الشراكات الرئيسية","text":"كيف سيسهم الشركاء في تعزيز نجاح المشروع؟","notes":""},
  {"id":48,"section":"الشراكات الرئيسية","text":"ما هي المخاطر المرتبطة بالشراكات وكيف سيتم التعامل معها؟","notes":""},

  {"id":49,"section":"تحليل السوق","text":"ما هو حجم السوق المستهدف؟","notes":""},
  {"id":50,"section":"تحليل السوق","text":"ما هي اتجاهات السوق الحالية والمستقبلية؟","notes":""},
  {"id":51,"section":"تحليل السوق","text":"ما هي الفجوات في السوق التي يمكن للمشروع سدها؟","notes":""},
  {"id":52,"section":"تحليل السوق","text":"ما هي المتغيرات الاقتصادية أو السياسية التي قد تؤثر على السوق؟","notes":""},
  {"id":53,"section":"تحليل السوق","text":"ما هي العوامل الاجتماعية أو الثقافية التي يجب أخذها بعين الاعتبار؟","notes":""},

  {"id":54,"section":"تحليل المنافسين","text":"من هم المنافسون الرئيسيون في السوق؟","notes":""},
  {"id":55,"section":"تحليل المنافسين","text":"ما هي نقاط القوة والضعف لديهم؟","notes":""},
  {"id":56,"section":"تحليل المنافسين","text":"ما هي استراتيجيات المنافسين التسويقية والتشغيلية؟","notes":""},
  {"id":57,"section":"تحليل المنافسين","text":"كيف يمكن للمشروع التفوق على المنافسين؟","notes":""},
  {"id":58,"section":"تحليل المنافسين","text":"هل هناك منافسون محتملون في المستقبل؟","notes":""},

  {"id":59,"section":"التحليل التسويقي","text":"ما هي استراتيجية التسويق المقترحة؟","notes":""},
  {"id":60,"section":"التحليل التسويقي","text":"ما هي القنوات التسويقية الأكثر فعالية للمشروع؟","notes":""},
  {"id":61,"section":"التحليل التسويقي","text":"ما هي الرسائل التسويقية الأساسية التي سيتم استخدامها؟","notes":""},
  {"id":62,"section":"التحليل التسويقي","text":"هل هناك خطة ترويجية لجذب العملاء في البداية؟","notes":""},
  {"id":63,"section":"التحليل التسويقي","text":"كيف سيتم قياس نجاح الحملة التسويقية؟","notes":""},

  {"id":64,"section":"التحليل الفني","text":"ما هي المتطلبات الفنية لتشغيل المشروع؟","notes":""},
  {"id":65,"section":"التحليل الفني","text":"ما هي التكنولوجيا المطلوبة؟","notes":""},
  {"id":66,"section":"التحليل الفني","text":"هل هناك حاجة لتطوير برامج أو أنظمة تقنية؟","notes":""},
  {"id":67,"section":"التحليل الفني","text":"كيف سيتم ضمان جودة المنتج أو الخدمة؟","notes":""},
  {"id":68,"section":"التحليل الفني","text":"ما هي خطط الصيانة والدعم الفني؟","notes":""},

  {"id":69,"section":"التحليل التشغيلي","text":"ما هي العمليات التشغيلية اليومية للمشروع؟","notes":""},
  {"id":70,"section":"التحليل التشغيلي","text":"ما هو حجم الموارد البشرية المطلوبة للتشغيل؟","notes":""},
  {"id":71,"section":"التحليل التشغيلي","text":"كيف سيتم إدارة سلسلة الإمداد (إن وجدت)؟","notes":""},
  {"id":72,"section":"التحليل التشغيلي","text":"هل هناك حاجة لتوفير مخزون؟ كيف سيتم إدارته؟","notes":""},
  {"id":73,"section":"التحليل التشغيلي","text":"ما هي خطط استمرارية الأعمال في حال حدوث مشاكل تشغيلية؟","notes":""},

  {"id":74,"section":"التحليل المالي","text":"ما هي التكاليف الاستثمارية (الرأسمالية) للمشروع؟","notes":""},
  {"id":75,"section":"التحليل المالي","text":"ما هي التكاليف التشغيلية الشهرية والسنوية؟","notes":""},
  {"id":76,"section":"التحليل المالي","text":"ما هي التوقعات المالية للإيرادات؟","notes":""},
  {"id":77,"section":"التحليل المالي","text":"ما هو صافي الربح المتوقع؟","notes":""},
  {"id":78,"section":"التحليل المالي","text":"ما هي نقطة التعادل (Break-even Point)؟","notes":""},
  {"id":79,"section":"التحليل المالي","text":"ما هو معدل العائد على الاستثمار (ROI) المتوقع؟","notes":""},
  {"id":80,"section":"التحليل المالي","text":"ما هي مؤشرات الأداء المالية الرئيسية؟","notes":""},

  {"id":81,"section":"تحليل المخاطر","text":"ما هي المخاطر الرئيسية التي قد تواجه المشروع؟","notes":""},
  {"id":82,"section":"تحليل المخاطر","text":"ما هي احتمالية حدوث كل خطر وتأثيره؟","notes":""},
  {"id":83,"section":"تحليل المخاطر","text":"ما هي خطط التخفيف من المخاطر؟","notes":""},
  {"id":84,"section":"تحليل المخاطر","text":"ما هي خطط الطوارئ في حال حدوث مخاطر كبيرة؟","notes":""},
  {"id":85,"section":"تحليل المخاطر","text":"كيف سيتم مراقبة المخاطر وتحديثها؟","notes":""},

  {"id":86,"section":"الجدول الزمني","text":"ما هي مراحل تنفيذ المشروع؟","notes":""},
  {"id":87,"section":"الجدول الزمني","text":"ما هو الجدول الزمني المقترح لكل مرحلة؟","notes":""},
  {"id":88,"section":"الجدول الزمني","text":"ما هي المعالم الرئيسية (Milestones) للمشروع؟","notes":""},
  {"id":89,"section":"الجدول الزمني","text":"ما هي العوامل التي قد تؤثر على الجدول الزمني؟","notes":""},

  {"id":90,"section":"الهيكل التنظيمي","text":"ما هو الهيكل التنظيمي للمشروع؟","notes":""},
  {"id":91,"section":"الهيكل التنظيمي","text":"ما هي الأدوار والمسؤوليات الرئيسية؟","notes":""},
  {"id":92,"section":"الهيكل التنظيمي","text":"كيف سيتم إدارة فريق العمل؟","notes":""},
  {"id":93,"section":"الهيكل التنظيمي","text":"ما هي آليات التواصل الداخلي؟","notes":""},

  {"id":94,"section":"الجوانب القانونية","text":"ما هي المتطلبات القانونية لتأسيس المشروع؟","notes":""},
  {"id":95,"section":"الجوانب القانونية","text":"هل هناك تراخيص أو تصاريح مطلوبة؟","notes":""},
  {"id":96,"section":"الجوانب القانونية","text":"ما هي القوانين واللوائح التي يجب الالتزام بها؟","notes":""},
  {"id":97,"section":"الجوانب القانونية","text":"هل هناك عقود أو اتفاقيات يجب إعدادها؟","notes":""},

  {"id":98,"section":"الاستدامة والمسؤولية","text":"كيف سيسهم المشروع في الاستدامة البيئية أو الاجتماعية؟","notes":""},
  {"id":99,"section":"الاستدامة والمسؤولية","text":"ما هي الممارسات المستدامة التي سيتم تبنيها؟","notes":""},
  {"id":100,"section":"الاستدامة والمسؤولية","text":"هل هناك خطة للمسؤولية الاجتماعية؟","notes":""},

  {"id":101,"section":"الأصول والخصوم","text":"ما هي الأصول الثابتة المطلوبة للمشروع؟","notes":""},
  {"id":102,"section":"الأصول والخصوم","text":"ما هي الأصول المتداولة؟","notes":""},
  {"id":103,"section":"الأصول والخصوم","text":"ما هي الخصوم قصيرة الأجل؟","notes":""},
  {"id":104,"section":"الأصول والخصوم","text":"ما هي الخصوم طويلة الأجل؟","notes":""},

  {"id":105,"section":"التمويل","text":"ما هي مصادر التمويل المحتملة؟","notes":""},
  {"id":106,"section":"التمويل","text":"هل سيتم الاعتماد على تمويل ذاتي أم قروض أم مستثمرين؟","notes":""},
  {"id":107,"section":"التمويل","text":"ما هي شروط التمويل المتوقعة؟","notes":""},
  {"id":108,"section":"التمويل","text":"ما هي الضمانات المطلوبة (إن وجدت)؟","notes":""},

  {"id":109,"section":"الخلاصة والتوصيات","text":"ما هي النتائج الرئيسية لدراسة الجدوى؟","notes":""},
  {"id":110,"section":"الخلاصة والتوصيات","text":"هل المشروع قابل للتنفيذ؟ ولماذا؟","notes":""},
  {"id":111,"section":"الخلاصة والتوصيات","text":"ما هي التوصيات المقترحة لتحسين فرص نجاح المشروع؟","notes":""},

  {"id":112,"section":"الخصوم والملكية","text":"ما هي قيمة رأس المال؟","notes":""},
  {"id":113,"section":"الخصوم والملكية","text":"ما هي حصة الملكية (إن وجدت)؟","notes":""},
  {"id":114,"section":"الخصوم والملكية","text":"هل هناك مستثمرون أو شركاء؟","notes":""},
  {"id":115,"section":"الخصوم والملكية","text":"كيف سيتم توزيع الأرباح؟","notes":""},
  {"id":116,"section":"الخصوم والملكية","text":"ما هي الديون أو الالتزامات المالية للمشروع؟","notes":""}
];

// ===== Helpers =====
function normSpace(s){
  return (s ?? "").toString().replace(/\s+/g, " ").trim();
}
function money(n){
  const x = Number(n || 0);
  return Number.isFinite(x) ? x.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "0";
}
function nowStamp(){
  const d = new Date();
  return d.toLocaleString("ar-MA", { dateStyle: "medium", timeStyle: "short" });
}
function guessFieldType(qText){
  const t = normSpace(qText);
  if (t.includes("تاريخ")) return "date";
  // Yes/No-ish
  if (t.startsWith("هل ") || t.includes("هل هناك")) return "yesno";
  // numeric-ish
  const numKeys = ["نسبة", "%", "قيمة", "حجم", "تكلفة", "إيراد", "صافي", "نقطة التعادل", "ROI", "رأس المال", "ديون", "التزامات"];
  if (numKeys.some(k => t.includes(k))) return "number";
  return "text";
}
function setSaveStatus(text){
  $("#saveStatus").text(text);
}

// ===== Build Form (sections + questions) =====
function buildForm(){
  // group by section
  const grouped = {};
  QUESTIONS.forEach(q => {
    const sec = normSpace(q.section);
    if(!grouped[sec]) grouped[sec] = [];
    grouped[sec].push(q);
  });

  // build nav + cards
  const $nav = $("#navSections").empty();
  const $container = $("#formContainer").empty();

  const sections = Object.keys(grouped);

  sections.forEach((sec, idx) => {
    const secId = `sec_${idx}_${sec.replace(/\s/g, "_")}`;

    $nav.append(`<li><a href="#${secId}" data-sec="${secId}" class="${idx===0?'active':''}">${sec}</a></li>`);

    const $card = $(`
      <section class="card section-card" id="${secId}" data-section="${sec}">
        <div class="card-head">
          <h2>${sec}</h2>
          <p class="hint">عدد الأسئلة: ${grouped[sec].length}</p>
        </div>
        <div class="qs"></div>
      </section>
    `);

    grouped[sec].forEach(q => {
      const name = `q_${q.id}`;
      const type = guessFieldType(q.text);

      let inputHtml = "";
      if(type === "date"){
        inputHtml = `<input type="date" name="${name}" />`;
      } else if(type === "number"){
        inputHtml = `<input type="number" step="0.01" name="${name}" placeholder="أدخل قيمة رقمية (اختياري)"/>`;
      } else if(type === "yesno"){
        inputHtml = `
          <select name="${name}">
            <option value="">— اختر —</option>
            <option value="نعم">نعم</option>
            <option value="لا">لا</option>
          </select>
          <div style="margin-top:8px">
            <textarea name="${name}_details" placeholder="تفاصيل/توضيح (اختياري)"></textarea>
          </div>
        `;
      } else {
        inputHtml = `<textarea name="${name}" placeholder="اكتب إجابتك هنا..."></textarea>`;
      }

      const noteLine = q.notes ? `<div class="q-meta">ملاحظة تعبئة: ${q.notes}</div>` : `<div class="q-meta">—</div>`;

      $card.find(".qs").append(`
        <div class="q" data-qid="${q.id}" data-qtext="${normSpace(q.text)}">
          <div class="q-head">
            <span class="badge">${q.id}</span>
            <div>
              <p class="q-title">${q.text}</p>
              ${noteLine}
            </div>
          </div>
          <div class="q-input">${inputHtml}</div>
        </div>
      `);
    });

    $container.append($card);
  });

  // nav active click
  $("#navSections a").on("click", function(){
    $("#navSections a").removeClass("active");
    $(this).addClass("active");
  });
}

// ===== Tables (revenues/costs) =====
function addRevRow(row = {}){
  const $tr = $(`
    <tr>
      <td><input type="text" class="rev-name" value="${row.name ?? ""}"></td>
      <td><input type="text" class="rev-unit" value="${row.unit ?? ""}"></td>
      <td><input type="number" class="rev-qty" step="0.01" value="${row.qty ?? ""}"></td>
      <td><input type="number" class="rev-price" step="0.01" value="${row.price ?? ""}"></td>
      <td class="rev-m">0</td>
      <td class="rev-y">0</td>
      <td><button class="icon-btn rev-del" type="button">حذف</button></td>
    </tr>
  `);
  $("#revTable tbody").append($tr);
}
function addCostRow(row = {}){
  const $tr = $(`
    <tr>
      <td><input type="text" class="c-name" value="${row.name ?? ""}"></td>
      <td><input type="text" class="c-unit" value="${row.unit ?? ""}"></td>
      <td><input type="number" class="c-qty" step="0.01" value="${row.qty ?? ""}"></td>
      <td><input type="number" class="c-price" step="0.01" value="${row.price ?? ""}"></td>
      <td class="c-m">0</td>
      <td class="c-y">0</td>
      <td><button class="icon-btn c-del" type="button">حذف</button></td>
    </tr>
  `);
  $("#costTable tbody").append($tr);
}

function recalcTables(){
  let revM=0, revY=0;
  $("#revTable tbody tr").each(function(){
    const qty = Number($(this).find(".rev-qty").val() || 0);
    const price = Number($(this).find(".rev-price").val() || 0);
    const m = qty * price;
    const y = m * 12;
    $(this).find(".rev-m").text(money(m));
    $(this).find(".rev-y").text(money(y));
    revM += m; revY += y;
  });
  $("#revTotalMonthly").text(money(revM));
  $("#revTotalYearly").text(money(revY));

  let cM=0, cY=0;
  $("#costTable tbody tr").each(function(){
    const qty = Number($(this).find(".c-qty").val() || 0);
    const price = Number($(this).find(".c-price").val() || 0);
    const m = qty * price;
    const y = m * 12;
    $(this).find(".c-m").text(money(m));
    $(this).find(".c-y").text(money(y));
    cM += m; cY += y;
  });
  $("#costTotalMonthly").text(money(cM));
  $("#costTotalYearly").text(money(cY));

  // summary boxes
  $("#sumRevM").text(money(revM));
  $("#sumRevY").text(money(revY));
  $("#sumCostM").text(money(cM));
  $("#sumCostY").text(money(cY));
  $("#sumNetM").text(money(revM - cM));
  $("#sumNetY").text(money(revY - cY));
}

// ===== Save/Load =====
function collectAll(){
  const data = {
    answers: {},
    revenues: [],
    costs: [],
    meta: { savedAt: new Date().toISOString(), version: "v1" }
  };

  // only question fields
  $(`[name^="q_"]`).each(function(){
    const name = $(this).attr("name");
    data.answers[name] = $(this).val();
  });

  $("#revTable tbody tr").each(function(){
    data.revenues.push({
      name: $(this).find(".rev-name").val(),
      unit: $(this).find(".rev-unit").val(),
      qty: $(this).find(".rev-qty").val(),
      price: $(this).find(".rev-price").val()
    });
  });

  $("#costTable tbody tr").each(function(){
    data.costs.push({
      name: $(this).find(".c-name").val(),
      unit: $(this).find(".c-unit").val(),
      qty: $(this).find(".c-qty").val(),
      price: $(this).find(".c-price").val()
    });
  });

  return data;
}

function saveToLocal(){
  const data = collectAll();
  localStorage.setItem(LS_KEY, JSON.stringify(data));
  setSaveStatus(`آخر حفظ: ${nowStamp()}`);
}

function loadFromLocal(){
  const raw = localStorage.getItem(LS_KEY);
  if(!raw) return false;

  try{
    const data = JSON.parse(raw);

    // answers
    Object.keys(data.answers || {}).forEach(k => {
      const $el = $(`[name="${k}"]`);
      if($el.length) $el.val(data.answers[k]);
    });

    // tables
    $("#revTable tbody").empty();
    (data.revenues || []).forEach(r => addRevRow(r));
    if(!(data.revenues || []).length) addRevRow();

    $("#costTable tbody").empty();
    (data.costs || []).forEach(r => addCostRow(r));
    if(!(data.costs || []).length) addCostRow();

    recalcTables();

    setSaveStatus(`آخر حفظ: ${data.meta?.savedAt ? new Date(data.meta.savedAt).toLocaleString("ar-MA",{dateStyle:"medium",timeStyle:"short"}) : nowStamp()}`);
    return true;
  }catch(e){
    return false;
  }
}

// ===== Download helpers =====
function downloadFile(filename, content, mime){
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportJSON(){
  const data = collectAll();
  const projectName = (data.answers["q_1"] || "project").toString().trim().replace(/\s+/g, "_") || "project";
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  downloadFile(`${projectName}_${stamp}.json`, JSON.stringify(data, null, 2), "application/json;charset=utf-8");
}

function applyImportedData(data){
  if(!data) return;

  // answers
  if(data.answers){
    Object.keys(data.answers).forEach(k => {
      const $el = $(`[name="${k}"]`);
      if($el.length) $el.val(data.answers[k]);
    });
  }

  // tables
  $("#revTable tbody").empty();
  if(Array.isArray(data.revenues) && data.revenues.length){
    data.revenues.forEach(r => addRevRow(r));
  }else{
    addRevRow();
  }

  $("#costTable tbody").empty();
  if(Array.isArray(data.costs) && data.costs.length){
    data.costs.forEach(r => addCostRow(r));
  }else{
    addCostRow();
  }

  recalcTables();

  // persist
  localStorage.setItem(LS_KEY, JSON.stringify(data));
  setSaveStatus(`آخر حفظ: ${nowStamp()}`);
}

function importJSONFile(file){
  const reader = new FileReader();
  reader.onload = function(e){
    try{
      const data = JSON.parse(e.target.result);
      applyImportedData(data);
      alert("تم الاستيراد بنجاح ✅");
    }catch(err){
      alert("ملف غير صالح أو يوجد خطأ في JSON.");
    }
  };
  reader.readAsText(file, "utf-8");
}

// ===== Search filter =====
function applySearchFilter(query){
  const q = normSpace(query).toLowerCase();

  if(!q){
    $(".q").show();
    $(".section-card").show();
    $("#navSections li").show();
    return;
  }

  // filter questions
  $(".q").each(function(){
    const text = ($(this).attr("data-qtext") || "").toLowerCase();
    const visible = text.includes(q);
    $(this).toggle(visible);
  });

  // hide empty sections
  $(".section-card").each(function(){
    const hasVisible = $(this).find(".q:visible").length > 0;
    $(this).toggle(hasVisible);

    const sec = $(this).attr("id");
    $(`#navSections a[data-sec="${sec}"]`).closest("li").toggle(hasVisible);
  });
}

// ===== Report (Comprehensive) =====
function buildReportHTML(data){
  const projectName = (data.answers["q_1"] || "بدون اسم").toString().trim();
  $("#reportProjectName").text(`اسم المشروع: ${projectName || "—"}`);
  $("#reportDate").text(`تاريخ التقرير: ${nowStamp()}`);
  $("#reportTitle").text("تقرير دراسة جدوى شامل");

  // group questions
  const grouped = {};
  QUESTIONS.forEach(q => {
    const sec = normSpace(q.section);
    if(!grouped[sec]) grouped[sec] = [];
    grouped[sec].push(q);
  });

  let html = "";

  Object.keys(grouped).forEach(sec => {
    html += `<div class="report-section">
      <h2>${sec}</h2>`;

    grouped[sec].forEach(q => {
      const key = `q_${q.id}`;
      let ans = (data.answers[key] ?? "").toString().trim();

      // details for yes/no
      const dKey = `${key}_details`;
      const details = (data.answers[dKey] ?? "").toString().trim();
      if(details && ans) ans = `${ans}\nتفاصيل: ${details}`;
      else if(details && !ans) ans = `${details}`;

      if(!ans) ans = "—";

      html += `
        <div class="report-item">
          <div class="qtxt">${q.id}. ${q.text}</div>
          <div class="aval">${ans}</div>
        </div>
      `;
    });

    html += `</div>`;
  });

  // Revenues table (full)
  const revRows = data.revenues || [];
  const revM = $("#revTotalMonthly").text();
  const revY = $("#revTotalYearly").text();

  html += `
    <div class="report-section">
      <h2>الإيرادات (تفصيلي)</h2>
      <table class="report-table">
        <thead>
          <tr>
            <th>المنتج / الخدمة</th>
            <th>الوحدة</th>
            <th>الكمية الشهرية</th>
            <th>قيمة الوحدة</th>
            <th>إيراد شهري</th>
            <th>إيراد سنوي</th>
          </tr>
        </thead>
        <tbody>
          ${revRows.map(r=>{
            const qty = Number(r.qty || 0);
            const price = Number(r.price || 0);
            const m = qty * price;
            const y = m * 12;
            return `
              <tr>
                <td>${normSpace(r.name) || "—"}</td>
                <td>${normSpace(r.unit) || "—"}</td>
                <td>${money(qty)}</td>
                <td>${money(price)}</td>
                <td>${money(m)}</td>
                <td>${money(y)}</td>
              </tr>
            `;
          }).join("") || `<tr><td colspan="6">—</td></tr>`}
        </tbody>
      </table>

      <div class="report-kpi">
        <div class="box"><div class="k">إجمالي الإيرادات الشهرية</div><div class="v">${revM}</div></div>
        <div class="box"><div class="k">إجمالي الإيرادات السنوية</div><div class="v">${revY}</div></div>
      </div>
    </div>
  `;

  // Costs table (full)
  const costRows = data.costs || [];
  const cM = $("#costTotalMonthly").text();
  const cY = $("#costTotalYearly").text();

  html += `
    <div class="report-section">
      <h2>التكاليف (تفصيلي)</h2>
      <table class="report-table">
        <thead>
          <tr>
            <th>البند</th>
            <th>الوحدة</th>
            <th>الكمية الشهرية</th>
            <th>تكلفة الوحدة</th>
            <th>تكلفة شهرية</th>
            <th>تكلفة سنوية</th>
          </tr>
        </thead>
        <tbody>
          ${costRows.map(r=>{
            const qty = Number(r.qty || 0);
            const price = Number(r.price || 0);
            const m = qty * price;
            const y = m * 12;
            return `
              <tr>
                <td>${normSpace(r.name) || "—"}</td>
                <td>${normSpace(r.unit) || "—"}</td>
                <td>${money(qty)}</td>
                <td>${money(price)}</td>
                <td>${money(m)}</td>
                <td>${money(y)}</td>
              </tr>
            `;
          }).join("") || `<tr><td colspan="6">—</td></tr>`}
        </tbody>
      </table>

      <div class="report-kpi">
        <div class="box"><div class="k">إجمالي التكاليف الشهرية</div><div class="v">${cM}</div></div>
        <div class="box"><div class="k">إجمالي التكاليف السنوية</div><div class="v">${cY}</div></div>
      </div>
    </div>
  `;

  // Net summary
  const netM = (Number($("#sumNetM").text().replace(/,/g,"")) || (Number(revM.replace(/,/g,"")) - Number(cM.replace(/,/g,""))));
  const netY = (Number($("#sumNetY").text().replace(/,/g,"")) || (Number(revY.replace(/,/g,"")) - Number(cY.replace(/,/g,""))));

  html += `
    <div class="report-section">
      <h2>ملخص مالي (تقديري)</h2>
      <div class="report-kpi">
        <div class="box"><div class="k">الإيرادات الشهرية</div><div class="v">${revM}</div></div>
        <div class="box"><div class="k">التكاليف الشهرية</div><div class="v">${cM}</div></div>
        <div class="box"><div class="k">الصافي الشهري</div><div class="v">${money(netM)}</div></div>
        <div class="box"><div class="k">الإيرادات السنوية</div><div class="v">${revY}</div></div>
        <div class="box"><div class="k">التكاليف السنوية</div><div class="v">${cY}</div></div>
        <div class="box"><div class="k">الصافي السنوي</div><div class="v">${money(netY)}</div></div>
      </div>
      <div class="report-item">
        <div class="qtxt">ملاحظة</div>
        <div class="aval">هذا الملخص تقديري مبني على إدخالات المستخدم في جداول الإيرادات والتكاليف.</div>
      </div>
    </div>
  `;

  $("#reportBody").html(html);
}

function exportPDF(){
  const data = collectAll();
  buildReportHTML(data);
  window.print(); // user chooses "Save as PDF"
}

function exportWordDoc(){
  const data = collectAll();
  buildReportHTML(data);

  const projectName = (data.answers["q_1"] || "project").toString().trim().replace(/\s+/g, "_") || "project";
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  const reportHTML = document.getElementById("report").outerHTML;

  // self-contained doc
  const doc = `
  <html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <title>Feasibility Report</title>
    <style>
      body{font-family:Tahoma, Arial, sans-serif; direction:rtl; margin:24px}
      #report{display:block}
      .report-header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;border-bottom:2px solid #eee;padding-bottom:14px;margin-bottom:14px}
      .report-title h1{margin:0 0 8px 0;font-size:22px}
      .report-meta{display:flex;gap:14px;flex-wrap:wrap;color:#333;font-size:13px}
      .report-badge{border:1px solid #eee;background:#fafafa;border-radius:12px;padding:10px 12px;font-size:12px;color:#444;min-width:150px;text-align:center}
      .report-section{margin:16px 0;page-break-inside:avoid}
      .report-section h2{margin:0 0 10px 0;font-size:16px;background:#f6f7f9;border:1px solid #e9eaee;padding:10px 12px;border-radius:12px}
      .report-item{padding:10px 12px;border:1px solid #e9eaee;border-radius:12px;margin-bottom:10px}
      .qtxt{font-weight:800;margin-bottom:6px}
      .aval{white-space:pre-wrap;line-height:1.6}
      .report-table{width:100%;border-collapse:collapse;margin-top:10px;font-size:13px}
      .report-table th,.report-table td{border:1px solid #e5e7eb;padding:8px;text-align:right}
      .report-table thead th{background:#f3f4f6}
      .report-kpi{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:10px}
      .report-kpi .box{border:1px solid #e5e7eb;border-radius:12px;padding:10px;background:#fafafa}
      .report-kpi .k{font-size:12px;color:#555}
      .report-kpi .v{font-size:16px;font-weight:900;margin-top:6px}
      .report-footer{margin-top:20px;border-top:1px solid #eee;padding-top:10px;color:#555;font-size:12px}
    </style>
  </head>
  <body>${reportHTML}</body>
  </html>`;

  downloadFile(`${projectName}_${stamp}.doc`, doc, "application/msword;charset=utf-8");
}

// ===== Init =====
$(function(){
  buildForm();

  // initial rows if no saved data
  const loaded = loadFromLocal();
  if(!loaded){
    addRevRow();
    addCostRow();
    recalcTables();
    setSaveStatus("آخر حفظ: —");
  }

  // table events
  $(document).on("input", "#revTable input, #costTable input", function(){
    recalcTables();
    saveToLocal();
  });

  $(document).on("click", ".rev-del", function(){
    $(this).closest("tr").remove();
    recalcTables();
    saveToLocal();
  });
  $(document).on("click", ".c-del", function(){
    $(this).closest("tr").remove();
    recalcTables();
    saveToLocal();
  });

  $("#addRevRow").on("click", function(){
    addRevRow();
    recalcTables();
    saveToLocal();
  });
  $("#addCostRow").on("click", function(){
    addCostRow();
    recalcTables();
    saveToLocal();
  });

  // answers autosave
  $(document).on("input change", `[name^="q_"]`, function(){
    saveToLocal();
  });

  // search
  $("#searchBox").on("input", function(){
    applySearchFilter($(this).val());
  });

  // buttons
  $("#btnSave").on("click", saveToLocal);
  $("#btnExportJson").on("click", exportJSON);
  $("#btnExportPdf").on("click", exportPDF);
  $("#btnExportDoc").on("click", exportWordDoc);

  $("#btnImport").on("click", function(){
    $("#importFile").click();
  });
  $("#importFile").on("change", function(){
    const file = this.files && this.files[0];
    if(file) importJSONFile(file);
    this.value = "";
  });

  $("#btnClear").on("click", function(){
    if(confirm("هل تريد مسح كل البيانات المحفوظة؟")){
      localStorage.removeItem(LS_KEY);
      location.reload();
    }
  });

  // safe initial save status if data exists
  if(localStorage.getItem(LS_KEY)) setSaveStatus(`آخر حفظ: ${nowStamp()}`);
});
