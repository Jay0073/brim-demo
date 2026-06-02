"use client";

// Locations — cinematic + interactive:
//   • striped heading banner (the signature B/W diagonal frame),
//   • a big, centred globe with a white location pin on the selected branch,
//     and a compact "selected" card centred just beneath it,
//   • a branch index on the left,
//   • a full-width carousel of ALL branches below — Google reviews, Book a
//     table + directions.
// Hovering the index previews a branch (spins the globe, swaps the card,
// centres the carousel). Clicking the index or the compact card smooth-scrolls
// down to that branch's full card in the carousel.

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { smoothScrollTo } from "@/lib/scroll";
import { Globe, type GlobeMarker } from "./Globe";
import { StoreCompactCard } from "./StoreCompactCard";
import { StoreDetailCard } from "./StoreDetailCard";
import { STORES, REGIONS, storesIn, type Region } from "@/lib/locations";

type Filter = Region | "All";
const FILTERS: Filter[] = ["All", ...REGIONS];
const flagFor = (r: Region) => (r === "UK" ? "🇬🇧" : "🇵🇰");

export function LocationsExperience() {
  const root = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [activeId, setActiveId] = useState<string | null>(STORES[0]?.id ?? null);

  const stores = useMemo(() => storesIn(filter), [filter]);
  const markers = useMemo<GlobeMarker[]>(
    () => stores.map((s) => ({ id: s.id, lat: s.lat, lng: s.lng })),
    [stores],
  );
  const active = stores.find((s) => s.id === activeId) ?? null;

  function changeFilter(next: Filter) {
    setFilter(next);
    setActiveId(storesIn(next)[0]?.id ?? null);
  }

  // Open the full card: select + smooth-scroll the carousel into view.
  function openDetail(id: string) {
    setActiveId(id);
    smoothScrollTo(carouselRef.current);
  }

  // Centre the active branch within the carousel (horizontal only → never
  // fights Lenis' page scroll).
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !activeId) return;
    const card = track.querySelector<HTMLElement>(`[data-id="${activeId}"]`);
    if (!card) return;
    const t = track.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    track.scrollBy({ left: c.left + c.width / 2 - (t.left + t.width / 2), behavior: "smooth" });
  }, [activeId, stores]);

  // Entrance choreography (pre-paint via useGSAP layout effect → no flash).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".loc-band", { scaleX: 0, duration: 0.8, ease: "power3.inOut" })
          .from(".loc-eyebrow", { opacity: 0, y: 12, duration: 0.5 }, "-=0.5")
          .from(".loc-title", { yPercent: 60, opacity: 0, duration: 0.7 }, "-=0.55")
          .from(".loc-toggle", { opacity: 0, y: 10, duration: 0.5 }, "-=0.4")
          .from(".loc-globe", { opacity: 0, scale: 0.9, duration: 0.9, ease: "power2.out" }, "-=0.45")
          .from(".loc-index-item", { opacity: 0, x: -24, stagger: 0.07, duration: 0.5 }, "-=0.75")
          .from(".loc-aside", { opacity: 0, y: 24, duration: 0.6 }, "-=0.6")
          .from(".loc-carousel", { opacity: 0, y: 28, duration: 0.6 }, "-=0.4");
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative min-h-dvh overflow-hidden bg-ink text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[34%] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(210,220,240,0.10), transparent 60%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-28 sm:pt-32">
        {/* ── Striped heading banner ─────────────────────────────────── */}
        <header className="relative isolate flex flex-col items-center py-8 text-center">
          <div
            aria-hidden
            className="loc-band brim-stripes brim-stripes-drift absolute inset-x-0 top-1/2 h-24 -translate-y-1/2 opacity-90"
            style={{ transformOrigin: "center" }}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 top-1/2 h-24 -translate-y-1/2"
            style={{
              background:
                "linear-gradient(90deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.92) 26%, rgba(10,10,10,0.92) 74%, rgba(10,10,10,0) 100%)",
            }}
          />
          <p className="loc-eyebrow relative text-[0.6rem] font-bold uppercase tracking-[0.35em] text-brim sm:text-xs sm:tracking-[0.45em]">
            Locations · {STORES.length} stores · UK &amp; Pakistan
          </p>
          <h1 className="loc-title relative mt-3 font-display text-6xl uppercase leading-[0.82] text-paper [text-shadow:0_6px_40px_rgba(0,0,0,0.85)] sm:text-8xl">
            Find a Brim
          </h1>
        </header>

        {/* ── Region toggle ──────────────────────────────────────────── */}
        <div className="loc-toggle mt-2 flex justify-center">
          <div
            role="tablist"
            aria-label="Filter stores by region"
            className="glass-dark inline-flex rounded-full p-1"
          >
            {FILTERS.map((f) => {
              const on = filter === f;
              return (
                <button
                  key={f}
                  role="tab"
                  aria-selected={on}
                  onClick={() => changeFilter(f)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    on ? "bg-paper text-ink" : "text-paper/70 hover:text-paper"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Stage: index | globe | tilted glass card — vertically centred ── */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_minmax(0,20rem)] lg:items-center">
          {/* INDEX */}
          <nav className="order-2 lg:order-none" aria-label="Store directory">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-ash">
              Branches
            </p>
            <ul className="flex flex-col">
              {stores.map((s, i) => {
                const on = s.id === activeId;
                return (
                  <li key={s.id} className="loc-index-item">
                    <button
                      onMouseEnter={() => setActiveId(s.id)}
                      onFocus={() => setActiveId(s.id)}
                      onClick={() => openDetail(s.id)}
                      aria-pressed={on}
                      className={`group relative flex w-full items-center gap-3 border-l-2 py-3 pl-4 pr-2 text-left transition-all ${
                        on
                          ? "border-brim bg-white/[0.04]"
                          : "border-white/10 hover:border-white/40 hover:bg-white/[0.02]"
                      }`}
                    >
                      <span
                        className={`font-display text-xs tabular-nums ${
                          on ? "text-brim" : "text-ash/50"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate font-display text-lg leading-tight transition-colors ${
                            on ? "text-paper" : "text-paper/80 group-hover:text-paper"
                          }`}
                        >
                          {s.name}
                        </span>
                        <span className="block truncate text-xs text-ash">
                          {s.city} <span aria-hidden>{flagFor(s.region)}</span> · ★{" "}
                          {s.rating.toFixed(1)}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className={`text-brim transition-all ${
                          on
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-1 opacity-0 group-hover:opacity-60"
                        }`}
                      >
                        →
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* GLOBE (centre) */}
          <div className="loc-globe order-1 lg:order-none">
            <Globe
              markers={markers}
              focusId={activeId}
              className="mx-auto w-full max-w-2xl"
            />
            <p aria-live="polite" className="mt-1 text-center text-sm text-ash">
              {active ? (
                <>
                  Pointing at{" "}
                  <span className="font-semibold text-paper">{active.name}</span> ·{" "}
                  {active.city}
                </>
              ) : (
                "Drag to spin the globe"
              )}
            </p>
          </div>

          {/* COMPACT GLASS CARD (right) — slightly tilted toward the globe */}
          <div className="loc-aside order-3 lg:order-none lg:[perspective:1400px]">
            {active && (
              <div className="transition-transform duration-500 lg:[transform:rotateY(-9deg)] lg:hover:[transform:rotateY(0deg)]">
                <StoreCompactCard
                  key={active.id}
                  store={active}
                  onOpen={() => smoothScrollTo(carouselRef.current)}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Carousel: all branches + reviews ───────────────────────── */}
        <section ref={carouselRef} className="loc-carousel mt-16 scroll-mt-24" aria-label="All branches">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brim">
                Every Brim
              </p>
              <h2 className="mt-1 font-display text-2xl uppercase leading-none text-paper sm:text-3xl">
                Browse the branches
              </h2>
            </div>
            <p className="hidden text-xs text-ash sm:block">
              Tap a card · scroll for more →
            </p>
          </div>
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {stores.map((s, i) => (
              <div key={s.id} data-id={s.id} className="snap-center">
                <StoreDetailCard
                  store={s}
                  index={i}
                  active={s.id === activeId}
                  onSelect={() => setActiveId(s.id)}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
