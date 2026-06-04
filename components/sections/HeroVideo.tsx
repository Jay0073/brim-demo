"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { asset } from "@/lib/asset";

// TEMPORARY video hero — a full-bleed clip that autoplays ONCE per page load
// (muted to satisfy browser autoplay, then unmuted on first interaction; not
// looped), with the tagline + CTAs overlaid for legibility. To restore the
// interactive liquid-glass hero, swap <HeroVideo /> back to <Hero /> in
// app/page.tsx (the original Hero component is left untouched).
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Browsers only allow MUTED autoplay. React also doesn't emit the `muted`
  // attribute into the SSR HTML, so we force it on via the ref and start
  // playback here (this is what actually makes the clip appear on load). Then
  // we unmute — replaying if the short clip already finished — on the first
  // user interaction, once.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.volume = 1;

    const play = () => video.play().catch(() => {});
    play();
    // Retry once the first frame is decodable, in case it wasn't ready yet.
    video.addEventListener("canplay", play, { once: true });

    const enableSound = () => {
      video.muted = false;
      video.play().catch(() => {});
      teardown();
    };
    const teardown = () => {
      window.removeEventListener("pointerdown", enableSound);
      window.removeEventListener("keydown", enableSound);
      window.removeEventListener("touchstart", enableSound);
      window.removeEventListener("scroll", enableSound);
    };

    // Preloader handoff: when the intro is dismissed it fires "brim:enter". We
    // (re)start the hero from the top so it's in sync with the reveal — with
    // sound when the dismissal was a real tap (a user gesture lets audio play).
    const onEnter = (e: Event) => {
      const withSound = (e as CustomEvent).detail?.withSound;
      try {
        video.currentTime = 0;
      } catch {
        /* not seekable yet — ignore */
      }
      if (withSound) {
        // We always WANT sound. After a real tap this succeeds; otherwise the
        // browser blocks audio — fall back to MUTED playback (so the video
        // still plays, never black) and leave the first-interaction unmute
        // armed so sound kicks in the instant the user does anything.
        video.muted = false;
        video
          .play()
          .then(() => teardown())
          .catch(() => {
            video.muted = true;
            video.play().catch(() => {});
          });
      } else {
        video.play().catch(() => {});
      }
    };

    window.addEventListener("pointerdown", enableSound);
    window.addEventListener("keydown", enableSound);
    window.addEventListener("touchstart", enableSound);
    window.addEventListener("scroll", enableSound, { passive: true });
    window.addEventListener("brim:enter", onEnter);

    return () => {
      teardown();
      window.removeEventListener("brim:enter", onEnter);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative flex h-dvh items-center justify-center overflow-hidden bg-ink select-none"
    >
      {/* Background video: autoplays muted on load (browser requirement), plays
          once (not looped), and unmutes on the first user interaction so it has
          sound (see the effect above). */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={asset("/hero.mp4")}
        // poster={asset("/image.png")}
        autoPlay
        muted
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

      {/* Brand lockup — small, top-left, over the video. BRIM wordmark is white
          (reads on the dark video); the Halal mark is black, so invert(1) flips
          it to white. */}
      <div className="pointer-events-none absolute left-5 top-5 z-20 flex items-center gap-2.5 sm:left-6 sm:top-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/brim-logo.svg")}
          alt="BRIM"
          className="h-6 w-auto [filter:drop-shadow(0_2px_8px_rgba(0,0,0,0.7))] sm:h-7"
        />
        <span className="h-5 w-px bg-white/30" aria-hidden />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/halal.svg")}
          alt="Halal certified"
          className="h-7 w-7 [filter:invert(1)_drop-shadow(0_2px_6px_rgba(0,0,0,0.5))]"
        />
      </div>

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
