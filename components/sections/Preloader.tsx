"use client";

// A short automatic introduction, shown once per full page load.
import { useEffect, useState } from "react";
import { asset } from "@/lib/asset";

// Module-level guard: show once per full page load, not on client-side nav back.
let shownThisLoad = false;

export function Preloader() {
  const [active, setActive] = useState(!shownThisLoad);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Include the fade in the 2.8-second total, independent of video loading.
    const fade = window.setTimeout(() => setLeaving(true), 2450);
    const finish = window.setTimeout(() => {
      shownThisLoad = true;
      setActive(false);
    }, 2800);
    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(finish);
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      role="status"
      aria-label="Loading BRIM"
      className={`fixed inset-0 z-[100] grid place-items-center bg-black transition-opacity duration-[350ms] ease-out motion-reduce:transition-none ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6 px-6 text-center">
        <video
          src={asset("/Burger2.mp4")}
          autoPlay
          muted
          playsInline
          aria-hidden
          className="h-40 w-40 object-contain [filter:invert(1)] sm:h-52 sm:w-52"
        />
        <div className="flex flex-col items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/brim-logo.svg")} alt="BRIM" className="h-7 w-auto opacity-90" />
          <span className="flex items-center gap-2 text-[0.5rem] font-semibold uppercase tracking-[0.35em] text-paper/40 sm:text-[0.55rem]">
            <span className="h-px w-4 bg-white/20" aria-hidden />
            Established In 2019
            <span className="h-px w-4 bg-white/20" aria-hidden />
          </span>
        </div>
      </div>
    </div>
  );
}
