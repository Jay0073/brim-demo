"use client";

// ─────────────────────────────────────────────────────────────────────────
//  HOW IT'S MADE — the core attraction.
//  A pinned section whose scroll scrubs a GSAP timeline that assembles a
//  burger in the center, beef → Brim, across 4 phases. Bold captions fade in
//  on alternating sides as each phase plays.
//
//  The burger is built from stacked, absolutely-positioned LAYER divs
//  (CSS-drawn for now). Each layer carries `data-layer` so GSAP can manage it,
//  and is trivially swappable for a transparent cutout <img> later — just keep
//  the className + data-layer and replace the inner visual.
// ─────────────────────────────────────────────────────────────────────────
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Phase = {
  id: number;
  kicker: string;
  title: string;
  copy: string;
  /** position + alignment of the caption card */
  pos: string;
};

const PHASES: Phase[] = [
  {
    id: 1,
    kicker: "Phase 01",
    title: "100% GRASS-FED",
    copy: "A single ball of 100% grass-fed, strictly Halal beef. No fillers. Never frozen.",
    pos: "left-6 top-[18%] items-start text-left md:left-16",
  },
  {
    id: 2,
    kicker: "Phase 02",
    title: "THE SMASH",
    copy: "Pressed hard onto a screaming-hot griddle for that lacy, caramelised crust.",
    pos: "right-6 top-[34%] items-end text-right md:right-16",
  },
  {
    id: 3,
    kicker: "Phase 03",
    title: "THE PERFECT MELT",
    copy: "Aged cheese draped over the patty until it melts into every single edge.",
    pos: "left-6 top-[56%] items-start text-left md:left-16",
  },
  {
    id: 4,
    kicker: "Phase 04",
    title: "THE BIG JUICY BRIM",
    copy: "Crowned with house sauce, pickles and a toasted bun. That's a Brim.",
    pos: "right-6 top-[70%] items-end text-right md:right-16",
  },
];

export function HowItsMade() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // ── Reduced motion: present everything assembled, no pin, no scrub. ──
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-layer]", { opacity: 1, xPercent: -50, scale: 1, y: 0 });
        gsap.set(".phase-card", { opacity: 1, y: 0 });
      });

      // ── Full experience ─────────────────────────────────────────────────
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // All layers are centered horizontally via xPercent so GSAP owns the
        // full transform (avoids fighting a Tailwind -translate-x class).
        gsap.set("[data-layer]", { xPercent: -50, opacity: 0 });

        // Entrance / "ball" states — ingredients arc in from off-stage.
        gsap.set(".l-bun-btm", { y: 140 });
        gsap.set(".l-patty", {
          y: -260,
          scaleX: 0.55,
          scaleY: 1.5, // tall, narrow → reads as a raw beef ball
          transformOrigin: "center bottom",
        });
        gsap.set(".l-cheese", { y: -240, x: 60, rotation: 12, scaleX: 0.4 });
        gsap.set(".l-sauce", { scaleX: 0, transformOrigin: "center center" });
        gsap.set(".l-pickle", { y: -160, x: -40, rotation: -30 });
        gsap.set(".l-bun-top", { y: -320, scale: 1.1 });
        gsap.set(".phase-card", { opacity: 0, y: 28 });

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=3800",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        // PHASE 1 — bottom bun settles, beef ball drops in.
        tl.addLabel("p1")
          .to(".l-bun-btm", { opacity: 1, y: 0, duration: 0.5 }, "p1")
          .to(
            ".l-patty",
            { opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.2)" },
            "p1+=0.15"
          )
          .to(".card-1", { opacity: 1, y: 0, duration: 0.4 }, "p1+=0.1")
          .to(".card-1", { opacity: 0, y: -28, duration: 0.4 }, "p1+=1.05");

        // PHASE 2 — THE SMASH: ball flattens onto the griddle.
        tl.addLabel("p2", "p1+=1.4")
          .to(
            ".l-patty",
            {
              scaleX: 1,
              scaleY: 1,
              duration: 0.45,
              ease: "power4.out",
            },
            "p2"
          )
          .to(
            ".l-bun-btm",
            { scaleX: 1.05, duration: 0.12, yoyo: true, repeat: 1 },
            "p2+=0.05"
          )
          .to(".card-2", { opacity: 1, y: 0, duration: 0.4 }, "p2")
          .to(".card-2", { opacity: 0, y: -28, duration: 0.4 }, "p2+=1.05");

        // PHASE 3 — THE MELT: cheese arcs in and drapes over the patty.
        tl.addLabel("p3", "p2+=1.4")
          .to(
            ".l-cheese",
            {
              opacity: 1,
              x: 0,
              y: 0,
              rotation: 0,
              scaleX: 1,
              duration: 0.6,
              ease: "power2.out",
            },
            "p3"
          )
          .to(".card-3", { opacity: 1, y: 0, duration: 0.4 }, "p3")
          .to(".card-3", { opacity: 0, y: -28, duration: 0.4 }, "p3+=1.05");

        // PHASE 4 — THE CROWN: sauce, pickles, top bun.
        tl.addLabel("p4", "p3+=1.4")
          .to(".l-sauce", { opacity: 1, scaleX: 1, duration: 0.35 }, "p4")
          .to(
            ".l-pickle",
            {
              opacity: 1,
              x: 0,
              y: 0,
              rotation: 0,
              duration: 0.4,
              stagger: 0.08,
            },
            "p4+=0.1"
          )
          .to(
            ".l-bun-top",
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.1)" },
            "p4+=0.25"
          )
          .to(".card-4", { opacity: 1, y: 0, duration: 0.4 }, "p4+=0.2");
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="how-its-made"
      className="relative h-dvh overflow-hidden bg-ink"
    >
      {/* Monochrome frame: bold diagonal strips, pushed out of focus (blur +
          vignette) so the vibrant burger in the center is the sharp subject. */}
      <div
        className="brim-stripes absolute inset-0 scale-110 blur-[6px] opacity-80"
        aria-hidden
      />
      <div className="absolute inset-0 bg-ink/30" aria-hidden />
      <div className="brim-vignette absolute inset-0" aria-hidden />
      {/* Warm pool of light under the food. */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brim/10 blur-[100px]"
      />

      {/* Section label */}
      <div className="pointer-events-none absolute inset-x-0 top-24 z-10 flex justify-center">
        <span className="glass-dark rounded-full px-4 py-1.5 font-display text-[0.7rem] uppercase tracking-[0.4em] text-paper">
          How it&apos;s made
        </span>
      </div>

      {/* Phase caption cards (one visible per phase while scrolling) */}
      {PHASES.map((p) => (
        <div
          key={p.id}
          className={`phase-card card-${p.id} glass absolute z-10 flex max-w-[17rem] flex-col gap-2 rounded-2xl p-5 shadow-xl shadow-black/30 ${p.pos}`}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brim">
            {p.kicker}
          </span>
          <h3 className="font-display text-4xl uppercase leading-[0.95] text-paper sm:text-5xl">
            {p.title}
          </h3>
          <p className="text-sm leading-relaxed text-paper/75">{p.copy}</p>
        </div>
      ))}

      {/* ── Center burger stage ──────────────────────────────────────────── */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-[320px] w-[300px]">
          {/* soft plate glow under the burger */}
          <div
            aria-hidden
            className="absolute bottom-4 left-1/2 h-10 w-[260px] -translate-x-1/2 rounded-[50%] bg-brim/20 blur-2xl"
          />

          {/* bottom bun */}
          <div
            data-layer
            className="l-bun-btm absolute bottom-2 left-1/2 h-10 w-[230px] rounded-b-[44px] rounded-t-md bg-gradient-to-b from-amber-300 to-amber-600 shadow-lg shadow-black/40"
          />
          {/* patty (ball → smashed) */}
          <div
            data-layer
            className="l-patty absolute bottom-[40px] left-1/2 h-9 w-[244px] rounded-[20px] bg-gradient-to-b from-[#6b3a22] to-[#2a160c] shadow-md shadow-black/50"
          />
          {/* cheese */}
          <div
            data-layer
            className="l-cheese absolute bottom-[64px] left-1/2 h-6 w-[256px] rounded-[10px] bg-gradient-to-b from-amber-300 to-yellow-500 shadow-sm shadow-black/30"
          >
            {/* drips */}
            <span className="absolute -bottom-2 left-6 h-4 w-3 rounded-b-full bg-yellow-500" />
            <span className="absolute -bottom-3 right-10 h-5 w-3 rounded-b-full bg-yellow-500" />
          </div>
          {/* sauce line */}
          <div
            data-layer
            className="l-sauce absolute bottom-[84px] left-1/2 h-2 w-[230px] rounded-full bg-brim"
          />
          {/* pickles */}
          <div
            data-layer
            className="l-pickle absolute bottom-[78px] left-1/2 flex w-[200px] justify-between"
          >
            <span className="h-4 w-4 rounded-full bg-lime-600 ring-2 ring-lime-800/40" />
            <span className="h-4 w-4 rounded-full bg-lime-600 ring-2 ring-lime-800/40" />
            <span className="h-4 w-4 rounded-full bg-lime-600 ring-2 ring-lime-800/40" />
          </div>
          {/* top bun (dome) */}
          <div
            data-layer
            className="l-bun-top absolute bottom-[92px] left-1/2 h-24 w-[252px] rounded-[120px_120px_28px_28px] bg-gradient-to-b from-amber-200 to-amber-500 shadow-xl shadow-black/40"
          >
            {/* sesame */}
            <span className="absolute left-1/2 top-5 h-1.5 w-2.5 -translate-x-1/2 rounded-full bg-amber-100/80" />
            <span className="absolute left-1/3 top-8 h-1.5 w-2.5 rounded-full bg-amber-100/70" />
            <span className="absolute right-1/3 top-9 h-1.5 w-2.5 rounded-full bg-amber-100/70" />
          </div>
        </div>
      </div>
    </section>
  );
}
