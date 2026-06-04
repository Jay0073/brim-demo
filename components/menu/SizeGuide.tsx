import { BURGER_SIZES } from "@/lib/menu";
import { BurgerGlyph } from "./BurgerGlyph";

// The 4oz / 8oz / 12oz ladder, shown atop the Burgers section.
export function SizeGuide() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/[0.03] p-6 ring-1 ring-white/10 sm:p-8">
      <div className="brim-stripes-fine absolute inset-0 opacity-[0.05]" aria-hidden />
      <div className="relative mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-2xl uppercase text-paper">Pick your weight</h3>
        <p className="text-sm text-paper/55">Every burger, three ways.</p>
      </div>
      <div className="relative grid grid-cols-3 gap-2 sm:gap-6">
        {BURGER_SIZES.map((s) => (
          <div
            key={s.oz}
            className="flex flex-col items-center gap-1.5 text-center"
          >
            <BurgerGlyph
              layers={s.layers}
              className="h-14 w-14 text-paper transition-transform duration-300 hover:scale-110 sm:h-16 sm:w-16"
            />
            <span className="font-display text-xl uppercase text-paper">{s.oz}</span>
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brim">
              {s.name}
            </span>
            <span className="hidden text-xs text-paper/45 sm:block">{s.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
