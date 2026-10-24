// تهيئة Firebase من الـ CDN الرسمي (ES Modules)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ⚠️ الصق هنا إعدادات مشروعك من:
// Firebase Console → Project settings → General → Your apps → Web app → SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyD11_MPt80nEdk4fH8Df4zFFZG3kOX7fYE",
  authDomain: "alogistics-200c3.firebaseapp.com",
  projectId: "alogistics-200c3",
  storageBucket: "alogistics-200c3.firebasestorage.app",
  messagingSenderId: "816172920321",
  appId: "1:816172920321:web:33293c38def865c8139a00",
};

// الأدمن الأساسيون: ثابتون ولا يمكن حذفهم من صفحة الأدمن.
// باقي المشرفين يُضافون ويُحذفون من صفحة الأدمن (مجموعة admins في Firestore).
// إذا عدّلت القائمة هنا عدّلها أيضاً في firestore.rules (الحماية الحقيقية هناك).
export const OWNER_EMAILS = ["logistipost@gmail.com"];

// هل تم لصق إعدادات Firebase؟
export const isConfigured = !firebaseConfig.projectId.startsWith("PASTE");

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
