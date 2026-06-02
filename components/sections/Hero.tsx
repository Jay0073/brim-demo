"use client";

// ─────────────────────────────────────────────────────────────────────────
//  HERO — cinematic intro on the B/W striped stage.
//
//  Choreography (GSAP, time-based — no scroll):
//    1. On load the burger card sits LARGE + CENTERED and plays the
//       falling-burger sequence (2×, muted→sound on first interaction).
//    2. When the clip ends it slides to the RIGHT + scales to its resting
//       slot, while the headline / copy / CTAs slide IN FROM THE LEFT and a
//       dark wash fades in under the text for legibility over the stripes.
//
//  The video's light studio backdrop is lifted to pure white (VIDEO_FILTER)
//  and the wrapper is a rounded card, so the burger reads as a clean white
//  panel on the stripes.
//
//  Pure monochrome — white type on bold black & white stripes, no colour
//  accent. Keep the <section id="hero"> wrapper so the page composition +
//  scroll math stay.
// ─────────────────────────────────────────────────────────────────────────
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { asset } from "@/lib/asset";

// Lifts the video's gray-blue studio backdrop (~rgb(187,195,197)) to pure
// white so the burger reads as floating, while keeping it rich and saturated.
const VIDEO_FILTER = "brightness(1.4) contrast(1.12) saturate(1.06)";

const PLAYBACK_RATE = 2;

// The last headline word auto-cycles through these (CSS upper-cases them).
const WORDS = ["Juicy", "Big", "Bold", "Fresh"];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const splitDone = useRef(false);

  // ── Intro choreography ──────────────────────────────────────────────────
  useGSAP(
    () => {
      const stageEl = root.current?.querySelector<HTMLElement>(".hero-stage");
      const video = videoRef.current;

      // Translate needed to move the resting stage to the viewport centre.
      const centreOffset = () => {
        if (!stageEl) return { x: 0, y: 0 };
        const r = stageEl.getBoundingClientRect();
        return {
          x: window.innerWidth / 2 - (r.left + r.width / 2),
          y: window.innerHeight / 2 - (r.top + r.height / 2),
        };
      };

      const mm = gsap.matchMedia();

      // Reduced motion → present the resting layout immediately, no intro.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hero-reveal", { opacity: 1, x: 0 });
        gsap.set([".hero-leftwash", ".hero-scroll"], { opacity: 1 });
        gsap.set(".hero-stage", { clearProps: "transform" });
      });

      // Full experience.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const introScale = window.innerWidth >= 1024 ? 1.6 : 1.15;
        const { x, y } = centreOffset();

        // Loop the clip so the burger keeps reforming — never a frozen frame.
        if (video) video.loop = true;

        // Initial state (runs pre-paint → no flash of the resting layout).
        gsap.set(".hero-stage", {
          x,
          y,
          scale: introScale,
          rotationY: 12,
          transformPerspective: 1100,
          transformOrigin: "center center",
        });
        // Burger sits a touch larger than its card → headroom to parallax it
        // inside the frame without exposing the edges.
        if (video) gsap.set(video, { scale: 1.12 });
        gsap.set(".hero-reveal", { opacity: 0, x: -70 });
        gsap.set([".hero-leftwash", ".hero-scroll"], { opacity: 0 });

        let splitTl: gsap.core.Timeline | undefined;
        let stopParallax = () => {};

        // Once settled: layered, clearly-visible motion so it never reads as a
        // still image — a continuous float + sway + pitch always running, plus
        // mouse-driven 3D yaw with the burger shifting the opposite way inside
        // the card for real depth.
        const startIdle = () => {
          if (!stageEl) return;
          gsap.to(stageEl, { y: -26, duration: 3, ease: "sine.inOut", repeat: -1, yoyo: true });
          gsap.to(stageEl, { rotationZ: 2.2, duration: 4.4, ease: "sine.inOut", repeat: -1, yoyo: true });
          gsap.to(stageEl, { rotationX: 3.5, duration: 5.2, ease: "sine.inOut", repeat: -1, yoyo: true });

          const yaw = gsap.quickTo(stageEl, "rotationY", { duration: 0.7, ease: "power3" });
          const vidX = video ? gsap.quickTo(video, "x", { duration: 0.8, ease: "power3" }) : null;
          const vidY = video ? gsap.quickTo(video, "y", { duration: 0.8, ease: "power3" }) : null;
          const onMove = (e: PointerEvent) => {
            const dx = gsap.utils.clamp(-1, 1, (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2));
            const dy = gsap.utils.clamp(-1, 1, (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2));
            yaw(dx * 14);
            if (vidX) vidX(dx * -26);
            if (vidY) vidY(dy * -26);
          };
          window.addEventListener("pointermove", onMove);
          stopParallax = () => window.removeEventListener("pointermove", onMove);
        };

        const runSplit = () => {
          if (splitDone.current) return;
          splitDone.current = true;
          splitTl = gsap
            .timeline({ defaults: { ease: "power4.out" }, onComplete: startIdle })
            .to(".hero-stage", { x: 0, y: 0, scale: 1, rotationY: 0, duration: 1.4 })
            .to(".hero-leftwash", { opacity: 1, duration: 0.9 }, "-=1.0")
            .to(
              ".hero-reveal",
              { opacity: 1, x: 0, duration: 0.85, stagger: 0.1, ease: "power3.out" },
              "-=0.85",
            )
            .to(".hero-scroll", { opacity: 1, duration: 0.5 }, "-=0.3");
        };

        // Split after roughly one full play of the clip (10s @ 2× ≈ 5s).
        const splitTimer = window.setTimeout(runSplit, 5200);

        return () => {
          window.clearTimeout(splitTimer);
          stopParallax();
          splitTl?.kill();
          if (stageEl) gsap.killTweensOf(stageEl);
          if (video) gsap.killTweensOf(video);
        };
      });

      // Initial positions are set — reveal the stage (was hidden to avoid a
      // flash of the resting layout on first paint).
      root.current?.classList.remove("hero-js-pending");
    },
    { scope: root },
  );

  // ── Playback rate + sound (independent of motion preference) ────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = PLAYBACK_RATE;

    const inView = () => {
      const r = v.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    };

    const removeListeners = () => {
      window.removeEventListener("pointerdown", enableSound);
      window.removeEventListener("keydown", enableSound);
      window.removeEventListener("touchstart", enableSound);
    };

    // Unmute on the first gesture. If the clip is still running sound just
    // fades in; if it finished and is on screen, replay it so it's heard.
    const enableSound = () => {
      v.muted = false;
      v.playbackRate = PLAYBACK_RATE;
      if (!v.ended) {
        void v.play().catch(() => {});
      } else if (inView()) {
        v.currentTime = 0;
        void v.play().catch(() => {});
      }
      removeListeners();
    };

    // Try audible playback right away; if blocked, play muted + arm unmute.
    v.muted = false;
    void v.play().catch(() => {
      v.muted = true;
      void v.play().catch(() => {});
      window.addEventListener("pointerdown", enableSound);
      window.addEventListener("keydown", enableSound);
      window.addEventListener("touchstart", enableSound);
    });

    return removeListeners;
  }, []);

  // ── Auto-cycling headline word ("They are JUICY → BIG → …") ─────────────
  useEffect(() => {
    const el = wordRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let i = 0;

    const swap = () => {
      i = (i + 1) % WORDS.length;
      const next = WORDS[i];
      if (reduce) {
        gsap
          .timeline()
          .to(el, { opacity: 0, duration: 0.3 })
          .add(() => {
            el.textContent = next;
          })
          .to(el, { opacity: 1, duration: 0.3 });
      } else {
        // Clean fade + small lift (px, not clipped) so letters never fragment.
        gsap
          .timeline({ defaults: { ease: "power3.inOut" } })
          .to(el, { opacity: 0, y: -16, duration: 0.32, ease: "power2.in" })
          .add(() => {
            el.textContent = next;
          })
          .set(el, { y: 16 })
          .to(el, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
      }
    };

    const id = window.setInterval(swap, 2800);
    return () => {
      window.clearInterval(id);
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <section
      ref={root}
      id="hero"
      className="hero-js-pending relative flex min-h-dvh items-center overflow-hidden bg-ink text-paper"
    >
      {/* Signature bold pure black & white diagonal stripes, slowly drifting. */}
      <div className="brim-stripes brim-stripes-drift absolute inset-0" aria-hidden />
      {/* Soft dark wash under the text column for legibility over the stripes. */}
      <div
        className="hero-leftwash pointer-events-none absolute inset-y-0 left-0 z-[1] w-[72%] bg-gradient-to-r from-ink via-ink/60 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-16 pt-28 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:px-12 lg:pt-24">
        {/* ── LEFT: statement type (slides in from the left) ───────────── */}
        <div className="order-2 lg:order-1 lg:col-span-6">
          <div className="hero-reveal inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/75 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-paper opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-paper" />
            </span>
            Smashed · Halal · Unforgettable
          </div>

          <h1 className="hero-reveal font-display mt-7 text-[clamp(3.25rem,9.5vw,8.5rem)] uppercase leading-[0.82] tracking-[-0.03em] [text-shadow:0_4px_40px_rgba(0,0,0,0.5)]">
            <span className="block">They are</span>
            {/* Auto-cycling word — clean fade + lift (see the cycling effect). */}
            <span ref={wordRef} className="block">
              Juicy
            </span>
          </h1>

          <p className="hero-reveal mt-7 max-w-md text-base leading-relaxed text-paper/65 sm:text-lg">
            100% grass-fed, strictly Halal smash burgers — pressed hard,
            caramelised deep, and impossible to forget.
          </p>

          <div className="hero-reveal mt-9 flex flex-wrap items-center gap-3">
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
        </div>

        {/* ── RIGHT: the live burger (starts centred, slides here) ─────── */}
        <div className="order-1 flex justify-center lg:order-2 lg:col-span-6 lg:justify-end">
          {/* Rounded white card so the burger reads as a clean panel on the
              stripes. Shadow/ring live on the wrapper so the video's brightness
              filter doesn't wash them out; overflow-hidden clips the corners. */}
          <div className="hero-stage relative w-[min(86vw,560px)] overflow-hidden rounded-[2rem] shadow-2xl shadow-black/50 ring-1 ring-black/10 lg:w-[min(46vw,640px)]">
            <video
              ref={videoRef}
              className="block w-full select-none"
              src={asset("/watermark-removed-finalized.mp4")}
              style={{ filter: VIDEO_FILTER }}
              onLoadedMetadata={(e) => {
                e.currentTarget.playbackRate = PLAYBACK_RATE;
              }}
              playsInline
              preload="auto"
              aria-hidden
            />
          </div>
        </div>
      </div>

      {/* Scroll cue into "How It's Made". */}
      <div className="hero-scroll absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-paper/45">
        Scroll
        <span aria-hidden className="h-8 w-px bg-white/25" />
      </div>
    </section>
  );
}
