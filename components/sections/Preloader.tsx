"use client";

// Intro preloader for the landing page. Plays the line-art burger animation
// (public/Burger2.mp4) on a black screen while the hero video (hero.mp4, which
// is already mounted + buffering behind it) loads. When it dismisses — on a tap,
// when the burger clip ends, or a safety timeout — it fires a "brim:enter" event
// that HeroVideo listens for to (re)start the hero from the top. A real tap
// dismissal passes withSound:true, so the hero comes in WITH audio (a user
// gesture is required for sound), giving a consistent reveal.
//
// The burger artwork is black-on-white, so we invert(1) it to white-on-black to
// sit cleanly on the dark screen (and avoid a white flash before the dark hero).

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";

// Module-level guard: show once per full page load, not on client-side nav back.
let shownThisLoad = false;

export function Preloader() {
  const [active, setActive] = useState(!shownThisLoad);
  const [leaving, setLeaving] = useState(false);
  const entered = useRef(false);

  function enter(withSound: boolean) {
    if (entered.current) return;
    entered.current = true;
    shownThisLoad = true;
    // Tell the hero to start fresh (and unmute if this was a real tap).
    window.dispatchEvent(new CustomEvent("brim:enter", { detail: { withSound } }));
    setLeaving(true);
    window.setTimeout(() => setActive(false), 650); // matches the fade duration
  }

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // no scrolling under the loader
    // Safety cap so a stalled/blocked clip can never trap the user. Requests
    // sound too — the hero falls back to muted if the browser blocks it.
    const cap = window.setTimeout(() => enter(true), 6000);
    return () => {
      window.clearTimeout(cap);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!active) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Enter site"
      onClick={() => enter(true)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && enter(true)}
      className={`fixed inset-0 z-[100] grid cursor-pointer place-items-center bg-black transition-opacity duration-[650ms] ease-out ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6 px-6 text-center">
        <video
          src={asset("/Burger2.mp4")}
          autoPlay
          muted
          playsInline
          onEnded={() => enter(true)}
          aria-hidden
          className="h-40 w-40 object-contain [filter:invert(1)] sm:h-52 sm:w-52"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/brim-logo.svg")} alt="BRIM" className="h-7 w-auto opacity-90" />
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.45em] text-paper/45">
          Tap to enter
        </span>
      </div>
    </div>
  );
}
