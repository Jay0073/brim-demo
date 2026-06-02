import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { LocationsExperience } from "@/components/locations/LocationsExperience";

export const metadata: Metadata = {
  title: `Locations — ${SITE.name}`,
  description:
    "Find your nearest Brim across the UK & Pakistan. Spin the globe for directions, opening hours and the latest Google reviews.",
};

export default function LocationsPage() {
  return <LocationsExperience />;
}
