// Programmatic smooth scroll that routes through the app's Lenis instance.
//
// Lenis owns scrolling (and globals.css forces `scroll-behavior: auto` while it
// runs), so native `scrollIntoView({behavior:"smooth"})` would *jump*. We let
// SmoothScroll register its Lenis here, then drive it directly. Falls back to
// native scrollIntoView if Lenis isn't available (SSR / reduced setups).

type LenisLike = { scrollTo: (target: HTMLElement | number, opts?: Record<string, unknown>) => void };

let lenis: LenisLike | null = null;

export function registerLenis(instance: LenisLike | null) {
  lenis = instance;
}

/** Smoothly bring `target` into view, leaving room for the floating navbar. */
export function smoothScrollTo(target: HTMLElement | null, offset = -90) {
  if (!target) return;
  if (lenis) lenis.scrollTo(target, { offset, duration: 1.1 });
  else target.scrollIntoView({ behavior: "smooth", block: "start" });
}
