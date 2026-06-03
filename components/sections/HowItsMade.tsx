"use client";

// ─────────────────────────────────────────────────────────────────────────
//  HOW IT'S MADE — Apple-style scroll-scrubbed image sequence.
//
//  Scroll pins the section and scrubs a preloaded JPG frame sequence onto a
//  <canvas> (no <img> swapping → no layout thrash). A catchy intro headline
//  greets the viewer, then bold captions fade through the 6 build phases as
//  the burger goes beef → smash → cheese → melt → stack → crown.
//
//  Frames live in /public/sequence/ (scripts/extract-frames.mjs, npm run
//  frames). The frame count is read from manifest.json at runtime, so
//  re-extracting with new footage needs no change here.
// ─────────────────────────────────────────────────────────────────────────
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { asset } from "@/lib/asset";

// useLayoutEffect on the client, useEffect on the server (dodges the SSR
// "useLayoutEffect does nothing on the server" warning). This MUST be a layout
// effect for the pinned ScrollTrigger below: its cleanup (gtx.revert) has to run
// in React's mutation phase — BEFORE React removes this <section> on a
// client-side route change — so GSAP's pin-spacer wrapper is unwound first. As a
// passive useEffect the cleanup runs too late and React throws
// "Failed to execute 'removeChild' on 'Node': … not a child of this node".
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Manifest = { count: number; pattern: string };

const SEQ_DIR = "/sequence";
// asset() prefixes the deploy basePath — required for raw Image()/fetch on Pages.
const framePath = (i: number) =>
  asset(`${SEQ_DIR}/frame-${String(i).padStart(4, "0")}.jpg`);

// Caption beats placed along scroll progress (0–1). `side` controls slide-in
// direction + anchor; copy matches what's on screen at that moment.
type Caption = {
  cls: string;
  at: number;
  side: "left" | "right" | "bottom";
  pos: string;
  kicker: string;
  title: string;
  copy: string;
};

const CAPTIONS: Caption[] = [
  {
    cls: "cap-1",
    at: 0.08,
    side: "left" as const,
    pos: "left-5 top-[30%] items-start text-left md:left-14",
    kicker: "01 — The Beef",
    title: "100% GRASS-FED",
    copy: "Never frozen. Ground fresh and hand-pattied every morning from 100% grass-fed, strictly Halal beef.",
  },
  {
    cls: "cap-2",
    at: 0.24,
    side: "right" as const,
    pos: "right-5 top-[32%] items-end text-right md:right-14",
    kicker: "02 — The Smash",
    title: "THE PERFECT SMASH",
    copy: "Pressed hard onto a screaming-hot griddle so the edges lace and caramelise into a deep, savoury crust.",
  },
  {
    cls: "cap-3",
    at: 0.4,
    side: "left" as const,
    pos: "left-5 top-[52%] items-start text-left md:left-14",
    kicker: "03 — The Cheese",
    title: "REAL AGED CHEESE",
    copy: "A full square of properly aged cheese, laid over the patty while it's still sizzling on the heat.",
  },
  {
    cls: "cap-4",
    at: 0.54,
    side: "right" as const,
    pos: "right-5 top-[30%] items-end text-right md:right-14",
    kicker: "04 — The Melt",
    title: "MELTED TO PERFECTION",
    copy: "It softens, slumps and folds into every ridge and edge of the beef. Nothing stiff or chewy to spoil it.",
  },
  {
    cls: "cap-5",
    at: 0.7,
    side: "left" as const,
    pos: "left-5 top-[50%] items-start text-left md:left-14",
    kicker: "05 — The Build",
    title: "SAUCED & STACKED",
    copy: "House sauce and sweet onions — drizzled and tucked neatly into a soft, toasted bun.",
  },
  {
    cls: "cap-6",
    at: 0.86,
    side: "right" as const,
    pos: "right-5 top-[32%] items-end text-right md:right-14",
    kicker: "06 — The Brim",
    title: "THE BIG JUICY BRIM",
    copy: "Crowned and ready. The burger that earns the queue. That, right there, is a Brim.",
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
    fetch(asset(`${SEQ_DIR}/manifest.json`))
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
  // Layout effect (not passive) so the GSAP cleanup unwinds the ScrollTrigger
  // pin-spacer before React removes this <section> on navigation — see the note
  // on useIsomorphicLayoutEffect above.
  useIsomorphicLayoutEffect(() => {
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

    const gtx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Reduced motion: rest on the final frame, show only the last caption.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        render(count - 1);
        gsap.set(".intro", { opacity: 0 });
        gsap.set(".cap", { opacity: 0 });
        gsap.set(".cap-6", { opacity: 1 });
        gsap.set(canvasRef.current, { opacity: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const frame = { i: 0 };
        gsap.set(".cap", { opacity: 0 });
        gsap.set(".intro", { opacity: 1 });
        gsap.set(canvasRef.current, { opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${count * 28}`, // ~28px of scroll per frame
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        // Fade the canvas in as the intro fades out (from 0 to 0.08)
        tl.to(canvasRef.current, { opacity: 1, duration: 0.08, ease: "power1.inOut" }, 0);
        tl.to(".intro", { opacity: 0, y: -40, duration: 0.08, ease: "power2.in" }, 0);

        // Frame scrubber starts scrubbing at 0.08 scroll progress
        tl.to(
          frame,
          {
            i: count - 1,
            ease: "none",
            duration: 0.92,
            onUpdate: () => render(frame.i),
          },
          0.08
        );

        // Captions fade in then out (except the last, which stays).
        CAPTIONS.forEach((c, idx) => {
          const isLast = idx === CAPTIONS.length - 1;
          const fromX = c.side === "left" ? -40 : c.side === "right" ? 40 : 0;
          
          if (isLast) {
            // The last caption stays visible
            const fromY = c.side === "bottom" ? 40 : 20;
            tl.fromTo(
              `.${c.cls}`,
              { opacity: 0, x: fromX, y: fromY },
              { opacity: 1, x: 0, y: 0, duration: 0.06, ease: "power2.out" },
              c.at
            );
          } else {
            // Other captions fade in, then fade out
            tl.fromTo(
              `.${c.cls}`,
              { opacity: 0, x: fromX, y: 20 },
              { opacity: 1, x: 0, y: 0, duration: 0.06, ease: "power2.out" },
              c.at
            ).to(
              `.${c.cls}`,
              { opacity: 0, y: -24, duration: 0.06, ease: "power2.in" },
              c.at + 0.13
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
      {/* Sequence canvas. Saturated + lifted a touch so the food pops. */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 h-full w-full opacity-0"
        style={{ filter: "saturate(1.22) contrast(1.06) brightness(1.04)" }}
      />

      {/* Soft cinematic vignette — darkens only the far edges so the centre
          food stays bright + in focus (gentler than the page-wide one). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            "radial-gradient(ellipse 82% 78% at 50% 48%, transparent 42%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Intro headline (not fixed — it clears as you scroll into the cook). */}
      <div className="intro pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-brim">
          How it&apos;s made
        </p>
        <h2 className="max-w-4xl font-display text-4xl uppercase leading-[0.95] text-paper [text-shadow:0_4px_40px_rgba(0,0,0,0.75)] sm:text-6xl">
          Wanna know how these big, juicy burgers are made?
        </h2>
        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-paper/55">
          Keep scrolling ↓
        </p>
      </div>

      {/* Phase captions — larger glass cards with a line of detail. */}
      {CAPTIONS.map((c) => (
        <div
          key={c.cls}
          className={`cap ${c.cls}  pointer-events-none absolute z-30 flex w-[calc(100%-2.5rem)] sm:w-[24rem] md:w-[28rem] flex-col gap-3 md:gap-4 rounded-3xl p-7 md:p-9  ${c.pos}`}
        >
          <span className="text-xs md:text-sm font-bold uppercase tracking-[0.32em] text-brim">
            {c.kicker}
          </span>
          <h3 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase leading-[0.92] text-paper">
            {c.title}
          </h3>
          <p className="text-[1rem] md:text-[1.12rem] font-semibold leading-relaxed text-paper/95">
            {c.copy}
          </p>
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