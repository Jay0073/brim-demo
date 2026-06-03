"use client";

// ─────────────────────────────────────────────────────────────────────────
//  Cart — app-wide client state for the shoppable menu demo.
//
//  Lines are stored as { slug, qty }; names/images/prices are resolved on read
//  via getItemBySlug + priceOf so the cart never holds stale copies of the menu.
//  Persisted to localStorage, but ONLY after mount (see `hydrated`) so the
//  server-rendered HTML and the first client render always agree — otherwise a
//  saved cart would cause a hydration mismatch.
// ─────────────────────────────────────────────────────────────────────────
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getItemBySlug } from "@/lib/menu";
import { priceOf } from "@/lib/pricing";

export interface CartLine {
  slug: string;
  qty: number;
}

interface CartContextValue {
  lines: CartLine[];
  /** Total number of items (sum of quantities). */
  count: number;
  /** Sum of price × qty across all lines, in pounds. */
  subtotal: number;
  /** True once localStorage has been read — gate count-dependent UI on this. */
  hydrated: boolean;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  // Drawer open/close lives here so any button (navbar, card, PDP) can open it.
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "brim.cart.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load any saved cart after mount (never during render → no SSR mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) {
          // Drop lines whose item no longer exists in the menu.
          setLines(parsed.filter((l) => l?.slug && getItemBySlug(l.slug)));
        }
      }
    } catch {
      // Corrupt/blocked storage — start empty.
    }
    setHydrated(true);
  }, []);

  // Persist on change, but only once we've hydrated (don't clobber the saved
  // cart with the empty initial state before it's loaded).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Ignore quota/private-mode errors.
    }
  }, [lines, hydrated]);

  const add = useCallback((slug: string, qty = 1) => {
    if (!getItemBySlug(slug)) return;
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug);
      if (existing) {
        return prev.map((l) =>
          l.slug === slug ? { ...l, qty: l.qty + qty } : l
        );
      }
      return [...prev, { slug, qty }];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, qty } : l))
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const { count, subtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const line of lines) {
      count += line.qty;
      subtotal += priceOf(line.slug) * line.qty;
    }
    return { count, subtotal: Math.round(subtotal * 100) / 100 };
  }, [lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count,
      subtotal,
      hydrated,
      add,
      setQty,
      remove,
      clear,
      isOpen,
      open,
      close,
    }),
    [lines, count, subtotal, hydrated, add, setQty, remove, clear, isOpen, open, close]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Access the cart. Throws if used outside <CartProvider>. */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
