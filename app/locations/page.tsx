import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { LocationsExperience } from "@/components/locations/LocationsExperience";
import { HalalPromise } from "@/components/sections/HalalPromise";

export const metadata: Metadata = {
  title: `Locations — ${SITE.name}`,
  description:
    "Find your nearest Brim across the UK — from Hemel Hempstead and Luton to London, Edinburgh and the branches opening next.",
};

export default function LocationsPage() {
  return (
    <div className="bg-paper text-ink [color-scheme:light]">
      <LocationsExperience />
      <HalalPromise variant="locations" />
    </div>
  );
}
