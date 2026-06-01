// ─────────────────────────────────────────────────────────────────────────
//  Menu data — single source of truth for the Menu page.
//  Descriptions are the real Brim copy (they already explain "what's in it").
//  Tags/spice/keywords power the filters + the lightweight semantic search.
// ─────────────────────────────────────────────────────────────────────────

export type DietTag =
  | "spicy"
  | "veggie"
  | "chicken"
  | "beef"
  | "cheesy"
  | "sweet";

export type SpiceLevel = 0 | 1 | 2 | 3;

export interface MenuItem {
  slug: string;
  name: string;
  description?: string;
  /** Flavours/options shown as chips (shakes, dips, drinks, seasonings). */
  variants?: string[];
  tags: DietTag[];
  spice?: SpiceLevel;
  /** Optional product shot at /public/menu/<slug>.jpg (placeholder if absent). */
  image?: string;
  /** Larger, inverted (black) card for hero items. */
  featured?: boolean;
  /** Tiny catchy label, e.g. "The original". */
  badge?: string;
  /** Extra search terms beyond name/description. */
  keywords?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  /** Catchy one-liner under the section header. */
  tagline: string;
  items: MenuItem[];
}

// ── Burger size system (the 4oz / 8oz / 12oz ladder) ──────────────────────
export const BURGER_SIZES = [
  { layers: 1, oz: "4oz", name: "Standard", note: "Single smash" },
  { layers: 2, oz: "8oz", name: "Serious", note: "Double stack" },
  { layers: 3, oz: "12oz", name: "Smashing", note: "Triple threat" },
] as const;

// ── Build-your-own options ────────────────────────────────────────────────
export const BUILD_YOUR_OWN = {
  rule: "Choose any 4 toppings plus 2 sauces (rashers excluded).",
  toppings: [
    "Lettuce",
    "Grilled Onions",
    "American Cheese",
    "Onion Rings",
    "Caramelised Onions",
    "Gherkins",
    "Cheddar Cheese",
    "Hash Brown",
    "Jalapeño",
    "Pineapple",
    "Cheese Sauce",
    "Chilli Jam",
    "Tomatoes",
    "Fried Egg",
    "Grilled Mushrooms",
  ],
  sauces: [
    "BRIM Burger Sauce",
    "Signature Sauce",
    "Sweet Chilli",
    "BBQ North",
    "Wild West",
    "Habañero",
  ],
  extra: "Add rashers anytime.",
};

// ── Dietary filter facets (chips in the control bar) ──────────────────────
export const DIET_FILTERS: { id: DietTag; label: string }[] = [
  { id: "spicy", label: "🌶 Spicy" },
  { id: "veggie", label: "Veggie" },
  { id: "chicken", label: "Chicken" },
  { id: "beef", label: "Beef" },
  { id: "cheesy", label: "Cheesy" },
  { id: "sweet", label: "Sweet" },
];

// Synonyms make the search feel "semantic" without a backend: a query token
// matches if the token OR any of its synonyms appears in the item haystack.
export const SEARCH_SYNONYMS: Record<string, string[]> = {
  spicy: ["chilli", "chili", "hot", "jalapeño", "jalapeno", "habañero", "habanero", "fiery", "heat", "🌶"],
  hot: ["spicy", "chilli", "jalapeño", "habañero", "fiery"],
  veggie: ["vegetarian", "vegan", "plant", "plant-based", "meat-free", "meatless"],
  vegan: ["veggie", "plant", "plant-based"],
  cheese: ["cheesy", "cheddar", "american", "monterey", "mozzarella"],
  cheesy: ["cheese", "cheddar", "american"],
  beef: ["patty", "smash", "burger", "steak"],
  chicken: ["tender", "fillet", "breaded", "poultry", "turkey"],
  sweet: ["chocolate", "vanilla", "caramel", "biscoff", "nutella", "oreo", "dessert", "shake", "milkshake"],
  shake: ["milkshake", "sweet", "thick"],
  fries: ["chips", "fry"],
  dog: ["hotdog", "frankfurter", "sausage"],
  kids: ["jr", "junior", "child", "little", "baby"],
};

export const MENU: MenuCategory[] = [
  {
    id: "burgers",
    name: "Burgers",
    tagline: "Smashed, never frozen — the reason you walked in.",
    items: [
      {
        slug: "brim-burger",
        name: "Brim Burger",
        description:
          "Double American cheese, lettuce, tomatoes, gherkins, BRIM Burger Sauce & Signature Sauce in a seeded brioche bun.",
        tags: ["beef", "cheesy"],
        badge: "The original",
        featured: true,
      },
      {
        slug: "bbq-rasher",
        name: "BBQ Rasher",
        description:
          "Double cheese, rashers of bacon, two onion rings, lettuce, caramelised onions, BBQ North & our BRIM Burger Sauce in a seeded brioche bun.",
        tags: ["beef", "cheesy"],
        keywords: ["bacon", "smoky", "bbq"],
      },
      {
        slug: "veggie-burger",
        name: "Veggie Burger",
        description:
          "A plant-based patty layered with lettuce and onion, topped with our Signature Sauce and Burger Sauce, all in a seeded bun.",
        tags: ["veggie"],
        badge: "Plant-based",
        keywords: ["vegan", "meat-free"],
      },
      {
        slug: "brim-maniac",
        name: "BRIM Maniac",
        description:
          "20oz of patties, 5 cheese layers, caramelised onions, chilli jam, our BRIM Burger Sauce with 3 slices of turkey bacon & 2 onion rings in a seeded brioche bun.",
        tags: ["beef", "cheesy"],
        spice: 1,
        badge: "20oz of chaos",
        featured: true,
        keywords: ["biggest", "challenge", "stack"],
      },
      {
        slug: "the-meltdown",
        name: "The Meltdown",
        description:
          "Hot cheese sauce, lettuce, onion, tomato & BRIM Burger Sauce in a seeded brioche bun.",
        tags: ["veggie", "cheesy"],
        keywords: ["cheese sauce", "meat-free"],
      },
      {
        slug: "smashed-shrooms",
        name: "Smashed Shrooms",
        description:
          "Grilled mushrooms & grilled onions, double cheese, ketchup, BRIM Burger Sauce & our Signature Sauce in a seeded brioche bun.",
        tags: ["veggie", "cheesy"],
        keywords: ["mushroom"],
      },
      {
        slug: "fiery-brimstone",
        name: "Fiery BRIMstone",
        description:
          "Jalapeños, double cheese, lettuce, Habañero Sauce & BRIM Burger Sauce in a seeded brioche bun.",
        tags: ["beef", "cheesy", "spicy"],
        spice: 3,
        badge: "Bring water",
      },
      {
        slug: "sweet-chilli-time",
        name: "Sweet Chilli Time",
        description:
          "Chilli jam, double cheese, lettuce, tomato, Sweet Chilli Sauce & BRIM Burger Sauce.",
        tags: ["beef", "cheesy", "spicy"],
        spice: 1,
        keywords: ["sweet"],
      },
      {
        slug: "hawaiian-heaven",
        name: "Hawaiian Heaven",
        description:
          "Turkey rashers, grilled pineapple, lettuce, onion & tomato, topped with our BRIM Burger Sauce in a seeded brioche bun.",
        tags: ["chicken"],
        badge: "Pineapple belongs",
        keywords: ["turkey", "pineapple", "sweet"],
      },
      {
        slug: "the-chicken-run",
        name: "The Chicken Run",
        description:
          "Breaded chicken fillet, Monterey Jack cheese, lettuce, tomato & Signature Sauce in a seeded brioche bun.",
        tags: ["chicken", "cheesy"],
        badge: "Crispy & golden",
      },
    ],
  },
  {
    id: "brim-box",
    name: "Brim Box",
    tagline: "One box. Total carnage.",
    items: [
      {
        slug: "loaded-box",
        name: "Loaded",
        description:
          "Fries, a beef patty covered with hot cheese sauce, burger sauce, signature sauce & American cheese, topped with crispy onions and chives.",
        tags: ["beef", "cheesy"],
        featured: true,
        badge: "Fork required",
      },
    ],
  },
  {
    id: "hot-dogs",
    name: "Hot Dogs",
    tagline: "Not your average frank.",
    items: [
      {
        slug: "classic-hot-dog",
        name: "Classic Hot Dog",
        description: "Ketchup & melted cheese in a brioche roll.",
        tags: ["cheesy"],
      },
      {
        slug: "loaded-dog",
        name: "Loaded Dog",
        description:
          "Frankfurter with turkey rashers, grilled onions, melted cheese, ketchup, chives and Wild West Sauce in a brioche roll, topped with crispy onions.",
        tags: ["cheesy", "chicken"],
        keywords: ["turkey", "loaded"],
      },
      {
        slug: "smokin-dog",
        name: "Smokin’ Dog",
        description:
          "Jalapeño, melted cheese, Habañero Hot Sauce, ketchup, chives & crispy onions in a brioche roll.",
        tags: ["cheesy", "spicy"],
        spice: 2,
      },
      {
        slug: "street-dog",
        name: "Street Dog",
        description:
          "Grilled onions, melted cheese, ketchup, chives, Wild West Sauce in a brioche roll, topped with crispy onions.",
        tags: ["cheesy"],
      },
    ],
  },
  {
    id: "brim-tots",
    name: "Brim Tots",
    tagline: "Tiny. Crispy. Dangerous.",
    items: [
      {
        slug: "classic-tots",
        name: "Classic Tots",
        description:
          "Breaded potato tots covered in BBQ sauce, our Wild West Sauce & topped with spring onions.",
        tags: ["veggie"],
      },
      {
        slug: "cheesy-tots",
        name: "Cheesy Tots",
        description:
          "Breaded potato tots covered in hot cheese sauce & topped with crispy onions.",
        tags: ["veggie", "cheesy"],
      },
      {
        slug: "hot-tots",
        name: "Hot Tots",
        description:
          "Breaded potato tots covered in BRIM Signature Sauce, jalapeño & cheese sauce.",
        tags: ["veggie", "cheesy", "spicy"],
        spice: 2,
      },
    ],
  },
  {
    id: "fries",
    name: "Fries",
    tagline: "Skin-on, hand-cut, fully loaded.",
    items: [
      {
        slug: "skin-on-fries",
        name: "Skin-On Fries",
        description: "Our classic skin-on fries. Add a seasoning:",
        variants: ["Herb & Garlic Salt", "Cayenne & Oregano"],
        tags: ["veggie"],
        keywords: ["chips"],
      },
      {
        slug: "sweet-potato-fries",
        name: "Sweet Potato Fries",
        tags: ["veggie", "sweet"],
      },
      {
        slug: "cheesy-fries",
        name: "Cheesy Fries",
        tags: ["veggie", "cheesy"],
      },
      {
        slug: "commando-fries",
        name: "Commando Fries",
        description:
          "Hot cheese sauce, Wild West Sauce, topped with crispy roasted onions.",
        tags: ["veggie", "cheesy"],
      },
      {
        slug: "dynamite-fries",
        name: "Dynamite Fries",
        description:
          "Hot cheese sauce, jalapeño, Habañero Hot Sauce & crispy roasted onions, topped with chives.",
        tags: ["veggie", "cheesy", "spicy"],
        spice: 3,
        badge: "Handle with care",
      },
    ],
  },
  {
    id: "sides",
    name: "Sides",
    tagline: "The supporting cast that steals the show.",
    items: [
      { slug: "chicken-tenders", name: "Chicken Tenders", tags: ["chicken"] },
      { slug: "onion-rings", name: "Onion Rings", tags: ["veggie"] },
      {
        slug: "cheese-stuffed-rings",
        name: "Cheese Stuffed Rings",
        tags: ["veggie", "cheesy"],
      },
      {
        slug: "mac-cheese-bites",
        name: "Mac & Cheese Bites",
        tags: ["veggie", "cheesy"],
      },
      {
        slug: "volcanic-cheese-bites",
        name: "Volcanic Cheese Bites",
        tags: ["veggie", "cheesy", "spicy"],
        spice: 2,
      },
    ],
  },
  {
    id: "dips",
    name: "Dips",
    tagline: "Dunk responsibly.",
    items: [
      {
        slug: "dips",
        name: "Dips",
        description: "Cool, classic, dunk-anything sauces.",
        variants: ["BRIM Burger Sauce", "Sweet Chilli", "BBQ North"],
        tags: [],
      },
      {
        slug: "dips-with-a-kick",
        name: "With a Kick",
        description: "For when you want it to bite back.",
        variants: ["Signature Sauce", "Wild West", "Habañero"],
        tags: ["spicy"],
        spice: 2,
      },
    ],
  },
  {
    id: "jr-brim",
    name: "Jr Brim",
    tagline: "Little legends eat here too.",
    items: [
      {
        slug: "chicken-little",
        name: "Chicken Little",
        description: "Chicken tenders, fries & a drink.",
        tags: ["chicken"],
        keywords: ["kids", "junior"],
      },
      {
        slug: "baby-burger",
        name: "Baby Burger",
        description: "2oz kids burger (plain with ketchup), fries & a drink.",
        tags: ["beef"],
        keywords: ["kids", "junior"],
      },
    ],
  },
  {
    id: "shakes",
    name: "Shakes",
    tagline: "Thick enough to stand a spoon in.",
    items: [
      {
        slug: "classic-shakes",
        name: "Classic Shakes",
        description: "The timeless four, blended thick.",
        variants: ["Chocolate", "Vanilla", "Strawberry", "Banana"],
        tags: ["sweet"],
      },
      {
        slug: "brim-shakes",
        name: "BRIM Shakes",
        description: "Loaded, indulgent, dessert-in-a-cup specials.",
        variants: [
          "Lotus Biscoff",
          "Salted Caramel",
          "Kinder Bueno White",
          "Ferrero Rocher & Nutella",
          "Reese’s",
          "Oreo",
        ],
        tags: ["sweet"],
        featured: true,
        badge: "Fan favourite",
      },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    tagline: "Save room. Trust us.",
    items: [
      {
        slug: "brim-brownie-special",
        name: "BRIM Brownie Special",
        description:
          "Hot layered brownies infused with ice cream & hot chocolate sauce.",
        tags: ["sweet"],
        featured: true,
        badge: "Best warm",
      },
    ],
  },
  {
    id: "drinks",
    name: "Drinks",
    tagline: "Wash it all down.",
    items: [
      {
        slug: "drinks",
        name: "Drinks",
        description: "Ice-cold and ready.",
        variants: [
          "Coca Cola",
          "Diet Coke",
          "Sprite",
          "Orange Fanta",
          "Lilt",
          "Evian Water",
        ],
        tags: [],
      },
    ],
  },
];

// ── Search helper (lightweight "semantic" matching) ───────────────────────
function haystack(item: MenuItem, categoryName: string): string {
  return [
    item.name,
    item.description ?? "",
    categoryName,
    ...(item.variants ?? []),
    ...item.tags,
    ...(item.keywords ?? []),
  ]
    .join(" ")
    .toLowerCase();
}

/** Every query word must match (after synonym expansion) — AND across words. */
export function itemMatchesQuery(
  item: MenuItem,
  categoryName: string,
  query: string
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = haystack(item, categoryName);
  const tokens = q.split(/\s+/).filter(Boolean);
  return tokens.every((tok) => {
    const variants = [tok, ...(SEARCH_SYNONYMS[tok] ?? [])];
    return variants.some((v) => hay.includes(v));
  });
}

export function itemMatchesDiet(item: MenuItem, diets: DietTag[]): boolean {
  if (diets.length === 0) return true;
  return diets.some((d) => item.tags.includes(d));
}
