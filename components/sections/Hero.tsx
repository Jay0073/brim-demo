"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { asset } from "@/lib/asset";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const topLayerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const burgerWrapRef = useRef<HTMLImageElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // ── Typing Effect State ──
  const words = ["JUICY", "BIG", "FRESH", "BRIM"];
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("JUICY");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullWord = words[wordIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < currentFullWord.length) {
        // Type next character
        timer = setTimeout(() => {
          setDisplayText(currentFullWord.substring(0, displayText.length + 1));
        }, 150); // typing speed
      } else {
        // Pause at full word before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (displayText.length > 0) {
        // Delete character
        timer = setTimeout(() => {
          setDisplayText(currentFullWord.substring(0, displayText.length - 1));
        }, 75); // deleting speed
      } else {
        // Fully deleted, move to next word
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIndex]);

  // ── Mouse / Touch Interactions (GSAP) ──
  useGSAP(
    () => {
      const container = containerRef.current;
      const topLayer = topLayerRef.current;
      const heading = headingRef.current;
      const burgerWrap = burgerWrapRef.current;
      const cta = ctaRef.current;

      if (!container || !topLayer || !burgerWrap) return;

      // Coordinates object to animate
      const coords = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        r: 0,
      };

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Responsive configuration
      const getRadii = () => {
        const isMobile = window.innerWidth < 768;
        return {
          base: isMobile ? 90 : 135,
          hover: isMobile ? 140 : 220,
        };
      };

      // Set initial values
      gsap.set(topLayer, { width: 0, height: 0, opacity: 0 });

      // Direct DOM update callback to avoid React re-renders on mousemove
      const updateStyle = () => {
        if (topLayer) {
          topLayer.style.left = `${coords.x}px`;
          topLayer.style.top = `${coords.y}px`;
          topLayer.style.width = `${coords.r * 2}px`;
          topLayer.style.height = `${coords.r * 2}px`;
          topLayer.style.opacity = coords.r > 0 ? "1" : "0";
        }

        const parallaxWrap = container.querySelector<HTMLElement>(".hero-parallax-wrap");
        if (parallaxWrap) {
          const x_tl = coords.x - coords.r;
          const y_tl = coords.y - coords.r;
          parallaxWrap.style.left = `${-x_tl}px`;
          parallaxWrap.style.top = `${-y_tl}px`;
        }
      };

      const animateRadius = (targetR: number) => {
        gsap.to(coords, {
          r: targetR,
          duration: prefersReducedMotion ? 0.1 : 0.45,
          ease: "power2.out",
          overwrite: "auto",
          onUpdate: updateStyle,
        });
      };

      // Handle Pointer Movement
      const onPointerMove = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Smoothly animate cursor position
        gsap.to(coords, {
          x,
          y,
          duration: prefersReducedMotion ? 0 : 0.35,
          ease: "power3.out",
          overwrite: "auto",
          onUpdate: updateStyle,
        });

        // 3D Parallax shift on the background image (opposite direction of mouse)
        const pctX = (x / rect.width) - 0.5;
        const pctY = (y / rect.height) - 0.5;
        gsap.to(burgerWrap, {
          x: pctX * -40,
          y: pctY * -40,
          duration: prefersReducedMotion ? 0 : 0.6,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const onPointerEnter = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.set(coords, { x, y });
        updateStyle();

        const { base } = getRadii();
        animateRadius(base);
      };

      const onPointerLeave = () => {
        animateRadius(0);
      };

      // Heading-specific hover (widens the lens)
      const onHeadingEnter = () => {
        const { hover } = getRadii();
        animateRadius(hover);
        gsap.to(heading, {
          scale: prefersReducedMotion ? 1 : 1.02,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const onHeadingLeave = () => {
        const { base } = getRadii();
        animateRadius(base);
        gsap.to(heading, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      // Button-wrapper hover (collapses the lens to 0)
      const onCtaEnter = () => {
        animateRadius(0);
      };

      const onCtaLeave = () => {
        const { base } = getRadii();
        animateRadius(base);
      };

      // Touch events specific override to collapse lens when touch ends
      const onPointerDown = (e: PointerEvent) => {
        if (e.pointerType === "touch") {
          const rect = container.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          gsap.set(coords, { x, y });
          updateStyle();

          const { base } = getRadii();
          animateRadius(base);
        }
      };

      const onPointerUp = (e: PointerEvent) => {
        if (e.pointerType === "touch") {
          animateRadius(0);
        }
      };

      // Bind events
      container.addEventListener("pointermove", onPointerMove);
      container.addEventListener("pointerenter", onPointerEnter);
      container.addEventListener("pointerleave", onPointerLeave);
      container.addEventListener("pointerdown", onPointerDown);
      container.addEventListener("pointerup", onPointerUp);
      container.addEventListener("pointercancel", onPointerUp);

      if (heading) {
        heading.addEventListener("pointerenter", onHeadingEnter);
        heading.addEventListener("pointerleave", onHeadingLeave);
      }

      if (cta) {
        cta.addEventListener("pointerenter", onCtaEnter);
        cta.addEventListener("pointerleave", onCtaLeave);
      }

      // Intro entry animation for typography on page load
      gsap.fromTo(
        ".hero-reveal-text",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: prefersReducedMotion ? 0.3 : 1.2,
          stagger: prefersReducedMotion ? 0 : 0.15,
          ease: "power4.out",
          delay: 0.2,
        }
      );

      return () => {
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerenter", onPointerEnter);
        container.removeEventListener("pointerleave", onPointerLeave);
        container.removeEventListener("pointerdown", onPointerDown);
        container.removeEventListener("pointerup", onPointerUp);
        container.removeEventListener("pointercancel", onPointerUp);

        if (heading) {
          heading.removeEventListener("pointerenter", onHeadingEnter);
          heading.removeEventListener("pointerleave", onHeadingLeave);
        }

        if (cta) {
          cta.removeEventListener("pointerenter", onCtaEnter);
          cta.removeEventListener("pointerleave", onCtaLeave);
        }
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative flex h-dvh items-center justify-center overflow-hidden bg-ink select-none"
    >
      {/* ── BOTTOM LAYER (Default view: Dark paper state) ── */}
      {/* Stripes background, softly out of focus */}
      <div
        className="brim-stripes absolute inset-0 scale-105 blur-[2px]"
        aria-hidden
      />
      {/* Vignette for lighting control */}
      <div className="brim-vignette absolute inset-0" aria-hidden />
      {/* Center ambient glow for depth */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[62vh] w-[82vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60 blur-3xl"
      />

      {/* Central content container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-5xl">

        <h1
          ref={headingRef}
          className="hero-reveal-text flex flex-col items-center pointer-events-auto cursor-default transition-transform duration-300"
        >
          {/* "THEY ARE" matching the font style of the How It's Made question */}
          <span className="block font-display text-[11vw] sm:text-[9vw] md:text-[8vw] lg:text-[7.5vw] uppercase leading-[0.95] tracking-normal text-paper [text-shadow:0_4px_40px_rgba(0,0,0,0.75)]">
            THEY ARE
          </span>
          {/* Typing word box with the Google Font Climate Crisis, reduced padding */}
          <span className="inline-block bg-paper text-ink px-4 py-1 sm:px-6 sm:py-1.5 rounded-[1.2rem] border-2 border-white/20 mt-3 align-middle shadow-2xl tracking-normal font-climate text-[11vw] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] leading-[1.05]">
            {displayText || "\u200b"}
          </span>
        </h1>

        <p className="hero-reveal-text mt-8 max-w-md text-base sm:text-lg leading-relaxed text-paper/75 pointer-events-auto [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
          100% grass-fed, strictly Halal smash burgers — pressed hard,
          caramelised deep, and impossible to forget.
        </p>

        <div
          ref={ctaRef}
          className="hero-reveal-text mt-9 flex flex-wrap items-center justify-center gap-3 pointer-events-auto"
        >
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

      {/* ── TOP LAYER (Revealed via morphing wavy glass lens) ── */}
      <div
        ref={topLayerRef}
        className="absolute z-20 pointer-events-none overflow-hidden border-[3px] border-white/25 shadow-[0_0_40px_rgba(255,255,255,0.18),inset_0_0_20px_rgba(255,255,255,0.12)] animate-liquid-glass bg-black/10"
        style={{
          width: "0px",
          height: "0px",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          isolation: "isolate",
        }}
      >
        {/* Parallax coordinate-aligning wrapper */}
        <div className="hero-parallax-wrap absolute w-screen h-screen">
          <img
            ref={burgerWrapRef}
            src={asset("/hero/brim-maniac.jpg")}
            alt="BRIM Maniac Full Screen"
            className="absolute w-[104vw] h-[104vh] -left-[2vw] -top-[2vh] max-w-none object-cover select-none"
            draggable="false"
          />
        </div>
        {/* Glassmorphic overlay sitting on top of the image to add sheen and blur */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] border border-white/15" style={{ borderRadius: "inherit" }} />
      </div>

      {/* Bottom fade to black to merge with the next section */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent z-15 pointer-events-none"
        aria-hidden
      />
    </section>
  );
}
