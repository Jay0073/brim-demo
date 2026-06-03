"use client";

// Slide-over cart + demo checkout. Rendered once, globally, from the root
// layout (inside <CartProvider>). Lists the cart lines with quantity steppers,
// shows a subtotal, and a "Pay" button that swaps to an "Order placed 🎉"
// confirmation and clears the cart — a self-contained demo, no real payment.
import { useEffect, useState } from "react";
import Link from "next/link";
import { getItemBySlug } from "@/lib/menu";
import { priceOf, formatGBP } from "@/lib/pricing";
import { asset } from "@/lib/asset";
import { useCart } from "./CartProvider";

export function CartDrawer() {
  const { lines, count, subtotal, isOpen, close, setQty, remove } = useCart();
  const [placed, setPlaced] = useState(false);

  // Reset the "order placed" screen whenever the drawer is reopened.
  useEffect(() => {
    if (isOpen) setPlaced(false);
  }, [isOpen]);

  // Close on Escape + lock body scroll while the drawer is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={close}
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-paper text-ink shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="font-display text-2xl uppercase leading-none">
            {placed ? "Order placed" : "Your order"}
            {!placed && count > 0 && (
              <span className="ml-2 align-middle text-sm font-medium text-ink/40">
                {count} {count === 1 ? "item" : "items"}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {placed ? (
          <ConfirmationView onDone={close} />
        ) : lines.length === 0 ? (
          <EmptyView onBrowse={close} />
        ) : (
          <>
            {/* Lines */}
            <ul className="flex-1 divide-y divide-ink/10 overflow-y-auto px-5">
              {lines.map((line) => {
                const found = getItemBySlug(line.slug);
                if (!found) return null;
                const { item } = found;
                const lineTotal = priceOf(item.slug) * line.qty;
                return (
                  <li key={line.slug} className="flex gap-3 py-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={asset(item.image)}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate font-semibold leading-tight">{item.name}</p>
                        <p className="shrink-0 font-semibold">{formatGBP(lineTotal)}</p>
                      </div>
                      <p className="text-xs text-ink/50">{formatGBP(priceOf(item.slug))} each</p>
                      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                        <Stepper
                          qty={line.qty}
                          onDec={() => setQty(line.slug, line.qty - 1)}
                          onInc={() => setQty(line.slug, line.qty + 1)}
                        />
                        <button
                          type="button"
                          onClick={() => remove(line.slug)}
                          className="text-xs font-medium uppercase tracking-wide text-ink/45 underline-offset-2 hover:text-brim hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Footer / pay */}
            <div className="border-t border-ink/10 px-5 py-4">
              <div className="flex items-center justify-between pb-3">
                <span className="text-sm font-medium uppercase tracking-wide text-ink/55">
                  Subtotal
                </span>
                <span className="font-display text-3xl leading-none">
                  {formatGBP(subtotal)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPlaced(true)}
                className="w-full rounded-full bg-ink py-3.5 text-sm font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-brim hover:text-ink"
              >
                Pay {formatGBP(subtotal)}
              </button>
              <p className="mt-2 text-center text-xs text-ink/40">
                Demo checkout — no payment is taken.
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function Stepper({
  qty,
  onDec,
  onInc,
}: {
  qty: number;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full ring-1 ring-ink/15">
      <button
        type="button"
        onClick={onDec}
        aria-label="Decrease quantity"
        className="grid h-8 w-8 place-items-center rounded-full text-lg leading-none text-ink/70 transition-colors hover:bg-ink/5"
      >
        −
      </button>
      <span className="w-7 text-center text-sm font-semibold tabular-nums">{qty}</span>
      <button
        type="button"
        onClick={onInc}
        aria-label="Increase quantity"
        className="grid h-8 w-8 place-items-center rounded-full text-lg leading-none text-ink/70 transition-colors hover:bg-ink/5"
      >
        +
      </button>
    </div>
  );
}

function EmptyView({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
      <p className="font-display text-3xl uppercase text-ink/80">Your cart is empty</p>
      <p className="text-sm text-ink/55">
        Add a smash burger, some loaded fries, a thick shake — then come back here
        to check out.
      </p>
      <Link
        href="/menu"
        onClick={onBrowse}
        className="mt-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-brim hover:text-ink"
      >
        Browse the menu
      </Link>
    </div>
  );
}

function ConfirmationView({ onDone }: { onDone: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
      <span className="text-6xl">🎉</span>
      <p className="font-display text-4xl uppercase leading-[0.9] text-ink">
        Order placed
      </p>
      <p className="max-w-xs text-sm text-ink/55">
        Thanks! This is a demo, so no payment was taken and nothing is on its way —
        but in a real BRIM, the griddle would already be screaming.
      </p>
      <button
        type="button"
        onClick={onDone}
        className="mt-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-brim hover:text-ink"
      >
        Done
      </button>
    </div>
  );
}
