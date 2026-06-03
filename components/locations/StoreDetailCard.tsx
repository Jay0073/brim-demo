"use client";

// A card in the bottom "all branches" carousel. Holds the Google reviews + Get
// directions. The whole card is selectable (click / keyboard) — selecting spins
// the globe, updates the compact card, and scrolls this card to centre. The
// active card is highlighted and lifted; the others dim back.

import { StorePhoto } from "./StorePhoto";
import { StarRating } from "./StarRating";
import { type Store, directionsUrl } from "@/lib/locations";

const flagFor = (region: Store["region"]) => (region === "UK" ? "🇬🇧" : "🇵🇰");

export function StoreDetailCard({
  store,
  active,
  index,
  onSelect,
}: {
  store: Store;
  active: boolean;
  index: number;
  onSelect: () => void;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      aria-pressed={active}
      aria-label={`${store.name}, ${store.city}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group relative w-[25rem] shrink-0 cursor-pointer overflow-hidden rounded-3xl bg-ink-soft shadow-xl shadow-black/20 outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brim sm:w-[34rem] ${
        active
          ? "scale-[1.015] shadow-2xl shadow-black/40 ring-2 ring-brim"
          : "hover:scale-[1.01]"
      }`}
    >
      <div className="relative">
        <StorePhoto store={store} className="h-44 w-full" />
        <div
          className="brim-stripes-fine absolute inset-x-0 top-0 z-10 h-1.5 opacity-90"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink-soft via-ink-soft/25 to-transparent"
          aria-hidden
        />
        <span className="absolute left-3 top-3 font-display text-xs tabular-nums text-paper/55">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
          <div className="min-w-0">
            <h3 className="truncate font-display text-xl uppercase leading-none text-paper">
              {store.name}
            </h3>
            <p className="mt-1 truncate text-xs text-paper/70">
              {store.neighborhood} · {store.city}{" "}
              <span aria-hidden>{flagFor(store.region)}</span>
            </p>
          </div>
          <div className="shrink-0 rounded-xl bg-black/55 px-2.5 py-1.5 text-center ring-1 ring-white/10 backdrop-blur-sm">
            <span className="block font-display text-lg leading-none text-paper">
              {store.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Reviews — every review in full (no truncation). Dark, on the dark
          card; the WHITE backdrop lives behind the card (the carousel panel). */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-ash">
            Google reviews
          </h4>
          <span className="text-[0.65rem] text-ash">
            {store.reviewCount.toLocaleString()} total
          </span>
        </div>
        <ul className="mt-2.5 space-y-2">
          {store.reviews.slice(0, 2).map((review, i) => (
            <li key={i} className="rounded-xl bg-white/[0.03] p-2.5">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-white/10 text-[0.65rem] font-bold text-paper">
                  {review.author.charAt(0)}
                </span>
                <span className="text-xs font-semibold text-paper">
                  {review.author}
                </span>
                <span className="ml-auto text-[0.65rem] text-ash">
                  {review.relativeTime}
                </span>
              </div>
              <StarRating rating={review.rating} size={11} className="mt-1.5" />
              <p className="mt-1.5 text-xs leading-relaxed text-paper/70">
                {review.text}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex gap-2">
          <a
            href={`tel:${store.phone.replace(/\s+/g, "")}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-paper px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" />
            </svg>
            Book a table
          </a>
          <a
            href={directionsUrl(store)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/20 px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:border-white hover:text-white"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M21.7 11.3l-9-9a1 1 0 0 0-1.4 0l-9 9a1 1 0 0 0 0 1.4l9 9a1 1 0 0 0 1.4 0l9-9a1 1 0 0 0 0-1.4zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5z" />
            </svg>
            Directions
          </a>
        </div>
      </div>
    </article>
  );
}
