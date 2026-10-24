const fs = require("fs");
const src = fs.readFileSync("lib/homepage-html.ts", "utf8");
const html = eval(
  src.match(/export const homepageHtml: string = ([\s\S]*);?\s*$/)[1].replace(/;\s*$/, "")
);

function dump(label, needle) {
  const i = html.indexOf(needle);
  console.log("\n====", label, i, "====");
  console.log(html.slice(i, i + 1200));
}

dump("BANNER", "banner-image-wrapper");
dump("ABOUT", "about-us-image");
console.log("\nRitovex count", (html.match(/Ritovex/gi) || []).length);
console.log(
  "Ritovex contexts",
  [...html.matchAll(/Ritovex[^"'<\s]*/gi)].slice(0, 20).map((m) => m[0])
);

const css = fs.readFileSync(
  "public/template/css/ritovex.webflow.shared.84db156a8.css",
  "utf8"
);
for (const sel of [
  ".banner-image",
  ".banner-image-wrapper",
  ".image-overlay",
  ".about-us-image",
  ".about-us-image-wrapper",
  ".image",
]) {
  const idx = css.indexOf(sel + "{");
  const idx2 = css.indexOf(sel + " {");
  const i = idx >= 0 ? idx : idx2;
  if (i < 0) {
    console.log("\nMISS CSS", sel);
    continue;
  }
  console.log("\nCSS", css.slice(i, css.indexOf("}", i) + 1));
}

// media queries mentioning banner-image
const re = /@media[^{]+\{[^}]*banner-image[^}]*\}/g;
const hits = css.match(/banner-image[^{]*\{[^}]*\}/g) || [];
console.log("\nbanner-image rules", hits.length);
hits.slice(0, 15).forEach((h) => console.log(h));
