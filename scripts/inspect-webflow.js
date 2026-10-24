const fs = require("fs");
const html = fs.readFileSync(
  "C:/Users/Rakshit/Documents/experiments/itcompany/template/index.html",
  "utf8"
);

const ids = [...html.matchAll(/data-w-id="([^"]+)"/g)].map((m) => m[1]);
console.log("data-w-id count", ids.length);
console.log("unique", new Set(ids).size);

const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
console.log("inline scripts", scripts.length);
scripts.forEach((s, i) => {
  const body = s[1].trim();
  if (!body) return;
  console.log("\n--- script", i, "len", body.length, "---");
  console.log(body.slice(0, 300));
});

const linkCss = [...html.matchAll(/href="([^"]+\.css)"/g)].map((m) => m[1]);
const linkJs = [...html.matchAll(/src="([^"]+\.js)"/g)].map((m) => m[1]);
console.log("\ncss", linkCss);
console.log("js", linkJs);
