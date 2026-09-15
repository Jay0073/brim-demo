import Image from "next/image";
import Link from "next/link";
import type { MenuItem } from "@/lib/menu";
import { asset } from "@/lib/asset";
import { formatGBP, priceOf } from "@/lib/pricing";

export function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white p-3 shadow-sm ring-1 ring-ink/10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/menu/${item.slug}`} className="grid min-h-44 grid-cols-[10rem_minmax(0,1fr)] gap-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-xl bg-ink">
          {item.image ? <Image src={asset(item.image)} alt={item.name} fill sizes="176px" className="object-cover transition-transform duration-500 group-hover:scale-105" /> : <span className="grid h-full place-items-center font-display text-6xl text-paper/20">BRIM</span>}
          {item.badge && <span className="absolute left-2 top-2 rounded-md bg-red-500 px-2 py-1 text-[0.62rem] font-bold uppercase text-white">{item.badge}</span>}
        </div>
        <div className="flex min-w-0 flex-col py-1 pr-1"><h3 className="font-display text-xl uppercase leading-tight [overflow-wrap:anywhere]">{item.name}</h3><p className="mt-2 line-clamp-2 text-sm leading-snug text-ink/55">{item.description}</p><div className="mt-auto"><span className="inline-flex rounded-lg bg-ink px-3 py-1.5 text-sm font-bold text-paper">from {formatGBP(priceOf(item.slug))}</span><p className="hidden mt-3 text-sm font-bold uppercase tracking-wide">View item <span aria-hidden>→</span></p></div></div>
      </Link>
    </article>
  );
}
