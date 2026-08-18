import { useEffect } from 'react';

/**
 * Adds `is-revealed` to every `[data-reveal]` element once it enters the
 * viewport, which is what the CSS transition keys off.
 *
 * Observes rather than listening to scroll so the work happens off the main
 * thread, and unobserves each element after it fires — the reveal is one-way,
 * so nothing should re-animate on the way back up.
 */
export function useReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('[data-reveal]'));
    if (elements.length === 0) return;

    // Without IntersectionObserver, show everything rather than hide it.
    if (typeof IntersectionObserver === 'undefined') {
      elements.forEach((element) => element.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}
