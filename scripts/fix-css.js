const fs = require("fs");
const src =
  "C:/Users/Rakshit/Documents/template/css/ritovex.webflow.shared.84db156a8.css";
const dest =
  "C:/Users/Rakshit/Documents/experiments/itcompany/app/ritovex.css";
let c = fs.readFileSync(src, "utf8");
c = c.replace(/url\("\.\.\/fonts\//g, 'url("/ritovex/fonts/');
c = c.replace(/url\('\.\.\/fonts\//g, "url('/ritovex/fonts/");
fs.writeFileSync(dest, c);
console.log("wrote", dest, c.length);
