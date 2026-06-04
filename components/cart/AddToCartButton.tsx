"use client";

// Add-to-cart control with two looks:
//  • "icon" — a round + button that overlays a menu card's image. It lives as a
//    SIBLING of the card's <Link> (not inside it), and still preventDefaults so
//    a click adds to the cart without ever navigating to the detail page.
//  • "full" — a wide pill for the product detail page. With `buyNow`, it also
//    opens the cart drawer so "Buy now" jumps straight to checkout.
import { useState } from "react";
import { useCart } from "./CartProvider";

interface Props {
  slug: string;
  variant?: "icon" | "full";
  qty?: number;
  /** Full variant only: open the drawer after adding ("Buy now"). */
  buyNow?: boolean;
  label?: string;
  className?: string;
}

export function AddToCartButton({
  slug,
  variant = "icon",
  qty = 1,
  buyNow = false,
  label,
  className = "",
}: Props) {
  const { add, open } = useCart();
  const [pulse, setPulse] = useState(false);

  function handleClick(e: React.MouseEvent) {
    // Critical for the card overlay: don't let the click bubble to the Link.
    e.preventDefault();
    e.stopPropagation();
    add(slug, qty);
    if (buyNow) open();
    setPulse(true);
    window.setTimeout(() => setPulse(false), 450);
  }

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 cursor-pointer text-sm font-semibold uppercase tracking-wide transition-transform active:scale-95 ${className}`}
      >
        <PlusIcon className="h-4 w-4" />
        {label ?? "Add to cart"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Add to cart"
      className={`grid h-10 w-10 place-items-center cursor-pointer rounded-full bg-ink text-paper shadow-lg shadow-black/30 transition-transform hover:bg-brim hover:text-ink active:scale-90 ${
        pulse ? "scale-110" : ""
      } ${className}`}
    >
      <PlusIcon className="h-5 w-5" />
    </button>
  );
}

function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
