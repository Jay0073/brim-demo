// Post-sequence breathing room: massive edge-to-edge type that routes users on
// to Menu / Locations. Hover slides a brim-coloured fill up behind the words.
// Pure CSS hover (group) — no client JS needed.
import Link from "next/link";

const CTAS = [
  { href: "/menu", label: "Craving yet? Explore the menu" },
  { href: "/locations", label: "Find your nearest Brim — UK & PK" },
];

export function ExploreCTA() {
  return (
    // Bright white section — balances the dark hero / How-It's-Made above and
    // the dark footer below, so the page reads black AND white, equally.
    <section className="bg-paper text-ink">
      {CTAS.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className="group relative flex items-center justify-between gap-6 overflow-hidden border-b border-ink/10 px-6 py-14 md:px-12 md:py-24"
        >
          {/* slide-up black fill */}
          <span
            aria-hidden
            className="absolute inset-0 -translate-y-full bg-ink transition-transform duration-500 ease-out group-hover:translate-y-0"
          />
          <span className="relative max-w-[85%] font-display text-[8.5vw] uppercase leading-[0.9] text-ink transition-colors duration-300 group-hover:text-paper md:text-[5.5vw]">
            {c.label}
          </span>
          <span className="relative shrink-0 font-display text-4xl text-ink transition-all duration-300 group-hover:translate-x-2 group-hover:text-paper md:text-6xl">
            ↗
          </span>
        </Link>
      ))}
    </section>
  );
}
