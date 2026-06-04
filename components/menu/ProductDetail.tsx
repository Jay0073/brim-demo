// Product detail page for a single menu item. Server component — the only
// interactive pieces are the <AddToCartButton> islands and the gallery. Pure
// solid-black theme. Used by app/menu/[slug]/page.tsx for every item.
//
// The buy column is deliberately rich (Halal + heat badges, "what's inside"
// chips, a macro grid and allergens) so no item's page ever reads as empty —
// the facts are derived per item in lib/menu-extras when not set in the JSON.
import Link from "next/link";
import type { MenuItem, MenuCategory } from "@/lib/menu";
import { priceOf, formatGBP } from "@/lib/pricing";
import { asset } from "@/lib/asset";
import { productFacts } from "@/lib/menu-extras";
import { SpiceMeter } from "./SpiceMeter";
import { HalalBadge, HalalMark } from "./HalalBadge";
import { ProductGallery, type GalleryImage } from "./ProductGallery";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

// Burger items get a second "what's inside" anatomy shot in the gallery; other
// categories (shakes, fries, drinks…) keep their single product photo.
const BURGER_BREAKDOWN = "/detaileburger.png";
const BREAKDOWN_CATEGORIES = new Set(["burgers", "jr-brim", "sandos"]);

const ALLERGEN_ICON: Record<string, string> = {
  Gluten: "🌾",
  Milk: "🥛",
  Soya: "🫘",
  Egg: "🥚",
  Mustard: "🟡",
};

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
  const facts = productFacts(item, category);

  // Main product photo, then the burger breakdown shot where it makes sense.
  const gallery: GalleryImage[] = [
    ...(item.image ? [{ src: item.image }] : []),
    ...(BREAKDOWN_CATEGORIES.has(category.id)
      ? [{ src: BURGER_BREAKDOWN, contain: true }]
      : []),
  ];

  return (
    <div className="relative min-h-dvh bg-black text-paper">
      {/* Brand stripe seam across the top edge. */}
      <div aria-hidden className="brim-stripes-fine absolute inset-x-0 top-0 h-1.5 opacity-90" />

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8 sm:pt-32">
        {/* Breadcrumb / back */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-paper/45">
          <Link href="/menu" className="transition-colors hover:text-brim">
            Menu
          </Link>
          <span aria-hidden>/</span>
          <span className="text-paper/70">{category.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* ── Image gallery (slides product photo ↔ burger breakdown) ── */}
          <ProductGallery
            images={gallery}
            alt={item.name}
            badge={item.badge}
            halal={facts.halal}
            heat={facts.heat}
          />

          {/* ── Buy column ─────────────────────────────────────────────── */}
          <div className="flex flex-col">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-brim">
              {category.name}
            </p>
            <h1 className="mt-3 font-display text-5xl uppercase leading-[0.9] text-paper sm:text-6xl">
              {item.name}
            </h1>

            {/* Price + at-a-glance badges */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="font-display text-4xl leading-none text-brim">
                {formatGBP(priceOf(item.slug))}
              </span>
              {item.spice ? <SpiceMeter level={item.spice} /> : null}
              {facts.halal && <HalalBadge />}
              {facts.heat && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.04] px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-paper/80">
                  🌶 {facts.heat}
                </span>
              )}
              {isVeggie && (
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
                  🌱 Plant-friendly
                </span>
              )}
            </div>

            {item.description && (
              <p className="mt-5 max-w-prose text-lg leading-relaxed text-paper/65">
                {item.description}
              </p>
            )}

            {/* What's inside — parsed ingredient chips */}
            {facts.ingredients.length > 0 && (
              <div className="mt-7">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-paper/45">
                  What&apos;s inside
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {facts.ingredients.map((ing) => (
                    <li
                      key={ing}
                      className="rounded-full bg-white/[0.05] px-3.5 py-1.5 text-sm font-medium text-paper/75 ring-1 ring-white/10"
                    >
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nutrition — macro cards (per serving) */}
            <div className="mt-7">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-paper/45">
                Nutrition <span className="text-paper/30">· per serving</span>
              </p>
              <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
                {[
                  { v: facts.nutrition.calories, l: "Calories" },
                  { v: facts.nutrition.protein, l: "Protein" },
                  { v: facts.nutrition.carbs, l: "Carbs" },
                  { v: facts.nutrition.fat, l: "Fat" },
                ].map((n) => (
                  <div
                    key={n.l}
                    className="rounded-2xl bg-white/[0.04] p-4 text-center ring-1 ring-white/10"
                  >
                    <span className="block font-display text-2xl leading-none text-paper tabular-nums">
                      {n.v}
                    </span>
                    <span className="mt-1.5 block text-[0.55rem] font-semibold uppercase tracking-wider text-paper/45">
                      {n.l}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Allergens */}
            {facts.allergens.length > 0 && (
              <div className="mt-7">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-paper/45">
                  Allergens
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {facts.allergens.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1.5 ring-1 ring-white/10"
                    >
                      <span aria-hidden className="text-sm leading-none">
                        {ALLERGEN_ICON[a] ?? "•"}
                      </span>
                      <span className="text-xs font-medium text-paper/70">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.variants && item.variants.length > 0 && (
              <div className="mt-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-paper/45">
                  Options
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {item.variants.map((v) => (
                    <li
                      key={v}
                      className="rounded-full bg-white/[0.05] px-3.5 py-1.5 text-sm font-medium text-paper/75 ring-1 ring-white/10"
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
                className="bg-paper text-ink hover:bg-white/90"
              />
              <AddToCartButton
                slug={item.slug}
                variant="full"
                buyNow
                label="Buy now"
                className="bg-brim text-ink hover:brightness-110"
              />
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-paper/40">
              <HalalMark size="h-5 w-5" icon="h-3.5 w-3.5" />
              Strictly Halal · Smashed to order · Never frozen
            </p>
          </div>
        </div>

        {/* ── Related ──────────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-3xl uppercase leading-none text-paper sm:text-4xl">
              More from {category.name}
            </h2>
            <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((rel) => (
                <li key={rel.slug}>
                  <Link
                    href={`/menu/${rel.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ring-white/10 transition-all hover:-translate-y-1 hover:ring-white/25"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-black">
                      {rel.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={asset(rel.image)}
                          alt={rel.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <HalalBadge className="absolute right-2 top-2 scale-90" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1 p-3.5">
                      <h3 className="font-display text-lg uppercase leading-[0.95] text-paper">
                        {rel.name}
                      </h3>
                      <span className="mt-auto pt-1 font-semibold text-brim">
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
