import { img } from "./assets";

export const site = {
  name: "Northline",
  email: "hello@northline.dev",
  address: "Ahmedabad, Gujarat, India",
  bookCallUrl: "#contact",
  whatsappUrl: "https://wa.me/10000000000",
};

export const navLinks = [
  { label: "About Us", href: "#about" },
  { label: "Portfolio", href: "#work" },
  { label: "Blogs", href: "#blog" },
  { label: "Contact Us", href: "#contact" },
] as const;

export const hero = {
  eyebrow: "AI That Ships in Production",
  title: "Build AI Products That Operators Trust",
  description:
    "From Ahmedabad to global teams — we turn LLMs, data, and workflows into AI SaaS, copilots, and automation your people actually use.",
};

export const about = {
  eyebrow: "Who We Are. Learn about Northline",
  title:
    "We are an AI product studio in Ahmedabad — engineers and designers who ship copilots, RAG systems, and intelligent SaaS — not slide-deck demos.",
  stats: [
    { icon: img.aboutIcons[0], label: "AI features shipped to production", value: 28, suffix: "+" },
    { icon: img.aboutIcons[1], label: "Years building software products", value: 18, suffix: "+" },
    { icon: img.aboutIcons[2], label: "AI MVPs launched with clients", value: 28, suffix: "+" },
    { icon: img.aboutIcons[3], label: "Clients across India & remote", value: 40, suffix: "+" },
  ],
};

export const services = [
  {
    number: "01",
    title: "AI Solutions",
    body: "Copilots, chat over your data, document extraction, and workflow automation — models where they earn ROI, humans for the decisions that matter.",
    image: img.services[0],
  },
  {
    number: "02",
    title: "AI SaaS Platforms",
    body: "Multi-tenant AI products with auth, billing-ready APIs, evals, and observability — so your SaaS stays reliable as usage grows.",
    image: img.services[1],
  },
  {
    number: "03",
    title: "Custom Software",
    body: "Full-stack web and mobile systems with AI features woven in — TMS, CRM, ops tools, and portals built around how your team works.",
    image: img.services[2],
  },
  {
    number: "04",
    title: "Data & Integrations",
    body: "Pipelines, embeddings, vector search, and clean connections to your CRMs, ERPs, and cloud — the backbone every serious AI feature needs.",
    image: img.services[3],
  },
] as const;

export const projects = [
  {
    title: "FleetMind AI TMS",
    blurb: "LLM-assisted dispatch and predictive ETAs cut empty miles for regional fleets.",
    date: "August 23, 2025",
    category: "AI Solutions",
    image: img.works[0],
  },
  {
    title: "PipelineAI CRM",
    blurb: "AI lead scoring and reply drafts doubled qualified pipeline in two quarters.",
    date: "August 23, 2025",
    category: "AI SaaS",
    image: img.works[1],
  },
  {
    title: "DocuMind RAG",
    blurb: "Private knowledge chat over SOPs and contracts — answers with citations, not guesses.",
    date: "August 23, 2025",
    category: "AI Solutions",
    image: img.works[2],
  },
  {
    title: "OpsPilot Copilot",
    blurb: "In-app copilot for support and ops teams — fewer tickets, faster first response.",
    date: "August 23, 2025",
    category: "AI Solutions",
    image: img.works[3],
  },
] as const;

export const processSteps = [
  {
    icon: img.processIcons[0],
    number: "01",
    title: "AI Discovery & Scope",
    body: "We map data, workflows, and the metric AI must move — before writing a line of model code.",
  },
  {
    icon: img.processIcons[1],
    number: "02",
    title: "Build & Integrate",
    body: "Copilots, RAG, and APIs wired into your product with evals, auth, and production-ready UX.",
  },
  {
    icon: img.processIcons[2],
    number: "03",
    title: "Launch & Improve",
    body: "Ship, measure quality, and iterate on prompts, retrieval, and UI until the team trusts it daily.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "Northline turned our dispatch chaos into an AI-assisted TMS. Empty miles dropped and the ops team actually uses the copilot every day.",
    author: "Jakob Alison",
    role: "COO at FleetMind",
    image: img.authors[0],
  },
  {
    quote:
      "They scoped RAG properly — citations, evals, and permissions — so our sales team trusts the answers instead of guessing.",
    author: "Alisa Olivia",
    role: "VP Sales at PipelineAI",
    image: img.authors[1],
  },
  {
    quote:
      "Clear AI roadmap, solid engineering, and no hype. DocuMind went from demo to daily internal tool in weeks.",
    author: "Jordan Walk",
    role: "Head of Ops at DocuMind",
    image: img.authors[2],
  },
  {
    quote:
      "OpsPilot cut first-response time for our support desk. Northline stayed close through launch and prompt tuning.",
    author: "Ema Watson",
    role: "Founder at OpsPilot",
    image: img.authors[3],
  },
] as const;

export const blogs = [
  {
    title: "When to Use RAG vs Fine-Tuning",
    excerpt: "A practical rule of thumb for grounding LLMs on your company data.",
    date: "July 31, 2025",
    image: img.blogs[0],
  },
  {
    title: "How to Ship an AI MVP in 6 Weeks",
    excerpt: "Scope, evals, and guardrails so your first AI release is useful — not a demo.",
    date: "July 31, 2025",
    image: img.blogs[1],
  },
  {
    title: "Stack We Use for Production AI",
    excerpt: "Models, vector DBs, and observability we trust when AI has to work on Monday morning.",
    date: "July 31, 2025",
    image: img.blogs[2],
  },
] as const;
