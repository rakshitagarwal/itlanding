const fs = require("fs");
const src = fs.readFileSync("lib/homepage-html.ts", "utf8");
const html = eval(
  src.match(/export const homepageHtml: string = ([\s\S]*);?\s*$/)[1].replace(/;\s*$/, "")
);

const i = html.lastIndexOf('class="section footer"');
console.log("footer idx", i);
console.log(html.slice(i, i + 3500));
console.log("\n---AFTER FOOTER---");
console.log(html.slice(html.indexOf("footer-details"), html.length).slice(-2500));

// anything after </section></div> page wrapper end
const lastSections = [...html.matchAll(/<section[^>]*class="[^"]*"/g)].map((m) => m[0]);
console.log("\nsections", lastSections.slice(-8));
console.log("page-wrapper closes", (html.match(/page-wrapper/g) || []).length);
console.log("Designed by", html.includes("Designed by"));
console.log("copyright", /©|Copyright/i.test(html));
