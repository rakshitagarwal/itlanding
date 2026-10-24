const fs = require("fs");
const src = fs.readFileSync("lib/homepage-html.ts", "utf8");
const t = src.slice(src.indexOf("`") >= 0 && src.includes("= `") ? 0 : 0);
// export const homepageHtml: string = "...";
const m = src.match(/export const homepageHtml: string = ([\s\S]*);?\s*$/);
const html = eval(m[1].replace(/;$/, ""));

const i = html.indexOf("wf-form-Newsletter");
console.log("---NEWSLETTER---\n", html.slice(Math.max(0, i - 500), i + 700));

const c = html.indexOf("w-commerce");
console.log("\n---COMMERCE START---\n", html.slice(c, c + 300));
console.log("\ncommerce wrappers", (html.match(/w-commerce-commercecartwrapper/g) || []).length);
console.log("w-form", (html.match(/class="[^"]*w-form[^"]*"/g) || []).slice(0, 10));
