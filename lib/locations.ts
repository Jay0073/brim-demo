// ─────────────────────────────────────────────────────────────────────────
//  Locations — types, typed views over data/locations.json, and Google Maps
//  link helpers.
//
//  The DATA lives in `data/locations.json`. This module is the typed gateway:
//  it casts the raw JSON onto the interfaces below and exposes helpers that
//  build directions / search / embed URLs. Components import from here, never
//  from the JSON directly — types and URL logic stay in one place.
//
//  Reviews are curated demo data (no live Google Places call — this is a static
//  export). To go live later, swap STORES for a fetched source and keep the
//  same Store shape; the components don't care where the data comes from.
// ─────────────────────────────────────────────────────────────────────────

import locationData from "@/data/locations.json";

export type Region = "UK" | "Pakistan";

export interface Review {
  author: string;
  /** 1–5 whole stars. */
  rating: number;
  /** Human relative time, e.g. "2 weeks ago". */
  relativeTime: string;
  text: string;
}

export interface Store {
  id: string;
  name: string;
  /** Street / area shown under the name, e.g. "Shoreditch High St". */
  neighborhood: string;
  city: string;
  country: string;
  region: Region;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  /** Opening hours, pre-formatted for display. */
  hours: string;
  /** Free-text query used for the "View on Google Maps" search link. */
  placeQuery: string;
  /** Storefront / hero photo (remote, swap for /public asset when you have one). */
  image: string;
  /** Average star rating, one decimal. */
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

// ── Typed views over the JSON data object ─────────────────────────────────
// JSON can't carry literal unions (`region` reads back as `string`), so we
// assert the imported shape onto the interfaces above. Keep data/locations.json
// in step when editing.
export const STORES = locationData.stores as unknown as Store[];

/** Region filter values, in display order (used by the toggle). */
export const REGIONS: Region[] = ["UK", "Pakistan"];

/** Stores in a region, or all of them when passed "All". */
export function storesIn(region: Region | "All"): Store[] {
  return region === "All" ? STORES : STORES.filter((s) => s.region === region);
}

/** Deep link that opens turn-by-turn directions to the store. */
export function directionsUrl(store: Store): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;
}

/** Opens the store's Google Maps place page (ratings, photos, hours). */
export function mapsUrl(store: Store): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    store.placeQuery,
  )}`;
}

/** Keyless embeddable Google map centred on the store (for an <iframe>). */
export function mapEmbedUrl(store: Store): string {
  return `https://maps.google.com/maps?q=${store.lat},${store.lng}&z=15&output=embed`;
}
