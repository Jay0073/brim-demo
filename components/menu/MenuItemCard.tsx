import Link from "next/link";
import type { MenuItem } from "@/lib/menu";
import { asset } from "@/lib/asset";
import { priceOf, formatGBP } from "@/lib/pricing";
import { SpiceMeter } from "./SpiceMeter";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

// Placeholder shown until a real product shot exists. To use a photo, set
// `image: "/menu/<slug>.jpg"` on the item (drop the file in /public/menu).
function Placeholder({ name, dark }: { name: string; dark: boolean }) {
  return (
    <div
      className={`relative grid h-full w-full place-items-center overflow-hidden ${
        dark ? "bg-black" : "bg-zinc-100"
      }`}
    >
      <div
        className={`brim-stripes-fine absolute inset-0 ${
          dark ? "opacity-[0.08]" : "opacity-[0.05]"
        }`}
        aria-hidden
      />
      <span
        className={`font-display text-7xl uppercase ${
          dark ? "text-white/15" : "text-ink/10"
        }`}
      >
        {name.charAt(0)}
      </span>
      <span
        className={`absolute bottom-2 right-3 text-[0.6rem] uppercase tracking-[0.3em] ${
          dark ? "text-white/30" : "text-ink/25"
        }`}
      >
        Brim
      </span>
    </div>
  );
}

export function MenuItemCard({ item }: { item: MenuItem }) {
  const dark = !!item.featured;

  return (
    // `relative` so the "+" button can overlay the image; `group` so the card's
    // hover scales the photo. The whole visual is a Link to the detail page; the
    // "+" lives OUTSIDE that Link so adding to cart never navigates.
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1 ${
        dark
          ? "bg-ink text-paper shadow-xl shadow-black/30"
          : "bg-white text-ink shadow-sm ring-1 ring-ink/10 hover:shadow-xl hover:shadow-black/10"
      }`}
    >
      <Link
        href={`/menu/${item.slug}`}
        aria-label={`View ${item.name}`}
        className="flex h-full flex-col"
      >
        {/* Image / placeholder. Featured tiles keep their big 4:3 hero shot;
            regular tiles let the image GROW (flex-1) to absorb any extra height
            when the grid row is stretched by a taller neighbour — so the space
            fills with food, not whitespace. Cards flagged `compact` instead use a
            fixed, shorter crop: they still stretch to match their row-mates'
            height (so a group stays uniform), but the image never balloons. */}
        <div
          className={`relative overflow-hidden ${
            dark ? "aspect-[4/3]" : item.compact ? "aspect-[16/10]" : "min-h-[14rem] flex-1"
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
            <Placeholder name={item.name} dark={dark} />
          )}
          {item.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-brim px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink shadow">
              {item.badge}
            </span>
          )}
        </div>

        {/* Body — content-height on regular tiles (the image takes the slack);
            featured tiles keep flex-1 so their copy fills the taller card. */}
        <div className={`flex flex-col gap-2.5 p-5 ${dark ? "flex-1" : ""}`}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-2xl uppercase leading-[0.95] sm:text-3xl">
              {item.name}
            </h3>
            {item.spice ? <SpiceMeter level={item.spice} className="shrink-0 pt-1" /> : null}
          </div>

          <p className={`font-display text-xl leading-none ${dark ? "text-paper" : "text-ink"}`}>
            {formatGBP(priceOf(item.slug))}
          </p>

          {item.description && (
            <p
              className={`text-sm leading-relaxed ${
                dark ? "text-paper/75" : "text-ink/65"
              }`}
            >
              {item.description}
            </p>
          )}

          {item.variants && item.variants.length > 0 && (
            <ul className="mt-1 flex flex-wrap gap-1.5">
              {item.variants.map((v) => (
                <li
                  key={v}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    dark
                      ? "bg-white/10 text-paper/80"
                      : "bg-ink/[0.06] text-ink/70"
                  }`}
                >
                  {v}
                </li>
              ))}
            </ul>
          )}

          {item.tags.includes("veggie") && (
            <span
              className={`mt-auto w-fit pt-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] ${
                dark ? "text-emerald-300/80" : "text-emerald-600"
              }`}
            >
              🌱 Plant-friendly
            </span>
          )}
        </div>
      </Link>

      {/* Direct add — overlays the image corner, opposite the badge. */}
      <AddToCartButton
        slug={item.slug}
        variant="icon"
        className="absolute right-3 top-3 z-10"
      />
    </article>
  );
}
