// اللغة (عربي/English) والوضع (نهاري/ليلي) لكل صفحات الموقع.
// النصوص الثابتة في HTML تحمل data-i18n="المفتاح" وتُترجم من القاموس أدناه.

const DICT = {
  ar: {
    "title.home": "A Logistics | نصل بثقتك",
    "title.stores": "A Logistics | عناوين الشحن",
    "title.track": "A Logistics | تتبع طلبك",

    "nav.menu": "القائمة",
    "nav.home": "الرئيسية",
    "nav.stores": "عناوين الشحن",
    "nav.track": "التتبع",
    "nav.how": "كيف نعمل",
    "nav.about": "من نحن",
    "nav.whatsapp": "واتساب",
    "nav.contact": "اتصل بنا",
    "toggle.lang": "English",
    "toggle.langShort": "EN",
    "toggle.dark": "الوضع الليلي",
    "toggle.light": "الوضع النهاري",

    "home.title": 'تتبع شحنات <span class="accent">A Logistics</span>',
    "home.lead": "تتبع طرودك في الوقت الفعلي وابقَ على اطلاع بكل خطوة في رحلة التوصيل",
    "home.promo": "اطلب من SHEIN و Temu و Zara وغيرها… واحنا نوصّلك",
    "home.allStores": "عرض جميع عناوين الشحن ←",
    "track.placeholder": "أدخل رقم التتبع",
    "track.button": "تتبع الآن",

    "offers.label": "العروض والوسطاء",
    "offers.prev": "السابق",
    "offers.next": "التالي",
    "offers.more": "اعرف أكثر",

    "why.title": "لماذا تختارنا",
    "why.license.title": "بريد قانوني ومرخّص",
    "why.license.text": "مرخّص من الجهات الفلسطينية ذات العلاقة",
    "why.1.title": "تتبع في الوقت الفعلي",
    "why.1.text": "راقب موقع طردك وحالته مع تحديثات مباشرة",
    "why.2.title": "توصيل سريع",
    "why.2.text": "خدمة توصيل سريعة وفعّالة لإيصال طردك إليك",
    "why.3.title": "آمن ومضمون",
    "why.3.text": "يتم التعامل مع طرودك بعناية وأمان",
    "why.4.title": "دعم متواصل",
    "why.4.text": "فريق الدعم لدينا جاهز دائماً لمساعدتك",

    "how.title": "كيف نعمل؟",
    "how.subtitle": "ثلاث خطوات بسيطة حتى يصلك طلبك",
    "how.1.title": "اطلب من المتجر",
    "how.1.text": "اطلب من أي متجر شريك، ويقوم المتجر بتسليم طلبك لنا",
    "how.2.title": "نجهّز ونشحن",
    "how.2.text": "نستلم الطلب ونجهّزه ثم نسلّمه لأقرب مندوب في منطقتك",
    "how.3.title": "استلم وتتبّع",
    "how.3.text": "تابع حالة طلبك برقم التتبع حتى يصل إلى باب بيتك",

    "cta.title": "جاهز لتتبع طردك؟",
    "cta.text": "أدخل رقم التتبع أعلاه أو اتصل بنا للحصول على المساعدة",
    "cta.button": "ابدأ الآن",

    "footer.about": "شريكك الموثوق للتوصيل وتتبع الطرود.",
    "footer.social": "وسائل التواصل",
    "footer.facebook": "فيسبوك",
    "footer.instagram": "انستغرام",
    "footer.whatsapp": "واتساب",
    "footer.links": "روابط سريعة",
    "footer.trackLink": "تتبع طلبك",
    "footer.address": "العنوان",
    "footer.city": "نابلس، فلسطين",
    "footer.hours": "يومياً 9 صباحاً – 3:30 مساءً",
    "footer.channel": "قناتنا على واتساب",
    "footer.contact": "تواصل معنا",
    "footer.copy": "© 2026 A Logistics – نصل بثقتك. جميع الحقوق محفوظة.",
    "footer.admin": "دخول الإدارة",

    "stores.title": 'كيف تطلب من <span class="accent">المواقع العالمية</span>',
    "stores.subtitle": 'حدّد المتجر الذي تود الشراء منه واضغط على "كيفية الطلب" للحصول على تعليمات خطوة بخطوة.',
    "stores.howButton": "كيفية الطلب",
    "stores.modalTitle": "كيفية الطلب — {name}",
    "stores.intro": "قم بالدخول إلى متجر {name} وبعد إضافة المنتجات للسلة وعند إتمام الطلب قم بإضافة البيانات كما هو موضح في الجدول التالي.",
    "stores.thField": "التفاصيل",
    "stores.thValue": "الوصف",
    "stores.shop": "تسوّق الآن",
    "stores.sendTracking": "أرسل رقم التتبع على واتساب",
    "stores.emptyTitle": "لا توجد متاجر",
    "stores.emptyText": "لا توجد عناوين شحن حالياً، تواصل معنا عبر واتساب.",
    "stores.copy": "نسخ",
    "stores.copied": "تم النسخ",
    "stores.close": "إغلاق",

    "trackPage.title": 'تتبع <span class="accent">طلبك</span>',
    "trackPage.subtitle": "أدخل رقم التتبع لمعرفة حالة شحنتك",
    "trackPage.loading": "جاري البحث عن طلبك...",
    "trackPage.idLabel": "رقم التتبع",
    "notFound.title": "لم نجد هذا الطلب",
    "notFound.before": "لا يوجد طلب برقم",
    "notFound.after": ". تأكد من الرقم وحاول مرة أخرى، أو تواصل معنا عبر واتساب.",
    "notFound.button": "ابحث في صفحة التتبع الرسمية ↗",
    "error.title": "تابع طلبك من صفحة التتبع",
    "error.text": "تعذّر عرض حالة الطلب هنا، اضغط الزر لفتح صفحة التتبع الرسمية مع رقمك مباشرة.",
    "error.button": "افتح صفحة التتبع ↗",

    "branch.title": "يرجى مراجعة المرجع للفرع",
    "branch.ref": "رقم المرجع:",
    "branch.text": "طردك مؤجل أو مرتجع أو متوقف حالياً. يرجى مراجعة فرعنا في نابلس برقم المرجع (يومياً 9 صباحاً – 3:30 مساءً) أو التواصل معنا لمتابعة الطلب.",
    "branch.button": "تواصل مع الفرع على واتساب",

    "step.received": "تم استلام الطلب",
    "step.preparing": "قيد التجهيز",
    "step.with_driver": "مع المندوب",
    "step.delivered": "تم التسليم",
    "step.cancelled": "ملغي",
    "step.returned": "مرتجع",
    "step.unknown": "غير معروف",

    "detail.store": "المتجر",
    "detail.customer": "اسم المستلم",
    "detail.city": "المدينة",
    "detail.note": "ملاحظة",
    "detail.reference": "المرجع",
    "detail.previous": "الحالة السابقة",
    "detail.created": "تاريخ الإنشاء",
    "detail.updated": "آخر تحديث: {date}",
  },

  en: {
    "title.home": "A Logistics | Delivering with trust",
    "title.stores": "A Logistics | Shipping addresses",
    "title.track": "A Logistics | Track your order",

    "nav.menu": "Menu",
    "nav.home": "Home",
    "nav.stores": "Shipping addresses",
    "nav.track": "Tracking",
    "nav.how": "How it works",
    "nav.about": "About us",
    "nav.whatsapp": "WhatsApp",
    "nav.contact": "Contact us",
    "toggle.lang": "العربية",
    "toggle.langShort": "ع",
    "toggle.dark": "Dark mode",
    "toggle.light": "Light mode",

    "home.title": 'Track your <span class="accent">A Logistics</span> shipments',
    "home.lead": "Track your parcels in real time and stay updated at every step of the delivery journey",
    "home.promo": "Order from SHEIN, Temu, Zara and more… we deliver to you",
    "home.allStores": "View all shipping addresses →",
    "track.placeholder": "Enter tracking number",
    "track.button": "Track now",

    "offers.label": "Offers & partners",
    "offers.prev": "Previous",
    "offers.next": "Next",
    "offers.more": "Learn more",

    "why.title": "Why choose us",
    "why.license.title": "Licensed & legal postal service",
    "why.license.text": "Licensed by the relevant Palestinian authorities",
    "why.1.title": "Real-time tracking",
    "why.1.text": "Follow your parcel's location and status with live updates",
    "why.2.title": "Fast delivery",
    "why.2.text": "A fast and efficient service that brings your parcel to you",
    "why.3.title": "Safe & secure",
    "why.3.text": "Your parcels are handled with care and safety",
    "why.4.title": "Always-on support",
    "why.4.text": "Our support team is always ready to help you",

    "how.title": "How it works",
    "how.subtitle": "Three simple steps until your order arrives",
    "how.1.title": "Order from the store",
    "how.1.text": "Order from any partner store, and the store hands your order to us",
    "how.2.title": "We prepare & ship",
    "how.2.text": "We receive and prepare your order, then pass it to the nearest driver",
    "how.3.title": "Receive & track",
    "how.3.text": "Follow your order with its tracking number until it reaches your door",

    "cta.title": "Ready to track your parcel?",
    "cta.text": "Enter your tracking number above or contact us for help",
    "cta.button": "Get started",

    "footer.about": "Your trusted partner for delivery and parcel tracking.",
    "footer.social": "Follow us",
    "footer.facebook": "Facebook",
    "footer.instagram": "Instagram",
    "footer.whatsapp": "WhatsApp",
    "footer.links": "Quick links",
    "footer.trackLink": "Track your order",
    "footer.address": "Address",
    "footer.city": "Nablus, Palestine",
    "footer.hours": "Daily 9 AM – 3:30 PM",
    "footer.channel": "Our WhatsApp channel",
    "footer.contact": "Contact us",
    "footer.copy": "© 2026 A Logistics – Delivering with trust. All rights reserved.",
    "footer.admin": "Admin login",

    "stores.title": 'How to order from <span class="accent">global stores</span>',
    "stores.subtitle": 'Pick the store you want to buy from and tap "How to order" for step-by-step instructions.',
    "stores.howButton": "How to order",
    "stores.modalTitle": "How to order — {name}",
    "stores.intro": "Go to {name}, add your products to the cart, and at checkout enter the details exactly as shown in the table below.",
    "stores.thField": "Field",
    "stores.thValue": "What to enter",
    "stores.shop": "Shop now",
    "stores.sendTracking": "Send tracking number on WhatsApp",
    "stores.emptyTitle": "No stores found",
    "stores.emptyText": "No shipping addresses right now, contact us on WhatsApp.",
    "stores.copy": "Copy",
    "stores.copied": "Copied",
    "stores.close": "Close",

    "trackPage.title": 'Track <span class="accent">your order</span>',
    "trackPage.subtitle": "Enter your tracking number to see your shipment status",
    "trackPage.loading": "Looking for your order...",
    "trackPage.idLabel": "Tracking number",
    "notFound.title": "We couldn't find this order",
    "notFound.before": "There is no order with number",
    "notFound.after": ". Check the number and try again, or contact us on WhatsApp.",
    "notFound.button": "Search on the official tracking page ↗",
    "error.title": "Track your order on the tracking page",
    "error.text": "We couldn't show the order status here. Tap the button to open the official tracking page with your number.",
    "error.button": "Open tracking page ↗",

    "branch.title": "Please take your reference to the branch",
    "branch.ref": "Reference number:",
    "branch.text": "Your parcel is postponed, returned or on hold. Please visit our Nablus branch with your reference number (daily 9 AM – 3:30 PM) or contact us to follow up.",
    "branch.button": "Contact the branch on WhatsApp",

    "step.received": "Order received",
    "step.preparing": "Preparing",
    "step.with_driver": "With driver",
    "step.delivered": "Delivered",
    "step.cancelled": "Cancelled",
    "step.returned": "Returned",
    "step.unknown": "Unknown",

    "detail.store": "Store",
    "detail.customer": "Recipient",
    "detail.city": "City",
    "detail.note": "Note",
    "detail.reference": "Reference",
    "detail.previous": "Previous status",
    "detail.created": "Created on",
    "detail.updated": "Last updated: {date}",
  },
};

const root = document.documentElement;

function load(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* التخزين غير متاح (مثلاً وضع التصفح الخاص) */
  }
}

/* ---------------------------------------------------------
   اللغة
   --------------------------------------------------------- */
export function getLang() {
  return root.lang === "en" ? "en" : "ar";
}

// t("stores.modalTitle", { name: "SHEIN" })
export function t(key, vars = {}) {
  const text = DICT[getLang()][key] ?? DICT.ar[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? "");
}

function applyLang() {
  const lang = getLang();
  root.dir = lang === "en" ? "ltr" : "rtl";

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  // نصوص فيها تنسيق بسيط (مثل كلمة ملوّنة) من القاموس نفسه
  document.querySelectorAll("[data-i18n-html]").forEach((node) => {
    node.innerHTML = t(node.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAria));
  });

  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    langBtn.textContent = t("toggle.langShort");
    langBtn.title = t("toggle.lang");
    langBtn.setAttribute("aria-label", t("toggle.lang"));
  }
  updateThemeButton();
}

export function setLang(lang) {
  root.lang = lang === "en" ? "en" : "ar";
  save("lang", root.lang);
  applyLang();
  document.dispatchEvent(new CustomEvent("langchange", { detail: root.lang }));
}

/* ---------------------------------------------------------
   الوضع النهاري / الليلي
   --------------------------------------------------------- */
function currentTheme() {
  return root.dataset.theme === "dark" ? "dark" : "light";
}

function updateThemeButton() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const label = currentTheme() === "dark" ? t("toggle.light") : t("toggle.dark");
  btn.title = label;
  btn.setAttribute("aria-label", label);
}

function setTheme(theme) {
  root.dataset.theme = theme;
  save("theme", theme);
  updateThemeButton();
}

/* ---------------------------------------------------------
   التشغيل
   --------------------------------------------------------- */
document.getElementById("lang-toggle")?.addEventListener("click", () => {
  setLang(getLang() === "ar" ? "en" : "ar");
});

document.getElementById("theme-toggle")?.addEventListener("click", () => {
  setTheme(currentTheme() === "dark" ? "light" : "dark");
});

applyLang();
