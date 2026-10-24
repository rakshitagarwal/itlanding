const fs = require("fs");
const s = fs.readFileSync("lib/homepage-html.ts", "utf8");
const i = s.indexOf("page-wrapper");
console.log(s.slice(i - 60, i + 100));
console.log("stray text", /page-wrapper">\s*id=/.test(JSON.parse(s.match(/= ([\s\S]*);?\s*$/)[1])));
