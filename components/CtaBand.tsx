"use client";

import Image from "next/image";
import { img } from "@/lib/assets";
import { site } from "@/lib/content";
import { PrimaryButton, Reveal } from "./motion";

export function CtaBand() {
  return (
    <section id="contact" className="bg-white pb-[110px]">
      <div className="mx-auto max-w-[1320px] px-4">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px]">
            <Image
              src={img.ctaBg}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-foreground/85" />
            <div className="relative px-6 py-16 text-center sm:px-12 sm:py-20">
              <p className="text-base font-medium text-white/80">
                Have a project in mind? Just let us know!
              </p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[60px]">
                Let’s Start Talk
              </h2>
              <div className="mt-8 flex justify-center">
                <PrimaryButton
                  href={`mailto:${site.email}`}
                  label="Connect With Us"
                  variant="coral"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
