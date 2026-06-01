// Central site config — single source of truth for nav, brand copy, contact.
// Keep this lean; pages/components import from here so we never duplicate strings.

export const SITE = {
  name: "Brim Burgers",
  shortName: "BRIM",
  tagline: "Smashed. Halal. Unforgettable.",
  description:
    "100% grass-fed, strictly Halal smash burgers. Franchises across the UK & Pakistan.",
  contact: {
    email: "info@brimburgers.com",
    franchiseEmail: "franchise@brimburgers.com",
    phone: "0203 442 9794",
    phoneHours: "Office hours · 9–5",
    address:
      "1c Amberside, Wood Lane, Hemel Hempstead, Hertfordshire, United Kingdom, HP2 4TP",
  },
} as const;

// Primary navigation. `/` (landing) is reached via the logo, so it's not listed.
export const NAV_LINKS = [
  { label: "Menu", href: "/menu" },
  { label: "Locations", href: "/locations" },
  { label: "Franchising", href: "/franchising" },
] as const;
