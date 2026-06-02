"use client";

// Compact "selected branch" card, centred under the globe: photo + name +
// rating, with a Maps link. No "Book a table" here (that lives on the detailed
// carousel cards). The whole card is clickable — clicking scrolls down to this
// branch's full card (reviews + booking) in the carousel.

import { StorePhoto } from "./StorePhoto";
import { StarRating } from "./StarRating";
import { type Store, mapsUrl } from "@/lib/locations";

const flagFor = (region: Store["region"]) => (region === "UK" ? "🇬🇧" : "🇵🇰");

export function StoreCompactCard({
  store,
  onOpen,
}: {
  store: Store;
  onOpen?: () => void;
}) {
  return (
    <article
      onClick={onOpen}
      role="button"
      tabIndex={0}
      aria-label={`${store.name} — see reviews`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen?.();
        }
      }}
      className="glass-dark animate-fade group cursor-pointer overflow-hidden rounded-3xl shadow-2xl shadow-black/50 outline-none transition-colors hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-white"
    >
      <div className="relative">
        <StorePhoto store={store} className="aspect-[16/10] w-full" />
        <div
          className="brim-stripes-fine absolute inset-x-0 top-0 h-1.5 opacity-90"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink-soft via-ink-soft/30 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
          <div className="min-w-0">
            <h3 className="truncate font-display text-2xl uppercase leading-none text-paper sm:text-3xl">
              {store.name}
            </h3>
            <p className="mt-1.5 truncate text-sm text-paper/75">
              {store.neighborhood} · {store.city}{" "}
              <span aria-hidden>{flagFor(store.region)}</span>
            </p>
          </div>
          <div className="shrink-0 rounded-2xl bg-black/55 px-3 py-2 text-center ring-1 ring-white/10 backdrop-blur-sm">
            <span className="block font-display text-2xl leading-none text-paper">
              {store.rating.toFixed(1)}
            </span>
            <StarRating rating={store.rating} size={11} className="mt-1 justify-center" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 p-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-ash transition-colors group-hover:text-paper">
          See reviews
          <span aria-hidden className="transition-transform group-hover:translate-y-0.5">
            ↓
          </span>
        </span>
        <a
          href={mapsUrl(store)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:border-brim hover:text-brim"
        >
          Maps ↗
        </a>
      </div>
    </article>
  );
}
