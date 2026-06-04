"use client";

// Product image gallery for the detail page. A horizontal slide track you move
// with arrows, dots or thumbnails — used to flip the main burger shot over to
// its "what's inside" breakdown. Falls back to a plain single image (no
// controls) when an item only has one picture. Pure solid-black theme.
import { useState } from "react";
import { asset } from "@/lib/asset";
import { HalalMark } from "./HalalBadge";

export interface GalleryImage {
  src: string;
  /** Show the whole image (letterboxed) instead of cropping to fill. */
  contain?: boolean;
}

export function ProductGallery({
  images,
  alt,
  badge,
  halal = false,
  heat = null,
}: {
  images: GalleryImage[];
  alt: string;
  badge?: string;
  halal?: boolean;
  heat?: string | null;
}) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const go = (i: number) => setIndex((i + count) % count);

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      {/* Viewport */}
      <div className="group relative aspect-square overflow-hidden rounded-3xl bg-white/[0.03] ring-1 ring-white/10">
        {count === 0 ? (
          <div className="grid h-full w-full place-items-center">
            <span className="font-display text-9xl uppercase text-paper/10">
              {alt.charAt(0)}
            </span>
          </div>
        ) : (
          <div
            className="flex h-full w-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {images.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={asset(img.src)}
                alt={i === 0 ? alt : `${alt} — what's inside`}
                draggable={false}
                className={`h-full w-full shrink-0 ${
                  img.contain ? "bg-white/[0.02] object-contain p-3" : "object-cover"
                }`}
              />
            ))}
          </div>
        )}

        {badge && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-brim px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink shadow-lg shadow-black/30">
            {badge}
          </span>
        )}

        {/* Halal + heat marks, stacked top-right (matches the spotlight). */}
        {(halal || heat) && (
          <div className="absolute right-4 top-4 z-10 flex flex-col items-center gap-2">
            {halal && <HalalMark />}
            {heat && (
              <span
                className="grid h-12 w-12 place-items-center rounded-full bg-paper shadow-lg ring-1 ring-black/10"
                title={`${heat} heat`}
              >
                <span className="text-[0.55rem] font-bold uppercase leading-none tracking-wide text-ink">
                  {heat}
                </span>
              </span>
            )}
          </div>
        )}

        {count > 1 && (
          <>
            {/* Arrows — always visible on touch, reveal on hover on desktop */}
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-paper ring-1 ring-white/15 backdrop-blur transition-all hover:bg-black/80 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-paper ring-1 ring-white/15 backdrop-blur transition-all hover:bg-black/80 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <Chevron dir="right" />
            </button>

            {/* Dots */}
            <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === index}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-5 bg-paper" : "w-2 bg-paper/30 hover:bg-paper/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              className={`relative h-16 w-16 overflow-hidden rounded-xl bg-white/5 ring-2 transition-all ${
                i === index ? "ring-brim" : "ring-transparent hover:ring-white/25"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(img.src)}
                alt=""
                className={`h-full w-full ${img.contain ? "bg-white/[0.03] object-contain p-1" : "object-cover"}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {dir === "left" ? <path d="m14 6-6 6 6 6" /> : <path d="m10 6 6 6-6 6" />}
    </svg>
  );
}
