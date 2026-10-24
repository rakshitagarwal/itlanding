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

/** Replace primary header links inside .nav-menu (drops dropdowns). */
function replaceNavMenu(html, links) {
  const openTag = '<nav role="navigation" class="nav-menu w-nav-menu">';
  const start = html.indexOf(openTag);
  if (start === -1) return html;
  const afterOpen = start + openTag.length;
  const contact = html.indexOf("navbar-contact-wrapper", afterOpen);
  if (contact === -1) return html;
  const closeNav = html.lastIndexOf("</nav>", contact);
  if (closeNav === -1 || closeNav < afterOpen) return html;
  const inner = links
    .map(
      ({ href, label }) =>
        `<a href="${href}" class="nav-link w-nav-link">${label}</a>`
    )
    .join("");
  return html.slice(0, afterOpen) + inner + html.slice(closeNav);
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

// --- Northline AI-first content ---
const replacements = [
  ["Ritovex - Webflow Ecommerce Website Template", "Northline | AI Software, SaaS & Custom Products"],
  [
    "Ritovex is a modern Creative Agency Webflow Ecommerce template, designed for startups, agencies, and professionals to build stunning, high-performing websites.",
    "Northline is an Ahmedabad AI software studio — we design and ship AI SaaS, copilots, automation, and custom products for startups and enterprises.",
  ],
  ["Ritovex - Webflow Ecommerce Website Template", "Northline | AI Software Studio"],
  [">Ritovex<", ">Northline<"],
  ["Creative Ideas That Inspire Growth", "AI That Ships in Production"],
  ["World’s Best Creative Agency Team", "Build AI Products That Operators Trust"],
  [
    "World’s best creative agency team – crafting legendary brands &nbsp;through bold ideas, strategic genius, and flawless execution that &nbsp;dominates the global stage.",
    "From Ahmedabad to global teams — we turn LLMs, data, and workflows into AI SaaS, copilots, and automation your people actually use.",
  ],
  [
    "World’s best creative agency team – crafting legendary brands through bold ideas, strategic genius, and flawless execution that dominates the global stage.",
    "From Ahmedabad to global teams — we turn LLMs, data, and workflows into AI SaaS, copilots, and automation your people actually use.",
  ],
  ["Trusted Partners Worldwide for Success", "Trusted by teams putting AI into production"],
  ["Who We Are. Learn About us", "Who We Are. Learn about Northline"],
  [
    "We are a dynamic team of innovators, storytellers, and visionaries dedicated to transforming ideas into extraordinary experiences.",
    "We are an AI product studio in Ahmedabad — engineers and designers who ship copilots, RAG systems, and intelligent SaaS — not slide-deck demos.",
  ],
  ["We deliver great work always", "AI features shipped to production"],
  ["Experience you can count on", "Years building software products"],
  ["Award-Winning Work, Trusted Results", "AI MVPs launched with clients"],
  ["We have happy Clients worldwide", "Clients across India & remote"],
  ["More About Us", "About Northline"],
  ["Get free Qoute", "Start an AI project"],
  ["Get free Quote", "Start an AI project"],
  ["Your Needs, Our Expertise", "AI capabilities we deliver"],
  [
    "Your Vision, Our Expertise – Together, we bring ideas to life &nbsp;with tailored solutions that deliver real results. Let’s build something amazing.",
    "LLM apps, RAG knowledge bases, document AI, scoring models, and AI-native SaaS — scoped to a metric, built to run in production.",
  ],
  [
    "Your Vision, Our Expertise – Together, we bring ideas to life with tailored solutions that deliver real results. Let’s build something amazing.",
    "LLM apps, RAG knowledge bases, document AI, scoring models, and AI-native SaaS — scoped to a metric, built to run in production.",
  ],
  [">Web Design<", ">AI Solutions<"],
  [
    "Focuses on the aesthetic and user experience of a website, creating visually appealing and intuitive layouts. It involves aspects like graphic design, typography, and color schemes to enhance user engagement.",
    "Copilots, chat over your data, document extraction, and workflow automation — models where they earn ROI, humans for the decisions that matter.",
  ],
  [">Web Development<", ">AI SaaS Platforms<"],
  [
    "Involves the coding and programming that makes a website functional and interactive. This includes front-end development (what users see) and back-end development (server, database, and application logic).",
    "Multi-tenant AI products with auth, billing-ready APIs, evals, and observability — so your SaaS stays reliable as usage grows.",
  ],
  [">Branding<", ">Custom Software<"],
  [
    "The process of creating a unique identity for a company or product, encompassing its name, logo, messaging, and overall market perception. It aims to establish recognition and a positive emotional connection with the target audience.",
    "Full-stack web and mobile systems with AI features woven in — TMS, CRM, ops tools, and portals built around how your team works.",
  ],
  [">Product Design<", ">Data & Integrations<"],
  [
    "Encompasses the entire process of creating a new product, from conceptualization and research to prototyping and final execution. It focuses on solving user problems and enhancing the overall user experience.",
    "Pipelines, embeddings, vector search, and clean connections to your CRMs, ERPs, and cloud — the backbone every serious AI feature needs.",
  ],
  ["Explore Our Real Woks", "Explore Our AI Work"],
  ['SmartCity Traffic Solution"', "FleetMind AI TMS"],
  [
    "AI-powered sensors reduced downtown traffic congestion by 35% weekly.",
    "LLM-assisted dispatch and predictive ETAs cut empty miles for regional fleets.",
  ],
  ["ShopEasy E-Commerce Platform", "PipelineAI CRM"],
  [
    "Boosted online sales 200% with lightning-fast, mobile-friendly checkout flows.",
    "AI lead scoring and reply drafts doubled qualified pipeline in two quarters.",
  ],
  ["MedTrack Healthcare App", "DocuMind RAG"],
  [
    "Doctor-patient communication with secure messaging and appointment tracking.",
    "Private knowledge chat over SOPs and contracts — answers with citations, not guesses.",
  ],
  ["EduPlay Learning Portal", "OpsPilot Copilot"],
  [
    "Interactive STEM games increased student engagement by 4X in classrooms.",
    "In-app copilot for support and ops teams — fewer tickets, faster first response.",
  ],
  ["Working Process", "How we deliver AI"],
  ["Explore Our 3 Step Working Process", "Explore Our 3 Step AI Delivery"],
  ["Start Projects", "Start an AI Project"],
  ["UI/UX Design", "LLM Apps & Copilots"],
  ["Digital Marketing", "RAG & Automation"],
  ["Testimonial", "Client Stories"],
  ["What Our Clients are Saying", "What Our Clients are Saying"],
  [
    "Hear directly from our clients about their experiences and the results we've delivered. Explore Client Feedback",
    "Hear from founders and operators on the AI products we design and ship. Explore Client Feedback",
  ],
  ["Project Manager at triko", "COO at FleetMind"],
  ["CTO at Ritovex", "VP Sales at PipelineAI"],
  ["Software Engineer at Briks", "Head of Ops at DocuMind"],
  ["Founder at Ritof", "Founder at OpsPilot"],
  ["Have a project in mind? Just let us know!", "Have an AI product in mind? Tell us."],
  ["Let’s Start Talk", "Let’s Build Your AI Product"],
  ["Connect With Us", "Talk to Northline"],
  ["Our Blogs", "AI Insights"],
  ["Read Our Recants Article", "Read Our Recent Articles"],
  ["Browse All Article", "Browse All Articles"],
  ["Simple Tips for Better Website Design", "When to Use RAG vs Fine-Tuning"],
  [
    "Learn easy ways to improve your website’s look and feel. easy step for you",
    "A practical rule of thumb for grounding LLMs on your company data.",
  ],
  ["How to Speed Up Your Website Fast loading", "How to Ship an AI MVP in 6 Weeks"],
  [
    "Quick fixes to make your site load faster. How great user experience boosts your business",
    "Scope, evals, and guardrails so your first AI release is useful — not a demo.",
  ],
  ["Best Tools for App Development Today world", "Stack We Use for Production AI"],
  [
    "Keep your site safe with simple security tips best tools to build apps easily and quickly",
    "Models, vector DBs, and observability we trust when AI has to work on Monday morning.",
  ],
  [
    "Get the latest tips for social media growth and marketing straight to your inbox!",
    "Get practical notes on shipping AI SaaS and copilots — no hype.",
  ],
  ["hello@domain.com", "hello@northline.dev"],
  ["Springfield 1234 Elmwood Street, IL 62701 USA", "Ahmedabad, Gujarat, India"],
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

// Header nav: About Us · Portfolio · Blogs · Contact Us
body = replaceNavMenu(
  body,
  [
    { href: "#about", label: "About Us" },
    { href: "#work", label: "Portfolio" },
    { href: "#blog", label: "Blogs" },
    { href: "#contact", label: "Contact Us" },
  ]
);

// Process cards share duplicate template text — set each step explicitly
const processSteps = [
  {
    cls: "_01",
    title: "AI Discovery &amp; Scope",
    desc: "We map data, workflows, and the metric AI must move — before writing a line of model code.",
  },
  {
    cls: "_02",
    title: "Build &amp; Integrate",
    desc: "Copilots, RAG, and APIs wired into your product with evals, auth, and production-ready UX.",
  },
  {
    cls: "_03",
    title: "Launch &amp; Improve",
    desc: "Ship, measure quality, and iterate on prompts, retrieval, and UI until the team trusts it daily.",
  },
];
for (const step of processSteps) {
  const re = new RegExp(
    `(<div class="working-process-card ${step.cls}">[\\s\\S]*?<h3 class="working-process-card-title">)[\\s\\S]*?(<\\/h3><div class="working-process-card-description">)[\\s\\S]*?(<\\/div>)`,
    "i"
  );
  body = body.replace(re, `$1${step.title}$2${step.desc}$3`);
}

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

function indexOfTag(html, tagName, from, closing) {
  const needle = closing ? `</${tagName}` : `<${tagName}`;
  let i = from;
  const lower = html.toLowerCase();
  while (i < html.length) {
    const idx = lower.indexOf(needle, i);
    if (idx < 0) return -1;
    const after = lower[idx + needle.length];
    if (after === undefined || /[\s>/]/.test(after)) return idx;
    i = idx + 1;
  }
  return -1;
}

/** Remove every tagName element whose opening tag matches attrMatch (optional contentMatch). */
function removeAllMatchingTags(html, tagName, attrMatch, contentMatch) {
  let guard = 0;
  while (guard++ < 50) {
    let found = null;
    let searchFrom = 0;
    while (searchFrom < html.length) {
      const open = indexOfTag(html, tagName, searchFrom, false);
      if (open < 0) break;
      const tagEnd = html.indexOf(">", open);
      if (tagEnd < 0) break;
      const openTag = html.slice(open, tagEnd + 1);
      if (!attrMatch.test(openTag)) {
        searchFrom = tagEnd + 1;
        continue;
      }
      let depth = 1;
      let i = tagEnd + 1;
      while (i < html.length && depth > 0) {
        const nextOpen = indexOfTag(html, tagName, i, false);
        const nextClose = indexOfTag(html, tagName, i, true);
        if (nextClose < 0) {
          i = html.length;
          break;
        }
        if (nextOpen >= 0 && nextOpen < nextClose) {
          depth += 1;
          i = nextOpen + 1;
          continue;
        }
        depth -= 1;
        i = html.indexOf(">", nextClose) + 1;
      }
      const chunk = html.slice(open, i);
      if (contentMatch && !contentMatch.test(chunk)) {
        searchFrom = i;
        continue;
      }
      found = { open, end: i };
      break;
    }
    if (!found) break;
    html = html.slice(0, found.open) + html.slice(found.end);
  }
  return html;
}

body = removeElementByAttr(body, /data-node-type="commerce-cart-wrapper"/);
body = removeElementByAttr(body, /class="[^"]*w-commerce-commercecartwrapper/);

// Remove phone / "Call Any Time" CTAs everywhere (header, about, footer)
body = removeAllMatchingTags(
  body,
  "a",
  /class="[^"]*navbar-contact-link-block/
);
body = removeAllMatchingTags(
  body,
  "div",
  /class="footer-information-single"/,
  /(?:22\s*\(00\)\s*356\s*7890|\+91\s*123\s*456789|\+1\s*\(415\)\s*555-0142|tel:)/
);

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
