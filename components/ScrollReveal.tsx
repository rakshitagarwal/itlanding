"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollReveal({
  children,
  threshold = 0.15,
  rootMargin = "0px 0px -80px 0px",
  className = "",
}: {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisible(true);
        });
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div
      ref={ref}
      className={`scroll-reveal-item ${visible ? "visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
