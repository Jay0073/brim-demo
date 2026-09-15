"use client";

// Store photo with an on-brand fallback: a missing/broken image becomes a plain
// ink panel carrying the wordmark. It stays dark because the card's name label
// sits on top of it and needs the contrast — but the diagonal stripes are gone,
// so it reads as a quiet placeholder rather than a second background pattern.
// Remote (Google) URLs and local /public paths both go through asset() so they
// resolve under the GitHub-Pages basePath in production.

import { useState } from "react";
import { asset } from "@/lib/asset";
import type { Store } from "@/lib/locations";

export function StorePhoto({
  store,
  className = "",
}: {
  store: Store;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!store.image || failed) {
    return (
      <div
        aria-hidden
        className={`relative grid place-items-center overflow-hidden bg-ink ${className}`}
      >
        <div className="relative z-10 text-center">
          <span className="block font-display text-2xl uppercase leading-none tracking-tight text-paper/90">
            Brim
          </span>
          <span className="mt-1.5 block text-[0.5rem] uppercase tracking-[0.3em] text-paper/45">
            Big Juicy Burgers
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={asset(store.image)}
      alt={`${store.name} storefront`}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
