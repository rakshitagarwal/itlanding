"use client";

import { useEffect, useRef } from "react";
import { homepageHtml } from "@/lib/homepage-html";

declare global {
  interface Window {
    Webflow?: {
      destroy?: () => void;
      ready?: () => void;
      require?: (name: string) => { init?: () => void };
      push?: (cb: () => void) => void;
    };
    jQuery?: unknown;
  }
}

const SCRIPTS = [
  "/template/js/jquery-3.5.1.min.dc5e7f18c8.js",
  "/template/js/webflow.schunk.300bb1e9d1d59bcb.js",
  "/template/js/webflow.schunk.1f51a299c4a843e1.js",
  "/template/js/webflow.104d0b61.8689d13c72490845.js",
];

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-northline-src="${src}"]`
    );
    if (existing) {
      if (existing.dataset.loaded === "1") resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.dataset.northlineSrc = src;
    el.onload = () => {
      el.dataset.loaded = "1";
      resolve();
    };
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(el);
  });
}

function clearOverlaysAndHeroImages(root?: HTMLElement | null) {
  const scope = root ?? document;
  const page = scope.querySelector?.(".page-wrapper") as HTMLElement | null;
  if (page) {
    page.style.opacity = "1";
    page.style.visibility = "visible";
  }
  scope.querySelectorAll?.(".image-overlay").forEach((node) => {
    (node as HTMLElement).remove();
  });
  scope.querySelectorAll?.(".banner-image, .about-us-image").forEach((node) => {
    const el = node as HTMLElement;
    el.style.opacity = "1";
    el.style.visibility = "visible";
    el.style.display = "block";
    if (el.tagName === "IMG") {
      const img = el as HTMLImageElement;
      img.loading = "eager";
      img.removeAttribute("sizes");
    }
  });
  // Hero copy should be visible on first paint (above the fold)
  scope
    .querySelectorAll?.(
      ".banner-typography, .banner-title, .banner-description-text, .banner-subtitle-wrapper, .banner-button-wrapper"
    )
    .forEach((node) => {
      const el = node as HTMLElement;
      el.style.opacity = "1";
      el.style.visibility = "visible";
      el.style.transform = "none";
    });
}

function initWebflow() {
  const wf = window.Webflow;
  if (!wf) return;
  try {
    wf.ready?.();
  } catch {
    /* ignore */
  }
  try {
    wf.require?.("ix2")?.init?.();
  } catch {
    /* ignore */
  }
}

/**
 * Sticky portfolio: vertical scroll through the tall section moves the
 * 4-card track left→right (2 visible at a time), then page continues down.
 */
function installPortfolioHorizontalScroll(root: HTMLElement) {
  const section = root.querySelector<HTMLElement>(".portfolio-content-vh");
  const track = root.querySelector<HTMLElement>(".portfolio-inner-ticker");
  const viewport = root.querySelector<HTMLElement>(".portfolio-ticker");
  if (!section || !track || !viewport) return () => {};

  // Reveal Webflow opacity:0 wrappers so the gallery is visible
  section
    .querySelectorAll<HTMLElement>(
      ".portfolio-top-content, .portfolio-bottom-content"
    )
    .forEach((el) => {
      el.style.opacity = "1";
      el.style.visibility = "visible";
      el.style.transform = "none";
    });

  let raf = 0;
  const update = () => {
    raf = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.style.transform = "none";
      return;
    }
    // On small screens keep 1-card horizontal scrub; always use sticky path ≥768
    const scrollRange = Math.max(1, section.offsetHeight - window.innerHeight);
    const passed = Math.min(
      scrollRange,
      Math.max(0, -section.getBoundingClientRect().top)
    );
    const progress = passed / scrollRange;
    const maxShift = Math.max(0, track.scrollWidth - viewport.clientWidth);
    track.style.transform = `translate3d(${-progress * maxShift}px, 0, 0)`;
  };

  const onScrollOrResize = () => {
    if (raf) return;
    raf = window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);

  return () => {
    window.removeEventListener("scroll", onScrollOrResize);
    window.removeEventListener("resize", onScrollOrResize);
    if (raf) window.cancelAnimationFrame(raf);
  };
}

/** Fallback scroll reveals if Webflow IX2 does not animate a node. */
function installScrollReveal(root: HTMLElement) {
  const targets = Array.from(
    root.querySelectorAll<HTMLElement>(
      ".section, .about-us-card, .working-process-card, .testimonial-card, .blog-item, .services-single, .portfolio-item, .cta-wrapper, .footer-content, .footer-details-wrapper"
    )
  );

  const reveal = (el: HTMLElement) => {
    el.style.transition =
      el.style.transition || "opacity .7s ease, transform .7s ease";
    el.style.opacity = "1";
    el.style.visibility = "visible";
    el.style.transform = "none";
    // Also reveal direct hidden children used by Webflow load/scroll IX
    el.querySelectorAll<HTMLElement>("[style*='opacity']").forEach((child) => {
      if (child.classList.contains("portfolio-inner-ticker")) return;
      const s = child.getAttribute("style") || "";
      if (!/opacity\s*:\s*0/.test(s)) return;
      child.style.transition =
        child.style.transition || "opacity .7s ease, transform .7s ease";
      child.style.opacity = "1";
      child.style.visibility = "visible";
      child.style.transform = "none";
    });
  };

  // Prepare below-fold sections for a soft fade if they are already transparent
  targets.forEach((el) => {
    const opacity = getComputedStyle(el).opacity;
    if (opacity === "0") {
      el.style.transform = el.style.transform || "translateY(24px)";
    }
  });

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        reveal(entry.target as HTMLElement);
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach((el) => io.observe(el));

  // Safety: anything still invisible after sitting in view
  const safety = window.setTimeout(() => {
    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView && getComputedStyle(el).opacity === "0") reveal(el);
    });
  }, 2500);

  return () => {
    io.disconnect();
    window.clearTimeout(safety);
  };
}

function installWebflowNetworkGuard() {
  const originalFetch = window.fetch.bind(window);
  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    if (
      url.includes("/.wf_graphql") ||
      (url.includes("webflow.com") && url.includes("form"))
    ) {
      return Promise.resolve(
        new Response(JSON.stringify({ data: null }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );
    }
    return originalFetch(input, init);
  }) as typeof fetch;

  return () => {
    window.fetch = originalFetch;
  };
}

function wireLocalForms(root: HTMLElement) {
  const onSubmit = (event: Event) => {
    const form = event.target as HTMLFormElement | null;
    if (!form || form.tagName !== "FORM") return;
    if (
      !form.hasAttribute("data-northline-form") &&
      !form.closest(".footer-form-block")
    ) {
      if (
        form.classList.contains("footer-form") ||
        form.id.includes("Newsletter")
      ) {
        event.preventDefault();
      }
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const success = root.querySelector<HTMLElement>(
      "[data-northline-form-success]"
    );
    if (success) success.style.display = "block";
    form.reset();
  };

  root.addEventListener("submit", onSubmit, true);
  return () => root.removeEventListener("submit", onSubmit, true);
}

export function TemplateHome() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("w-mod-js");
    if ("ontouchstart" in window) {
      document.documentElement.classList.add("w-mod-touch");
    }

    const restoreFetch = installWebflowNetworkGuard();
    const root = rootRef.current;
    const unwireForms = root ? wireLocalForms(root) : () => {};
    let stopReveal: (() => void) | undefined;
    let stopPortfolio: (() => void) | undefined;

    let cancelled = false;

    (async () => {
      try {
        clearOverlaysAndHeroImages(rootRef.current);
        for (const src of SCRIPTS) {
          await loadScript(src);
          if (cancelled) return;
        }
        requestAnimationFrame(() => {
          if (cancelled) return;
          initWebflow();
          clearOverlaysAndHeroImages(rootRef.current);
          if (rootRef.current) {
            stopReveal = installScrollReveal(rootRef.current);
            stopPortfolio = installPortfolioHorizontalScroll(rootRef.current);
          }
          setTimeout(() => {
            if (!cancelled) clearOverlaysAndHeroImages(rootRef.current);
          }, 300);
        });
      } catch (err) {
        console.error(err);
        clearOverlaysAndHeroImages(rootRef.current);
        if (rootRef.current) {
          stopReveal = installScrollReveal(rootRef.current);
          stopPortfolio = installPortfolioHorizontalScroll(rootRef.current);
        }
      }
    })();

    return () => {
      cancelled = true;
      restoreFetch();
      unwireForms();
      stopReveal?.();
      stopPortfolio?.();
      try {
        window.Webflow?.destroy?.();
      } catch {
        /* ignore */
      }
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="ritovex-root"
      dangerouslySetInnerHTML={{ __html: homepageHtml }}
      suppressHydrationWarning
    />
  );
}
