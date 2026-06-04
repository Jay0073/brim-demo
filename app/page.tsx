// TEMP: original interactive hero commented out — using the video hero below.
// import { Hero } from "@/components/sections/Hero";
import { Preloader } from "@/components/sections/Preloader";
import { HeroVideo } from "@/components/sections/HeroVideo";
import { Specials } from "@/components/sections/Specials";
import { HowItsMade } from "@/components/sections/HowItsMade";
import { BrimBuild } from "@/components/sections/BrimBuild";
import { BrandStory } from "@/components/sections/BrandStory";
import { ExploreCTA } from "@/components/sections/ExploreCTA";

// Landing page composition. Order matters for the scroll story:
//   Hero (video) → How It's Made (pinned) → Specials (the lineup) → Brim Build
//   (anatomy of a burger) → Explore CTAs → Brand Story (the chronicle)
//   → Footer (in layout).
export default function Home() {
  return (
    <>
      <Preloader />
      {/* TEMP: <Hero /> */}
      <HeroVideo />
      <HowItsMade />
      {/* <Specials /> */}
      <BrimBuild />
      <ExploreCTA />
      <BrandStory />
    </>
  );
}
