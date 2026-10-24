// لوحة الأدمن: إدارة عناوين الشحن (المتاجر) والإعلانات والمشرفين في Firestore.
// الدخول بحساب Google، والكتابة مسموحة فقط للأدمن (القواعد في firestore.rules).
import { app, db, OWNER_EMAILS, isConfigured } from "./firebase-config.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { defaultStoresForFirestore } from "./stores-data.js";

const $ = (id) => document.getElementById(id);
const VIEWS = ["loading", "config", "login", "denied", "dashboard"];

let stores = [];
let editingId = null;
let currentEmail = "";

function show(view) {
  VIEWS.forEach((v) => $("view-" + v).classList.toggle("hidden", v !== view));
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

let toastTimer;
function toast(message) {
  const box = $("toast");
  box.textContent = message;
  box.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => box.classList.add("hidden"), 2500);
}

function errorMessage(err) {
  if (err?.code === "permission-denied") {
    return "تم رفض العملية. تأكد من نشر قواعد firestore.rules وأنك داخل بإيميل الأدمن.";
  }
  return "حدث خطأ: " + (err?.message || err);
}

const faviconFor = (url) => {
  try {
    return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`;
  } catch {
    return "";
  }
};

/* ---------------------------------------------------------
   تسجيل الدخول
   --------------------------------------------------------- */
if (!isConfigured) {
  show("config");
} else {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  $("login-btn").addEventListener("click", async () => {
    $("login-error").classList.add("hidden");
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") return;
      const msg =
        err.code === "auth/unauthorized-domain"
          ? `أضف الدومين "${location.hostname}" في Firebase Console ← Authentication ← Settings ← Authorized domains.`
          : err.code === "auth/operation-not-allowed"
          ? "فعّل تسجيل الدخول بـ Google من Firebase Console ← Authentication ← Sign-in method."
          : errorMessage(err);
      $("login-error").textContent = msg;
      $("login-error").classList.remove("hidden");
    }
  });

  const logout = () => signOut(auth);
  $("logout-btn").addEventListener("click", logout);
  $("denied-logout").addEventListener("click", logout);

  onAuthStateChanged(auth, async (user) => {
    $("admin-user").textContent = user?.email || "";
    $("admin-user").classList.toggle("hidden", !user);
    $("logout-btn").classList.toggle("hidden", !user);

    if (!user) return show("login");
    show("loading");
    currentEmail = (user.email || "").toLowerCase();
    if (!(await isAdminEmail(currentEmail))) {
      $("denied-email").textContent = user.email;
      return show("denied");
    }
    show("dashboard");
    await Promise.all([loadStores(), loadAds()]);
  });
}

// أساسي، أو موجود في مجموعة admins (غير الأدمن لا يستطيع قراءتها أصلاً)
async function isAdminEmail(email) {
  if (OWNER_EMAILS.includes(email)) return true;
  try {
    return (await getDoc(doc(db, "admins", email))).exists();
  } catch {
    return false;
  }
}

/* ---------------------------------------------------------
   التبويبات
   --------------------------------------------------------- */
document.querySelectorAll(".admin-tab").forEach((tab) =>
  tab.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab").forEach((t) => t.classList.toggle("active", t === tab));
    ["stores", "ads"].forEach((name) => $("tab-" + name).classList.toggle("hidden", name !== tab.dataset.tab));
  })
);

/* ---------------------------------------------------------
   المشرفون
   --------------------------------------------------------- */
const adminsDialog = $("admins-dialog");
adminsDialog.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => adminsDialog.close()));

function adminRow(email, { owner = false } = {}) {
  const row = el("div", "admin-row");
  const info = el("div", "admin-row-info");
  info.appendChild(el("strong", "ltr-text", email));
  const tags = [owner ? "أدمن أساسي" : "مشرف", email === currentEmail ? "أنت" : ""].filter(Boolean);
  info.appendChild(el("span", "admin-muted small", tags.join(" · ")));
  row.appendChild(info);

  if (!owner) {
    const del = el("button", "btn btn-ghost btn-sm btn-danger", "حذف");
    del.type = "button";
    del.addEventListener("click", async () => {
      const self = email === currentEmail ? "\nانتبه: هذا حسابك، ستفقد صلاحية الدخول." : "";
      if (!confirm(`حذف ${email} من المشرفين؟${self}`)) return;
      try {
        await deleteDoc(doc(db, "admins", email));
        toast("تم حذف المشرف");
        if (email === currentEmail) return location.reload();
        await loadAdmins();
      } catch (err) {
        alert(errorMessage(err));
      }
    });
    row.appendChild(del);
  }
  return row;
}

async function loadAdmins() {
  const list = $("admins-list");
  list.innerHTML = '<div class="spinner-wrap"><div class="spinner"></div></div>';
  try {
    const snap = await getDocs(collection(db, "admins"));
    list.innerHTML = "";
    OWNER_EMAILS.forEach((e) => list.appendChild(adminRow(e, { owner: true })));
    snap.docs
      .map((d) => d.id)
      .filter((e) => !OWNER_EMAILS.includes(e))
      .sort()
      .forEach((e) => list.appendChild(adminRow(e)));
  } catch (err) {
    list.innerHTML = "";
    list.appendChild(el("p", "admin-error", errorMessage(err)));
  }
}

$("admins-btn").addEventListener("click", () => {
  $("admin-email-error").classList.add("hidden");
  $("new-admin-email").value = "";
  adminsDialog.showModal();
  loadAdmins();
});

$("add-admin-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("new-admin-email").value.trim().toLowerCase();
  const error = $("admin-email-error");
  error.classList.add("hidden");

  let problem = "";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) problem = "اكتب إيميل صحيح.";
  else if (OWNER_EMAILS.includes(email)) problem = "هذا الإيميل أدمن أساسي أصلاً.";
  if (problem) {
    error.textContent = problem;
    error.classList.remove("hidden");
    return;
  }

  try {
    await setDoc(doc(db, "admins", email), { addedBy: currentEmail, addedAt: serverTimestamp() });
    $("new-admin-email").value = "";
    toast(`تمت إضافة ${email}`);
    await loadAdmins();
  } catch (err) {
    error.textContent = errorMessage(err);
    error.classList.remove("hidden");
  }
});

/* ---------------------------------------------------------
   قائمة المتاجر
   --------------------------------------------------------- */
async function loadStores() {
  $("admin-list").innerHTML = '<div class="spinner-wrap"><div class="spinner"></div></div>';
  try {
    const snap = await getDocs(collection(db, "stores"));
    stores = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || (a.name || "").localeCompare(b.name || ""));
    renderList();
  } catch (err) {
    $("admin-list").innerHTML = "";
    $("admin-list").appendChild(el("p", "admin-error", errorMessage(err)));
  }
}

function renderList() {
  const list = $("admin-list");
  list.innerHTML = "";
  $("stores-count").textContent = stores.length ? `${stores.length} متجر` : "";
  $("import-btn").classList.toggle("hidden", stores.length > 0);

  if (stores.length === 0) {
    const box = el("div", "message");
    box.appendChild(el("div", "emoji", "📭"));
    box.appendChild(el("h3", "", "لا توجد متاجر في قاعدة البيانات بعد"));
    box.appendChild(
      el("p", "", 'الموقع يعرض حالياً المتاجر الافتراضية. اضغط "استيراد المتاجر الافتراضية" لنقلها هنا وتعديلها.')
    );
    list.appendChild(box);
    return;
  }

  stores.forEach((s) => {
    const row = el("div", "admin-row");

    const logo = el("div", "store-logo");
    if (s.logoUrl) {
      const img = el("img");
      img.src = s.logoUrl;
      img.alt = "";
      img.onerror = () => logo.replaceChildren(el("span", "letter-logo", s.name.charAt(0).toUpperCase()));
      logo.appendChild(img);
    } else {
      logo.appendChild(el("span", "letter-logo", (s.name || "?").charAt(0).toUpperCase()));
    }

    const info = el("div", "admin-row-info");
    info.appendChild(el("strong", "", s.name));
    const meta = [s.category, `${(s.fields || []).length} صفوف`, `الترتيب ${s.order ?? "—"}`].filter(Boolean);
    info.appendChild(el("span", "admin-muted small", meta.join(" · ")));

    const actions = el("div", "admin-row-actions");
    const edit = el("button", "btn btn-ghost btn-sm", "تعديل");
    edit.type = "button";
    edit.addEventListener("click", () => openEditor(s));
    const del = el("button", "btn btn-ghost btn-sm btn-danger", "حذف");
    del.type = "button";
    del.addEventListener("click", () => removeStore(s));
    actions.append(edit, del);

    row.append(logo, info, actions);
    list.appendChild(row);
  });
}

async function removeStore(store) {
  if (!confirm(`حذف "${store.name}" نهائياً؟ لا يمكن التراجع عن هذا.`)) return;
  try {
    await deleteDoc(doc(db, "stores", store.id));
    toast(`تم حذف ${store.name}`);
    await loadStores();
  } catch (err) {
    alert(errorMessage(err));
  }
}

$("import-btn").addEventListener("click", async () => {
  if (!confirm("سيتم نسخ المتاجر الافتراضية (16 متجر) إلى قاعدة البيانات. متابعة؟")) return;
  try {
    const batch = writeBatch(db);
    defaultStoresForFirestore().forEach((s) => {
      const id = s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      batch.set(doc(db, "stores", id || doc(collection(db, "stores")).id), { ...s, updatedAt: serverTimestamp() });
    });
    await batch.commit();
    toast("تم استيراد المتاجر");
    await loadStores();
  } catch (err) {
    alert(errorMessage(err));
  }
});

$("add-btn").addEventListener("click", () => openEditor(null));

/* ---------------------------------------------------------
   نافذة التعديل
   --------------------------------------------------------- */
const editor = $("editor");
editor.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => editor.close()));

function input(className, value, placeholder, dir) {
  const node = el(className === "textarea" ? "textarea" : "input", "input");
  if (className === "textarea") node.rows = 2;
  node.value = value || "";
  node.placeholder = placeholder;
  if (dir) node.dir = dir;
  return node;
}

function miniButton(label, title, onClick) {
  const b = el("button", "mini-btn", label);
  b.type = "button";
  b.title = title;
  b.setAttribute("aria-label", title);
  b.addEventListener("click", onClick);
  return b;
}

// شريط أزرار الصف: تحريك لأعلى/لأسفل وحذف
function rowControls(card, list) {
  const bar = el("div", "rep-controls");
  bar.append(
    miniButton("↑", "تحريك لأعلى", () => card.previousElementSibling && list.insertBefore(card, card.previousElementSibling)),
    miniButton("↓", "تحريك لأسفل", () => card.nextElementSibling && list.insertBefore(card.nextElementSibling, card)),
    miniButton("✕", "حذف", () => card.remove())
  );
  return bar;
}

function addFieldRow(f = {}) {
  const list = $("fields-list");
  const card = el("div", "rep-card");
  card.appendChild(rowControls(card, list));

  const grid = el("div", "rep-grid");
  const label = input("", f.label, "اسم الحقل في موقع المتجر (مثل First Name)", "auto");
  const labelEn = input("", f.label_en, "اسم الحقل بالإنجليزي (إذا كان بالعربي)", "ltr");
  const text = input("", f.text, "الشرح بالعربي (مثل: اكتب اسمك الأول)");
  const textEn = input("", f.text_en, "Explanation in English", "ltr");
  const value = input("", f.value, "القيمة للنسخ (مثل العنوان أو الرقم)", "ltr");
  label.dataset.key = "label";
  labelEn.dataset.key = "label_en";
  text.dataset.key = "text";
  textEn.dataset.key = "text_en";
  value.dataset.key = "value";
  value.classList.add("span-2");
  grid.append(label, labelEn, text, textEn, value);
  card.appendChild(grid);
  list.appendChild(card);
  return label;
}

function addNoteRow(ar = "", en = "") {
  const list = $("notes-list");
  const card = el("div", "rep-card");
  card.appendChild(rowControls(card, list));
  const grid = el("div", "rep-grid");
  const noteAr = input("textarea", ar, "الملاحظة بالعربي");
  const noteEn = input("textarea", en, "Note in English", "ltr");
  noteAr.dataset.key = "ar";
  noteEn.dataset.key = "en";
  grid.append(noteAr, noteEn);
  card.appendChild(grid);
  list.appendChild(card);
  return noteAr;
}

$("add-field").addEventListener("click", () => addFieldRow().focus());
$("add-note").addEventListener("click", () => addNoteRow().focus());

function updateLogoPreview() {
  const src = $("f-logo").value.trim();
  $("logo-preview").src = src;
  $("logo-preview").classList.toggle("hidden", !src);
}
$("f-logo").addEventListener("input", updateLogoPreview);
$("auto-logo").addEventListener("click", () => {
  const icon = faviconFor($("f-url").value.trim());
  if (!icon) return alert("اكتب رابط المتجر أولاً (يبدأ بـ https://)");
  $("f-logo").value = icon;
  updateLogoPreview();
});

function openEditor(store) {
  editingId = store?.id || null;
  $("editor-title").textContent = store ? `تعديل ${store.name}` : "إضافة متجر";
  $("editor-error").classList.add("hidden");

  $("f-name").value = store?.name || "";
  $("f-order").value = store?.order ?? stores.length + 1;
  $("f-url").value = store?.url || "";
  $("f-logo").value = store?.logoUrl || "";
  $("f-category").value = store?.category || "";
  $("f-category-en").value = store?.category_en || "";
  $("f-intro").value = store?.intro || "";
  $("f-intro-en").value = store?.intro_en || "";
  updateLogoPreview();

  // اقتراحات الأقسام من المتاجر الموجودة
  const cats = [...new Set(stores.map((s) => s.category).filter(Boolean))];
  $("categories").replaceChildren(...cats.map((c) => Object.assign(el("option"), { value: c })));

  $("fields-list").innerHTML = "";
  (store?.fields?.length ? store.fields : [{}]).forEach((f) => addFieldRow(f));
  $("notes-list").innerHTML = "";
  (store?.notes || []).forEach((n, i) => addNoteRow(n, store.notes_en?.[i]));

  editor.showModal();
  $("f-name").focus();
}

function collectForm() {
  const fields = [...$("fields-list").children]
    .map((card) => {
      const f = {};
      card.querySelectorAll("[data-key]").forEach((i) => (f[i.dataset.key] = i.value.trim()));
      return f;
    })
    .filter((f) => f.label || f.text || f.value);

  const notes = [];
  const notesEn = [];
  [...$("notes-list").children].forEach((card) => {
    const ar = card.querySelector('[data-key="ar"]').value.trim();
    const en = card.querySelector('[data-key="en"]').value.trim();
    if (ar || en) {
      notes.push(ar || en);
      notesEn.push(en);
    }
  });

  const order = parseInt($("f-order").value, 10);
  return {
    name: $("f-name").value.trim(),
    order: Number.isFinite(order) ? order : stores.length + 1,
    url: $("f-url").value.trim(),
    logoUrl: $("f-logo").value.trim(),
    category: $("f-category").value.trim(),
    category_en: $("f-category-en").value.trim(),
    intro: $("f-intro").value.trim(),
    intro_en: $("f-intro-en").value.trim(),
    fields,
    notes,
    notes_en: notesEn,
  };
}

function validate(data) {
  if (!data.name) return "اسم المتجر مطلوب.";
  const isUrl = (u) => !u || /^https?:\/\//i.test(u);
  if (!isUrl(data.url)) return "رابط المتجر لازم يبدأ بـ https://";
  if (!isUrl(data.logoUrl)) return "رابط الشعار لازم يبدأ بـ https://";
  const duplicate = stores.find((s) => s.id !== editingId && s.name.toLowerCase() === data.name.toLowerCase());
  if (duplicate) return "يوجد متجر بنفس الاسم.";
  return "";
}

$("editor-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = collectForm();
  const problem = validate(data);
  if (problem) {
    $("editor-error").textContent = problem;
    $("editor-error").classList.remove("hidden");
    return;
  }

  const saveBtn = $("save-btn");
  saveBtn.disabled = true;
  saveBtn.textContent = "جاري الحفظ...";
  try {
    const id = editingId || doc(collection(db, "stores")).id;
    await setDoc(doc(db, "stores", id), { ...data, updatedAt: serverTimestamp() });
    editor.close();
    toast(editingId ? "تم حفظ التعديلات" : "تمت إضافة المتجر");
    await loadStores();
  } catch (err) {
    $("editor-error").textContent = errorMessage(err);
    $("editor-error").classList.remove("hidden");
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "حفظ";
  }
});

/* ---------------------------------------------------------
   الإعلانات والعروض (تظهر في الصفحة الرئيسية)
   --------------------------------------------------------- */
let ads = [];
let editingAdId = null;
const adEditor = $("ad-editor");
adEditor.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => adEditor.close()));

async function loadAds() {
  $("ads-list").innerHTML = '<div class="spinner-wrap"><div class="spinner"></div></div>';
  try {
    const snap = await getDocs(collection(db, "ads"));
    ads = snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    renderAds();
  } catch (err) {
    $("ads-list").innerHTML = "";
    $("ads-list").appendChild(el("p", "admin-error", errorMessage(err)));
  }
}

function renderAds() {
  const list = $("ads-list");
  list.innerHTML = "";
  const visible = ads.filter((a) => a.active !== false).length;
  $("ads-count").textContent = ads.length ? `${ads.length} إعلان · ${visible} ظاهر` : "";

  if (ads.length === 0) {
    const box = el("div", "message");
    box.appendChild(el("div", "emoji", "📣"));
    box.appendChild(el("h3", "", "لا توجد إعلانات بعد"));
    box.appendChild(el("p", "", 'قسم الإعلانات مخفي في الموقع حالياً. اضغط "إضافة إعلان" لإظهاره.'));
    list.appendChild(box);
    return;
  }

  ads.forEach((a) => {
    const active = a.active !== false;
    const row = el("div", "admin-row" + (active ? "" : " inactive"));

    const thumb = el("img", "ad-thumb");
    thumb.alt = "";
    if (a.imageUrl) thumb.src = a.imageUrl;
    thumb.onerror = () => thumb.removeAttribute("src");

    const info = el("div", "admin-row-info");
    info.appendChild(el("strong", "", a.title || a.title_en || "(إعلان بصورة فقط)"));
    const meta = [a.badge, active ? "ظاهر" : "مخفي", `الترتيب ${a.order ?? "—"}`].filter(Boolean);
    info.appendChild(el("span", "admin-muted small", meta.join(" · ")));

    const actions = el("div", "admin-row-actions");
    const toggle = el("button", "btn btn-ghost btn-sm", active ? "إخفاء" : "إظهار");
    toggle.type = "button";
    toggle.addEventListener("click", () =>
      saveAd(a.id, { ...a, active: !active }, active ? "تم إخفاء الإعلان" : "تم إظهار الإعلان").catch((err) =>
        alert(errorMessage(err))
      )
    );
    const edit = el("button", "btn btn-ghost btn-sm", "تعديل");
    edit.type = "button";
    edit.addEventListener("click", () => openAdEditor(a));
    const del = el("button", "btn btn-ghost btn-sm btn-danger", "حذف");
    del.type = "button";
    del.addEventListener("click", () => removeAd(a));
    actions.append(toggle, edit, del);

    row.append(thumb, info, actions);
    list.appendChild(row);
  });
}

async function removeAd(ad) {
  if (!confirm(`حذف الإعلان "${ad.title || ad.title_en || "بصورة فقط"}" نهائياً؟`)) return;
  try {
    await deleteDoc(doc(db, "ads", ad.id));
    toast("تم حذف الإعلان");
    await loadAds();
  } catch (err) {
    alert(errorMessage(err));
  }
}

// يحفظ الإعلان (بدون id وupdatedAt القديمين) ثم يعيد تحميل القائمة
async function saveAd(id, data, message) {
  const { id: _id, updatedAt: _u, ...clean } = data;
  await setDoc(doc(db, "ads", id), { ...clean, updatedAt: serverTimestamp() });
  toast(message);
  await loadAds();
}

/* صورة الإعلان: من الجهاز (تُصغَّر وتُحفظ داخل الإعلان نفسه في Firestore) أو برابط */
const MAX_IMAGE_WIDTH = 1400;
const MAX_IMAGE_CHARS = 700_000; // حد مستند Firestore هو 1MB، فنترك مساحة لباقي البيانات
let adImageData = ""; // الصورة المرفوعة من الجهاز (data URL)

function currentAdImage() {
  return adImageData || $("a-image").value.trim();
}

function updateAdPreview() {
  const src = currentAdImage();
  $("ad-image-preview").src = src;
  $("ad-image-preview").classList.toggle("hidden", !src);
  $("a-image-clear").classList.toggle("hidden", !src);
  $("a-image").classList.toggle("hidden", !!adImageData);
  $("a-image-status").textContent = adImageData
    ? `صورة من الجهاز (${Math.round((adImageData.length * 0.75) / 1024)} KB)`
    : "";
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("الملف ليس صورة صالحة"));
    };
    img.src = url;
  });
}

// نصغّر الصورة ونضغطها حتى تصير أصغر من الحد المسموح
async function compressImage(file) {
  const img = await loadImage(file);
  let width = Math.min(img.naturalWidth, MAX_IMAGE_WIDTH);
  for (let attempt = 0; attempt < 6; attempt++) {
    const height = Math.round((img.naturalHeight * width) / img.naturalWidth);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff"; // خلفية بيضاء للصور الشفافة (JPEG لا يدعم الشفافية)
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    for (const quality of [0.85, 0.7, 0.55]) {
      const data = canvas.toDataURL("image/jpeg", quality);
      if (data.length <= MAX_IMAGE_CHARS) return data;
    }
    width = Math.round(width * 0.75);
  }
  throw new Error("الصورة كبيرة جداً، جرّب صورة أصغر.");
}

$("a-image").addEventListener("input", updateAdPreview);

$("a-image-file").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  e.target.value = "";
  if (!file) return;
  $("ad-editor-error").classList.add("hidden");
  $("a-image-status").textContent = "جاري تجهيز الصورة...";
  try {
    adImageData = await compressImage(file);
    $("a-image").value = "";
  } catch (err) {
    $("ad-editor-error").textContent = err.message;
    $("ad-editor-error").classList.remove("hidden");
  }
  updateAdPreview();
});

$("a-image-clear").addEventListener("click", () => {
  adImageData = "";
  $("a-image").value = "";
  updateAdPreview();
});

const AD_FIELDS = {
  "a-badge": "badge",
  "a-badge-en": "badge_en",
  "a-title": "title",
  "a-title-en": "title_en",
  "a-text": "text",
  "a-text-en": "text_en",
  "a-link": "link",
  "a-link-label": "linkLabel",
  "a-link-label-en": "linkLabel_en",
};

function openAdEditor(ad) {
  editingAdId = ad?.id || null;
  $("ad-editor-title").textContent = ad ? "تعديل الإعلان" : "إضافة إعلان";
  $("ad-editor-error").classList.add("hidden");
  Object.entries(AD_FIELDS).forEach(([inputId, key]) => ($(inputId).value = ad?.[key] || ""));
  $("a-order").value = ad?.order ?? ads.length + 1;
  $("a-active").checked = ad ? ad.active !== false : true;
  const image = ad?.imageUrl || "";
  adImageData = image.startsWith("data:") ? image : "";
  $("a-image").value = adImageData ? "" : image;
  updateAdPreview();
  adEditor.showModal();
  $("a-title").focus();
}

$("add-ad-btn").addEventListener("click", () => openAdEditor(null));

$("ad-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {};
  Object.entries(AD_FIELDS).forEach(([inputId, key]) => (data[key] = $(inputId).value.trim()));
  const order = parseInt($("a-order").value, 10);
  data.order = Number.isFinite(order) ? order : ads.length + 1;
  data.active = $("a-active").checked;
  data.imageUrl = currentAdImage();

  const isUrl = (u) => !u || /^https?:\/\//i.test(u);
  let problem = "";
  if (!data.title && !data.title_en && !data.imageUrl) problem = "اكتب عنوان للإعلان أو أضف صورة.";
  else if (!adImageData && !isUrl(data.imageUrl)) problem = "رابط الصورة لازم يبدأ بـ https://";
  else if (!isUrl(data.link)) problem = "رابط الزر لازم يبدأ بـ https://";
  if (problem) {
    $("ad-editor-error").textContent = problem;
    $("ad-editor-error").classList.remove("hidden");
    return;
  }

  const saveBtn = $("ad-save-btn");
  saveBtn.disabled = true;
  saveBtn.textContent = "جاري الحفظ...";
  try {
    await saveAd(editingAdId || doc(collection(db, "ads")).id, data, editingAdId ? "تم حفظ الإعلان" : "تمت إضافة الإعلان");
    adEditor.close();
  } catch (err) {
    $("ad-editor-error").textContent = errorMessage(err);
    $("ad-editor-error").classList.remove("hidden");
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "حفظ";
  }
});
