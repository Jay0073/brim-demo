"use client";

import { useRef, useState, type CSSProperties } from "react";
import { asset } from "@/lib/asset";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./BrimBuild.module.css";
import { BurgerProcessVisual, animateBurgerProcess } from "./BurgerProcessVisual";

const STEP_DURATION = 2.8;
const pointOnCircle = (angle: number) => {
  const radians = angle * Math.PI / 180;
  return { x: 400 + 270 * Math.cos(radians), y: 400 + 270 * Math.sin(radians) };
};
const STEPS = [
  { title: "Fresh beef", icon: "grass", headline: "Great burgers start here.", copy: "Fresh, grass-fed British beef. Full of flavour, with no frozen patties." },
  { title: "Hand-formed", icon: "ball", headline: "The shape of things to come.", copy: "Portioned by hand. Gently rolled into a ball, ready for the griddle." },
  { title: "The smash", icon: "press", headline: "Pressed. With purpose.", copy: "One firm press turns the beef ball into a thin, even patty." },
  { title: "Golden edges", icon: "spatula", headline: "This is where flavour happens.", copy: "The hot griddle creates a savoury crust: crisp edges, juicy centre." },
  { title: "Stack it up", icon: "stack", headline: "Double down on flavour.", copy: "Melt the cheese. Stack the patties. Double the flavour in every bite." },
  { title: "Bold flavours", icon: "sauce", headline: "The finishing touches.", copy: "Pickles, onions and house sauce add crunch, tang and a creamy finish." },
  { title: "The Brim", icon: "burger", headline: "All together. All Brim.", copy: "Finish with a toasted brioche crown. Your Brim burger is ready." },
].map((step, index) => {
  const point = pointOnCircle(-90 + index * 360 / 7);
  return { ...step, x: point.x / 8, y: point.y / 8 };
});
const CONNECTIONS = STEPS.map((_, index) => {
  const start = pointOnCircle(-90 + index * 360 / 7 + 12);
  const end = pointOnCircle(-90 + (index + 1) * 360 / 7 - 12);
  return `M${start.x} ${start.y} A270 270 0 0 1 ${end.x} ${end.y}`;
});

const INGREDIENTS = [
  { title: "Brioche bun", copy: "Buttery, soft and perfectly toasted.", side: "left", y: 10 },
  { title: "Signature Brim sauce", copy: "Our secret sauce. Unmatched taste.", side: "right", y: 23 },
  { title: "Fresh lettuce", copy: "Crisp, organic and locally sourced.", side: "left", y: 28 },
  { title: "Vine-ripened tomatoes", copy: "Juicy, ripe and full of natural flavour.", side: "left", y: 42 },
  { title: "Red onions", copy: "Sharp, fresh and perfectly balanced.", side: "left", y: 55 },
  { title: "Double American cheese", copy: "Melted to perfection for maximum flavour.", side: "left", y: 68 },
  { title: "Double smashed Angus beef", copy: "Juicy, crispy edges. 100% Angus beef.", side: "right", y: 62 },
  { title: "Crunchy pickles", copy: "Adds the perfect crunch and tang.", side: "right", y: 78 },
  { title: "House burger sauce", copy: "Creamy, tangy and made in-house.", side: "right", y: 92 },
  { title: "Toasted brioche base", copy: "Buttery, toasted and built to hold it all.", side: "left", y: 91 },
];

function ProcessIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    grass: "M6 12C10 4 22 3 29 9c7 6 4 15-3 20-7 5-19 4-22-3-2-5 0-10 2-14ZM10 14c3-5 11-6 15-2 4 4 2 10-3 13-5 3-11 2-13-2-1-3 0-6 1-9ZM18 12l-2 5 5 3-2 6",
    ball: "M28 10c-7-10-24-4-24 9s18 17 25 7c5-7 3-12-1-16ZM11 12c-5 4-5 10 0 13M16 10l5-1",
    press: "M7 21h22v8H7zM5 32h26M18 20V9M11 9h14M7 4v7M29 4v7",
    spatula: "m6 5 13 6-6 13L1 18ZM16 20l14 12 3-4-15-11M6 10l8 4M4 14l8 4",
    stack: "M4 12c0-12 28-12 28 0ZM4 18h28M4 24h28M4 29h28v4H4z",
    sauce: "M4 15h10v18H4zM7 15V8h4v7M9 8V3M22 15h10v18H22zM25 15V8h4v7M27 8V3M5 23h8M23 23h8",
    burger: "M4 13c0-14 28-14 28 0ZM3 18h30M4 24h28M4 29h28v4H4z",
    fresh: "M18 2v32M4 10l28 16M4 26 32 10M13 5l5 5 5-5M13 31l5-5 5 5M2 2l32 32",
  };
  return <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}

export function BrimBuild() {
  const root = useRef<HTMLDivElement>(null);
  const playback = useRef<gsap.core.Timeline | null>(null);
  const userPaused = useRef(false);
  const syncPlayback = useRef<() => void>(() => {});
  const [paused, setPaused] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const step = STEPS[activeStep];

  function selectStep(index: number) {
    userPaused.current = true;
    setPaused(true);
    setComplete(false);
    setActiveStep(index);
    playback.current?.pause().seek(index * STEP_DURATION + 2.25, true);
  }

  function togglePlayback() {
    if (complete) {
      userPaused.current = false;
      setPaused(false);
      setComplete(false);
      setActiveStep(0);
      playback.current?.pause(0);
    } else {
      userPaused.current = !userPaused.current;
      setPaused(userPaused.current);
    }
    syncPlayback.current();
  }
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const process = root.current!.querySelector("[data-process-panel]")!;
      const connectors = process.querySelectorAll("[data-connector]");
      const progress = process.querySelector("[data-progress]");
      const timeline = gsap.timeline({ paused: true, onComplete: () => setComplete(true) });
      playback.current = timeline;
      // The composition stays visible. Only attention moves around the circle.
      gsap.set(connectors, { strokeDashoffset: 1 });
      timeline.fromTo(progress, { scaleX: 0 }, {
        scaleX: 1, duration: STEPS.length * STEP_DURATION, ease: "none",
      }, 0);
      STEPS.forEach((_, index) => {
        const at = index * STEP_DURATION;
        timeline.call(() => setActiveStep(index), [], at)
          .to(connectors[index], { strokeDashoffset: 0, duration: STEP_DURATION, ease: "none" }, at);
      });
      animateBurgerProcess(timeline, process, STEP_DURATION);
      // Use actual visibility, independent of the pinned section above us and
      // ScrollTrigger's cached positions during route restoration/refresh.
      const stage = process.querySelector("figure")!;
      let ready = false;
      let disposed = false;
      const sync = () => {
        const rect = stage.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 73);
        const visible = visibleHeight > Math.min(rect.height, window.innerHeight - 73) * 0.45;
        if (ready && visible && !document.hidden && !userPaused.current) timeline.play();
        else timeline.pause();
      };
      syncPlayback.current = sync;
      const observer = new IntersectionObserver(sync, {
        rootMargin: "-73px 0px -40px 0px", threshold: Array.from({ length: 21 }, (_, i) => i / 20),
      });
      observer.observe(stage);
      // Start the story only when its photographs can actually be displayed.
      Promise.all(Array.from(stage.querySelectorAll("img"), image => image.decode().catch(() => {}))).then(() => {
        if (disposed) return;
        ready = true;
        sync();
      });
      const frame = requestAnimationFrame(sync);
      sync();
      document.addEventListener("visibilitychange", sync);
      window.addEventListener("pageshow", sync);
      window.addEventListener("focus", sync);
      gsap.utils.toArray<HTMLElement>("[data-build-panel]").forEach((panel) => {
        gsap.from(panel.querySelectorAll("[data-reveal]"), {
          opacity: 0, y: 22, duration: 0.7, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: panel, start: "top 75%", once: true },
        });
        gsap.fromTo(panel.querySelector("[data-burger]"), { y: 12 }, {
          y: -12, ease: "none",
          scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: 1 },
        });
      });
      return () => {
        disposed = true;
        observer.disconnect();
        cancelAnimationFrame(frame);
        document.removeEventListener("visibilitychange", sync);
        window.removeEventListener("pageshow", sync);
        window.removeEventListener("focus", sync);
        syncPlayback.current = () => {};
        playback.current = null;
      };
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <div ref={root} id="brim-build" className={styles.root}>
      <section data-process-panel className={`${styles.panel} ${styles.processPanel}`} aria-labelledby="process-heading">
        <div className={styles.intro}>
          <header className={styles.processHeader}>
            <p className={styles.eyebrow}><span /> The Brim method</p>
            <h2 id="process-heading">Good things.<br />Made <em>properly.</em></h2>
            <p className={styles.subheading}>Seven little details.<br />One big, juicy difference.</p>
          </header>
          <div className={styles.walkthrough}>
            <div className={styles.chapter}><span>{complete ? "The whole story" : `Step ${String(activeStep + 1).padStart(2, "0")} / 07`}</span><span>{complete ? "Made to enjoy" : step.title}</span></div>
            <div key={complete ? "complete" : activeStep} className={styles.detail}>
              <h3>{complete ? "That’s a Brim burger." : step.headline}</h3>
              <p>{complete ? "Fresh beef. A proper smash. Crisp edges, melted cheese and our signature finish. Every step makes the bite." : step.copy}</p>
            </div>
          </div>
          <div className={styles.controls}>
            <div className={styles.progressTrack} aria-hidden="true"><span data-progress /></div>
            <div className={styles.controlRow}>
              <button type="button" className={styles.playback} onClick={togglePlayback}>
                <span aria-hidden="true">{complete ? "↻" : paused ? "▷" : "Ⅱ"}</span>
                {complete ? "Replay the process" : paused ? "Continue the story" : "Pause the story"}
              </button>
              <span className={styles.hint}>Select any step to explore</span>
            </div>
          </div>
        </div>
        <div className={styles.process}>
          <svg className={styles.orbit} viewBox="0 0 800 800" fill="none" aria-hidden="true">
            {CONNECTIONS.map((d, index) => <g key={index}>
              <path d={d} stroke="#e5e5e5" strokeWidth="1.5" />
              <path data-connector d={d} pathLength="1" stroke="#000000" strokeWidth="2" strokeDasharray="1" strokeLinecap="round" />
            </g>)}
          </svg>
          <div className={styles.burgerStage}>
            <BurgerProcessVisual activeStep={activeStep} />
          </div>
          <ol className={styles.steps} aria-label="How we make a Brim burger">
            {STEPS.map((item, index) => <li data-step key={item.icon} className={styles.step} style={{ "--x": `${item.x}%`, "--y": `${item.y}%` } as CSSProperties}>
              <button type="button" className={`${styles.stepButton} ${activeStep === index && !complete ? styles.activeStep : ""} ${complete || index < activeStep ? styles.visitedStep : ""}`} aria-current={activeStep === index && !complete ? "step" : undefined} onClick={() => selectStep(index)}>
                <span className={styles.icon}><ProcessIcon name={item.icon} /></span>
                <span className={styles.stepNumber}>0{index + 1}</span>
                <span className={styles.stepTitle}>{item.title}</span>
              </button>
            </li>)}
          </ol>
        </div>
      </section>
      <section data-build-panel className={`${styles.panel} ${styles.anatomyPanel}`} aria-labelledby="anatomy-heading">
        <header data-reveal className={styles.header}>
          <p className={styles.eyebrow}>Every layer has a reason</p>
          <h2 id="anatomy-heading">Built to the <em>Brim.</em></h2>
        </header>
        <div className={styles.anatomy}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-burger className={styles.layers} src={asset("/burger-layers-white.png")} width="1024" height="1536" loading="lazy" alt="Exploded Brim burger showing each ingredient from the brioche crown to the toasted base" />
          <ul className={styles.ingredients}>
            {INGREDIENTS.map((item, index) => <li data-reveal key={item.title} className={`${styles.ingredient} ${item.side === "left" ? styles.left : styles.right}`} style={{ "--y": `${item.y}%` } as CSSProperties}>
              <span className={styles.ingredientNumber}>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{item.title}</h3><p>{item.copy}</p></div>
            </li>)}
          </ul>
        </div>
      </section>
    </div>
  );
}
