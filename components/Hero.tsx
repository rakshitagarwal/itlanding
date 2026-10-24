"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { img } from "@/lib/assets";
import { hero, site } from "@/lib/content";
import { ImageWipe, PrimaryButton } from "./motion";

export function Hero() {
  return (
    <section id="top" className="bg-white pt-[88px]">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col items-center gap-12 px-4 py-[70px] lg:flex-row lg:justify-between lg:py-[110px]">
        <motion.div
          className="w-full max-w-[600px]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-3.5 inline-block bg-surface px-[11px] py-[3px]">
            <p className="text-base font-medium text-foreground">{hero.eyebrow}</p>
          </div>
          <div className="mb-11">
            <h1 className="mb-5 text-4xl font-bold leading-[1.3] tracking-[-1.2px] text-foreground sm:text-5xl lg:text-[60px]">
              {hero.title}
            </h1>
            <p className="max-w-[525px] text-lg font-medium leading-[1.5] text-muted">
              {hero.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <PrimaryButton href={site.bookCallUrl} label="Get Started" />
            <a href="#work" className="inline-flex items-center gap-2.5 text-foreground">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground">
                <Image src={img.bannerPlay} alt="" width={14} height={14} />
              </span>
              <span className="text-base font-medium">Watch Demo</span>
            </a>
          </div>
        </motion.div>

        <ImageWipe className="w-full max-w-[631px] rounded-[28px] lg:rounded-[40px]">
          <Image
            src={img.banner}
            alt="Banner"
            width={900}
            height={700}
            priority
            className="h-auto w-full object-cover"
          />
        </ImageWipe>
      </div>
    </section>
  );
}
