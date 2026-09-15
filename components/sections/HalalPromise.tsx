import Image from "next/image";

// The Halal promise band — a brand fixture that appears on every main page.
// The frame (mark, "Fully Halal" lockup, three proof points) is identical
// everywhere so it reads as one recurring brand statement; the copy is written
// for the page it sits on, because what a diner needs to know on the menu is
// not what an operator needs to know on the franchising page.

type Variant = "home" | "menu" | "franchising" | "about" | "locations";

interface Content {
  eyebrow: string;
  title: string;
  body: string;
  points: [string, string][];
}

const CONTENT: Record<Variant, Content> = {
  home: {
    eyebrow: "Our Halal promise",
    title: "Big flavour. Fully Halal.",
    body: "From the first burger to the last bite, our whole menu is fully Halal. It’s part of how we source, prepare and serve the food you come to BRIM for.",
    points: [
      ["Carefully sourced", "Hand-slaughtered beef and chicken from BRIM-approved suppliers."],
      ["No pork. No alcohol.", "A fully Halal kitchen and an alcohol-free place to enjoy your meal."],
      ["The whole menu", "Burgers, sides and shakes, all prepared to the same Halal standard."],
    ],
  },
  menu: {
    eyebrow: "Halal assurance",
    title: "Every plate on this menu is Halal.",
    body: "There is no separate menu and no exceptions. Every burger, every side and every shake is prepared to the same fully Halal standard, on the same line, every shift.",
    points: [
      ["Certified meat", "Hand-slaughtered beef and chicken, sourced only through BRIM-approved suppliers."],
      ["No alcohol, no pork", "Not on the menu, not in the kitchen, not behind the counter."],
      ["One kitchen", "No mixed preparation — the whole line runs to a single standard."],
    ],
  },
  franchising: {
    eyebrow: "Why the model works",
    title: "Halal isn’t a feature. It’s the product.",
    body: "Operators inherit a fully Halal supply chain and a written standard, so the trust that takes independents years to build is in place before the doors open.",
    points: [
      ["Approved supply chain", "Certified beef and chicken through suppliers BRIM has already vetted."],
      ["Written into the manual", "The Halal standard is part of the operating manual, not left to the site."],
      ["An underserved market", "A premium Halal offer in a category that rarely serves it properly."],
    ],
  },
  about: {
    eyebrow: "The founding conviction",
    title: "Halal is where BRIM began.",
    body: "The brand exists because premium and Halal were treated as two different choices. Everything since — the sourcing, the rooms, the standard — has been built so nobody eating with us has to make it.",
    points: [
      ["Trust as product", "Certification is part of what we sell, never a footnote by the till."],
      ["Alcohol-free rooms", "A fully Halal setting the whole family can sit down in."],
      ["The same everywhere", "One standard across every branch and every market we enter."],
    ],
  },
  locations: {
    eyebrow: "At every branch",
    title: "Every BRIM is fully Halal.",
    body: "Hemel Hempstead to Edinburgh, and every site opening after them — the certification, the suppliers and the standard behind the counter are identical.",
    points: [
      ["Every branch certified", "No location-by-location exceptions, and none planned."],
      ["No alcohol on site", "Every BRIM is an alcohol-free room, by design."],
      ["One supply chain", "The same approved suppliers serve the whole estate."],
    ],
  },
};

export function HalalPromise({ variant }: { variant: Variant }) {
  const { eyebrow, title, body, points } = CONTENT[variant];

  return (
    <section className={variant === "home" ? "bg-white px-6 py-12 text-ink sm:py-16" : "px-6 py-20 sm:py-24"} aria-labelledby={`halal-${variant}`}>
      <div className={variant === "home" ? "mx-auto w-full max-w-7xl" : "mx-auto w-full max-w-6xl border-t border-ink/10 pt-16 sm:pt-20"}>
        <div className="grid gap-10 rounded-3xl bg-white p-8 ring-1 ring-ink/10 sm:p-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-paper ring-1 ring-ink/10">
              <Image src="/halal.svg" alt="" aria-hidden width={52} height={52} />
            </span>
            <p className="mt-6 font-display text-3xl uppercase leading-none">Fully Halal</p>
            <p className="mt-2.5 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-ink/45">
              Hand-slaughtered · Alcohol-free
            </p>
          </div>

          <div className="lg:col-span-8">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-ink/45">{eyebrow}</p>
            <h2
              id={`halal-${variant}`}
              className="mt-4 font-display text-4xl uppercase leading-[0.9] sm:text-5xl"
            >
              {title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/60">{body}</p>

            <ul className="mt-8 grid gap-6 border-t border-ink/10 pt-8 sm:grid-cols-3">
              {points.map(([label, copy]) => (
                <li key={label}>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-ink">{label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/55">{copy}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
