"use client";

import type { CSSProperties } from "react";
import { asset } from "@/lib/asset";
import { gsap } from "@/lib/gsap";
import styles from "./BurgerProcessVisual.module.css";

const SCENES = [
  { image: "fresh-beef", label: "Fresh ground beef", description: "A mound of fresh ground beef with natural fat marbling." },
  { image: "hand-formed", label: "Formed by hand", description: "Gloved hands gently shape the beef into a round ball." },
  { image: "beef-ball", label: "Pressed into a patty", description: "A steel burger press moves down and flattens the beef ball." },
  { image: "seared-patty", label: "Crisp, golden edges", description: "A thin seared patty with crisp, caramelised edges." },
  { image: "cheese-stack", label: "Stacked with cheese", description: "Two hot beef patties stacked with melted American cheese." },
  { image: "dressed-stack", label: "Sauced & topped", description: "The stack sits on a brioche base with pickles, onions and house sauce." },
  { image: null, label: "The big juicy one.", description: "The finished Brim burger, crowned with its glossy brioche bun." },
];

// These tweens belong to the parent's playback timeline. Pause, seek, replay,
// visibility changes and route cleanup therefore control the whole scene.
export function animateBurgerProcess(timeline: gsap.core.Timeline, root: Element, duration: number) {
  const scenes = root.querySelectorAll<HTMLElement>("[data-food-scene]");
  gsap.set(scenes, { opacity: 0 });
  gsap.set(scenes[0], { opacity: 1 });
  scenes.forEach((scene, index) => {
    const at = index * duration;
    // Clear the outgoing silhouette before introducing the next photograph.
    // Overlapping photographs make the hands and steel look transparent.
    if (index > 0) {
      timeline.to(scenes[index - 1], { opacity: 0, duration: 0.16, ease: "power1.in" }, at)
        .fromTo(scene, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: "power1.out", immediateRender: false }, at + 0.14);
    }
    const food = scene.querySelector("[data-food]");
    if (index === 2) {
      const press = scene.querySelector("[data-press]");
      const patty = scene.querySelector("[data-patty]");
      // Keep both photographs on the same ground plane. The plate contacts
      // the ball before compression and lifts only after a short firm hold.
      timeline.set(press, { visibility: "visible" }, at + 0.42)
        .fromTo(press, { yPercent: -76 }, { yPercent: -8, duration: 0.72, ease: "power2.inOut", immediateRender: false }, at + 0.42)
        .fromTo(food, { scaleX: 1, scaleY: 1 }, { scaleX: 1.08, scaleY: 0.72, duration: 0.4, ease: "power2.inOut", immediateRender: false }, at + 0.64)
        .fromTo(food, { opacity: 1 }, { opacity: 0, duration: 0.2, immediateRender: false }, at + 0.88)
        .fromTo(patty, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, at + 0.88)
        .to(press, { yPercent: -90, duration: 0.48, ease: "power2.in" }, at + 1.55)
        .set(press, { visibility: "hidden" }, at + 2.03);
    } else if (index === 1) {
      timeline.fromTo(food, { scale: 1.025, yPercent: -1 }, {
        scale: 1, yPercent: 0, duration: 0.8, ease: "power2.out", immediateRender: false,
      }, at + 0.25);
    } else if (index >= 4) {
      // Reveal the build from its base upwards, without dropping the whole
      // burger or wobbling a finished photograph as though it were one layer.
      timeline.fromTo(food, { clipPath: "inset(90% 0 0 0)", yPercent: -3 }, {
        clipPath: "inset(0% 0 0 0)", yPercent: 0, duration: 0.85,
        ease: "power2.out", immediateRender: false,
      }, at + 0.14);
    } else {
      timeline.fromTo(food, { scale: 0.98 }, {
        scale: 1, duration: 0.65, ease: "power2.out", immediateRender: false,
      }, at + 0.15);
    }
    if (index === 3) {
      timeline.fromTo(scene.querySelectorAll("[data-steam]"), { y: 6, opacity: 0 }, {
        y: -12, opacity: 0.22, duration: 0.75, stagger: 0.12,
        repeat: 1, yoyo: true, ease: "sine.inOut", immediateRender: false,
      }, at + 0.4);
    }
  });
}

export function BurgerProcessVisual({ activeStep }: { activeStep: number }) {
  return (
    <figure className={styles.root} aria-label={SCENES[activeStep].description} role="img">
      <div className={styles.canvas}>
        {SCENES.map((scene, index) => (
          <div key={scene.label} data-food-scene data-active={activeStep === index} data-scene-index={index} className={`${styles.scene} ${index === 2 ? styles.smash : ""}`} aria-hidden="true">
            {/* All assets load together so advancing a step never waits for a request. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-food src={asset(scene.image ? `/process/${scene.image}.webp` : "/burger-white.png")} alt="" width="1536" height="1024" className={styles.food} draggable={false} />
            {index === 2 && (
              // eslint-disable-next-line @next/next/no-img-element
              <img data-patty src={asset("/process/raw-patty.webp")} alt="" width="1536" height="1024" className={styles.patty} draggable={false} />
            )}
            {index === 2 && (
              // eslint-disable-next-line @next/next/no-img-element
              <img data-press src={asset("/process/burger-press.webp")} alt="" width="1536" height="1024" className={styles.press} style={{ "--press-mask": `url("${asset("/process/burger-press-mask.svg")}")` } as CSSProperties} draggable={false} />
            )}
            {index === 3 && <div className={styles.steam} aria-hidden="true"><i data-steam /><i data-steam /><i data-steam /></div>}
          </div>
        ))}
      </div>
      <figcaption className={styles.caption} aria-hidden="true"><span>Step {String(activeStep + 1).padStart(2, "0")} · Made properly</span><strong>{SCENES[activeStep].label}</strong></figcaption>
    </figure>
  );
}
