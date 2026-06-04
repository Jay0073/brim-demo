"use client";

// ─────────────────────────────────────────────────────────────────────────
//  BRAND STORY — an interactive chronicle of how Brim grew, year by year.
//
//  Left rail: a clickable vertical timeline of milestone years. Right panel:
//  the selected milestone in full — big year marker, custom line icon, the
//  story copy and a headline metric. Selecting a year re-mounts the panel
//  with the house `animate-rise` fade-lift (auto-disabled under reduced
//  motion via globals.css).
//
//  Entrance is a lightweight GSAP/ScrollTrigger reveal (no pinning), scoped
//  with useGSAP so cleanup is automatic. Dark `bg-ink` so it pours straight
//  into the footer below.
// ─────────────────────────────────────────────────────────────────────────
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { asset } from "@/lib/asset";

type IconKey = "compass" | "award" | "box" | "flag" | "globe";

interface Milestone {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  icon: IconKey;
  metric: string;
  metricLabel: string;
  /** Optional founder/person highlighted on this milestone. */
  person?: { name: string; role: string; image: string };
}

// Brand timeline. Inlined like the other sections' copy — it's editorial, not
// data that needs to live in JSON.
const MILESTONES: Milestone[] = [
  {
    year: "2019",
    title: "The Ignition Outpost",
    subtitle: "Where it began · one store",
    description:
      "Founded by Amadul Hassan in Hemel Hempstead on a single belief — that halal food deserves to be premium, bold and unapologetically big. One empty unit, one heavy-cast iron and an obsession with quality: grass-fed beef, artisan-baked buns and signature sauces crafted in-house — a brand the UK had never seen before.",
    icon: "compass",
    metric: "1",
    metricLabel: "Store it all started with",
    person: {
      name: "Amadul Hassan",
      role: "Founder & CEO",
      image: "/team/amadul-hassan.jpg",
    },
  },
  {
    year: "2021",
    title: "The London Criss-Cross",
    subtitle: "Refining the boutique footprint",
    description:
      "Perfecting the signature double-smashed 40-second lace crust. We establish boutique landmarks in Stratford and High Barnet. The strict monochrome branding and meticulous presentation instantly command premium pricing and real social notoriety.",
    icon: "award",
    metric: "2",
    metricLabel: "Flagships established",
  },
  {
    year: "2023",
    title: "Architectures of Unboxing",
    subtitle: "The luxury Brim Box launch",
    description:
      "We reinvent takeaway with the luxury “Brim Box” — a high-grade, moisture-controlled matte-black drawer-case that keeps our steam-toasted brioche structurally pristine in transit. Demand erupts overnight.",
    icon: "box",
    metric: "350K+",
    metricLabel: "Boxes delivered safely",
  },
  {
    year: "2024",
    title: "The Great Britain Perimeter",
    subtitle: "Reaching nine premium boutiques",
    description:
      "Brim scales aggressively while guarding artisan consistency. Flagships come online in Kentish Town, Luton, Hammersmith, Hemel Hempstead and Dalston — every site running identical temperature-probe iron calibrations and organic sourcing pipelines.",
    icon: "flag",
    metric: "9",
    metricLabel: "UK locations active",
  },
  {
    year: "2025",
    title: "Overcoming Oceans",
    subtitle: "International presence in PK",
    description:
      "To prove global adaptability, Brim opens state-of-the-art flagship hubs in Lahore (Gulberg) and Islamabad (F-11). The ultra-premium black design lands perfectly with international high-income audiences — the concept travels.",
    icon: "globe",
    metric: "2",
    metricLabel: "Overseas boutiques live",
  },
  {
    year: "2026",
    title: "The Centennial Horizon",
    subtitle: "Global enterprise roadmap",
    description:
      "With standardised workflow matrices, localised supply alliances and our elite design philosophy, Brim sets a course for 100+ locations across major metros in Europe, South Asia and the GCC. This is the future of the smash.",
    icon: "globe",
    metric: "100+",
    metricLabel: "Locations forecast globally",
  },
];

// Minimal stroke icons (lucide-react isn't a dependency here). 24×24, inherit
// colour + stroke from the parent so they recolour on the active state.
function Icon({ name, className }: { name: IconKey; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "compass":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <polygon points="16 8 13.5 13.5 8 16 10.5 10.5" />
        </svg>
      );
    case "award":
      return (
        <svg {...common}>
          <circle cx="12" cy="9" r="5" />
          <path d="M9 13.4 8 21l4-2 4 2-1-7.6" />
        </svg>
      );
    case "box":
      return (
        <svg {...common}>
          <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" />
          <path d="M3 7.5 12 12l9-4.5M12 12v9" />
        </svg>
      );
    case "flag":
      return (
        <svg {...common}>
          <path d="M5 21V4" />
          <path d="M5 4h11l-2 3 2 3H5" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.6 2.6 2.6 16.4 0 18M12 3c-2.6 2.6-2.6 16.4 0 18" />
        </svg>
      );
  }
}

export function BrandStory() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const event = MILESTONES[active];

  // Scroll-in reveal: header + rail items lift into place once. Scoped to the
  // section; useGSAP reverts everything on unmount.
  useGSAP(
    () => {
      gsap.from(".bs-reveal", {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="brand-story"
      className="relative overflow-hidden bg-ink text-paper"
    >
      {/* Brand hairline seam (matches Specials / Footer edges). */}
      <div
        aria-hidden
        className="brim-stripes-fine absolute inset-x-0 top-0 h-2 opacity-80"
      />

      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* ── LEFT: heading + clickable year rail ─────────────────────── */}
          <div className="lg:col-span-5">
            <p className="bs-reveal text-xs font-bold uppercase tracking-[0.4em] text-paper/70">
              Brand evolution
            </p>
            <h2 className="bs-reveal mt-4 max-w-md font-display text-5xl uppercase leading-[0.85] sm:text-6xl">
              Crafted with{" "}
              <span className="text-ash">obsession</span>
            </h2>
            <p className="bs-reveal mt-5 max-w-sm text-pretty text-sm leading-relaxed text-paper/55">
              Seven years from a single London outpost to an international
              boutique chain — smashed to order, every step audited.
            </p>

            {/* The timeline: a vertical line with a clickable node per year.
                Tablist semantics — each year selects the panel on the right. */}
            <div
              role="tablist"
              aria-label="Brand timeline"
              aria-orientation="vertical"
              className="bs-reveal relative mt-10 space-y-1 border-l border-white/10 pl-7"
            >
              {MILESTONES.map((m, i) => {
                const selected = i === active;
                return (
                  <button
                    key={m.year}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    aria-controls="brand-story-panel"
                    onClick={() => setActive(i)}
                    className="group relative block w-full cursor-pointer py-3 text-left outline-none"
                  >
                    {/* Node on the line. */}
                    <span
                      aria-hidden
                      className={`absolute left-[-31px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border transition-all duration-300 ${
                        selected
                          ? "scale-125 border-paper bg-paper shadow-[0_0_14px_2px] shadow-paper/40"
                          : "border-white/25 bg-ink group-hover:border-paper/60"
                      }`}
                    />
                    <span
                      className={`block font-display text-xl tabular-nums tracking-tight transition-colors duration-200 ${
                        selected
                          ? "text-paper"
                          : "text-ash group-hover:text-paper/80"
                      }`}
                    >
                      {m.year}
                    </span>
                    <span
                      className={`mt-0.5 block text-[0.8rem] tracking-tight transition-colors duration-200 ${
                        selected
                          ? "font-semibold text-paper/70"
                          : "text-paper/30 group-hover:text-paper/50"
                      }`}
                    >
                      {m.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: the selected milestone, in full ──────────────────── */}
          <div className="bs-reveal lg:col-span-7">
            <div
              key={event.year}
              id="brand-story-panel"
              role="tabpanel"
              aria-label={`${event.year} — ${event.title}`}
              className="animate-rise relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-10"
            >
              {/* Giant ghost year, clipped top-right (echoes the Specials tiles). */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-3 -top-10 select-none font-display text-[11rem] leading-none text-white/[0.035]"
              >
                {event.year.slice(2)}
              </span>

              {/* Header row: year marker + step counter + icon. */}
              <div className="relative flex items-start justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                  <span className="block font-display text-6xl leading-none tracking-tighter text-paper sm:text-7xl">
                    {event.year}
                  </span>
                  <span className="mt-3 block text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-ash">
                    Chronicle ·{" "}
                    <span className="tabular-nums text-paper">
                      {String(active + 1).padStart(2, "0")}
                    </span>
                    <span className="text-ash"> / {String(MILESTONES.length).padStart(2, "0")}</span>
                  </span>
                </div>
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/5 text-paper">
                  <Icon name={event.icon} className="h-6 w-6" />
                </span>
              </div>

              {/* Founder — only on milestones with a person attached. */}
              {event.person && (
                <div className="relative mt-7 flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(event.person.image)}
                    alt={event.person.name}
                    className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-white/15"
                  />
                  <div>
                    <span className="block font-display text-xl uppercase leading-none text-paper">
                      {event.person.name}
                    </span>
                    <span className="mt-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-ash">
                      {event.person.role}
                    </span>
                  </div>
                </div>
              )}

              {/* Story copy. */}
              <div className="relative mt-8 space-y-4">
                <span className="block text-xs font-bold uppercase tracking-[0.3em] text-paper/70">
                  {event.subtitle}
                </span>
                <h3 className="font-display text-3xl uppercase leading-[0.95] text-paper sm:text-4xl">
                  {event.title}
                </h3>
                <p className="max-w-2xl text-[0.95rem] leading-relaxed text-paper/60">
                  {event.description}
                </p>
              </div>

              {/* Headline metric + standing quality badge. */}
              <div className="relative mt-8 grid grid-cols-1 gap-3 border-t border-white/5 pt-7 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/5 bg-ink/60 p-5">
                  <span className="block font-display text-4xl tabular-nums leading-none text-paper">
                    {event.metric}
                  </span>
                  <span className="mt-2.5 block text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ash">
                    {event.metricLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-ink/60 p-5">
                  <div>
                    <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-ash">
                      Quality standard
                    </span>
                    <span className="mt-1.5 block text-sm font-bold tracking-wide text-paper">
                      100% Halal · Audited
                    </span>
                  </div>
                  <span
                    aria-hidden
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper text-base text-ink"
                  >
                    ✓
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
