import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/asset";

const CATEGORIES = [
  { name: "Burgers", image: "/menu/brim-burger.jpg", href: "/menu#cat-burgers" },
  { name: "Hot Dogs", image: "/menu/classic-hot-dog.jpg", href: "/menu#cat-hot-dogs" },
  { name: "Loaded Fries", image: "/menu/loaded-box.jpg", href: "/menu#cat-fries" },
  { name: "Wraps", image: "/menu/brim-sando.jpg", href: "/menu#cat-sandos" },
  { name: "Brim Junior", image: "/menu/chicken-little.jpg", href: "/menu#cat-jr-brim" },
  { name: "Sips and Scoops", image: "/menu/brim-shakes.jpg", href: "/menu#cat-shakes" },
  { name: "Desserts", image: "/menu/san-sabastian-cheesecake.jpg", href: "/menu#cat-desserts" },
  { name: "Naked Box", image: "/menu/loaded-tots.jpg", href: "/menu#cat-brim-box" },
] as const;

export function HomeCategories() {
  return (
    <section className="bg-paper px-5 py-16 text-ink sm:px-8 sm:py-24" aria-labelledby="categories-heading">
      <div className="mx-auto max-w-6xl">
        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-ink/45">Best burgers in the UK</p>
          <h2 id="categories-heading" className="mt-3 font-display text-4xl uppercase leading-none sm:text-6xl">Our categories</h2>
        </header>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link key={category.name} href={category.href} className="group overflow-hidden rounded-lg border border-ink/15 bg-white transition-transform duration-300 hover:-translate-y-1">
              <div className="relative aspect-[1.08] overflow-hidden bg-ink">
                <Image src={asset(category.image)} alt={category.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <p className="px-3 py-4 text-center font-display text-lg uppercase leading-none sm:text-2xl">{category.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
