const fs = require("fs");
const s = fs.readFileSync("lib/homepage-html.ts", "utf8");
console.log("opacity:0", (s.match(/opacity:0/g) || []).length);
console.log("footer-bottom", s.includes("footer-bottom-content"));
console.log("copyright", s.includes("All rights reserved"));
console.log("id top", /id=\\"top\\"/.test(s) || s.includes('id=\\"top\\"'));
console.log("Powered by Webflow", s.includes("Powered by"));
console.log("ends with", s.slice(-180));
