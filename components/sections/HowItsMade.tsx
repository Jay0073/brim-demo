"use client";

// ─────────────────────────────────────────────────────────────────────────
//  HOW IT'S MADE — Apple-style scroll-scrubbed image sequence.
//
//  Scroll pins the section and scrubs a preloaded JPG frame sequence onto a
//  <canvas> (no <img> swapping → no layout thrash). Bold captions fade in /
//  out around the centre as the burger goes beef → smash → cheese → melt.
//
//  Frames live in /public/sequence/ and are produced by
//  scripts/extract-frames.mjs (npm run frames). The frame count is read from
//  /public/sequence/manifest.json at runtime, so re-extracting with different
//  footage needs no change here.
// ─────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

type Manifest = { count: number; pattern: string };

const SEQ_DIR = "/sequence";
const framePath = (i: number) => `${SEQ_DIR}/frame-${String(i).padStart(4, "0")}.jpg`;

// Caption beats, placed along scroll progress (0–1). Side controls the slide-in
// direction + anchor; copy matches the footage (raw → smash → cheese → melt).
const CAPTIONS = [
  {
    cls: "cap-1",
    at: 0.1,
    side: "left" as const,
    pos: "left-6 top-[24%] items-start text-left md:left-16",
    kicker: "01 — The Beef",
    title: "100% GRASS-FED",
    copy: "Never frozen. Ground fresh and hand-formed, every single morning.",
  },
  {
    cls: "cap-2",
    at: 0.37,
    side: "right" as const,
    pos: "right-6 top-[32%] items-end text-right md:right-16",
    kicker: "02 — The Smash",
    title: "THE PERFECT SMASH",
    copy: "Pressed onto a screaming-hot griddle for a lacy, caramelised crust.",
  },
  {
    cls: "cap-3",
    at: 0.63,
    side: "left" as const,
    pos: "left-6 top-[58%] items-start text-left md:left-16",
    kicker: "03 — The Cheese",
    title: "REAL AGED CHEESE",
    copy: "A full slice draped on while the patty is still sizzling hot.",
  },
  {
    cls: "cap-4",
    at: 0.86,
    side: "bottom" as const,
    pos: "bottom-[12%] left-1/2 items-center text-center",
    kicker: "04 — The Melt",
    title: "MELTED TO PERFECTION",
    copy: "Folded into every edge. That, right there, is a Brim.",
  },
];

export function HowItsMade() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const renderRef = useRef<(i: number) => void>(() => {});
  const frameRef = useRef(0);
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);

  // ── 1. Load manifest + preload every frame into memory ────────────────────
  useEffect(() => {
    let cancelled = false;
    fetch(`${SEQ_DIR}/manifest.json`)
      .then((r) => r.json() as Promise<Manifest>)
      .then((m) => {
        if (cancelled) return;
        const n = m.count;
        const imgs: HTMLImageElement[] = new Array(n);
        let loaded = 0;
        for (let i = 0; i < n; i++) {
          const img = new Image();
          img.onload = () => {
            loaded++;
            if (i === 0) renderRef.current(0); // show first frame ASAP
            if (loaded === n && !cancelled) setReady(true);
          };
          img.src = framePath(i + 1);
          imgs[i] = img;
        }
        imagesRef.current = imgs;
        setCount(n);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // ── 2. Canvas drawing + scroll scrubbing (runs once frames are known) ─────
  useEffect(() => {
    if (!count) return;
    if (!canvasRef.current || !sectionRef.current) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw a frame "cover"-style (fill, centre-crop) at CSS pixel size.
    function drawCover(img: HTMLImageElement) {
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let dw: number, dh: number;
      if (cr > ir) {
        dw = cw;
        dh = cw / ir;
      } else {
        dh = ch;
        dw = ch * ir;
      }
      ctx!.clearRect(0, 0, cw, ch);
      ctx!.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }

    function render(i: number) {
      const idx = Math.max(0, Math.min(count - 1, Math.round(i)));
      frameRef.current = idx;
      const img = imagesRef.current[idx];
      if (img && img.complete && img.naturalWidth) drawCover(img);
    }
    renderRef.current = render;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      render(frameRef.current);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // GSAP scope for easy cleanup.
    const gtx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Reduced motion: rest on the final frame, show only the last caption.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        render(count - 1);
        gsap.set(".cap", { opacity: 0 });
        gsap.set(".cap-4", { opacity: 1, xPercent: -50 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const frame = { i: 0 };
        gsap.set(".cap", { opacity: 0 });
        gsap.set(".cap-4", { xPercent: -50 }); // own the X transform (centred)

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${count * 22}`, // ~22px of scroll per frame
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        // The frame scrubber spans the whole timeline (length = 1).
        tl.to(
          frame,
          {
            i: count - 1,
            ease: "none",
            duration: 1,
            onUpdate: () => render(frame.i),
          },
          0
        );

        // Captions fade in then out (except the last, which stays).
        CAPTIONS.forEach((c) => {
          const fromX = c.side === "left" ? -40 : c.side === "right" ? 40 : 0;
          if (c.side === "bottom") {
            tl.fromTo(
              `.${c.cls}`,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 0.07, ease: "power2.out" },
              c.at
            );
          } else {
            tl.fromTo(
              `.${c.cls}`,
              { opacity: 0, x: fromX, y: 20 },
              { opacity: 1, x: 0, y: 0, duration: 0.07, ease: "power2.out" },
              c.at
            ).to(
              `.${c.cls}`,
              { opacity: 0, y: -24, duration: 0.07, ease: "power2.in" },
              c.at + 0.16
            );
          }
        });
      });
    }, section);

    return () => {
      ro.disconnect();
      gtx.revert();
    };
  }, [count]);

  return (
    <section
      ref={sectionRef}
      id="how-its-made"
      className="relative h-dvh overflow-hidden bg-black"
    >
      {/* The sequence canvas (opaque, full-bleed). */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 h-full w-full" />

      {/* Faint endless wordmark — a watermark over the footage (the canvas is
          opaque, so it has to sit above it to be seen), kept subtle via low
          opacity + soft-light blend, and faded at the edges by the vignette. */}
      <div className="pointer-events-none absolute inset-0 z-[15] flex items-center overflow-hidden mix-blend-soft-light">
        <div className="animate-marquee flex whitespace-nowrap font-display text-[20vw] uppercase leading-none text-white/15">
          <span>Brim Burgers&nbsp;—&nbsp;Brim Burgers&nbsp;—&nbsp;Brim Burgers&nbsp;—&nbsp;</span>
          <span aria-hidden>
            Brim Burgers&nbsp;—&nbsp;Brim Burgers&nbsp;—&nbsp;Brim Burgers&nbsp;—&nbsp;
          </span>
        </div>
      </div>

      {/* Vignette to seat the footage into pure black at the edges. */}
      <div className="brim-vignette pointer-events-none absolute inset-0 z-20" aria-hidden />

      {/* Section label */}
      <div className="pointer-events-none absolute inset-x-0 top-24 z-30 flex justify-center">
        <span className="glass-dark rounded-full px-4 py-1.5 font-display text-[0.7rem] uppercase tracking-[0.4em] text-paper">
          How it&apos;s made
        </span>
      </div>

      {/* Captions */}
      {CAPTIONS.map((c) => (
        <div
          key={c.cls}
          className={`cap ${c.cls} glass pointer-events-none absolute z-30 flex max-w-[17rem] flex-col gap-2 rounded-2xl p-5 opacity-0 shadow-xl shadow-black/40 ${c.pos}`}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brim">
            {c.kicker}
          </span>
          <h3 className="font-display text-4xl uppercase leading-[0.95] text-paper sm:text-5xl">
            {c.title}
          </h3>
          <p className="text-sm leading-relaxed text-paper/75">{c.copy}</p>
        </div>
      ))}

      {/* Loading veil until all frames are in memory (prevents flicker). */}
      {!ready && (
        <div className="absolute inset-0 z-40 grid place-items-center bg-black">
          <span className="font-display text-sm uppercase tracking-[0.4em] text-paper/60">
            Firing up the griddle…
          </span>
        </div>
      )}
    </section>
  );
}
