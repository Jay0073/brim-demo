import { Hero } from "@/components/sections/Hero";
import { Specials } from "@/components/sections/Specials";
import { HowItsMade } from "@/components/sections/HowItsMade";
import { ExploreCTA } from "@/components/sections/ExploreCTA";

// Landing page composition. Order matters for the scroll story:
//   Hero (video) → How It's Made (pinned) → Specials (the lineup) → Explore CTAs
//   → Footer (in layout).
export default function Home() {
  return (
    <>
      <Hero />
      <HowItsMade />
      <Specials />
      <ExploreCTA />
    </>
  );
}
