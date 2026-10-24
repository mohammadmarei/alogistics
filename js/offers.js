// الإعلانات والعروض في الصفحة الرئيسية (الوسطاء، Black Friday...).
// يديرها الأدمن من لوحة الأدمن (مجموعة ads في Firestore)، وإذا لا يوجد إعلانات نعرض إعلاناً افتراضياً.
import { db, isConfigured } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { t, getLang } from "./site.js";

const AUTOPLAY_MS = 6000;

// يظهر فقط إذا لا يوجد أي إعلان ظاهر من لوحة الأدمن
const DEFAULT_AD = {
  badge: "عروض قريباً",
  badge_en: "Offers soon",
  title: "عروض خاصة ووسطاء معتمدون",
  title_en: "Special offers & trusted partners",
  text: "تابعنا لتعرف أحدث العروض مثل Black Friday، وتعرّف على الوسطاء الذين يتعاملون مع A Logistics.",
  text_en: "Follow us for the latest offers like Black Friday, and meet the partners who work with A Logistics.",
  link: "https://whatsapp.com/channel/0029VasoA9pKWEKtpYkLQ004",
  linkLabel: "تابع قناتنا على واتساب",
  linkLabel_en: "Follow our WhatsApp channel",
};

const section = document.getElementById("offers");
const track = document.getElementById("offers-track");
const dots = document.getElementById("offers-dots");
const prevBtn = document.getElementById("offers-prev");
const nextBtn = document.getElementById("offers-next");

let ads = [];
let current = 0;
let timer = null;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

// بالإنجليزي نعرض النص الإنجليزي إن وُجد، وإلا العربي
const pick = (ar, en) => (getLang() === "en" ? en || ar : ar || en) || "";

function createSlide(ad) {
  const title = pick(ad.title, ad.title_en);
  const text = pick(ad.text, ad.text_en);
  const badge = pick(ad.badge, ad.badge_en);
  const hasContent = title || text || badge;

  const slide = el("article", "offer-slide" + (hasContent ? "" : " image-only"));

  if (hasContent) {
    const body = el("div", "offer-body");
    if (badge) body.appendChild(el("span", "offer-badge", badge));
    if (title) body.appendChild(el("h2", "offer-title", title));
    if (text) body.appendChild(el("p", "offer-text", text));
    if (ad.link) {
      const a = el("a", "btn btn-orange", pick(ad.linkLabel, ad.linkLabel_en) || t("offers.more"));
      a.href = ad.link;
      a.target = "_blank";
      a.rel = "noopener";
      body.appendChild(a);
    }
    slide.appendChild(body);
  }

  if (ad.imageUrl) {
    const media = el(ad.link && !hasContent ? "a" : "div", "offer-media");
    if (media.tagName === "A") {
      media.href = ad.link;
      media.target = "_blank";
      media.rel = "noopener";
    }
    const img = el("img");
    img.src = ad.imageUrl;
    img.alt = title;
    img.loading = "lazy";
    img.onerror = () => media.remove();
    media.appendChild(img);
    slide.appendChild(media);
  }
  return slide;
}

function show(index) {
  const slides = track.children;
  if (!slides.length) return;
  current = (index + slides.length) % slides.length;
  [...slides].forEach((s, i) => s.classList.toggle("active", i === current));
  [...dots.children].forEach((d, i) => d.classList.toggle("active", i === current));
}

function restartTimer() {
  clearInterval(timer);
  if (ads.length > 1) timer = setInterval(() => show(current + 1), AUTOPLAY_MS);
}

function render() {
  track.innerHTML = "";
  dots.innerHTML = "";
  ads.forEach((ad, i) => {
    track.appendChild(createSlide(ad));
    const dot = el("button", "offers-dot");
    dot.type = "button";
    dot.setAttribute("aria-label", String(i + 1));
    dot.addEventListener("click", () => {
      show(i);
      restartTimer();
    });
    dots.appendChild(dot);
  });

  const many = ads.length > 1;
  [prevBtn, nextBtn, dots].forEach((n) => n.classList.toggle("hidden", !many));
  section.classList.toggle("hidden", ads.length === 0);
  show(current);
  restartTimer();
}

async function loadAds() {
  if (isConfigured) await fetchAds();
  if (ads.length === 0) ads = [DEFAULT_AD];
  render();
}

async function fetchAds() {
  try {
    const snap = await getDocs(collection(db, "ads"));
    ads = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((a) => a.active !== false && (a.title || a.title_en || a.imageUrl))
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  } catch (err) {
    console.warn("تعذّر تحميل الإعلانات:", err.message);
  }
}

if (section) {
  // الأسهم: "التالي" دائماً باتجاه القراءة
  prevBtn.addEventListener("click", () => {
    show(current - 1);
    restartTimer();
  });
  nextBtn.addEventListener("click", () => {
    show(current + 1);
    restartTimer();
  });

  // السحب باللمس على الجوال
  let startX = null;
  track.addEventListener("pointerdown", (e) => (startX = e.clientX));
  track.addEventListener("pointerup", (e) => {
    if (startX == null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) < 40) return;
    const forward = getLang() === "en" ? dx < 0 : dx > 0;
    show(current + (forward ? 1 : -1));
    restartTimer();
  });

  // نوقف التبديل التلقائي عند وضع الماوس على الإعلان
  section.addEventListener("mouseenter", () => clearInterval(timer));
  section.addEventListener("mouseleave", restartTimer);

  document.addEventListener("langchange", render);
  loadAds();
}
