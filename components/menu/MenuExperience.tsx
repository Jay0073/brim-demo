"use client";

// Interactive menu. Category pills are SCROLL navigation (smooth-scroll +
// scrollspy) so nothing is hidden — you browse the whole menu by scrolling.
// Search + dietary chips are the real filters. Search is ranked (best matches
// float up within each section). "Surprise me" jumps to a random item.
import { useEffect, useMemo, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { MENU, DIET_FILTERS, rankMenu, type DietTag } from "@/lib/menu";
import { MenuItemCard } from "./MenuItemCard";
import { BrimSpotlight } from "./BrimSpotlight";
import { SizeGuide } from "./SizeGuide";
import { BuildYourOwn } from "./BuildYourOwn";
import { CartButton } from "@/components/cart/CartButton";

export function MenuExperience() {
  const lenis = useLenis();
  const [query, setQuery] = useState("");
  const [diets, setDiets] = useState<DietTag[]>([]);
  const [activeId, setActiveId] = useState(MENU[0].id);
  const [surprise, setSurprise] = useState<string | null>(null);

  const barRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const startedFiltering = useRef(false);
  const deepLinkDone = useRef(false);

  const isFiltering = query.trim() !== "" || diets.length > 0;

  // Ranked, synonym-aware, typo-tolerant search + dietary chips (see lib/menu).
  const sections = useMemo(() => rankMenu(query, diets), [query, diets]);

  const visibleSections = sections.filter((c) => c.filtered.length > 0);
  const visibleIds = new Set(visibleSections.map((c) => c.id));
  const total = visibleSections.reduce((n, c) => n + c.filtered.length, 0);

  // Offset so a scrolled-to header lands just below the sticky bar.
  const scrollOffset = () => -((barRef.current?.offsetHeight ?? 96) + 92);

  function scrollToEl(el: Element | null) {
    if (!el) return;
    if (lenis) lenis.scrollTo(el as HTMLElement, { offset: scrollOffset(), duration: 1.05 });
    else (el as HTMLElement).scrollIntoView({ behavior: "smooth" });
  }

  function goToCategory(id: string) {
    setActiveId(id);
    scrollToEl(document.getElementById(`cat-${id}`));
  }

  // Scrollspy: highlight the pill of whichever section is up top.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        const id = top?.target.getAttribute("data-cat");
        if (id) setActiveId(id);
      },
      {
        rootMargin: `-${(barRef.current?.offsetHeight ?? 96) + 96}px 0px -55% 0px`,
        threshold: 0,
      }
    );
    document.querySelectorAll("[data-cat]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [visibleSections.length]);

  // When a filter first kicks in, pull the user up to the results.
  useEffect(() => {
    if (isFiltering && !startedFiltering.current) {
      startedFiltering.current = true;
      scrollToEl(topRef.current);
    } else if (!isFiltering) {
      startedFiltering.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFiltering]);

  // Deep link from the landing-page "Specials": /menu?item=<slug> opens the
  // menu and scrolls to that item, flashing the same highlight as "Surprise me".
  // Wait for Lenis (warm from the root provider) so the smooth scroll lands true.
  useEffect(() => {
    if (deepLinkDone.current || !lenis) return;
    const slug = new URLSearchParams(window.location.search).get("item");
    const exists = !!slug && MENU.some((c) => c.items.some((it) => it.slug === slug));
    deepLinkDone.current = true;
    if (!exists) return;
    const toItem = setTimeout(() => {
      setSurprise(slug);
      scrollToEl(document.getElementById(`item-${slug}`));
    }, 160);
    const clear = setTimeout(() => setSurprise(null), 2600);
    return () => {
      clearTimeout(toItem);
      clearTimeout(clear);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenis]);

  const toggleDiet = (d: DietTag) =>
    setDiets((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const clearAll = () => {
    setQuery("");
    setDiets([]);
  };

  function surpriseMe() {
    const all = MENU.flatMap((c) => c.items);
    const pick = all[Math.floor(Math.random() * all.length)];
    setQuery("");
    setDiets([]);
    setSurprise(pick.slug);
    setTimeout(() => scrollToEl(document.getElementById(`item-${pick.slug}`)), 60);
    setTimeout(() => setSurprise(null), 2400);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* ── Sticky control bar (opaque + compact) ────────────────────────── */}
      <div
        ref={barRef}
        className="sticky top-20 z-30 -mx-4 border-b border-white/10 bg-black/90 px-4 py-2.5 backdrop-blur-md sm:-mx-6 sm:px-6"
      >
        <div className="flex flex-col gap-2.5">
          {/* Search + surprise */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-paper/40"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.2-3.2" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                aria-label="Search the menu"
                placeholder="Search “spicy”, “cheesy”, “veggie”, “shake”…"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-paper outline-none placeholder:text-paper/35 focus:border-white/35"
              />
            </div>
            <button
              onClick={surpriseMe}
              className="shrink-0 rounded-xl bg-white/[0.06] px-3.5 text-sm font-semibold uppercase tracking-wide text-paper ring-1 ring-white/10 transition-colors hover:bg-brim hover:text-ink hover:ring-brim sm:px-4"
            >
              🎲<span className="ml-1.5 hidden sm:inline">Surprise me</span>
            </button>
          </div>

          {/* Category pills — scroll navigation */}
          <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 [scrollbar-width:none]">
            {MENU.map((c) => {
              const active = activeId === c.id;
              const empty = !visibleIds.has(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => goToCategory(c.id)}
                  disabled={empty}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold uppercase tracking-wide transition-colors ${
                    active
                      ? "bg-paper text-ink"
                      : empty
                      ? "cursor-not-allowed text-paper/20"
                      : "bg-white/[0.05] text-paper/60 hover:bg-white/10 hover:text-paper"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* Dietary chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {DIET_FILTERS.map((f) => {
              const active = diets.includes(f.id);
              return (
                <button
                  key={f.id}
                  onClick={() => toggleDiet(f.id)}
                  aria-pressed={active}
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    active
                      ? "bg-brim text-ink"
                      : "text-paper/55 ring-1 ring-white/15 hover:text-paper hover:ring-white/40"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
            {isFiltering && (
              <span className="ml-auto flex items-center gap-3 text-xs">
                <span className="font-medium text-paper/45">
                  {total} {total === 1 ? "result" : "results"}
                </span>
                <button
                  onClick={clearAll}
                  className="font-semibold uppercase tracking-wide text-paper/55 underline-offset-2 hover:text-paper hover:underline"
                >
                  Clear all
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cart entry — the "cart option" at the top of the menu, just below the
          category/filter controls. Opens the slide-over drawer. */}
      <div className="flex items-center justify-end pt-4">
        <CartButton
          showLabel
          className="rounded-full bg-white/[0.06] px-4 py-2 text-paper ring-1 ring-white/10 transition-colors hover:bg-brim hover:text-ink hover:ring-brim"
        />
      </div>

      <div ref={topRef} />

      {/* ── Results ──────────────────────────────────────────────────────── */}
      {total === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-4xl uppercase text-paper">Nothing on the grill</p>
          <p className="mt-3 text-paper/55">
            No bites match{query ? ` “${query}”` : " those filters"}. Try “cheesy”
            or “spicy”.
          </p>
          <button
            onClick={clearAll}
            className="mt-6 rounded-full bg-paper px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-brim"
          >
            Reset the menu
          </button>
        </div>
      ) : (
        <div className="space-y-16 py-10 sm:py-14">
          {visibleSections.map((cat) => (
            <section
              key={cat.id}
              id={`cat-${cat.id}`}
              data-cat={cat.id}
              className="scroll-mt-44"
            >
              <header className="mb-6">
                <div className="flex items-end justify-between gap-4">
                  <h2 className="font-display text-4xl uppercase leading-none text-paper sm:text-6xl">
                    {cat.name}
                  </h2>
                  <span className="shrink-0 pb-1 text-sm font-medium text-paper/40">
                    {cat.filtered.length}{" "}
                    {cat.filtered.length === 1 ? "item" : "items"}
                  </span>
                </div>
                <div className="mt-3 h-1 w-16 rounded-full bg-brim" />
                <p className="mt-3 text-paper/55">{cat.tagline}</p>
              </header>

              {cat.id === "burgers" && !isFiltering && (
                <div className="mb-6">
                  <SizeGuide />
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cat.filtered.map((it) => (
                  <div
                    key={it.slug}
                    id={`item-${it.slug}`}
                    className={`rounded-3xl transition-all duration-300 ${
                      it.featured ? "sm:col-span-2" : ""
                    } ${surprise === it.slug ? "ring-4 ring-brim ring-offset-2 ring-offset-black" : ""}`}
                  >
                    {it.slug === "brim-burger" ? (
                      <BrimSpotlight item={it} />
                    ) : (
                      <MenuItemCard item={it} />
                    )}
                  </div>
                ))}
              </div>

              {/* {cat.id === "burgers" && !isFiltering && (
                <div className="mt-6">
                  <BuildYourOwn />
                </div>
              )} */}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
