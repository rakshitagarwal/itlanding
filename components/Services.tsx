"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { img } from "@/lib/assets";
import { services } from "@/lib/content";
import { Reveal } from "./motion";

export function Services() {
  const [active, setActive] = useState(0);

  return (
    <section id="services" className="bg-foreground py-[110px]">
      <div className="mx-auto w-full max-w-[1320px] px-4">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <Image src={img.subtitleIcon2} alt="" width={18} height={18} />
            <span className="text-base font-medium text-white/80">
              Your Needs, Our Expertise
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[40px]">
            Your Vision, Our Expertise
          </h2>
          <p className="mt-4 text-lg font-medium text-white/65">
            Together, we bring ideas to life with tailored solutions that deliver
            real results. Let’s build something amazing.
          </p>
        </Reveal>

        <div className="relative mt-14">
          {services.map((service, i) => {
            const isActive = active === i;
            return (
              <a
                key={service.number}
                href="#contact"
                className="group relative block border-b border-white/10 px-2 py-8 last:border-b-0 sm:px-6"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-3.5">
                    <span className="pt-3 text-xl text-white/40">
                      {service.number}
                    </span>
                    <div>
                      <h3
                        className={`text-3xl font-bold tracking-[-0.96px] transition sm:text-4xl lg:text-[48px] ${
                          isActive ? "text-surface" : "text-surface/70"
                        }`}
                      >
                        {service.title}
                      </h3>
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            className="max-w-[700px] overflow-hidden pt-4 text-base text-white/85"
                          >
                            {service.body}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <span className="mt-2 flex h-12 w-[60px] shrink-0 items-center justify-center rounded-full border border-muted">
                    <Image
                      src={img.servicesArrow}
                      alt=""
                      width={18}
                      height={18}
                      className="brightness-0 invert"
                    />
                  </span>
                </div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, rotate: 0, y: 20 }}
                      animate={{ opacity: 1, rotate: 11.92, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="pointer-events-none absolute bottom-[-20px] right-[8%] z-10 hidden w-[220px] overflow-hidden rounded-[22px] shadow-2xl lg:block xl:right-[18%] xl:w-[280px]"
                    >
                      <Image
                        src={service.image}
                        alt=""
                        width={309}
                        height={220}
                        className="h-auto w-full object-cover"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
