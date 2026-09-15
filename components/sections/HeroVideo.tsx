"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    eyebrow: "Smashed · halal · never frozen",
    title: "Big flavour.|Fully Brim.",
    copy: "Freshly smashed burgers, loaded fries and bold flavours—made for a proper meal.",
    image: "/hero/brim-meal-hero.png",
    alt: "BRIM smash burger, fries and cola",
    imagePosition: "object-[62%_center]",
  },
  {
    eyebrow: "Crispy · cheesy · no shortcuts",
    title: "Loaded to|the Brim.",
    copy: "Golden fries, melted cheese and every topping worth getting stuck into.",
    image: "/hero/brim-loaded-hero.png",
    alt: "Loaded fries with cheese and toppings",
    imagePosition: "object-[65%_center]",
  },
  {
    eyebrow: "Golden crunch · proper bite",
    title: "Crunch meets|juicy.",
    copy: "Crispy chicken, fresh toppings and a burger built to disappear fast.",
    image: "/hero/brim-chicken-hero.png",
    alt: "Crispy chicken burger with fries and cola",
    imagePosition: "object-[66%_center]",
  },
  {
    eyebrow: "Thick shakes · sweet finish",
    title: "Save room|for more.",
    copy: "Big shakes and sweet finishes for the part of the meal you never skip.",
    image: "/hero/brim-shakes-hero.png",
    alt: "Chocolate and strawberry milkshakes",
    imagePosition: "object-[64%_center]",
  },
] as const;

const SLIDE_DURATION = 6000;

export function HeroVideo() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (isPaused || reducedMotion.matches) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % SLIDES.length);
    }, SLIDE_DURATION);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const slide = SLIDES[activeSlide];

  return (
    <section
      id="hero"
      aria-roledescription="carousel"
      aria-label="Featured BRIM menu"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
      className="relative isolate h-dvh min-h-[42rem] overflow-hidden bg-[#ead4af] text-ink"
    >
      {SLIDES.map((item, index) => (
        <div
          key={item.image}
          aria-hidden={index !== activeSlide}
          className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
            index === activeSlide
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-[1.035] opacity-0"
          }`}
        >
          <Image
            src={item.image}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover ${item.imagePosition}`}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,248,235,0.98)_0%,rgba(255,248,235,0.9)_31%,rgba(255,248,235,0.3)_56%,transparent_75%)]"
          />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex h-full max-w-[120rem] items-center px-6 pb-10 pt-24 sm:px-12 sm:pb-14 lg:px-[clamp(3rem,8vw,10rem)]">
        <div key={slide.image} className="brim-hero-copy max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-ink/55">
            {slide.eyebrow}
          </p>
          <h1 className="mt-5 font-display text-[clamp(3.9rem,8vw,8.7rem)] uppercase leading-[0.78] tracking-[-0.065em]">
            {slide.title.split("|").map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-7 max-w-sm text-base leading-relaxed text-ink/65 sm:text-lg">
            {slide.copy}
          </p>
          <Link
            href="/menu"
            className="mt-8 inline-flex items-center gap-5 rounded-full bg-ink px-7 py-4 text-sm font-bold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.03]"
          >
            Explore the menu <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-6 z-20 flex items-center gap-2 sm:bottom-10 sm:left-12 lg:left-[clamp(3rem,8vw,10rem)]">
        {SLIDES.map((item, index) => (
          <button
            key={item.image}
            type="button"
            aria-label={`Show slide ${index + 1}: ${item.title.replace("|", " ")}`}
            aria-pressed={index === activeSlide}
            onClick={() => setActiveSlide(index)}
            className={`h-2 rounded-full transition-[width,background-color] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${
              index === activeSlide ? "w-10 bg-ink" : "w-2 bg-ink/35 hover:bg-ink/60"
            }`}
          />
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Slide {activeSlide + 1} of {SLIDES.length}: {slide.title.replace("|", " ")}
      </p>
    </section>
  );
}
