// Amazon-style product detail page for a single menu item. Server component —
// the only interactive piece is the <AddToCartButton> client island. Used by
// app/menu/[slug]/page.tsx for every item (the "new component" the menu links
// into). Big image on the left, buy column on the right, related items below.
import Link from "next/link";
import type { MenuItem, MenuCategory } from "@/lib/menu";
import { priceOf, formatGBP } from "@/lib/pricing";
import { asset } from "@/lib/asset";
import { SpiceMeter } from "./SpiceMeter";
import { ProductGallery, type GalleryImage } from "./ProductGallery";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

// Burger items get a second "what's inside" anatomy shot in the gallery; other
// categories (shakes, fries, drinks…) keep their single product photo.
const BURGER_BREAKDOWN = "/detaileburger.png";
const BREAKDOWN_CATEGORIES = new Set(["burgers", "jr-brim"]);

export function ProductDetail({
  item,
  category,
  related,
}: {
  item: MenuItem;
  category: MenuCategory;
  related: MenuItem[];
}) {
  const isVeggie = item.tags.includes("veggie");

  // Main product photo, then the burger breakdown shot where it makes sense.
  const gallery: GalleryImage[] = [
    ...(item.image ? [{ src: item.image }] : []),
    ...(BREAKDOWN_CATEGORIES.has(category.id)
      ? [{ src: BURGER_BREAKDOWN, contain: true }]
      : []),
  ];

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8 sm:pt-32">
        {/* Breadcrumb / back */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/45">
          <Link href="/menu" className="transition-colors hover:text-brim">
            Menu
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink/70">{category.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* ── Image gallery (slides product photo ↔ burger breakdown) ── */}
          <ProductGallery images={gallery} alt={item.name} badge={item.badge} />

          {/* ── Buy column ─────────────────────────────────────────────── */}
          <div className="flex flex-col">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-brim">
              {category.name}
            </p>
            <h1 className="mt-3 font-display text-5xl uppercase leading-[0.9] sm:text-6xl">
              {item.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <span className="font-display text-4xl leading-none">
                {formatGBP(priceOf(item.slug))}
              </span>
              {item.spice ? <SpiceMeter level={item.spice} /> : null}
              {isVeggie && (
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  🌱 Plant-friendly
                </span>
              )}
            </div>

            {item.description && (
              <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink/70">
                {item.description}
              </p>
            )}

            {item.variants && item.variants.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">
                  Options
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {item.variants.map((v) => (
                    <li
                      key={v}
                      className="rounded-full bg-ink/[0.06] px-3.5 py-1.5 text-sm font-medium text-ink/70"
                    >
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AddToCartButton
                slug={item.slug}
                variant="full"
                label="Add to cart"
                className="bg-ink text-paper hover:bg-ink/90"
              />
              <AddToCartButton
                slug={item.slug}
                variant="full"
                buyNow
                label="Buy now"
                className="bg-brim text-ink ring-1 ring-ink/10 hover:brightness-105"
              />
            </div>
            <p className="mt-3 text-xs text-ink/40">
              Strictly Halal · Smashed to order · Never frozen
            </p>
          </div>
        </div>

        {/* ── Related ──────────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-3xl uppercase leading-none sm:text-4xl">
              More from {category.name}
            </h2>
            <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((rel) => (
                <li key={rel.slug}>
                  <Link
                    href={`/menu/${rel.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/10 transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
                      {rel.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={asset(rel.image)}
                          alt={rel.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1 p-3.5">
                      <h3 className="font-display text-lg uppercase leading-[0.95]">
                        {rel.name}
                      </h3>
                      <span className="mt-auto pt-1 font-semibold text-ink/70">
                        {formatGBP(priceOf(rel.slug))}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
