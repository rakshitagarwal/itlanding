const fs = require("fs");
const s = fs.readFileSync("lib/homepage-html.ts", "utf8");
const m = [...s.matchAll(/srcset=\\?"([^"\\]+)/g)].map((x) => x[1]).slice(0, 8);
console.log(m);
console.log("bad relative", (s.match(/srcset=\\"images\//g) || []).length);
