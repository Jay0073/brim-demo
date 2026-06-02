// ─────────────────────────────────────────────────────────────────────────
//  SPECIALS — a bright "flash to white" editorial break in the landing scroll.
//  A bento grid of the menu's signature picks, pulled live from data/menu.json
//  (the `featured` items) so it never drifts from the real menu.
//
//  Each tile is a full-bleed product shot with a foot-weighted scrim (clear at
//  the top so the food stays crisp). The milkshake runs tall (row-span-2); the
//  rest are unit cells, so the bento fills with no gaps. Pure CSS hover.
// ─────────────────────────────────────────────────────────────────────────
import Link from "next/link";
import { MENU, type MenuItem } from "@/lib/menu";
import { SpiceMeter } from "@/components/menu/SpiceMeter";
import { asset } from "@/lib/asset";

interface Pick {
  item: MenuItem;
  category: string;
  /** Grid span for this tile (the shake runs tall via row-span-2). */
  span: string;
}

// Curated order + per-tile grid span. DOM order + spans tile a gapless 3×3 on
// lg (Maniac runs wide up top, the shake runs tall, the Brim Box runs wide
// along the foot):
//   row1: maniac maniac · shake
//   row2: burger brownie · shake (tall)
//   row3: brim-box brim-box · commando
// On sm it folds to a 2-col stack (the wide tiles span the full width).
// Slugs resolve against the live menu, so copy/badges/spice/photos come from JSON.
const LAYOUT: Record<string, { span: string }> = {
  "brim-maniac": { span: "sm:col-span-2 lg:col-span-2" },
  "brim-shakes": { span: "sm:row-span-2 lg:row-span-2" },
  "brim-burger": { span: "" },
  "brim-brownie-special": { span: "" },
  "loaded-box": { span: "sm:col-span-2 lg:col-span-2" },
  "commando-fries": { span: "sm:col-span-2 lg:col-span-1" },
};

const bySlug = new Map<string, { item: MenuItem; category: string }>();
for (const cat of MENU) {
  for (const it of cat.items) bySlug.set(it.slug, { item: it, category: cat.name });
}

const PICKS: Pick[] = Object.entries(LAYOUT)
  .map(([slug, l]) => {
    const found = bySlug.get(slug);
    return found ? { ...found, ...l } : null;
  })
  .filter((p): p is Pick => p !== null);

function SpecialCard({ pick, index }: { pick: Pick; index: number }) {
  const { item, category, span } = pick;
  const tall = span.includes("row-span-2");

  return (
    <Link
      href="/menu"
      aria-label={`${item.name} — see it on the menu`}
      className={`group relative flex flex-col justify-end overflow-hidden rounded-[1.75rem] p-6 shadow-lg shadow-black/15 ring-1 ring-ink/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/25 hover:ring-brim/70 sm:p-7 ${
        tall ? "min-h-[26rem]" : "min-h-[18rem]"
      } ${span}`}
    >
      {item.image ? (
        <>
          {/* Full-bleed product shot, gently punched up so the food pops. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(item.image)}
            alt={item.name}
            loading="lazy"
            draggable={false}
            className="absolute inset-0 h-full w-full select-none object-cover [filter:saturate(1.14)_contrast(1.08)_brightness(1.04)] transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          {/* Foot-weighted scrim: clear up top (crisp food), dark only where the
              copy sits. Lifts a touch on hover to reveal more of the shot.
              Inline gradient — Tailwind can't tokenise commas in arbitrary values. */}
          <div
            aria-hidden
            className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-85"
            style={{
              backgroundImage:
                "linear-gradient(to top, rgba(8,8,8,0.94) 0%, rgba(8,8,8,0.66) 26%, rgba(8,8,8,0.16) 50%, transparent 72%)",
            }}
          />
        </>
      ) : (
        // Fallback when a pick has no photo: inverted tile + ghost initial.
        <span className="absolute inset-0 bg-ink">
          <span
            aria-hidden
            className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[11rem] leading-none text-white/[0.06]"
          >
            {item.name.charAt(0)}
          </span>
        </span>
      )}

      {/* Editorial index. */}
      <span className="absolute right-5 top-5 font-display text-sm tabular-nums text-paper/85 [text-shadow:0_1px_10px_rgba(0,0,0,0.7)]">
        {String(index + 1).padStart(2, "0")}
      </span>

      {item.badge && (
        <span className="absolute left-5 top-5 rounded-full bg-brim px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink shadow-lg shadow-black/30">
          {item.badge}
        </span>
      )}

      <div className="relative">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brim [text-shadow:0_1px_12px_rgba(0,0,0,0.7)]">
          {category}
        </p>
        <h3 className="mt-2 font-display text-3xl uppercase leading-[0.9] text-paper [text-shadow:0_2px_26px_rgba(0,0,0,0.65)] sm:text-4xl">
          {item.name}
        </h3>
        {item.description && (
          <p className="mt-2.5 line-clamp-2 max-w-md text-sm leading-relaxed text-paper/85 [text-shadow:0_1px_16px_rgba(0,0,0,0.6)]">
            {item.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          {item.spice ? (
            <SpiceMeter level={item.spice} />
          ) : (
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-paper/70 [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]">
              Signature pick
            </span>
          )}
          <span
            aria-hidden
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-lg text-paper backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-brim group-hover:text-ink"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

export function Specials() {
  return (
    <section
      id="specials"
      className="relative overflow-hidden bg-paper text-ink"
    >
      {/* Crisp brand hairline at the seam from the section above. */}
      <div
        className="brim-stripes-fine absolute inset-x-0 top-0 h-1.5 opacity-80"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28 lg:px-12">
        {/* Asymmetric header: statement type left, the pitch + CTA right. */}
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-brim">
              Fan favourites
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-5xl uppercase leading-[0.82] sm:text-7xl">
              The Brim
              <br />
              Specials
            </h2>
          </div>
          <div className="md:max-w-xs md:text-right">
            <p className="text-balance text-ink/60">
              The smashes, stacks and shakes people queue for — smashed to order,
              strictly Halal, never frozen.
            </p>
            <Link
              href="/menu"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ink underline-offset-4 transition-colors hover:text-brim hover:underline"
            >
              See the full menu
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Bento grid — the milkshake runs tall, the rest are unit cells. */}
        <div className="mt-12 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {PICKS.map((pick, i) => (
            <SpecialCard key={pick.item.slug} pick={pick} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
