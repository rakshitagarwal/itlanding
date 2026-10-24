"use client";

import Image from "next/image";
import { img } from "@/lib/assets";
import { testimonials } from "@/lib/content";
import { Reveal } from "./motion";

function Card({
  t,
}: {
  t: (typeof testimonials)[number];
}) {
  return (
    <article className="w-[340px] shrink-0 rounded-[22px] bg-surface p-7 sm:w-[380px]">
      <Image src={img.quoteIcon} alt="" width={100} height={20} className="h-5 w-auto" />
      <p className="mt-5 text-base font-medium leading-relaxed text-foreground">
        {t.quote}
      </p>
      <footer className="mt-6 flex items-center gap-3 border-t border-[#1b1a2733] pt-5">
        <Image
          src={t.image}
          alt={t.author}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-bold">{t.author}</p>
          <p className="text-sm text-muted">{t.role}</p>
        </div>
      </footer>
    </article>
  );
}

export function Testimonials() {
  const row = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="overflow-hidden bg-white py-[110px]">
      <div className="mx-auto w-full max-w-[1320px] px-4">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center justify-center gap-2">
            <Image src={img.subtitleIcon} alt="" width={18} height={18} />
            <span className="text-base font-medium">Testimonial</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[40px]">
            What Our Clients are Saying
          </h2>
          <p className="mt-4 text-lg font-medium text-muted">
            Hear directly from our clients about their experiences and the
            results we&apos;ve delivered.{" "}
            <span className="text-foreground underline">Explore Client Feedback</span>
          </p>
        </Reveal>
      </div>

      <div className="mt-14 overflow-hidden">
        <div className="animate-marquee-slow flex w-max gap-5 px-4">
          {row.map((t, i) => (
            <Card key={`${t.author}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
