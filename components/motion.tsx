"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function PrimaryButton({
  href,
  label,
  variant = "dark",
  className = "",
}: {
  href: string;
  label: string;
  variant?: "dark" | "coral" | "outline";
  className?: string;
}) {
  const bg =
    variant === "coral"
      ? "bg-accent text-foreground"
      : variant === "outline"
        ? "border border-foreground bg-transparent text-foreground"
        : "bg-foreground text-white";

  return (
    <a
      href={href}
      className={`group relative inline-flex overflow-hidden rounded-[5px] ${bg} px-6 py-3.5 text-lg font-medium leading-none ${className}`}
    >
      <span className="relative block h-[1.2em] overflow-hidden">
        <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
          {label}
        </span>
        <span className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
          {label}
        </span>
      </span>
    </a>
  );
}

export function Counter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toString());
  const [text, setText] = useState("0");

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  useEffect(() => {
    const unsub = display.on("change", (v) => setText(v));
    return () => unsub();
  }, [display]);

  return (
    <span ref={ref} className="tabular-nums">
      {text}
      {suffix}
    </span>
  );
}

export function ImageWipe({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[2] flex"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.div
          className="h-full w-1/2 bg-white"
          variants={{
            hidden: { x: 0 },
            show: { x: "-100%" },
          }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        />
        <motion.div
          className="h-full w-1/2 bg-white"
          variants={{
            hidden: { x: 0 },
            show: { x: "100%" },
          }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        />
      </motion.div>
    </div>
  );
}
