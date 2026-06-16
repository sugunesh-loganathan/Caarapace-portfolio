"use client";

import { useState } from "react";
import { LenisProvider } from "@/lib/lenis";
import Preloader from "@/components/layout/Preloader";
import ScrollProgress from "@/components/ui/ScrollProgress";
import SectionNav, { type SectionNavItem } from "@/components/ui/SectionNav";
import SlideArrows from "@/components/ui/SlideArrows";
import Hero from "@/components/sections/Hero";
import BusinessReality from "@/components/sections/BusinessReality";
import Challenges from "@/components/sections/Challenges";
import Introducing from "@/components/sections/Introducing";
import WhyChoose from "@/components/sections/WhyChoose";
import Journey from "@/components/sections/Journey";
import Finale from "@/components/sections/Finale";

const SECTIONS: SectionNavItem[] = [
  { id: "hero", label: "Intro" },
  { id: "reality", label: "Reality" },
  { id: "challenges", label: "Challenges" },
  { id: "introducing", label: "Caarapace" },
  { id: "why", label: "Why Us" },
  { id: "journey", label: "Journey" },
  { id: "finale", label: "Finale" },
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <LenisProvider>
      <Preloader onComplete={() => setLoaded(true)} />
      <ScrollProgress />
      <SectionNav sections={SECTIONS} visible={loaded} />
      <SlideArrows sectionIds={SECTIONS.map((s) => s.id)} visible={loaded} />

      <main className="relative bg-white">
        <Hero id="hero" started={loaded} />
        <BusinessReality id="reality" />
        <Challenges id="challenges" />
        <Introducing id="introducing" />
        <WhyChoose id="why" />
        <Journey id="journey" />
        <Finale id="finale" />
      </main>
    </LenisProvider>
  );
}
