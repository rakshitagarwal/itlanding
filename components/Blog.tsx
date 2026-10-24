"use client";

import Image from "next/image";
import { img } from "@/lib/assets";
import { blogs } from "@/lib/content";
import { PrimaryButton, Reveal } from "./motion";

export function Blog() {
  return (
    <section className="bg-surface py-[110px]">
      <div className="mx-auto w-full max-w-[1320px] px-4">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <div className="mb-4 inline-flex items-center gap-2">
              <Image src={img.subtitleIcon} alt="" width={18} height={18} />
              <span className="text-base font-medium">Our Blogs</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[40px]">
              Read Our Recants Article
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <PrimaryButton href="#blog" label="Browse All Article" variant="outline" />
          </Reveal>
        </div>

        <div id="blog" className="mt-12 grid gap-6 md:grid-cols-3">
          {blogs.map((post, i) => (
            <Reveal key={post.title} delay={i * 0.08}>
              <article className="overflow-hidden rounded-[22px] bg-white">
                <div className="aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={560}
                    height={350}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="inline-flex items-center gap-2 text-sm text-muted">
                    <Image src={img.blogDate} alt="" width={14} height={14} />
                    {post.date}
                  </p>
                  <h3 className="mt-3 text-xl font-bold transition hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
