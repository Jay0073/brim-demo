import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import { ALL_ITEMS, getItemBySlug } from "@/lib/menu";
import { ProductDetail } from "@/components/menu/ProductDetail";

// Static export: every item page is prerendered at build time, so the dynamic
// [slug] segment MUST enumerate its params here (the build fails otherwise).
export function generateStaticParams() {
  return ALL_ITEMS.map((item) => ({ slug: item.slug }));
}

// `params` is a Promise in this Next version — await it.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = getItemBySlug(slug);
  if (!found) return { title: `Menu — ${SITE.name}` };
  return {
    title: `${found.item.name} — ${SITE.name}`,
    description: found.item.description ?? SITE.description,
  };
}

export default async function MenuItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = getItemBySlug(slug);
  if (!found) notFound();

  const { item, category } = found;
  // Up to 4 siblings from the same category (minus this item) for the strip.
  const related = category.items.filter((it) => it.slug !== item.slug).slice(0, 4);

  return <ProductDetail item={item} category={category} related={related} />;
}
