// سيرفر محلي للتجربة فقط (بديل Live Server): يعرض الموقع ويشغّل دالة التتبع /api/track
// التشغيل:  node dev-server.mjs   ثم افتح  http://localhost:8080
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import trackHandler from "./netlify/functions/track.mjs";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PORT = 8080;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === "/api/track") {
    const response = await trackHandler(new Request(url));
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(await response.text());
    return;
  }

  let path = decodeURIComponent(url.pathname);
  if (path.endsWith("/")) path += "index.html";
  const file = normalize(join(ROOT, path));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end();
    return;
  }

  try {
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("404 - الصفحة غير موجودة");
  }
}).listen(PORT, () => console.log(`الموقع شغّال على http://localhost:${PORT}`));
