// Reusable Halal marks. The brand is strictly Halal, so these appear across the
// menu cards and product pages. halal.svg is black artwork: inverted to white on
// the dark pill, left black on the white round mark.
import { asset } from "@/lib/asset";

/** Small outlined pill — for card corners and inline rows on dark surfaces. */
export function HalalBadge({ className = "" }: { className?: string }) {
  return (
    <span
      title="Halal certified"
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/45 px-2.5 py-1 backdrop-blur-sm ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/halal.svg")}
        alt=""
        aria-hidden
        className="h-3.5 w-3.5 [filter:invert(1)]"
      />
      <span className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-paper/90">
        Halal
      </span>
    </span>
  );
}

/** Round white badge — for hero spots (gallery / detail overlays). */
export function HalalMark({
  size = "h-12 w-12",
  icon = "h-7 w-7",
}: {
  size?: string;
  icon?: string;
}) {
  return (
    <span
      title="Halal certified"
      className={`grid ${size} place-items-center rounded-full bg-paper shadow-lg ring-1 ring-black/10`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/halal.svg")} alt="Halal certified" className={icon} />
    </span>
  );
}
