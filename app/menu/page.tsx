import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { MenuExperience } from "@/components/menu/MenuExperience";

export const metadata: Metadata = {
  title: `Menu — ${SITE.name}`,
  description:
    "Smashed to order, strictly Halal, never frozen. Burgers, loaded dogs, dynamite fries, thick shakes and more.",
};

export default function MenuPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink [color-scheme:light]">
      <header className="bg-black px-6 pb-14 pt-32 text-center text-paper sm:pb-20 sm:pt-36"><p className="text-xs font-bold uppercase tracking-[0.35em] text-paper/60">Smashed · halal · never frozen</p><h1 className="mt-4 font-display text-6xl uppercase leading-none sm:text-8xl">The menu</h1></header>

      <MenuExperience />
    </div>
  );
}
