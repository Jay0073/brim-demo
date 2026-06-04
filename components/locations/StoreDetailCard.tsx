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
      className={`group relative flex flex-col md:flex-row w-[21rem] sm:w-[25rem] md:w-[48rem] h-[550px] md:h-[460px] shrink-0 cursor-pointer overflow-hidden rounded-[2rem] bg-[#0c0c0c] border transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-brim ${
        active
          ? "scale-[1.015] border-brim shadow-[0_20px_45px_rgba(0,0,0,0.18)] ring-1 ring-brim z-10"
          : "border-white/10 opacity-70 hover:opacity-100 hover:scale-[1.01] hover:shadow-[0_15px_30px_rgba(0,0,0,0.12)] hover:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
      }`}
    >
      {/* LEFT SIDE: Store Photo & Overlays (42% on desktop, full-width on mobile) */}
      <div className="relative h-48 sm:h-56 md:h-full md:w-[42%] shrink-0 overflow-hidden">
        <StorePhoto store={store} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div
          className="brim-stripes-fine absolute inset-x-0 top-0 z-10 h-1.5 opacity-90"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-black/35 to-transparent z-10"
          aria-hidden
        />
        
        {/* Floating index badge on top left */}
        <span className="absolute left-4 top-4 z-20 rounded-lg bg-black/60 px-2.5 py-1 font-display text-[0.65rem] tracking-wider tabular-nums text-paper/60 backdrop-blur-md border border-white/5">
          BRANCH {String(index + 1).padStart(2, "0")}
        </span>

        {/* Floating high-contrast rating badge on top right */}
        <div className="absolute right-4 top-4 z-20 flex flex-col items-center justify-center rounded-xl bg-black/65 px-3 py-2.5 text-center border border-white/10 backdrop-blur-md shadow-lg shadow-black/40">
          <span className="block font-display text-xl font-extrabold leading-none text-white">
            {store.rating.toFixed(1)}
          </span>
          <StarRating rating={store.rating} size={11} className="mt-1.5 justify-center" />
        </div>

        {/* Text information overlays at bottom of photo (mobile) / left-aligned on image (desktop) */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-5">
          <h3 className="font-display text-2xl uppercase leading-[0.9] text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.5)] md:text-3xl">
            {store.name}
          </h3>
          <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-paper/85 flex items-center gap-1.5">
            {store.neighborhood} · {store.city} <span aria-hidden className="text-sm">{flagFor(store.region)}</span>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Reviews, Phone, and Directions (58% on desktop) */}
      <div className="flex flex-1 flex-col justify-between p-5 md:p-6 md:h-full overflow-hidden bg-[#0c0c0c] relative">
        
        {/* Reviews Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-ash/80">
              Google Reviews
            </h4>
            <span className="text-[0.65rem] font-semibold text-ash/80 bg-white/5 px-2 py-0.5 rounded-full">
              {store.reviewCount.toLocaleString()} reviews
            </span>
          </div>

          {/* Scrolling Reviews Container with Vertical Gradient Mask */}
          <div 
            data-lenis-prevent
            className="flex-1 overflow-y-auto pr-1 py-3 space-y-3 mt-1.5 scrollbar-thin [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{
              maskImage: "linear-gradient(to bottom, transparent, black 16px, black calc(100% - 16px), transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 16px, black calc(100% - 16px), transparent)"
            }}
          >
            {store.reviews.slice(0, 3).map((review, i) => (
              <div key={i} className="rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.03] p-3 transition-colors duration-300">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-full bg-brim/15 text-[0.65rem] font-bold text-brim border border-brim/10">
                    {review.author.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <span className="block text-xs font-semibold text-white truncate">
                      {review.author}
                    </span>
                    <span className="block text-[0.6rem] text-ash/70 leading-none mt-0.5">
                      {review.relativeTime}
                    </span>
                  </div>
                  <div className="ml-auto shrink-0 flex items-center gap-1">
                    <span className="text-xs font-display text-white">{review.rating}</span>
                    <StarRating rating={review.rating} size={9} />
                  </div>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-neutral-300 font-sans tracking-wide">
                  "{review.text}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons Action bar */}
        <div className="mt-4 flex gap-3 shrink-0 pt-3 border-t border-white/5">
          <a
            href={`tel:${store.phone.replace(/\s+/g, "")}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-neutral-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-white hover:bg-white/5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M21.7 11.3l-9-9a1 1 0 0 0-1.4 0l-9 9a1 1 0 0 0 0 1.4l9 9a1 1 0 0 0 1.4 0l9-9a1 1 0 0 0 0-1.4zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5z" />
            </svg>
            Directions
          </a>
        </div>
      </div>
    </article>
  );
}
