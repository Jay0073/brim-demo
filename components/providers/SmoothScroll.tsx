"use client";

// App-wide smooth scrolling via Lenis, with the RAF loop driven by GSAP's
// ticker so Lenis and ScrollTrigger stay perfectly in sync (essential for the
// pinned "How It's Made" sequence — otherwise pinned sections jitter).
import { ReactLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const pathname = usePathname();

  // On route change, jump to the very top INSTANTLY (no smooth animation —
  // otherwise Lenis visibly scrolls up from the previous position).
  useEffect(() => {
    lenisRef.current?.lenis?.scrollTo(0, { immediate: true, force: true });
    // Pins/triggers were measured for the old page — recompute for the new one.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  useEffect(() => {
    // Drive Lenis from GSAP's ticker instead of its own RAF (autoRaf: false).
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Tell ScrollTrigger to recompute on every Lenis scroll frame.
    const lenis = lenisRef.current?.lenis;
    lenis?.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(update);
      lenis?.off("scroll", ScrollTrigger.update);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ autoRaf: false, lerp: 0.1, smoothWheel: true }}
    >
      {children}
    </ReactLenis>
  );
}
