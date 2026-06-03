import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { asset } from "@/lib/asset";
import { MenuExperience } from "@/components/menu/MenuExperience";

export const metadata: Metadata = {
  title: `Menu — ${SITE.name}`,
  description:
    "Smashed to order, strictly Halal, never frozen. Burgers, loaded dogs, dynamite fries, thick shakes and more.",
};

export default function MenuPage() {
  return (
    // Bright, editorial page — white frame makes the food the loudest thing.
    <div className="min-h-dvh bg-paper text-ink">
      {/* Hero */}
      <header className="relative overflow-hidden px-6 pb-8 pt-32 text-center sm:pt-36">
        <div
          className="brim-stripes-fine absolute inset-x-0 top-0 h-1.5 opacity-80"
          aria-hidden
        />
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-brim">
          Smashed · Halal · Never frozen
        </p>
        <h1 className="mt-4 font-display text-6xl uppercase leading-[0.82] text-ink sm:text-8xl">
          The Menu
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance text-ink/60">
          Beef pressed thin, seared crisp, and built to your liking. Stack it
          high, spice it bold, and let the loaded fries do the rest.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3">
          <a
            href={asset("/BRIM-Allergen-Menu.pdf")}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-brim hover:text-ink"
          >
            Download the allergen menu
          </a>
          <p className="text-xs uppercase tracking-wider text-ink/40">
            Some locations may have a limited menu
          </p>
        </div>
      </header>

      <MenuExperience />

      <div className="h-12" />
    </div>
  );
}
