// دالة Netlify: تبحث عن رقم التتبع في نظام Click (Olivery) وترجع النتيجة كـ JSON.
// نحتاجها لأن موقع Olivery لا يسمح للمتصفح بقراءة ردّه من موقع آخر (CORS).
// الرابط: /api/track?id=رقم_التتبع

const OLIVERY_URL = "https://click.olivery.io/order_tracking";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

function cleanText(html) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// التاريخ يأتي بتوقيت UTC بصيغة dd-mm-yyyy HH:MM:SS
function toIso(value) {
  const m = value.match(/^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return value;
  const [, d, mo, y, h, mi, s = "0"] = m;
  return new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)).toISOString();
}

export default async (req) => {
  const id = (new URL(req.url).searchParams.get("id") || "").trim();
  if (!id || id.length > 60) return json({ error: "bad_id" }, 400);

  let html;
  try {
    const res = await fetch(OLIVERY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ order_seq: id }),
    });
    if (!res.ok) return json({ error: "upstream_" + res.status }, 502);
    html = await res.text();
  } catch {
    return json({ error: "upstream_unreachable" }, 502);
  }

  const tbody = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i)?.[1] || "";
  const orders = [];
  for (const row of tbody.match(/<tr[\s\S]*?<\/tr>/gi) || []) {
    const rawCells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((c) => c[1]);
    // صف "No Results" فيه خلية واحدة فقط
    if (rawCells.length < 5) continue;
    const [, reference, status, previousStatus, createdOn] = rawCells.map(cleanText);
    // خلية الرقم فيها الرقم ثم المرجع بين نجمتين، نأخذ أول span فقط
    const sequence = cleanText(rawCells[0].match(/<span[^>]*>([\s\S]*?)<\/span>/i)?.[1] || rawCells[0]);
    orders.push({ sequence, reference, status, previousStatus, createdOn: toIso(createdOn) });
  }

  return json({ orders });
};

export const config = { path: "/api/track" };
