"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { img } from "@/lib/assets";
import { navLinks, site } from "@/lib/content";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-dashed border-[#1b1a2733] bg-white/90 backdrop-blur-sm transition ${
        scrolled ? "shadow-[0_1px_0_rgba(27,26,39,0.06)]" : ""
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1320px] items-stretch px-4">
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2.5 py-5 pr-6"
          aria-label={`${site.name} home`}
        >
          <Image src={img.logo} alt="" width={36} height={36} className="h-9 w-9" />
          <span className="text-xl font-bold tracking-tight text-foreground">
            {site.name}
          </span>
        </a>

        <nav
          className="hidden flex-1 items-center justify-center border-x border-dashed border-[#1b1a2733] px-6 lg:flex"
          aria-label="Main"
        >
          <ul className="flex items-center gap-7 py-7">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`border-b border-transparent pb-0.5 text-lg text-foreground transition hover:border-foreground ${
                    i === 0 ? "border-foreground" : ""
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="text-lg text-foreground/80">Company ▾</li>
            <li className="text-lg text-foreground/80">Pages ▾</li>
          </ul>
        </nav>

        <button
          type="button"
          className="ml-auto inline-flex h-11 w-11 items-center justify-center self-center rounded-[5px] border border-[#1b1a2733] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="flex w-4 flex-col gap-1">
            <span className={`h-0.5 w-full bg-foreground transition ${open ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`h-0.5 w-full bg-foreground transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-full bg-foreground transition ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-dashed border-[#1b1a2733] bg-white px-5 py-8 lg:hidden"
        >
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-2xl font-bold"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
