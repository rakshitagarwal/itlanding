const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const templateDir = path.join(root, "template");
const publicTemplate = path.join(root, "public", "template");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

console.log("Syncing template → public/template …");
fs.rmSync(publicTemplate, { recursive: true, force: true });
copyDir(templateDir, publicTemplate);

// Fix font urls in CSS for public serving
const cssPath = path.join(
  publicTemplate,
  "css",
  "ritovex.webflow.shared.84db156a8.css"
);
let css = fs.readFileSync(cssPath, "utf8");
css = css
  .replace(/url\("\.\.\/fonts\//g, 'url("/template/fonts/')
  .replace(/url\('\.\.\/fonts\//g, "url('/template/fonts/")
  .replace(/url\("\.\.\/images\//g, 'url("/template/images/')
  .replace(/url\('\.\.\/images\//g, "url('/template/images/");
fs.writeFileSync(cssPath, css);

let html = fs.readFileSync(path.join(templateDir, "index.html"), "utf8");

// Asset paths → /template/...
html = html
  .replace(/(src|href)="(css|js|images|fonts)\//g, '$1="/template/$2/')
  .replace(
    /srcset="([^"]+)"/g,
    (_, value) =>
      `srcset="${value.replace(/(^|,\s*)(?:\.\/)?(images\/)/g, "$1/template/$2")}"`
  )
  .replace(
    /url\((['"]?)(?!https?:|\/|data:)([^)'"]+)\1\)/g,
    (m, q, p) => `url(${q}/template/${p.replace(/^\.\.\//, "")}${q})`
  );

// Protect asset URLs so text replacements cannot rename image files
// (e.g. "Testimonial" in a filename must stay "Testimonial")
const assetPlaceholders = [];
function protectAssets(input) {
  return input.replace(
    /((?:src|href|srcset)=["'][^"']*["'])|(url\([^)]+\))/g,
    (match) => {
      const key = `__ASSET_PH_${assetPlaceholders.length}__`;
      assetPlaceholders.push(match);
      return key;
    }
  );
}
function restoreAssets(input) {
  let out = input;
  assetPlaceholders.forEach((value, i) => {
    out = out.split(`__ASSET_PH_${i}__`).join(value);
  });
  return out;
}

html = protectAssets(html);

// --- IT company content replacements ---
const replacements = [
  ["Ritovex - Webflow Ecommerce Website Template", "Northline | Custom Software, AI SaaS & Digital Products"],
  [
    "Ritovex is a modern Creative Agency Webflow Ecommerce template, designed for startups, agencies, and professionals to build stunning, high-performing websites.",
    "Northline builds custom software, AI SaaS, TMS, CRM, and cloud products for startups and enterprises — from strategy through launch.",
  ],
  ["Ritovex - Webflow Ecommerce Website Template", "Northline | IT Company"],
  [">Ritovex<", ">Northline<"],
  ["Creative Ideas That Inspire Growth", "Engineering Ideas That Ship Products"],
  ["World’s Best Creative Agency Team", "Your Partner for Custom Software & AI"],
  [
    "World’s best creative agency team – crafting legendary brands &nbsp;through bold ideas, strategic genius, and flawless execution that &nbsp;dominates the global stage.",
    "Senior engineers and product thinkers building AI SaaS, transport systems, CRM platforms, and cloud apps that operators trust every day.",
  ],
  [
    "World’s best creative agency team – crafting legendary brands through bold ideas, strategic genius, and flawless execution that dominates the global stage.",
    "Senior engineers and product thinkers building AI SaaS, transport systems, CRM platforms, and cloud apps that operators trust every day.",
  ],
  ["Trusted Partners Worldwide for Success", "Trusted by product teams shipping worldwide"],
  ["Who We Are. Learn About us", "Who We Are. Learn about Northline"],
  [
    "We are a dynamic team of innovators, storytellers, and visionaries dedicated to transforming ideas into extraordinary experiences.",
    "We are a product engineering studio — designers, full-stack developers, and AI specialists turning business problems into reliable software.",
  ],
  ["We deliver great work always", "Projects delivered on time"],
  ["Experience you can count on", "Years of engineering experience"],
  ["Award-Winning Work, Trusted Results", "Products launched in production"],
  ["We have happy Clients worldwide", "Happy clients worldwide"],
  ["More About Us", "Meet the Team"],
  ["Get free Qoute", "Book a call"],
  ["Get free Quote", "Book a call"],
  ["Your Needs, Our Expertise", "What we build for IT teams"],
  [
    "Your Vision, Our Expertise – Together, we bring ideas to life &nbsp;with tailored solutions that deliver real results. Let’s build something amazing.",
    "From AI-native TMS and CRM to cloud platforms — we design, build, and stay on so your product keeps shipping after launch.",
  ],
  [
    "Your Vision, Our Expertise – Together, we bring ideas to life with tailored solutions that deliver real results. Let’s build something amazing.",
    "From AI-native TMS and CRM to cloud platforms — we design, build, and stay on so your product keeps shipping after launch.",
  ],
  [">Web Design<", ">Custom Software<"],
  [
    "Focuses on the aesthetic and user experience of a website, creating visually appealing and intuitive layouts. It involves aspects like graphic design, typography, and color schemes to enhance user engagement.",
    "End-to-end web and mobile apps — UX, APIs, databases, and cloud deploy — built for the workflows your operators live in every day.",
  ],
  [">Web Development<", ">Cloud & DevOps<"],
  [
    "Involves the coding and programming that makes a website functional and interactive. This includes front-end development (what users see) and back-end development (server, database, and application logic).",
    "Infrastructure, CI/CD, observability, and secure deployments so your product scales without late-night fire drills.",
  ],
  [">Branding<", ">AI Solutions<"],
  [
    "The process of creating a unique identity for a company or product, encompassing its name, logo, messaging, and overall market perception. It aims to establish recognition and a positive emotional connection with the target audience.",
    "Practical AI for routing, scoring, document automation, and copilots — models where they earn their keep, people for product decisions.",
  ],
  [">Product Design<", ">Product Engineering<"],
  [
    "Encompasses the entire process of creating a new product, from conceptualization and research to prototyping and final execution. It focuses on solving user problems and enhancing the overall user experience.",
    "Discovery, UX, MVP, and iteration loops — the smallest useful version shipped fast, instrumented for real usage.",
  ],
  ["Explore Our Real Woks", "Explore Our Real Work"],
  ['SmartCity Traffic Solution"', "FleetMind AI TMS"],
  [
    "AI-powered sensors reduced downtown traffic congestion by 35% weekly.",
    "AI routing and live tracking cut empty miles by 28% for regional fleets.",
  ],
  ["ShopEasy E-Commerce Platform", "PipelineAI CRM"],
  [
    "Boosted online sales 200% with lightning-fast, mobile-friendly checkout flows.",
    "AI lead scoring and follow-up drafts doubled qualified pipeline in two quarters.",
  ],
  ["MedTrack Healthcare App", "CargoLink Network"],
  [
    "Doctor-patient communication with secure messaging and appointment tracking.",
    "Cross-border cargo booking, docs, and status in one digital operating network.",
  ],
  ["EduPlay Learning Portal", "Orbit Ops Console"],
  [
    "Interactive STEM games increased student engagement by 4X in classrooms.",
    "Replaced three internal tools — status-related support tickets fell by half.",
  ],
  ["Working Process", "How we deliver"],
  ["Explore Our 3 Step Working Process", "Explore Our 3 Step Delivery Process"],
  ["Start Projects", "Start a Project"],
  ["Discovery & Strategy", "Discovery & Strategy"],
  ["We start by understanding your vision, goals,", "We scope the problem, users, and the metric that must move,"],
  ["Design & Development", "Design & Build"],
  ["UI/UX Design", "UI/UX & Architecture"],
  ["Digital Marketing", "Launch & Iterate"],
  ["Testimonial", "Client Stories"],
  ["What Our Clients are Saying", "What Our Clients are Saying"],
  [
    "Hear directly from our clients about their experiences and the results we've delivered. Explore Client Feedback",
    "Hear from founders and operators on the software we design and ship. Explore Client Feedback",
  ],
  ["Project Manager at triko", "COO at FleetMind"],
  ["CTO at Ritovex", "VP Sales at PipelineAI"],
  ["Software Engineer at Briks", "CTO at CargoLink"],
  ["Founder at Ritof", "Founder at Orbit Ops"],
  ["Have a project in mind? Just let us know!", "Have a software project in mind? Tell us."],
  ["Let’s Start Talk", "Let’s Build Together"],
  ["Connect With Us", "Talk to Founders"],
  ["Our Blogs", "Insights"],
  ["Read Our Recants Article", "Read Our Recent Articles"],
  ["Browse All Article", "Browse All Articles"],
  ["Simple Tips for Better Website Design", "Practical Tips for Better SaaS UX"],
  [
    "Learn easy ways to improve your website’s look and feel. easy step for you",
    "Small UX changes that help operators finish work faster in complex apps.",
  ],
  ["How to Speed Up Your Website Fast loading", "How to Speed Up Your Web App"],
  [
    "Quick fixes to make your site load faster. How great user experience boosts your business",
    "Performance wins that keep dashboards snappy under real production load.",
  ],
  ["Best Tools for App Development Today world", "Best Tools for AI App Development"],
  [
    "Keep your site safe with simple security tips best tools to build apps easily and quickly",
    "A practical stack for shipping AI TMS and CRM features without bloat.",
  ],
  [
    "Get the latest tips for social media growth and marketing straight to your inbox!",
    "Get product engineering tips and AI SaaS playbooks in your inbox.",
  ],
  ["hello@domain.com", "hello@northline.dev"],
  ["22 (00) 356 7890", "+1 (415) 555-0142"],
  ["+91 123 456789", "+1 (415) 555-0142"],
  ["View Web Development", "View Case Study"],
];

for (const [from, to] of replacements) {
  html = html.split(from).join(to);
}

html = restoreAssets(html);

// Point multi-page template links at homepage sections
const linkFixes = [
  ['href="/template-pages/about-us"', 'href="#about"'],
  ['href="/template-pages/services"', 'href="#services"'],
  ['href="/template-pages/projects"', 'href="#work"'],
  ['href="/template-pages/contact-us"', 'href="#contact"'],
  ['href="/template-pages/pricing"', 'href="#contact"'],
  ['href="/template-pages/blogs"', 'href="#blog"'],
  ['href="/template-pages/team-member"', 'href="#about"'],
];
for (const [from, to] of linkFixes) {
  html = html.split(from).join(to);
}

// Swap every Ritovex logo file reference before any text rename
html = html.replace(
  /[^"'=\s]*Ritovex(?:%20| )?Logo\.svg/gi,
  "/template/images/northline-logo.svg"
);

// Replace navbar + footer logo markup with Northline mark + wordmark
html = html.replace(
  /<img[^>]*class="navbar-logo-image"[^>]*>/g,
  '<img src="/template/images/northline-logo.svg" loading="eager" alt="Northline" class="navbar-logo-image"><span class="navbar-logo-text" style="margin-left:10px;font-weight:700;font-size:20px;color:#141414;letter-spacing:-0.02em;display:inline-block;vertical-align:middle">Northline</span>'
);
// Neutralize leftover external Ritovex demo links, then brand text
html = html.replace(/https?:\/\/ritovex\.webflow\.io[^"'\\\s]*/gi, "#");
html = protectAssets(html);
html = html.replace(/Ritovex/gi, "Northline");
html = restoreAssets(html);

// Extract body inner HTML
const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
if (!bodyMatch) throw new Error("No body found");
let body = bodyMatch[1];

// Give major sections stable IDs for in-page nav (best-effort)
body = body
  .replace(
    'class="about-us-content"',
    'id="about" class="about-us-content"'
  )
  .replace(
    'class="services-content"',
    'id="services" class="services-content"'
  )
  .replace(
    'class="portfolio-content-vh"',
    'id="work" class="portfolio-content-vh"'
  )
  .replace('class="cta-wrapper"', 'id="contact" class="cta-wrapper"')
  .replace(
    'class="blog-section-title-wrapper"',
    'id="blog" class="blog-section-title-wrapper"'
  );

// Remove script tags from body (we load them from React)
body = body.replace(/<script[\s\S]*?<\/script>/gi, "");

// --- Disable Webflow-hosted forms & ecommerce (no Webflow backend locally) ---
function removeElementByAttr(html, attrMatch) {
  const start = html.search(attrMatch);
  if (start < 0) return html;
  // Walk back to opening '<' of this tag
  const open = html.lastIndexOf("<", start);
  if (open < 0) return html;
  let i = open;
  let depth = 0;
  while (i < html.length) {
    if (html.startsWith("</div", i)) {
      depth -= 1;
      const end = html.indexOf(">", i) + 1;
      i = end;
      if (depth === 0) return html.slice(0, open) + html.slice(end);
      continue;
    }
    if (html.startsWith("<div", i)) {
      depth += 1;
      i = html.indexOf(">", i) + 1;
      continue;
    }
    i += 1;
  }
  return html;
}

body = removeElementByAttr(body, /data-node-type="commerce-cart-wrapper"/);
body = removeElementByAttr(body, /class="[^"]*w-commerce-commercecartwrapper/);

// Newsletter: replace entire Webflow form block with a plain local form
body = body.replace(
  /<div class="footer-form-block w-form">[\s\S]*?<div class="w-form-fail">[\s\S]*?<\/div><\/div><\/div>/i,
  `<div class="footer-form-block">
<form id="newsletter-form" name="newsletter-form" method="post" action="#" class="footer-form" data-northline-form="newsletter">
<div class="footer-form-single">
<input class="footer-form-input-filed w-input" maxlength="256" name="email" placeholder="you@company.com" type="email" id="newsletter-email" required>
<input type="submit" class="footer-form-submit-button w-button" value="Subscribe Now">
</div>
</form>
<div class="success-message" style="display:none" data-northline-form-success><div>Thank you! You are on the list.</div></div>
</div>`
);

// Strip any leftover Webflow form / commerce site bindings
body = body
  .replace(/\sdata-wf-page-id="[^"]*"/g, "")
  .replace(/\sdata-wf-element-id="[^"]*"/g, "")
  .replace(/\sdata-wf-site(?:-id)?="[^"]*"/g, "")
  .replace(/\bfooter-form-block w-form\b/g, "footer-form-block")
  .replace(/\sclass="([^"]*)\bw-form\b([^"]*)"/g, ' class="$1$2"')
  .replace(/\sclass="([^"]*)\bw-form-done\b([^"]*)"/g, ' class="$1$2"')
  .replace(/\sclass="([^"]*)\bw-form-fail\b([^"]*)"/g, ' class="$1$2"');

// Page shell must be visible; keep other opacity:0 so scroll/load IX2 can run.
body = body.replace(
  /<div style="opacity:0" class="page-wrapper">/i,
  '<div id="top" style="opacity:1" class="page-wrapper">'
);
// Clean any prior bad injection that left id="top" as visible text
body = body.replace(
  /(<div id="top" style="opacity:1" class="page-wrapper">)\s*id="top"/i,
  "$1"
);
body = body.replace(
  /<div style="opacity:1" class="page-wrapper">/i,
  '<div id="top" style="opacity:1" class="page-wrapper">'
);

// Remove image wipe overlays (they cover hero/about when IX2 wipe never finishes)
body = body.replace(
  /<div[^>]*class="image-overlay"[^>]*>[\s\S]*?<\/div><\/div>/gi,
  ""
);

// Remove extra logo strip under the real footer bar (nothing should sit below credits)
body = body.replace(
  /<div class="footer-bottom-content">[\s\S]*?<\/div><\/div>(?=<\/section>)/i,
  ""
);

// Footer credits: copyright instead of "Powered by Webflow", keep Follow Us
body = body.replace(
  /<div class="footer-details-text">[\s\S]*?<\/div>(?=<div class="footer-social-media-wrapper">)/i,
  `<div class="footer-details-text">© 2026 Northline. All rights reserved. · Designed by <a href="/" aria-current="page" class="footer-details-text-link w--current">Northline</a></div>`
);

// Dead template demo links → in-page anchors
body = body
  .replace(/href="\/template-pages\/[^"]*"/g, 'href="#work"')
  .replace(/href="\/authentications-pages\/[^"]*"/g, 'href="#contact"')
  .replace(/href="\/utility-pages\/[^"]*"/g, 'href="#contact"')
  .replace(/href="\/404"/g, 'href="#top"');

const outTs = path.join(root, "lib", "homepage-html.ts");
const escaped = JSON.stringify(body);
fs.writeFileSync(
  outTs,
  `/* Auto-generated by scripts/build-it-homepage.js — do not edit by hand */\nexport const homepageHtml: string = ${escaped};\n`
);

console.log("Wrote", outTs, "bytes", escaped.length);
console.log("Done.");
