"use client";

import Image from "next/image";
import { img } from "@/lib/assets";
import { processSteps, site } from "@/lib/content";
import { PrimaryButton, Reveal } from "./motion";

export function Process() {
  return (
    <section className="bg-surface py-[110px]">
      <div className="mx-auto w-full max-w-[1320px] px-4">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2">
              <Image src={img.subtitleIcon} alt="" width={18} height={18} />
              <span className="text-base font-medium">Working Process</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[40px]">
              Explore Our 3 Step Working Process
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <PrimaryButton href={site.bookCallUrl} label="Start Projects" />
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {processSteps.map((step, i) => (
            <Reveal key={`${step.number}-${step.title}`} delay={i * 0.1}>
              <article className="h-full rounded-[22px] bg-white p-8 shadow-[0_10px_40px_rgba(20,20,20,0.04)]">
                <div className="flex items-center justify-between">
                  <Image src={step.icon} alt="" width={48} height={48} />
                  <span className="text-4xl font-black text-[#e8e8ee]">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
