"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { asset } from "@/lib/asset";

// TEMPORARY video hero — a full-bleed clip that plays ONCE per page load (with
// sound, no loop), with the tagline + CTAs overlaid for legibility. To restore the
// interactive liquid-glass hero, swap <HeroVideo /> back to <Hero /> in
// app/page.tsx (the original Hero component is left untouched).
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // The clip keeps its sound. Browsers block sound-on autoplay until the user
  // interacts, so we try to play immediately and, if that's refused, start
  // playback (with sound) on the first user interaction — once.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = 1;

    const start = () => {
      video.muted = false;
      if (!video.ended) video.play().catch(() => {});
      teardown();
    };
    const teardown = () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
      window.removeEventListener("scroll", start);
    };

    // Attempt immediate playback with sound; fall back to first-interaction.
    video.play().catch(() => {
      window.addEventListener("pointerdown", start);
      window.addEventListener("keydown", start);
      window.addEventListener("touchstart", start);
      window.addEventListener("scroll", start, { passive: true });
    });

    return teardown;
  }, []);

  return (
    <section
      id="hero"
      className="relative flex h-dvh items-center justify-center overflow-hidden bg-ink select-none"
    >
      {/* Background video: plays once per load WITH sound (not looped). Sound-on
          autoplay is blocked by browsers until the user interacts, so playback
          may begin on the first interaction (see the effect above). image.png is
          the poster shown until the first frame is ready. */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={asset("/hero.mp4")}
        poster={asset("/image.png")}
        autoPlay
        playsInline
        preload="auto"
        aria-hidden
      />

      {/* Scrim so the overlaid copy stays readable over any frame. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70"
      />

      {/* Overlay: tagline + CTAs. */}
      {/* <div className="relative z-10 flex max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="max-w-md text-base leading-relaxed text-paper/85 [text-shadow:0_2px_10px_rgba(0,0,0,0.6)] sm:text-lg">
          100% grass-fed, strictly Halal smash burgers — pressed hard,
          caramelised deep, and impossible to forget.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/menu"
            className="group inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-black/30 transition-colors hover:bg-white"
          >
            Explore the menu
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <Link
            href="/locations"
            className="rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-paper transition-colors hover:border-white/50 hover:bg-white/10"
          >
            Find a location
          </Link>
        </div>
      </div> */}

      {/* Scroll cue — nudges down into "How It's Made", where the burger's
          journey begins. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2">
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.45em] text-paper/80 [text-shadow:0_2px_12px_rgba(0,0,0,0.7)] sm:text-xs">
          Scroll · begin the journey
        </span>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-6 w-6 animate-bounce text-brim [filter:drop-shadow(0_2px_8px_rgba(0,0,0,0.6))]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
