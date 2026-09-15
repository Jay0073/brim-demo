"use client";

// A card in the bottom "all branches" carousel: address, hours, reviews where
// we have them, and directions. The whole card is selectable (click / keyboard)
// — selecting spins the globe, updates the compact card, and scrolls this card
// to centre. The active card is highlighted and lifted; the others sit back.
//
// The card degrades by what the branch actually has: no phone → no call button,
// no reviews → the address block carries the card, not open yet → a "Coming
// soon" state instead of reviews.

import { StorePhoto } from "./StorePhoto";
import { StarRating } from "./StarRating";
import { type Store, directionsUrl, mapsUrl } from "@/lib/locations";

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
  const comingSoon = store.status === "coming-soon";
  const reviews = store.reviews ?? [];

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
      className={`group relative flex w-[25rem] shrink-0 cursor-pointer flex-col overflow-hidden rounded-3xl bg-white outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brim sm:w-[34rem] ${
        active
          ? "scale-[1.015] shadow-2xl shadow-ink/15 ring-2 ring-brim"
          : "shadow-lg shadow-ink/5 ring-1 ring-ink/10 hover:scale-[1.01] hover:shadow-xl hover:shadow-ink/10"
      }`}
    >
      <div className="relative">
        <StorePhoto store={store} className="h-44 w-full" />
        {/* Kept dark: the name sits on the photograph. */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
          aria-hidden
        />
        <span className="absolute left-3 top-3 font-display text-xs tabular-nums text-paper/70">
          {String(index + 1).padStart(2, "0")}
        </span>
        {comingSoon && (
          <span className="absolute right-3 top-3 rounded-full bg-brim px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-ink">
            Coming soon
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
          <div className="min-w-0">
            <h3 className="truncate font-display text-xl uppercase leading-none text-paper">
              {store.name}
            </h3>
            <p className="mt-1 truncate text-xs text-paper/75">
              {store.neighborhood} · {store.city}
            </p>
          </div>
          {store.rating !== undefined && (
            <div className="shrink-0 rounded-xl bg-black/55 px-2.5 py-1.5 text-center ring-1 ring-white/15 backdrop-blur-sm">
              <span className="block font-display text-lg leading-none text-paper">
                {store.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* Address + hours — the one block every branch always has. */}
        <div className="border-b border-ink/10 pb-3">
          <p className="text-sm leading-relaxed text-ink/70">{store.address}</p>
          {store.hours && (
            <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-ink/45">
              {store.hours}
            </p>
          )}
        </div>

        {/* Middle band. Every card gives it the same flex-1 slot, so a branch
            with no review data centres a short message in exactly the space the
            two-review cards fill — no ragged void above the buttons. */}
        {comingSoon ? (
          <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-brim/15 text-lg" aria-hidden>
              🚧
            </span>
            <p className="mt-3 font-display text-lg uppercase leading-none text-ink">
              Opening soon
            </p>
            <p className="mt-2 max-w-[22rem] text-sm leading-relaxed text-ink/55">
              This branch is on the way. We&rsquo;ll announce the opening date
              before it lands — meanwhile your nearest trading store is above.
            </p>
          </div>
        ) : reviews.length > 0 ? (
          <div className="flex-1 pt-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-ink/45">
                Google reviews
              </h4>
              {store.reviewCount !== undefined && (
                <span className="text-[0.65rem] text-ink/45">
                  {store.reviewCount.toLocaleString()} total
                </span>
              )}
            </div>
            <ul className="mt-2.5 space-y-2">
              {reviews.slice(0, 2).map((review, i) => (
                <li key={i} className="rounded-xl bg-ink/[0.03] p-2.5 ring-1 ring-ink/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-ink text-[0.65rem] font-bold text-paper">
                      {review.author.charAt(0)}
                    </span>
                    <span className="text-xs font-semibold text-ink">
                      {review.author}
                    </span>
                    <span className="ml-auto text-[0.65rem] text-ink/45">
                      {review.relativeTime}
                    </span>
                  </div>
                  <StarRating
                    rating={review.rating}
                    size={11}
                    className="mt-1.5"
                    track="text-ink/15"
                  />
                  <p className="mt-1.5 text-xs leading-relaxed text-ink/65">
                    {review.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-ink/[0.06] text-lg" aria-hidden>
              ★
            </span>
            <p className="mt-3 font-display text-lg uppercase leading-none text-ink">
              One of our newer sites
            </p>
            <p className="mt-2 max-w-[22rem] text-sm leading-relaxed text-ink/55">
              We haven&rsquo;t pulled reviews for this branch yet. Tap through
              for the latest photos, hours and ratings on Google.
            </p>
          </div>
        )}

        <div className="mt-auto flex gap-2 pt-4">
          {store.phone ? (
            <a
              href={`tel:${store.phone.replace(/\s+/g, "")}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-brim hover:text-ink"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
              </svg>
              Call {store.phone}
            </a>
          ) : (
            <a
              href={mapsUrl(store)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-brim hover:text-ink"
            >
              View on Maps ↗
            </a>
          )}
          <a
            href={directionsUrl(store)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink/20 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink/50 hover:bg-ink/[0.04]"
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
