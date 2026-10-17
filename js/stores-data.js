// بيانات المتاجر وطريقة الطلب من كل متجر.
// كل صف في الجدول: label = اسم الحقل في موقع المتجر،
// text = شرح للعميل، value = قيمة تُنسخ كما هي (يظهر بجانبها زر نسخ).

const PHONE = "0529091314";
const CITY = "Jerusalem";
const ZIP = "9788702";

const firstName = { label: "First Name", text: "اكتب اسمك الأول" };
const lastNameElg = { label: "Last Name", text: "اكتب اسم عائلتك ثم أضف", value: "ELG" };
const phone = { label: "Phone Number", text: "اعتمد هذا الرقم:", value: PHONE };
const country = { label: "Country", value: "Israel" };

const LOCAL_NOTE = "ما في حد أدنى للطلب أو جمارك لأنه موقع داخلي.";
const TRACK_NOTE = "عند الطلب أرسل لنا رقم الطلب، وبعد الشحن أرسل رقم التتبع.";
const EXACT_NOTE = "الرجاء إدخال البيانات كما هي تماماً لضمان وصول طلبك.";

const favicon = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

export const STORES = [
  {
    name: "SHEIN",
    category: "أزياء",
    url: "https://www.shein.com",
    logoUrl: favicon("shein.com"),
    fields: [
      country,
      { label: "First Name", text: "اكتب اسمك الأول كما في الهوية" },
      { label: "Last Name", text: "اكتب اسم عائلتك كما في الهوية" },
      { label: "Phone Number", text: "مفتاح الدولة IL +972 ثم:", value: "0507000440" },
      { label: "Street Address", value: "Al Asmai street 10 / CON Shufat (ELG)" },
      { label: "City", value: "Jerusalem/ירושלים" },
      { label: "Post/Zip Code", value: "9730000" },
      { label: "National ID Number", text: "رقم هويتك (9 أرقام)" },
    ],
    notes: [
      "طرق الشحن المتاحة: Express أو Standard أو Economics.",
      "الاسم يجب أن يطابق الهوية لضمان التخليص الجمركي.",
      TRACK_NOTE,
    ],
  },
  {
    name: "Temu",
    category: "متنوع",
    url: "https://www.temu.com",
    logoUrl: favicon("temu.com"),
    fields: [
      country,
      firstName,
      { label: "Last Name", text: "اكتب اسم عائلتك ثم أضف", value: "(ELG)" },
      { label: "Phone Number", value: "+972529091314" },
      { label: "Street Name", value: "dlv abba berdichev 2 pobox 49583 (elg)" },
      { label: "Apartment", value: "perfect laundry - french hill" },
      { label: "Postal Code", value: ZIP },
      { label: "City", value: "jerusalem" },
      { label: "Shipping", text: "اختر طريقة الشحن", value: "Pick up free" },
      { label: "Pickup Point", text: "حدّد نقطة الاستلام:", value: "aba berdichev street, jerusalem" },
    ],
    notes: [
      "اختر وسيلة الشحن القياسي، ويمكن تجميع الطرود من الأحد للخميس.",
      "يرجى الالتزام بعنوان الشحن.",
    ],
  },
  {
    name: "Zara",
    category: "أزياء",
    url: "https://www.zara.com",
    logoUrl: favicon("zara.com"),
    fields: [
      firstName,
      lastNameElg,
      { label: "Address Line 1", value: "DLV Aba Berdichev 2 (logistics)" },
      { label: "Flat/Location", value: "French Hill/Perfect Laundry Store" },
      { label: "City", value: CITY },
      { label: "Region", value: "Israel" },
    ],
    notes: [EXACT_NOTE, TRACK_NOTE],
  },
  {
    name: "iHerb",
    category: "صحة وتجميل",
    url: "https://www.iherb.com",
    logoUrl: favicon("iherb.com"),
    fields: [
      { label: "الدولة", value: "إسرائيل" },
      { label: "الاسم الكامل", text: "اسمك + اسم العائلة + ", value: "logistics" },
      { label: "السطر الأول للعنوان", value: "5 Hafez ibrahim st Orabi (Elg)" },
      { label: "السطر الثاني للعنوان", value: "5 Hafez ibrahim st Orabi (Elg)" },
      { label: "المدينة", value: CITY },
      { label: "الرمز البريدي", value: "9730000" },
      { label: "رقم الهاتف المحمول", value: PHONE },
    ],
    notes: [
      "لا يُسمح باستخدام اسم تجاري أو اسم شركة في خانة الاسم.",
      "يرجى الالتزام بالعنوان واستخدام خدمة التوصيل المنزلي.",
    ],
  },
  {
    name: "eBay",
    category: "متنوع",
    url: "https://www.ebay.com",
    logoUrl: favicon("ebay.com"),
    fields: [
      country,
      firstName,
      { label: "Last Name", text: "اكتب اسم عائلتك ثم أضف", value: "(elg)" },
      { label: "Street Address 1", value: "DLV French Hill, Aba Berdichev 2" },
      { label: "Street Address 2", value: "pobox 49583(logistics)" },
      { label: "City", value: CITY },
      { label: "State", value: CITY },
      { label: "Postal Code", value: ZIP },
      { label: "Mobile Number", value: PHONE },
    ],
    notes: [EXACT_NOTE],
  },
  {
    name: "AliExpress",
    category: "متنوع",
    url: "https://www.aliexpress.com",
    logoUrl: favicon("aliexpress.com"),
    fields: [
      { label: "اسم جهة الاتصال", text: "اسمك واسم العائلة + ", value: "ELG" },
      { label: "رقم الهاتف", text: "+972 ثم:", value: PHONE },
      { label: "العنوان", value: "DLV ABA BERDICHEV 2 POBOX49583 (ELG)" },
      { label: "تفاصيل العنوان", value: "PERFECT LAUNDRY / FRENCH HILL" },
      { label: "المنطقة", value: CITY },
      { label: "المدينة", value: CITY },
      { label: "الرمز البريدي", value: ZIP },
      { label: "معلومات الجمارك", text: "فعّل خيار (أنا مواطن) واكتب رقم هويتك" },
    ],
    notes: ["يرجى الالتزام بعنوان الشحن."],
  },
  {
    name: "Adidas",
    category: "رياضة",
    url: "https://www.adidas.com",
    logoUrl: favicon("adidas.com"),
    fields: [
      phone,
      firstName,
      lastNameElg,
      { label: "Email", text: "إيميلك الشخصي" },
      country,
      { label: "Street and House Number", value: "2 Aba Berdichev St / Perfect Laundry Store" },
      { label: "City", value: CITY },
      { label: "Zip Code", value: ZIP },
    ],
    notes: [LOCAL_NOTE, "عند الطلب الرجاء إرسال رقم التتبع."],
  },
  {
    name: "ASOS",
    category: "أزياء",
    url: "https://www.asos.com",
    logoUrl: favicon("asos.com"),
    fields: [
      { label: "First Name", text: "اسمك المعتمد في حساب ASOS" },
      lastNameElg,
      phone,
      country,
      { label: "Address Line 1", value: "DLV French Hill, Aba Berdichev 2 logistics" },
      { label: "Address Line 2", value: "pobox 49583 (logistics)" },
      { label: "City", value: CITY },
      { label: "Postal Code", value: ZIP },
    ],
    notes: ["تأكد من دقة البيانات لتجربة تسوق سلسة من ASOS."],
  },
  {
    name: "YesStyle",
    category: "صحة وتجميل",
    url: "https://www.yesstyle.com",
    logoUrl: favicon("yesstyle.com"),
    fields: [
      { label: "Name", text: "اسمك + اسم العائلة + ", value: "Elg" },
      phone,
      { label: "Address Line 1", value: "DLV Aba Berdichev 2" },
      { label: "Address Line 2", value: "PO Box 49583 (logistics)" },
      { label: "Location", value: "French Hill - Perfect Laundry" },
      { label: "City", value: CITY },
      { label: "Postal Code", value: ZIP },
    ],
    notes: [EXACT_NOTE],
  },
  {
    name: "Lookfantastic",
    category: "صحة وتجميل",
    url: "https://www.lookfantastic.com",
    logoUrl: favicon("lookfantastic.com"),
    fields: [
      { label: "Full Name", text: "اسمك + اسم العائلة + ", value: "Elg" },
      country,
      { label: "Postal Code", value: ZIP },
      { label: "House Name / Number", value: "Perfect Laundry / French Hill" },
      { label: "Address Line 1", value: "DLV Aba Berdichev 2 pobox49583" },
      { label: "Address Line 2", value: "(logistics)" },
      { label: "Town / City", value: CITY },
      phone,
    ],
    notes: [EXACT_NOTE, "عند الطلب الرجاء إرسال رقم التتبع."],
  },
  {
    name: "NEXT",
    category: "أزياء",
    url: "https://www.next.co.uk",
    logoUrl: favicon("next.co.uk"),
    fields: [
      country,
      firstName,
      lastNameElg,
      phone,
      { label: "Address", value: "AbaBerdichevpobox49583 logistics" },
      { label: "City", value: CITY },
      { label: "Postal Code", value: ZIP },
    ],
    notes: [TRACK_NOTE],
  },
  {
    name: "Stradivarius",
    category: "أزياء",
    url: "https://www.stradivarius.com",
    logoUrl: favicon("stradivarius.com"),
    fields: [
      { label: "Market", value: "Israel" },
      { label: "Street and Number", value: "DLV French Hill, Aba Berdichev 2 (logistics)" },
      { label: "Location", value: "Perfect Laundry Store" },
      { label: "City", value: CITY },
      { label: "Name", text: "اسمك + ", value: "elg" },
      phone,
    ],
    notes: ["لا يوجد حد أدنى للطلب ولا جمارك."],
  },
  {
    name: "Pull & Bear",
    category: "أزياء",
    url: "https://www.pullandbear.com",
    logoUrl: favicon("pullandbear.com"),
    fields: [
      firstName,
      lastNameElg,
      { label: "Address Line 1", value: "DLV Aba Berdichev 2 (logistics)" },
      { label: "Flat/Location", value: "French Hill/Perfect Laundry Store" },
      { label: "City", value: CITY },
      { label: "Region", value: "Israel" },
      phone,
    ],
    notes: [LOCAL_NOTE],
  },
  {
    name: "Terminal X",
    category: "أزياء",
    url: "https://www.terminalx.com",
    logoUrl: favicon("terminalx.com"),
    fields: [
      { label: "المدينة", value: "ירושלים" },
      { label: "الشارع", value: "אבא ברדיצב" },
      { label: "نقطة الاستلام", value: "ירושלים, אבא ברדיצב 2, גבעת הצרפתית" },
      { label: "الاسم", text: "اكتب اسمك" },
      { label: "اسم العائلة", text: "اسم العائلة + ", value: "Elg" },
      phone,
    ],
    notes: ["لا يوجد حد أدنى للطلب أو جمارك."],
  },
  {
    name: "Cider",
    category: "أزياء",
    url: "https://www.shopcider.com",
    logoUrl: favicon("shopcider.com"),
    fields: [
      country,
      { label: "First Name", text: "اكتب اسمك (Your Name)" },
      { label: "Last Name", text: "اسم العائلة + ", value: "ELG" },
      { label: "Mobile", text: "اعتمد هذا الرقم:", value: PHONE },
      { label: "Address Line 1", value: "DLV 5 Hafez Ibrahim St, Orabi (logistics)" },
      { label: "City", value: CITY },
      { label: "State", value: CITY },
      { label: "Postal Code", value: "9730000" },
    ],
    notes: [EXACT_NOTE, "عند الطلب، الرجاء تزويدنا برقم التتبع فوراً."],
  },
  {
    name: "Myprotein",
    category: "رياضة",
    url: "https://www.myprotein.com",
    logoUrl: favicon("myprotein.com"),
    fields: [
      country,
      { label: "Contact Name", text: "اسمك + اسم العائلة + ", value: "Elg" },
      phone,
      { label: "Address Line 1", value: "DLV Aba Berdichev 2" },
      { label: "Address Line 2", value: "PO Box 49583 (logistics)" },
      { label: "Address Line 3", value: "French Hill - Perfect Laundry" },
      { label: "City", value: CITY },
      { label: "Postal Code", value: ZIP },
    ],
    notes: ["الرجاء اعتماد العنوان ورقم الهاتف كما هو."],
  },
];

// الترجمة الإنجليزية لنصوص المتاجر (النص العربي ← الإنجليزي).
// أي نص غير موجود هنا يظهر بالعربي كما هو.
export const TEXT_EN = {
  // الأقسام
  "أزياء": "Fashion",
  "متنوع": "General",
  "صحة وتجميل": "Health & Beauty",
  "رياضة": "Sports",

  // أسماء حقول بالعربي
  "الدولة": "Country",
  "الاسم الكامل": "Full name",
  "السطر الأول للعنوان": "Address line 1",
  "السطر الثاني للعنوان": "Address line 2",
  "المدينة": "City",
  "الرمز البريدي": "Postal code",
  "رقم الهاتف المحمول": "Mobile number",
  "اسم جهة الاتصال": "Contact name",
  "رقم الهاتف": "Phone number",
  "العنوان": "Address",
  "تفاصيل العنوان": "Address details",
  "المنطقة": "Region",
  "معلومات الجمارك": "Customs info",
  "الشارع": "Street",
  "نقطة الاستلام": "Pickup point",
  "الاسم": "First name",
  "اسم العائلة": "Last name",

  // الشرح
  "اكتب اسمك الأول": "Your first name",
  "اكتب اسم عائلتك ثم أضف": "Your last name, then add",
  "اعتمد هذا الرقم:": "Use this number:",
  "اكتب اسمك الأول كما في الهوية": "Your first name as on your ID",
  "اكتب اسم عائلتك كما في الهوية": "Your last name as on your ID",
  "مفتاح الدولة IL +972 ثم:": "Country code IL +972, then:",
  "رقم هويتك (9 أرقام)": "Your ID number (9 digits)",
  "اختر طريقة الشحن": "Choose shipping method",
  "حدّد نقطة الاستلام:": "Pickup point:",
  "اسمك + اسم العائلة + ": "First name + last name + ",
  "اسمك واسم العائلة + ": "First and last name + ",
  "+972 ثم:": "+972, then:",
  "فعّل خيار (أنا مواطن) واكتب رقم هويتك": "Turn on \"I am a citizen\" and enter your ID number",
  "إيميلك الشخصي": "Your personal email",
  "اسمك المعتمد في حساب ASOS": "Your name as in your ASOS account",
  "اسمك + ": "Your name + ",
  "اكتب اسمك": "Your first name",
  "اسم العائلة + ": "Last name + ",
  "اكتب اسمك (Your Name)": "Your first name",

  // الملاحظات
  [LOCAL_NOTE]: "No minimum order and no customs, it's a local site.",
  [TRACK_NOTE]: "After ordering, send us the order number, and the tracking number once it ships.",
  [EXACT_NOTE]: "Please enter the details exactly as shown so your order arrives.",
  "طرق الشحن المتاحة: Express أو Standard أو Economics.": "Available shipping: Express, Standard or Economics.",
  "الاسم يجب أن يطابق الهوية لضمان التخليص الجمركي.": "Your name must match your ID for customs clearance.",
  "اختر وسيلة الشحن القياسي، ويمكن تجميع الطرود من الأحد للخميس.": "Choose standard shipping. Parcels can be consolidated Sunday to Thursday.",
  "يرجى الالتزام بعنوان الشحن.": "Please use this shipping address exactly.",
  "لا يُسمح باستخدام اسم تجاري أو اسم شركة في خانة الاسم.": "Business or company names are not allowed in the name field.",
  "يرجى الالتزام بالعنوان واستخدام خدمة التوصيل المنزلي.": "Please use this address and choose home delivery.",
  "عند الطلب الرجاء إرسال رقم التتبع.": "After ordering, please send us the tracking number.",
  "تأكد من دقة البيانات لتجربة تسوق سلسة من ASOS.": "Double-check your details for a smooth ASOS order.",
  "لا يوجد حد أدنى للطلب ولا جمارك.": "No minimum order and no customs.",
  "لا يوجد حد أدنى للطلب أو جمارك.": "No minimum order or customs.",
  "عند الطلب، الرجاء تزويدنا برقم التتبع فوراً.": "After ordering, send us the tracking number right away.",
  "الرجاء اعتماد العنوان ورقم الهاتف كما هو.": "Please use the address and phone number exactly as shown.",
};

// تحويل المتاجر أعلاه لشكل Firestore (يستخدمه زر "استيراد المتاجر الافتراضية" في صفحة الأدمن).
// الترجمة الإنجليزية تُحفظ داخل كل متجر في حقول تنتهي بـ _en.
export function defaultStoresForFirestore() {
  const en = (text) => (text && TEXT_EN[text]) || "";
  return STORES.map((s, i) => ({
    name: s.name,
    url: s.url || "",
    logoUrl: s.logoUrl || "",
    category: s.category || "",
    category_en: en(s.category),
    intro: s.intro || "",
    intro_en: "",
    order: i + 1,
    fields: s.fields.map((f) => ({
      label: f.label || "",
      label_en: en(f.label),
      text: f.text || "",
      text_en: en(f.text),
      value: f.value || "",
    })),
    notes: s.notes || [],
    notes_en: (s.notes || []).map(en),
  }));
}
