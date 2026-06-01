import { BUILD_YOUR_OWN } from "@/lib/menu";

// Dark, striped "make it yours" module — a visual break inside Burgers.
export function BuildYourOwn() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-ink p-6 text-paper sm:p-8">
      <div className="brim-stripes-fine absolute inset-0 opacity-[0.06]" aria-hidden />
      <div className="relative">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-brim">
          Make it yours
        </span>
        <h3 className="mt-2 font-display text-3xl uppercase sm:text-4xl">
          Build your own
        </h3>
        <p className="mt-2 max-w-md text-sm text-paper/70">
          {BUILD_YOUR_OWN.rule}
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-paper/50">
              Toppings — pick 4
            </h4>
            <ul className="flex flex-wrap gap-1.5">
              {BUILD_YOUR_OWN.toppings.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-white/10 px-3 py-1 text-sm text-paper/85"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-paper/50">
              Sauces — pick 2
            </h4>
            <ul className="flex flex-wrap gap-1.5">
              {BUILD_YOUR_OWN.sauces.map((s) => (
                <li
                  key={s}
                  className="rounded-full bg-white/10 px-3 py-1 text-sm text-paper/85"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-5 text-xs uppercase tracking-wider text-brim/90">
          + {BUILD_YOUR_OWN.extra}
        </p>
      </div>
    </div>
  );
}
