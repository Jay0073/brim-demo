"use client";

// Brim Burger "spotlight" — a side slide-over popup that opens INSTEAD of
// navigating to the detail page, but ONLY for the Brim Burger. It mirrors the
// concept mock: gallery + thumbnails, Halal/Mild badges, nutrition cards and
// allergen chips. Every other menu item still links to its normal detail page.
//
// Trigger: the card is a <Link> to /menu/<slug>; we intercept clicks in the
// CAPTURE phase (so it beats the Link's own handler) and open the panel.

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { asset } from "@/lib/asset";
import { priceOf, formatGBP } from "@/lib/pricing";
import type { MenuItem } from "@/lib/menu";
import { isHalal } from "@/lib/menu-extras";
import { MenuItemCard } from "./MenuItemCard";

const BREAKDOWN = "/detaileburger.png";
const ALLERGEN_ICON: Record<string, string> = {
  Gluten: "🌾",
  Milk: "🥛",
  Soya: "🫘",
  Egg: "🥚",
  Mustard: "🟡",
};

export function BrimSpotlight({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false);

  function onCardClickCapture(e: React.MouseEvent) {
    e.preventDefault(); // stop the Link from navigating to the detail page
    setOpen(true);
  }

  return (
    <>
      <div onClickCapture={onCardClickCapture} className="contents">
        <MenuItemCard item={item} />
      </div>
      <SpotlightDrawer item={item} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function SpotlightDrawer({
  item,
  open,
  onClose,
}: {
  item: MenuItem;
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const unit = priceOf(item.slug);
  const images = [
    ...(item.image ? [{ src: item.image, contain: false, label: item.name }] : []),
    { src: BREAKDOWN, contain: true, label: "What's inside" },
  ];

  // Esc to close and lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // "Cards moving" — stagger the content in each time the panel opens.
  useGSAP(
    () => {
      if (!open) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-stagger]", {
        opacity: 0,
        y: 26,
        duration: 0.5,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.12,
      });
    },
    { scope: panelRef, dependencies: [open] }
  );

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        role="dialog"
        inert={!open}
        aria-hidden={!open}
        aria-modal="true"
        aria-label={`${item.name} details`}
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-lg flex-col bg-paper text-ink shadow-2xl ring-1 ring-ink/10 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Brand stripe edge down the panel's left seam. */}
        <div aria-hidden className="brim-stripes-fine absolute inset-y-0 left-0 w-1.5 opacity-70" />
        {/* Header: BRIM logo + Halal mark (side by side) · close */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            {/* Logo artwork is white — invert it to black on the light panel. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/brim-logo.svg")} alt="BRIM" className="h-6 w-auto [filter:invert(1)]" />
            {isHalal(item) && <><span className="h-6 w-px bg-ink/15" aria-hidden />
            {/* Halal artwork is black — reads as-is on the light panel. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/halal.svg")} alt="Halal certified" className="h-7 w-7" /></>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-11 w-11 place-items-center rounded-full text-ink/55 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6">
          {/* Gallery: thumbnail strip + big (dark) image with Halal/Mild badges */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row" data-stagger>
            <div className="flex gap-2 sm:flex-col">
              {images.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`View ${img.label}`}
                  className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white ring-2 transition ${
                    i === active ? "ring-brim" : "ring-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(img.src)} alt="" className={`h-full w-full ${img.contain ? "object-contain p-1" : "object-contain"}`} />
                </button>
              ))}
            </div>

            <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl bg-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(images[active].src)}
                alt={item.name}
                className={`aspect-[4/3] w-full ${images[active].contain ? "object-contain p-3" : "object-contain"}`}
              />
              <div className="absolute right-3 top-3 flex flex-col items-center gap-2">
                {isHalal(item) && (
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-lg ring-1 ring-black/5" title="Halal certified">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset("/halal.svg")} alt="Halal certified" className="h-7 w-7" />
                  </span>
                )}
                {item.heat && (
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-lg ring-1 ring-black/5" title={`${item.heat} heat`}>
                    <span className="text-[0.55rem] font-bold uppercase leading-none tracking-wide text-ink">
                      {item.heat}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Title + price */}
          <div className="mt-5 flex flex-wrap items-start justify-between gap-3" data-stagger>
            <div>
              {item.badge && (
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-brim-deep">{item.badge}</p>
              )}
              <h2 className="mt-1 font-display text-4xl uppercase leading-[0.9]">{item.name}</h2>
            </div>
            <span className="shrink-0 font-display text-3xl leading-none">{formatGBP(unit)}</span>
          </div>

          {item.description && (
            <p className="mt-3 text-sm leading-relaxed text-ink/60" data-stagger>
              {item.description}
            </p>
          )}

          {/* Nutrition cards */}
          {item.nutrition && (
            <div className="mt-5 grid grid-cols-2 gap-2 min-[480px]:grid-cols-4">
              {[
                { v: item.nutrition.calories, l: "Calories" },
                { v: item.nutrition.protein, l: "Protein" },
                { v: item.nutrition.carbs, l: "Carbs" },
                { v: item.nutrition.fat, l: "Fat" },
              ].map((n) => (
                <div
                  key={n.l}
                  data-stagger
                  className="rounded-xl bg-white p-3 text-center ring-1 ring-ink/10"
                >
                  <span className="block font-display text-xl leading-none text-ink">{n.v}</span>
                  <span className="mt-1 block text-[0.55rem] font-semibold uppercase tracking-wider text-ink/50">
                    {n.l}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink/50" data-stagger>
                Allergens
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {item.allergens.map((a) => (
                  <li
                    key={a}
                    data-stagger
                    className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-ink/10"
                  >
                    <span aria-hidden className="text-sm leading-none">
                      {ALLERGEN_ICON[a] ?? "•"}
                    </span>
                    <span className="text-xs font-medium text-ink/70">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer: the standing product promise — nothing to order from here. */}
        <div className="border-t border-ink/10 px-5 py-4">
          <p className="text-center text-xs text-ink/45">
            {isHalal(item) ? "Strictly Halal · Smashed to order · Never frozen" : "Made to enjoy"}
          </p>
        </div>
      </aside>
    </>
  );
}
