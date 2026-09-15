// import { Preloader } from "@/components/sections/Preloader";
import { HeroVideo } from "@/components/sections/HeroVideo";
import { HowItsMade } from "@/components/sections/HowItsMade";
import { HomeCategories } from "@/components/sections/HomeCategories";
import { HomeLocations } from "@/components/sections/HomeLocations";

export default function Home() {
  return (
    <>
      {/* <Preloader /> */}
      <HeroVideo />
      <HowItsMade />
      <HomeCategories />
      <HomeLocations />
    </>
  );
}
