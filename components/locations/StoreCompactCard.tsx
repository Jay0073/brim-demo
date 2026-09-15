"use client";

// Compact "selected branch" card, centred under the globe: photo + name +
// rating, with a Maps link. No "Book a table" here (that lives on the detailed
// carousel cards). The whole card is clickable — clicking scrolls down to this
// branch's full card (reviews + booking) in the carousel.
//
// Branches without a rating (the newer sites) simply render without the badge,
// and a branch that hasn't opened yet gets a "Coming soon" chip instead.

import { StorePhoto } from "./StorePhoto";
import { StarRating } from "./StarRating";
import { type Store, mapsUrl } from "@/lib/locations";

export function StoreCompactCard({
  store,
  onOpen,
}: {
  store: Store;
  onOpen?: () => void;
}) {
  const comingSoon = store.status === "coming-soon";

  return (
    <article
      onClick={onOpen}
      role="button"
      tabIndex={0}
      aria-label={`${store.name} — see details`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen?.();
        }
      }}
      className="animate-fade group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-xl shadow-ink/10 outline-none ring-1 ring-ink/10 transition-shadow hover:shadow-2xl hover:shadow-ink/15 focus-visible:ring-2 focus-visible:ring-ink"
    >
      <div className="relative">
        <StorePhoto store={store} className="aspect-[4/3] w-full" />
        {/* Kept dark: the name sits on the photograph. */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
          aria-hidden
        />
        {comingSoon && (
          <span className="absolute left-4 top-4 rounded-full bg-brim px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink">
            Coming soon
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
          <div className="min-w-0">
            <h3 className="truncate font-display text-2xl uppercase leading-none text-paper sm:text-3xl">
              {store.name}
            </h3>
            <p className="mt-1.5 truncate text-sm text-paper/80">
              {store.neighborhood} · {store.city}
            </p>
          </div>
          {store.rating !== undefined && (
            <div className="shrink-0 rounded-2xl bg-black/55 px-3 py-2 text-center ring-1 ring-white/15 backdrop-blur-sm">
              <span className="block font-display text-2xl leading-none text-paper">
                {store.rating.toFixed(1)}
              </span>
              <StarRating rating={store.rating} size={11} className="mt-1 justify-center" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 p-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-ink/50 transition-colors group-hover:text-ink">
          {comingSoon ? "See details" : "See reviews"}
          <span aria-hidden className="transition-transform group-hover:translate-y-0.5">
            ↓
          </span>
        </span>
        <a
          href={mapsUrl(store)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ink/20 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink/50 hover:bg-ink/[0.04]"
        >
          Maps ↗
        </a>
      </div>
    </article>
  );
}
