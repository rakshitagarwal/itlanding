"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function useScrollAnimation(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.15,
    rootMargin: "0px 0px -80px 0px",
    ...options,
  };

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    },
    []
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, defaultOptions);
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, handleObserver, defaultOptions]);

  return { ref, isVisible };
}
