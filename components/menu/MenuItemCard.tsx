import Link from "next/link";
import type { MenuItem } from "@/lib/menu";
import { getItemBySlug } from "@/lib/menu";
import { asset } from "@/lib/asset";
import { priceOf, formatGBP } from "@/lib/pricing";
import { nutritionOf, isHalal } from "@/lib/menu-extras";
import { SpiceMeter } from "./SpiceMeter";
import { HalalBadge } from "./HalalBadge";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

// Placeholder shown until a real product shot exists. To use a photo, set
// `image: "/menu/<slug>.jpg"` on the item (drop the file in /public/menu).
function Placeholder({ name }: { name: string }) {
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden bg-black">
      <div className="brim-stripes-fine absolute inset-0 opacity-[0.08]" aria-hidden />
      <span className="font-display text-7xl uppercase text-white/15">
        {name.charAt(0)}
      </span>
      <span className="absolute bottom-2 right-3 text-[0.6rem] uppercase tracking-[0.3em] text-white/30">
        Brim
      </span>
    </div>
  );
}

export function MenuItemCard({ item }: { item: MenuItem }) {
  // Resolve the owning category so we can show per-item calories (demo facts).
  const categoryId = getItemBySlug(item.slug)?.category.id ?? "";
  const cal = nutritionOf(item, categoryId).calories;
  const halal = isHalal(item);
  const isVeggie = item.tags.includes("veggie");

  return (
    // Dark card on the pure-black page. `group` so the photo scales on hover.
    // The whole visual is a <Link>; the footer (calories + add) sits OUTSIDE the
    // link so adding to cart never navigates.
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white/[0.03] shadow-xl shadow-black/40 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.05] hover:ring-white/25">
      <Link
        href={`/menu/${item.slug}`}
        aria-label={`View ${item.name}`}
        className="flex flex-1 flex-col"
      >
        {/* Image / placeholder. The image is the slack-absorber: it GROWS
            (flex-1) to fill whatever height the grid row takes, so a card that
            shares a row with a taller neighbour shows more food instead of an
            empty gap below its copy. Featured tiles start a touch taller. */}
        <div
          className={`relative flex-1 overflow-hidden ${
            item.featured ? "min-h-[17rem]" : "min-h-[13rem]"
          }`}
        >
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset(item.image)}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <Placeholder name={item.name} />
          )}

          {/* Badges over the shot: brand label (left), Halal mark (right). */}
          {item.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-brim px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink shadow-lg shadow-black/30">
              {item.badge}
            </span>
          )}
          {halal && <HalalBadge className="absolute right-3 top-3" />}
        </div>

        {/* Body — content height (the image above takes the row's slack). */}
        <div className="flex flex-col gap-2.5 p-5 pb-3.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-2xl uppercase leading-[0.95] text-paper sm:text-3xl">
              {item.name}
            </h3>
            <span className="shrink-0 font-display text-xl leading-none text-brim">
              {formatGBP(priceOf(item.slug))}
            </span>
          </div>

          {item.spice ? <SpiceMeter level={item.spice} /> : null}

          {item.description && (
            <p className="text-sm leading-relaxed text-paper/55">
              {item.description}
            </p>
          )}

          {item.variants && item.variants.length > 0 && (
            <ul className="mt-1 flex flex-wrap gap-1.5">
              {item.variants.map((v) => (
                <li
                  key={v}
                  className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-paper/75 ring-1 ring-white/5"
                >
                  {v}
                </li>
              ))}
            </ul>
          )}

          {isVeggie && (
            <span className="mt-auto w-fit pt-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
              🌱 Plant-friendly
            </span>
          )}
        </div>
      </Link>

      {/* Footer (outside the Link): calories + direct add. */}
      <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-3.5">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-paper/45 tabular-nums">
          {cal} Cal
        </span>
        <AddToCartButton slug={item.slug} variant="icon" />
      </div>
    </article>
  );
}
