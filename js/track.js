import { t, getLang } from "./site.js";

// صفحة التتبع الرسمية لشركة Click (Olivery)
const OLIVERY_URL = "https://click.olivery.io/order_tracking";
// دالة Netlify التي تبحث في Olivery (انظر netlify/functions/track.mjs)
const API_URL = "/api/track";

// مراحل الطلب العادية بالترتيب، والنص من القاموس step.<key>
const STEPS = [
  { key: "received", icon: "📥" },
  { key: "preparing", icon: "📦" },
  { key: "with_driver", icon: "🚚" },
  { key: "delivered", icon: "✅" },
];

// حالات خاصة تُنهي المسار
const SPECIAL = { cancelled: "✖", returned: "↩" };

const form = document.getElementById("track-form");
const input = document.getElementById("tracking-input");
const views = {
  loading: document.getElementById("loading"),
  result: document.getElementById("result"),
  notfound: document.getElementById("not-found"),
  error: document.getElementById("error-box"),
};

let currentId = "";
let lastOrder = null; // آخر طلب معروض، لإعادة رسمه عند تغيير اللغة

function setView(view) {
  Object.entries(views).forEach(([name, node]) => node.classList.toggle("hidden", name !== view));
}

// ترجمة حالات Olivery المعروفة للعربية (بالإنجليزي تظهر كما هي)
const OLIVERY_AR = {
  "in branch": "في الفرع",
  "waiting": "تم استلام الطلب",
  "picked up": "تم الاستلام من المتجر",
  "picked": "تم الاستلام من المتجر",
  "out for delivery": "مع المندوب",
  "in progress": "قيد التوصيل",
  "postponed": "مؤجل",
  "delivered": "تم التسليم",
  "completed": "مكتمل",
  "money collected": "تم التسليم",
  "cancelled": "ملغي",
  "canceled": "ملغي",
  "rejected": "مرفوض",
  "returned": "مرتجع",
  "stuck": "عالق",
  "on hold": "متوقف",
};

// حالات نعرضها بالإنجليزي بنص مختلف عن نص Olivery
const OLIVERY_EN = {
  "waiting": "Order received",
};

function translateStatus(text = "") {
  const key = text.trim().toLowerCase();
  if (getLang() === "en") return OLIVERY_EN[key] || text;
  return OLIVERY_AR[key] || text;
}

// طرد مؤجل أو مرتجع أو عالق: نطلب من الزبون مراجعة الفرع
function needsBranch(text = "") {
  return /postpon|return|reject|stuck|hold|delay|مؤجل|مرتجع|راجع|مرفوض|عالق|متوقف/i.test(text);
}

// تحويل نص الحالة القادم من Olivery إلى إحدى مراحل الخط الزمني
function mapStatus(text = "") {
  const s = text.toLowerCase();
  if (/cancel|ملغ|إلغاء|الغاء/.test(s)) return "cancelled";
  if (/return|reject|مرتجع|راجع|رفض/.test(s)) return "returned";
  if (/out for|driver|in.?progress|on the way|postpon|مندوب|سائق|قيد التوصيل|في الطريق|مؤجل/.test(s)) return "with_driver";
  if (/deliver|complete|تم التوصيل|تم التسليم|سُلّم/.test(s)) return "delivered";
  if (/pick|prepar|warehouse|branch|تجهيز|مخزن|المستودع|الفرع/.test(s)) return "preparing";
  return "received";
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date)) return String(value);
  return date.toLocaleString(getLang() === "en" ? "en-GB" : "ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderTimeline(status) {
  const list = document.getElementById("timeline");
  list.innerHTML = "";

  const isSpecial = status in SPECIAL;
  const currentIndex = STEPS.findIndex((s) => s.key === status);
  const delivered = status === "delivered";

  const addStep = (className, dot, label) => {
    const li = document.createElement("li");
    li.className = className;
    li.innerHTML = `<div class="tl-dot"></div><div class="tl-label"></div>`;
    li.querySelector(".tl-dot").textContent = dot;
    li.querySelector(".tl-label").textContent = label;
    list.appendChild(li);
  };

  STEPS.forEach((step, i) => {
    const done = !isSpecial && (i < currentIndex || delivered);
    let cls = "tl-step";
    if (done) cls += " done";
    if (!isSpecial && i === currentIndex && !delivered) cls += " current";
    if (delivered && step.key === "delivered") cls += " delivered-final";
    addStep(cls, done ? "✓" : i + 1, step.icon + " " + t("step." + step.key));
  });

  // للطلب الملغي أو المرتجع نضيف خطوة حمراء/برتقالية في النهاية
  if (isSpecial) addStep("tl-step failed " + status, SPECIAL[status], t("step." + status));
}

// يرسم بطاقة الطلب من بيانات Olivery الخام، فيعاد رسمها بسهولة عند تغيير اللغة
function renderOrder(order) {
  lastOrder = order;
  const statusKey = mapStatus(order.status);

  document.getElementById("order-id").textContent = order.sequence;

  const branch = needsBranch(order.status);
  const badge = document.getElementById("order-status");
  badge.textContent = translateStatus(order.status);
  badge.className = "badge " + statusKey + (branch ? " attention" : "");
  document.getElementById("branch-notice").classList.toggle("hidden", !branch);

  // [مفتاح العنوان, القيمة]
  const details = [
    ["detail.reference", order.reference],
    ["detail.previous", translateStatus(order.previousStatus)],
    ["detail.created", formatDate(order.createdOn)],
  ];

  const box = document.getElementById("order-details");
  box.innerHTML = "";
  details
    .filter(([, value]) => value)
    .forEach(([key, value]) => {
      const d = document.createElement("div");
      d.className = "detail";
      d.innerHTML = "<span></span><strong></strong>";
      d.querySelector("span").textContent = t(key);
      d.querySelector("strong").textContent = value;
      box.appendChild(d);
    });

  renderTimeline(statusKey);
  setView("result");
}

/* ---------------------------------------------------------
   مصادر البحث
   --------------------------------------------------------- */

// البحث في Olivery عبر دالة Netlify. ترجع null إذا لم تكن الدالة متاحة.
async function findInOlivery(id) {
  try {
    const res = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`);
    if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return null;
    const data = await res.json();
    return Array.isArray(data.orders) ? data.orders : null;
  } catch {
    return null;
  }
}

// فتح صفحة Click الرسمية في تبويب جديد مع البحث عن الرقم مباشرة
function openOlivery() {
  const f = document.createElement("form");
  f.method = "POST";
  f.action = OLIVERY_URL;
  f.target = "_blank";
  const field = document.createElement("input");
  field.type = "hidden";
  field.name = "order_seq";
  field.value = currentId;
  f.appendChild(field);
  document.body.appendChild(f);
  f.submit();
  f.remove();
}

async function trackOrder(rawId) {
  const id = rawId.trim().replace(/\s+/g, "");
  if (!id) return;

  currentId = id;
  lastOrder = null;
  input.value = id;
  // نحدّث الرابط ليسهل مشاركته
  history.replaceState(null, "", "?id=" + encodeURIComponent(id));
  setView("loading");

  const orders = await findInOlivery(id);
  if (orders === null) {
    setView("error");
    return;
  }
  if (orders.length === 0) {
    document.getElementById("not-found-id").textContent = id;
    setView("notfound");
    return;
  }

  const order = orders.find((o) => o.sequence === id || o.reference === id) || orders[0];
  renderOrder({ ...order, sequence: order.sequence || id });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  trackOrder(input.value);
});

document.querySelectorAll(".external-btn").forEach((btn) => btn.addEventListener("click", openOlivery));

document.addEventListener("langchange", () => {
  if (lastOrder) renderOrder(lastOrder);
});

// قراءة رقم التتبع من الرابط ?id=
const urlId = new URLSearchParams(location.search).get("id");
if (urlId) trackOrder(urlId);
