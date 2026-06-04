// ─────────────────────────────────────────────────────────────────────────
//  Menu extras — demo "product facts" for the detail / spotlight pages.
//
//  Most items in data/menu.json only carry name + description + tags. The
//  product pages want more to feel complete (Halal mark, heat, macros, allergens,
//  an ingredient breakdown). Rather than hand-authoring all of that for ~40
//  items, this module DERIVES plausible, deterministic demo facts from what each
//  item already has — and always defers to explicit JSON values when present.
//
//  Deterministic on purpose: same item → same numbers on every render (no
//  Math.random), so server and client agree and pages are stable.
// ─────────────────────────────────────────────────────────────────────────
import type { MenuItem, MenuCategory } from "./menu";

export interface Nutrition {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

export interface ProductFacts {
  halal: boolean;
  /** Heat descriptor, e.g. "Mild" — null when the item has no spice. */
  heat: string | null;
  nutrition: Nutrition;
  allergens: string[];
  /** Parsed "what's inside" chips. */
  ingredients: string[];
}

// The whole brand is strictly Halal — every food item carries the mark unless a
// JSON flag explicitly says otherwise.
export function isHalal(item: MenuItem): boolean {
  return item.halal ?? true;
}

// Heat label from explicit `heat`, else mapped from the 0–3 spice level.
const HEAT_BY_LEVEL = ["", "Mild", "Medium", "Hot"] as const;
export function heatLabel(item: MenuItem): string | null {
  if (item.heat) return item.heat;
  if (item.spice && item.spice > 0) return HEAT_BY_LEVEL[item.spice];
  return null;
}

// Per-category macro baselines. A small, deterministic per-item delta (derived
// from the slug) keeps sibling items from reading identically.
const MACRO_BASE: Record<string, Nutrition> = {
  burgers: { calories: 760, protein: "40g", carbs: "46g", fat: "44g" },
  sandos: { calories: 820, protein: "44g", carbs: "52g", fat: "47g" },
  "brim-box": { calories: 940, protein: "38g", carbs: "72g", fat: "54g" },
  "hot-dogs": { calories: 520, protein: "22g", carbs: "38g", fat: "31g" },
  "brim-tots": { calories: 430, protein: "12g", carbs: "44g", fat: "26g" },
  fries: { calories: 380, protein: "8g", carbs: "48g", fat: "20g" },
  sides: { calories: 410, protein: "15g", carbs: "36g", fat: "24g" },
  dips: { calories: 120, protein: "1g", carbs: "6g", fat: "11g" },
  "jr-brim": { calories: 450, protein: "20g", carbs: "40g", fat: "22g" },
  shakes: { calories: 620, protein: "12g", carbs: "78g", fat: "28g" },
  desserts: { calories: 560, protein: "9g", carbs: "70g", fat: "29g" },
  drinks: { calories: 140, protein: "0g", carbs: "35g", fat: "0g" },
};
const MACRO_FALLBACK: Nutrition = { calories: 600, protein: "24g", carbs: "48g", fat: "30g" };

/** Stable small integer (0–N) from a string — used to vary demo numbers. */
function hash(slug: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h % mod;
}

export function nutritionOf(item: MenuItem, categoryId: string): Nutrition {
  if (item.nutrition) return item.nutrition;
  const base = MACRO_BASE[categoryId] ?? MACRO_FALLBACK;
  // Deterministic ±60 kcal swing per slug (+ a bump for the big featured items).
  // protein/carbs/fat keep the category baseline — believable, and avoids
  // implying false gram-level precision on demo content.
  const calories = base.calories + (hash(item.slug, 13) * 10 - 60) + (item.featured ? 90 : 0);
  return { ...base, calories };
}

// Allergen inference from tags + category. Defers to explicit JSON allergens.
export function allergensOf(item: MenuItem, categoryId: string): string[] {
  if (item.allergens) return item.allergens;
  const a = new Set<string>();
  const bread =
    categoryId === "burgers" ||
    categoryId === "sandos" ||
    categoryId === "hot-dogs" ||
    categoryId === "jr-brim" ||
    categoryId === "brim-box";
  const fried =
    categoryId === "brim-tots" ||
    categoryId === "fries" ||
    categoryId === "sides";

  if (bread || fried || categoryId === "desserts") a.add("Gluten");
  if (item.tags.includes("cheesy") || item.tags.includes("sweet")) a.add("Milk");
  if (item.tags.includes("beef") || item.tags.includes("chicken")) {
    a.add("Egg");
    a.add("Mustard");
  }
  if (item.tags.includes("veggie")) a.add("Soya");
  return [...a];
}

// "What's inside" — parse the description into ingredient chips. Trims the
// trailing "in a … bun/roll" and the lead-in verbs so chips read cleanly.
export function ingredientsOf(item: MenuItem): string[] {
  if (!item.description) return item.variants ?? [];
  const cleaned = item.description
    .replace(/\s+in an?\b[^.]*$/i, "") // drop "in a seeded brioche bun"
    .replace(/\.$/, "");
  return cleaned
    .split(/,|\band\b|&/i)
    .map((s) =>
      s
        .trim()
        .replace(/^(topped with|covered in|filled with|with|our|the)\s+/i, "")
        .replace(/\s+$/, "")
        .trim()
    )
    .filter((s) => s.length > 1)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .slice(0, 12);
}

/** Everything the product pages need, in one call. */
export function productFacts(item: MenuItem, category: MenuCategory): ProductFacts {
  return {
    halal: isHalal(item),
    heat: heatLabel(item),
    nutrition: nutritionOf(item, category.id),
    allergens: allergensOf(item, category.id),
    ingredients: ingredientsOf(item),
  };
}
