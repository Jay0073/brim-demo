"use client";

// Store photo with an on-brand fallback: a missing/broken image becomes the
// signature BRIM black/white stripes + wordmark (mirrors the real signage).
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
        className={`relative grid place-items-center overflow-hidden bg-black ${className}`}
      >
        <div className="brim-stripes absolute inset-0 opacity-95" />
        <div className="relative z-10 rounded-xl bg-black/80 px-4 py-2.5 text-center ring-1 ring-white/15">
          <span className="block font-display text-xl uppercase leading-none tracking-tight text-paper">
            Brim
          </span>
          <span className="mt-1 block text-[0.5rem] uppercase tracking-[0.3em] text-paper/70">
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
