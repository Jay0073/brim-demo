// ─────────────────────────────────────────────────────────────────────────
//  Menu — types, typed views over data/menu.json, and the search engine.
//
//  The DATA lives in `data/menu.json` (a single JSON object). This module is
//  the typed gateway to it: it casts the raw JSON into the interfaces below and
//  exposes the search helpers. Components import from here, never from the JSON
//  directly, so the types and the search stay in one place.
// ─────────────────────────────────────────────────────────────────────────

import menuData from "@/data/menu.json";

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
  /** Use a fixed, shorter image crop instead of the grow-to-fill one, so the
   *  tile stays compact while still matching its row-mates' height. */
  compact?: boolean;
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

export interface BurgerSize {
  layers: number;
  oz: string;
  name: string;
  note: string;
}

export interface BuildYourOwn {
  rule: string;
  toppings: string[];
  sauces: string[];
  extra: string;
}

// ── Typed views over the JSON data object ─────────────────────────────────
// JSON can't carry literal unions (e.g. `tags` reads back as `string[]`), so we
// assert the imported shapes onto the interfaces above. The data is validated
// by hand against these types — keep data/menu.json in step when editing.
export const MENU = menuData.categories as unknown as MenuCategory[];
export const BURGER_SIZES = menuData.burgerSizes as BurgerSize[];
export const BUILD_YOUR_OWN = menuData.buildYourOwn as BuildYourOwn;
export const DIET_FILTERS = menuData.dietFilters as { id: DietTag; label: string }[];
export const SEARCH_SYNONYMS = menuData.searchSynonyms as Record<string, string[]>;

// ═══════════════════════════════════════════════════════════════════════════
//  Search engine — ranked, synonym-aware, typo-tolerant lexical matching.
//
//  Not ML embeddings, but it *feels* semantic: query words are expanded through
//  a synonym map, matched across weighted fields (name beats description beats
//  category), tolerate small typos via edit distance, and every item gets a
//  score so the best matches float to the top. Every query word must land
//  somewhere (AND across words) — so "spicy chicken" needs both.
// ═══════════════════════════════════════════════════════════════════════════

// How much a hit in each field is worth. Name is king; category is a faint hint.
const FIELD_WEIGHTS = {
  name: 10,
  badge: 7,
  keywords: 7,
  tags: 6,
  description: 4,
  variants: 4,
  category: 2,
} as const;

interface WeightedField {
  /** Whole field text, lowercased (for substring checks). */
  text: string;
  /** Tokenised words of the field (for exact-word + fuzzy checks). */
  words: string[];
  weight: number;
}

// Filler words dropped from a query so natural-language phrasing still works:
// "something for kids" matches on "kids", "i want it spicy" matches on "spicy".
// Deliberately excludes food words (e.g. "hot" stays — it means spice).
const STOPWORDS = new Set([
  "a", "an", "and", "any", "anything", "are", "as", "at", "be", "best", "bit",
  "but", "by", "can", "combo", "dish", "dishes", "do", "eat", "find", "food",
  "for", "get", "give", "good", "has", "have", "i", "im", "in", "is", "it",
  "just", "like", "looking", "meal", "meals", "menu", "me", "my", "need",
  "nice", "of", "on", "option", "options", "or", "order", "please", "really",
  "show", "some", "something", "stuff", "super", "that", "the", "then", "thing",
  "things", "this", "to", "very", "want", "with", "you", "your",
]);

/** Strip accents and lowercase so "jalapeno" === "jalapeño", "habanero" too. */
const DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");
function norm(text: string): string {
  return text.normalize("NFD").replace(DIACRITICS, "").toLowerCase();
}

/** Normalise, then split on whitespace and the punctuation in menu copy. */
function words(text: string): string[] {
  return norm(text)
    .split(/[\s,.&/()'’"-]+/)
    .filter(Boolean);
}

/** Flatten an item into the weighted fields the scorer searches over. */
function itemFields(item: MenuItem, categoryName: string): WeightedField[] {
  const raw: [string, number][] = [
    [item.name, FIELD_WEIGHTS.name],
    [item.badge ?? "", FIELD_WEIGHTS.badge],
    [(item.keywords ?? []).join(" "), FIELD_WEIGHTS.keywords],
    [item.tags.join(" "), FIELD_WEIGHTS.tags],
    [item.description ?? "", FIELD_WEIGHTS.description],
    [(item.variants ?? []).join(" "), FIELD_WEIGHTS.variants],
    [categoryName, FIELD_WEIGHTS.category],
  ];
  return raw
    .filter(([text]) => text.length > 0)
    .map(([text, weight]) => ({
      text: text.toLowerCase(),
      words: words(text),
      weight,
    }));
}

/** Classic Levenshtein edit distance (rolling two-row DP). */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array<number>(n + 1);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

/** How many typos to forgive — scales with token length to avoid false hits. */
function fuzzAllowance(token: string): number {
  if (token.length <= 3) return 0; // too short — a 1-edit match is basically noise
  if (token.length <= 6) return 1;
  return 2;
}

/**
 * Best score for one (already lowercased) term in one field.
 * Exact word > prefix > substring > fuzzy. Synonyms are gently discounted so a
 * literal match always outranks a synonym match of equal field weight.
 */
function termFieldScore(term: string, field: WeightedField, isSynonym: boolean): number {
  const w = field.weight * (isSynonym ? 0.8 : 1);

  if (field.words.includes(term)) return w; // exact whole-word hit
  if (field.text.includes(term)) {
    const prefix = field.words.some((word) => word.startsWith(term));
    return w * (prefix ? 0.8 : 0.5); // "cheese" in "cheeseburger" vs mid-word
  }

  const allow = fuzzAllowance(term);
  if (allow === 0) return 0;
  let best = 0;
  for (const word of field.words) {
    if (Math.abs(word.length - term.length) > allow) continue;
    const d = levenshtein(word, term);
    if (d > 0 && d <= allow) best = Math.max(best, w * (d === 1 ? 0.45 : 0.3));
  }
  return best;
}

/** Score one query token (with its synonyms) across all of an item's fields. */
function tokenScore(token: string, fields: WeightedField[]): number {
  const terms: [string, boolean][] = [
    [token, false],
    ...(SEARCH_SYNONYMS[token] ?? []).map(
      (s) => [norm(s), true] as [string, boolean]
    ),
  ];
  let total = 0;
  for (const field of fields) {
    let bestForField = 0;
    for (const [term, isSyn] of terms) {
      bestForField = Math.max(bestForField, termFieldScore(term, field, isSyn));
    }
    total += bestForField; // presence in multiple fields compounds
  }
  return total;
}

/** AND-score an item against a list of already-resolved query tokens. */
function itemQueryScore(
  item: MenuItem,
  categoryName: string,
  tokens: string[]
): number {
  const fields = itemFields(item, categoryName);
  let total = 0;
  for (const token of tokens) {
    const s = tokenScore(token, fields);
    if (s <= 0) return 0; // every token must match somewhere (AND)
    total += s;
  }
  return total;
}

/** Tokenise a query: split, drop filler, fall back to raw if it's *all* filler. */
function queryTokens(query: string): string[] {
  const raw = words(query);
  const meaningful = raw.filter((t) => !STOPWORDS.has(t));
  return meaningful.length > 0 ? meaningful : raw;
}

/**
 * Keep only tokens that match at least one item *somewhere* in the menu.
 * This is what lets natural-language queries work: "i want something really
 * cheesy" keeps "cheesy" (it matches real items) and quietly drops "really"
 * (it matches nothing), instead of the unknown word nuking every result.
 */
function liveTokens(tokens: string[]): string[] {
  return tokens.filter((tok) =>
    MENU.some((cat) =>
      cat.items.some((it) => tokenScore(tok, itemFields(it, cat.name)) > 0)
    )
  );
}

/**
 * Relevance score for one item against a raw query. 0 means "no match".
 * Higher is better — sort descending to rank. (Single-item helper; the page
 * uses {@link rankMenu}, which also filters out menu-wide unknown words.)
 */
export function scoreItem(
  item: MenuItem,
  categoryName: string,
  query: string
): number {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return 0;
  return itemQueryScore(item, categoryName, tokens);
}

/** Boolean view of {@link scoreItem}. Empty query matches everything. */
export function itemMatchesQuery(
  item: MenuItem,
  categoryName: string,
  query: string
): boolean {
  if (!query.trim()) return true;
  return scoreItem(item, categoryName, query) > 0;
}

export function itemMatchesDiet(item: MenuItem, diets: DietTag[]): boolean {
  if (diets.length === 0) return true;
  return diets.some((d) => item.tags.includes(d));
}

/** A category with its items narrowed (and ranked, when searching) for the UI. */
export interface RankedCategory extends MenuCategory {
  filtered: MenuItem[];
}

/**
 * The Menu page's one-stop search: applies the query (ranked, synonym-aware,
 * typo-tolerant, filler-word tolerant) and the dietary chips, returning every
 * category with its `filtered` items. Categories stay in menu order; items
 * within a category are ranked best-match-first while searching.
 */
export function rankMenu(query: string, diets: DietTag[]): RankedCategory[] {
  const searching = query.trim().length > 0;
  // Only keep query words that actually discriminate; unknown filler is dropped.
  const tokens = searching ? liveTokens(queryTokens(query)) : [];

  return MENU.map((cat) => {
    const ranked = cat.items
      .map((it) => ({
        it,
        score: tokens.length ? itemQueryScore(it, cat.name, tokens) : 0,
      }))
      // A non-empty query with no usable tokens (gibberish) matches nothing;
      // an empty query keeps everything and only the diet chips filter.
      .filter(
        ({ it, score }) =>
          (searching ? score > 0 : true) && itemMatchesDiet(it, diets)
      );

    if (tokens.length) ranked.sort((a, b) => b.score - a.score);
    return { ...cat, filtered: ranked.map((r) => r.it) };
  });
}
