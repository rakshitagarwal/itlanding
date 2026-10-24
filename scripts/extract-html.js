const fs = require("fs");
const html = fs.readFileSync(
  "C:/Users/Rakshit/Documents/template/index.html",
  "utf8"
);
// Pretty-print rough section markers by splitting on section-ish class opens
const parts = html.split(/(?=<div[^>]+class="[^"]*(?:banner-section|sponsors-section|about-section|services-section|work-section|working-process|testimonial-section|cta-section|blog-section|footer-section|navbar-section)[^"]*")/i);
console.log("parts", parts.length);
for (let i = 0; i < Math.min(parts.length, 15); i++) {
  const chunk = parts[i].slice(0, 400).replace(/\s+/g, " ");
  console.log("\n=== PART", i, "===\n", chunk);
}
