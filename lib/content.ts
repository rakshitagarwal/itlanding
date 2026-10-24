import { img } from "./assets";

export const site = {
  name: "Ritovex",
  phone: "22 (00) 356 7890",
  phoneLabel: "Call Any Time",
  email: "hello@domain.com",
  address: "Springfield 1234 Elmwood Street, IL 62701 USA",
  bookCallUrl: "#contact",
  whatsappUrl: "https://wa.me/10000000000",
};

export const navLinks = [
  { label: "Home", href: "#top" },
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#work" },
] as const;

export const hero = {
  eyebrow: "Creative Ideas That Inspire Growth",
  title: "World’s Best Creative Agency Team",
  description:
    "World’s best creative agency team – crafting legendary brands through bold ideas, strategic genius, and flawless execution that dominates the global stage.",
};

export const about = {
  eyebrow: "Who We Are. Learn About us",
  title:
    "We are a dynamic team of innovators, storytellers, and visionaries dedicated to transforming ideas into extraordinary experiences.",
  stats: [
    { icon: img.aboutIcons[0], label: "We deliver great work always", value: 28, suffix: "+" },
    { icon: img.aboutIcons[1], label: "Experience you can count on", value: 18, suffix: "+" },
    { icon: img.aboutIcons[2], label: "Award-Winning Work, Trusted Results", value: 28, suffix: "+" },
    { icon: img.aboutIcons[3], label: "We have happy Clients worldwide", value: 5, suffix: "K+" },
  ],
};

export const services = [
  {
    number: "01",
    title: "Web Design",
    body: "Focuses on the aesthetic and user experience of a website, creating visually appealing and intuitive layouts. It involves aspects like graphic design, typography, and color schemes to enhance user engagement.",
    image: img.services[0],
  },
  {
    number: "02",
    title: "Web Development",
    body: "Involves the coding and programming that makes a website functional and interactive. This includes front-end development (what users see) and back-end development (server, database, and application logic).",
    image: img.services[1],
  },
  {
    number: "03",
    title: "Branding",
    body: "The process of creating a unique identity for a company or product, encompassing its name, logo, messaging, and overall market perception. It aims to establish recognition and a positive emotional connection with the target audience.",
    image: img.services[2],
  },
  {
    number: "04",
    title: "Product Design",
    body: "Encompasses the entire process of creating a new product, from conceptualization and research to prototyping and final execution. It focuses on solving user problems and enhancing the overall user experience.",
    image: img.services[3],
  },
] as const;

export const projects = [
  {
    title: 'SmartCity Traffic Solution"',
    blurb: "AI-powered sensors reduced downtown traffic congestion by 35% weekly.",
    date: "August 23, 2025",
    category: "Web Development",
    image: img.works[0],
  },
  {
    title: "ShopEasy E-Commerce Platform",
    blurb: "Boosted online sales 200% with lightning-fast, mobile-friendly checkout flows.",
    date: "August 23, 2025",
    category: "Web Development",
    image: img.works[1],
  },
  {
    title: "MedTrack Healthcare App",
    blurb: "Doctor-patient communication with secure messaging and appointment tracking.",
    date: "August 23, 2025",
    category: "Web Development",
    image: img.works[2],
  },
  {
    title: "EduPlay Learning Portal",
    blurb: "Interactive STEM games increased student engagement by 4X in classrooms.",
    date: "August 23, 2025",
    category: "Web Development",
    image: img.works[3],
  },
] as const;

export const processSteps = [
  {
    icon: img.processIcons[0],
    number: "01",
    title: "Discovery & Strategy",
    body: "We start by understanding your vision, goals,",
  },
  {
    icon: img.processIcons[1],
    number: "02",
    title: "Design & Development",
    body: "UI/UX Design and development crafted for scale and clarity.",
  },
  {
    icon: img.processIcons[2],
    number: "03",
    title: "Discovery & Strategy",
    body: "Digital Marketing and launch support that keeps momentum.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "Was initially hesitant about the project, but the team quickly put my mind at ease. Their expertise and creative solutions were impressive. The final product exceeded my expectations,",
    author: "Jakob Alison",
    role: "Project Manager at triko",
    image: img.authors[0],
  },
  {
    quote:
      "I came to them with a vague idea, and they helped me refine it into a concrete plan. Throughout the process, they kept me informed and involved, ensuring I was happy with the direction.",
    author: "Alisa Olivia",
    role: "CTO at Ritovex",
    image: img.authors[1],
  },
  {
    quote:
      "Working with them was a true pleasure. They were responsive, communicative, and always willing to go the extra mile. I especially appreciated their attention to detail",
    author: "Jordan Walk",
    role: "Software Engineer at Briks",
    image: img.authors[2],
  },
  {
    quote:
      "Throughout the process, they kept me informed and involved, ensuring I was happy with the direction. I came to them with a vague idea, and they helped me refine it into a concrete plan.",
    author: "Ema Watson",
    role: "Founder at Ritof",
    image: img.authors[3],
  },
] as const;

export const blogs = [
  {
    title: "Simple Tips for Better Website Design",
    excerpt: "Learn easy ways to improve your website’s look and feel. easy step for you",
    date: "July 31, 2025",
    image: img.blogs[0],
  },
  {
    title: "How to Speed Up Your Website Fast loading",
    excerpt: "Quick fixes to make your site load faster. How great user experience boosts your business",
    date: "July 31, 2025",
    image: img.blogs[1],
  },
  {
    title: "Best Tools for App Development Today world",
    excerpt: "Keep your site safe with simple security tips best tools to build apps easily and quickly",
    date: "July 31, 2025",
    image: img.blogs[2],
  },
] as const;
