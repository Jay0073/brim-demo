"use client";

// Cart entry point: a bag glyph with a live item-count badge that opens the
// drawer. Used in the navbar and in the menu's top cart bar. The badge only
// renders after `hydrated` so the server HTML (which can't know localStorage)
// matches the first client paint.
import { useCart } from "./CartProvider";

export function CartButton({
  className = "",
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { count, hydrated, open } = useCart();
  const badge = hydrated && count > 0 ? count : null;

  return (
    <button
      type="button"
      onClick={open}
      aria-label={badge ? `Open cart, ${badge} items` : "Open cart"}
      className={`relative inline-flex items-center gap-2 rounded-full transition-colors ${className}`}
    >
      <span className="relative grid place-items-center">
        <BagIcon className="h-5 w-5" />
        {badge !== null && (
          <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-brim px-1 text-[0.6rem] font-bold leading-none text-ink">
            {badge}
          </span>
        )}
      </span>
      {showLabel && <span className="text-sm font-semibold">Cart</span>}
    </button>
  );
}

function BagIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
