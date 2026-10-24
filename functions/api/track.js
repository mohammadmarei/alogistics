// دالة Cloudflare Pages: نفس دالة Netlify، بس بتشتغل على Cloudflare على الرابط /api/track
import handler from "../../netlify/functions/track.mjs";

export const onRequest = ({ request }) => handler(request);
