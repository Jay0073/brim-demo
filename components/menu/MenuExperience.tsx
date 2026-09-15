import { MENU } from "@/lib/menu";
import { MenuItemCard } from "./MenuItemCard";

export function MenuExperience() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
      <div className="space-y-16">
        {MENU.map((category) => (
          <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-28">
            <div className="mb-6 flex items-end justify-between gap-5 border-b border-ink/15 pb-4"><div><h2 className="font-display text-4xl uppercase leading-none sm:text-5xl">{category.name}</h2><p className="mt-2 text-sm text-ink/55">{category.tagline}</p></div><span className="text-sm text-ink/45">{category.items.length} items</span></div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{category.items.map((item) => <MenuItemCard key={item.slug} item={item} />)}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
