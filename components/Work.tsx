"use client";

import Image from "next/image";
import { img } from "@/lib/assets";
import { projects } from "@/lib/content";
import { Reveal } from "./motion";

export function Work() {
  return (
    <section id="work" className="bg-white py-[110px]">
      <div className="mx-auto w-full max-w-[1320px] px-4">
        <Reveal>
          <div className="mb-4 inline-flex items-center gap-2">
            <Image src={img.subtitleIcon} alt="" width={18} height={18} />
            <span className="text-base font-medium">Explore Our Real Woks</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[40px]">
            Explore Our Real Woks
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-7 sm:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={i * 0.08}>
              <article className="group">
                <div className="relative mb-5 overflow-hidden rounded-[22px]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={520}
                    className="aspect-[16/11] h-auto w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute left-4 top-4 rounded-[5px] bg-white/95 px-3 py-1.5 text-sm font-medium text-foreground">
                    View {project.category}
                  </div>
                  <div className="absolute bottom-4 left-4 rounded-[5px] bg-foreground/80 px-3 py-1.5 text-sm text-white">
                    {project.date}
                  </div>
                </div>
                <h3 className="text-2xl font-bold transition group-hover:text-accent">
                  {project.title}
                </h3>
                <p className="mt-2 text-base font-medium text-muted">
                  {project.blurb}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
