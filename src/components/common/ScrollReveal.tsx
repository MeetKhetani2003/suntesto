"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    // Enable JS-specific styling to safely hide elements for scroll reveal
    document.documentElement.classList.add("js-enabled");

    let observer: IntersectionObserver;
    let mutationObserver: MutationObserver;
    let timeoutId: NodeJS.Timeout;

    // We introduce a small delay (150ms) to wait until the route transition
    // has scrolled the window back to the top (0px). This prevents bottom elements
    // from triggering prematurely at previous scroll positions during transition.
    timeoutId = setTimeout(() => {
      const observerOptions = {
        root: null,
        rootMargin: "0px 0px -40px 0px", // Trigger when 40px inside viewport
        threshold: 0.02, // Trigger early for instant reactivity
      };

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      const setupObserver = () => {
        const targets = document.querySelectorAll(
          ".reveal, .reveal-text, .reveal-section, .reveal-card, .reveal-left, .reveal-right"
        );

        targets.forEach((target) => {
          const rect = target.getBoundingClientRect();
          // Check if the element is currently visible inside the viewport
          const inViewport =
            rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0;

          if (inViewport) {
            // Already visible: show immediately so the user doesn't see blank spaces
            target.classList.add("is-visible");
          } else {
            // Not visible yet: clean up in case of leftover active class, then observe
            target.classList.remove("is-visible");
            observer.observe(target);
          }
        });
      };

      // Perform initial observer scan
      setupObserver();

      // Listen to DOM mutations (to automatically hook newly loaded dynamic tabs/products/reviews)
      mutationObserver = new MutationObserver(() => {
        setupObserver();
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      if (observer) observer.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
