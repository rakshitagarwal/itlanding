const fs = require("fs");
const path = require("path");

const src = fs.readFileSync("lib/homepage-html.ts", "utf8");
const html = eval(
  src.match(/export const homepageHtml: string = ([\s\S]*);?\s*$/)[1].replace(/;\s*$/, "")
);

const urls = [
  ...html.matchAll(/(?:src|href)="(\/template\/[^"]+)"/g),
].map((m) => m[1]);

const css = fs.readFileSync(
  "public/template/css/ritovex.webflow.shared.84db156a8.css",
  "utf8"
);
const cssUrls = [...css.matchAll(/url\((["']?)([^)"']+)\1\)/g)].map((m) => m[2]);

const all = [...new Set([...urls, ...cssUrls.map((u) => {
  if (u.startsWith("/template/")) return u;
  if (u.startsWith("../")) return "/template/" + u.replace(/^\.\.\//, "");
  return null;
}).filter(Boolean)])];

const missing = [];
const ok = [];
for (const u of all) {
  const decoded = decodeURIComponent(u.split("?")[0]);
  const file = path.join("public", ...decoded.replace(/^\//, "").split("/"));
  if (fs.existsSync(file)) ok.push(u);
  else missing.push({ u, file });
}

console.log("total", all.length, "ok", ok.length, "missing", missing.length);
missing.forEach((m) => console.log("MISS", m.u, "->", m.file));

// list disk images with spaces
const imgs = fs.readdirSync("public/template/images");
console.log("\ndisk images", imgs.length);
console.log("space names", imgs.filter((n) => n.includes(" ")).slice(0, 20));
