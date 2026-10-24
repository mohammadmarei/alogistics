import { db, isConfigured } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { STORES, TEXT_EN } from "./stores-data.js";
import { t, getLang } from "./site.js";

const WHATSAPP = "https://wa.me/972502527344";

const grid = document.getElementById("stores-grid");

// الصفحة الرئيسية تعرض عدداً محدوداً فقط (data-limit في HTML)
const maxItems = Number(grid?.dataset.limit) || 0;

let allStores = [...STORES];
let currentStore = null;

/* ---------------------------------------------------------
   أدوات صغيرة
   --------------------------------------------------------- */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

// بالإنجليزي: النص المخصص (مثل text_en من صفحة الأدمن)، ثم قاموس TEXT_EN، وإلا يبقى العربي
function tr(text, en) {
  if (!text) return text;
  return getLang() === "en" ? en || TEXT_EN[text] || text : text;
}

const byOrder = (a, b) => (a.order ?? 999) - (b.order ?? 999) || a.name.localeCompare(b.name);

// شعار المتجر، وإذا فشل تحميله نعرض أول حرف من الاسم
function createLogo(store, className) {
  const wrap = el("div", className);
  const showLetter = () => {
    wrap.innerHTML = "";
    wrap.appendChild(el("span", "letter-logo", (store.name || "?").trim().charAt(0).toUpperCase()));
  };
  if (!store.logoUrl) {
    showLetter();
    return wrap;
  }
  const img = el("img");
  img.alt = store.name || "";
  img.loading = "lazy";
  img.src = store.logoUrl;
  img.onerror = showLetter;
  wrap.appendChild(img);
  return wrap;
}

async function copyText(value, button) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const tmp = el("textarea");
    tmp.value = value;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand("copy");
    tmp.remove();
  }
  button.classList.add("copied");
  button.setAttribute("aria-label", t("stores.copied"));
  setTimeout(() => {
    button.classList.remove("copied");
    button.setAttribute("aria-label", t("stores.copy"));
  }, 1500);
}

/* ---------------------------------------------------------
   نافذة "كيفية الطلب"
   --------------------------------------------------------- */
const COPY_ICON = `<svg class="icon" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const CHECK_ICON = `<svg class="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`;

const modal = el("dialog", "modal");
modal.innerHTML = `
  <div class="modal-head">
    <div class="modal-logo"></div>
    <h3 class="modal-title"></h3>
    <button class="modal-close" type="button">✕</button>
  </div>
  <p class="modal-intro"></p>
  <div class="table-wrap">
    <table class="how-table">
      <thead><tr><th class="th-field"></th><th class="th-value"></th></tr></thead>
      <tbody></tbody>
    </table>
  </div>
  <ul class="modal-notes"></ul>
  <div class="modal-actions">
    <a class="btn btn-orange modal-shop" target="_blank" rel="noopener"></a>
    <a class="btn btn-ghost modal-whatsapp" href="${WHATSAPP}" target="_blank" rel="noopener"></a>
  </div>`;
document.body.appendChild(modal);

modal.querySelector(".modal-close").addEventListener("click", () => modal.close());
// إغلاق عند الضغط خارج النافذة
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.close();
});

function fillModal(store) {
  modal.querySelector(".modal-logo").replaceWith(createLogo(store, "modal-logo"));
  modal.querySelector(".modal-title").textContent = t("stores.modalTitle", { name: store.name });
  modal.querySelector(".modal-intro").textContent =
    tr(store.intro, store.intro_en) || t("stores.intro", { name: store.name });
  modal.querySelector(".modal-close").setAttribute("aria-label", t("stores.close"));
  modal.querySelector(".th-field").textContent = t("stores.thField");
  modal.querySelector(".th-value").textContent = t("stores.thValue");
  modal.querySelector(".modal-shop").textContent = t("stores.shop");
  modal.querySelector(".modal-whatsapp").textContent = t("stores.sendTracking");

  const tbody = modal.querySelector("tbody");
  tbody.innerHTML = "";
  const fields = Array.isArray(store.fields) ? store.fields : [];
  modal.querySelector(".table-wrap").classList.toggle("hidden", fields.length === 0);

  fields.forEach((f) => {
    const row = el("tr");
    row.appendChild(el("td", "field-label", tr(f.label, f.label_en) || ""));

    const td = el("td");
    const cell = el("div", "field-value");
    if (f.text) cell.appendChild(el("span", "field-text", tr(f.text, f.text_en)));
    if (f.value) {
      const chip = el("span", "chip");
      chip.appendChild(el("code", "", f.value));
      const btn = el("button", "copy-btn");
      btn.type = "button";
      btn.setAttribute("aria-label", t("stores.copy"));
      btn.innerHTML = COPY_ICON + CHECK_ICON;
      btn.addEventListener("click", () => copyText(f.value, btn));
      chip.appendChild(btn);
      cell.appendChild(chip);
    }
    td.appendChild(cell);
    row.appendChild(td);
    tbody.appendChild(row);
  });

  const notes = modal.querySelector(".modal-notes");
  notes.innerHTML = "";
  const notesList = (store.notes || []).filter(Boolean);
  notesList.forEach((n, i) => notes.appendChild(el("li", "", tr(n, store.notes_en?.[i]))));
  notes.classList.toggle("hidden", notesList.length === 0);

  const shop = modal.querySelector(".modal-shop");
  shop.classList.toggle("hidden", !store.url);
  if (store.url) shop.href = store.url;
}

function openStore(store) {
  currentStore = store;
  fillModal(store);
  modal.showModal();
}

/* ---------------------------------------------------------
   شبكة المتاجر
   --------------------------------------------------------- */
function createStoreCard(store) {
  const card = el("article", "store-card");
  card.tabIndex = 0;
  card.appendChild(createLogo(store, "store-logo"));
  card.appendChild(el("h3", "store-name", store.name || "—"));
  const btn = el("button", "btn btn-ghost btn-sm", t("stores.howButton"));
  btn.type = "button";
  card.appendChild(btn);

  card.addEventListener("click", () => openStore(store));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter") openStore(store);
  });
  return card;
}

function showSpinner() {
  grid.innerHTML = '<div class="spinner-wrap"><div class="spinner"></div></div>';
}

function showEmpty() {
  grid.innerHTML = "";
  const box = el("div", "message");
  box.appendChild(el("div", "emoji", "🔍"));
  box.appendChild(el("h3", "", t("stores.emptyTitle")));
  box.appendChild(el("p", "", t("stores.emptyText")));
  grid.appendChild(box);
}

function render(stores) {
  if (stores.length === 0) return showEmpty();
  grid.innerHTML = "";
  const list = maxItems ? stores.slice(0, maxItems) : stores;
  list.forEach((s) => grid.appendChild(createStoreCard(s)));
}

// المتاجر من Firestore (يديرها الأدمن). إذا كانت المجموعة فارغة أو تعذّر الاتصال
// نعرض المتاجر الافتراضية الموجودة في stores-data.js
async function loadStores() {
  if (isConfigured) {
    showSpinner();
    try {
      const snap = await getDocs(collection(db, "stores"));
      if (!snap.empty) {
        allStores = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((s) => s.name).sort(byOrder);
      }
    } catch (err) {
      console.warn("تعذّر تحميل المتاجر من Firestore:", err.message);
    }
  }
  render(allStores);
}

if (grid) {
  loadStores();

  // عند تغيير اللغة نعيد رسم الكروت والنافذة المفتوحة
  document.addEventListener("langchange", () => {
    render(allStores);
    if (modal.open && currentStore) fillModal(currentStore);
  });
}
