"use client";

import Image from "next/image";
import { img } from "@/lib/assets";
import { about } from "@/lib/content";
import { Counter, ImageWipe, PrimaryButton, Reveal } from "./motion";

export function About() {
  return (
    <section id="about" className="bg-white py-[110px]">
      <div className="mx-auto grid w-full max-w-[1320px] items-center gap-12 px-4 lg:grid-cols-2">
        <Reveal>
          <ImageWipe className="overflow-hidden rounded-[28px]">
            <Image
              src={img.about}
              alt="About us"
              width={800}
              height={900}
              className="h-auto w-full object-cover"
            />
          </ImageWipe>
        </Reveal>

        <div>
          <Reveal>
            <div className="mb-4 inline-flex items-center gap-2">
              <Image src={img.subtitleIcon} alt="" width={18} height={18} />
              <span className="text-base font-medium text-foreground">
                {about.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl font-bold leading-snug tracking-tight text-foreground sm:text-4xl lg:text-[40px]">
              {about.title}
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {about.stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08}>
                <div className="rounded-[16px] border border-[#1b1a2733] bg-surface p-5">
                  <Image src={stat.icon} alt="" width={40} height={40} />
                  <p className="mt-4 text-3xl font-bold text-foreground">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-sm text-muted">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center gap-4">
            <PrimaryButton href="#work" label="More About Us" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
