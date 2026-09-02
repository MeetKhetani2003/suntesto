import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import FreezeDryingMagic from "@/components/sections/FreezeDryingMagic";
import ProductFormula from "@/components/sections/ProductFormula";
import ProductTabs from "@/components/sections/ProductTabs";
import KidsParents from "@/components/sections/KidsParents";
import FlavoursScroll from "@/components/sections/FlavoursScroll";
import WhatWeServed from "@/components/sections/WhatWeServed";
import SmoothiesCTA from "@/components/sections/SmoothiesCTA";
import LimitedEdition from "@/components/sections/LimitedEdition";
import RawFoodProcess from "@/components/sections/RawFoodProcess";
import RealPeople from "@/components/sections/RealPeople";
import FrequentlyBought from "@/components/sections/FrequentlyBought";
import FreezeDryingProcess from "@/components/sections/FreezeDryingProcess";
import RealPeoplePureLove from "@/components/sections/RealPeoplePureLove";
import InstagramGrid from "@/components/sections/InstagramGrid";
import Footer from "@/components/layout/Footer";

/**
 * Home page — sections are assembled here module by module.
 */
export default function HomePage() {
  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <Header />

      <main className="w-full">
        {/* ── Hero Banner with bottom wavy ticker ───────────── */}
        <Hero />

        {/* ── Magic of Freeze Drying Section ─────────────────── */}


        {/* ── Product Formula Section ───────────────────────── */}
        <ProductFormula />

        {/* ── Product Tabs & Card Grid ──────────────────────── */}
        <ProductTabs />

        {/* ── Kids Love & Parents Trust / Clean Label Section ── */}
        <KidsParents />

        {/* ── 5 Flavors Zero Faking Scroll Section ───────────── */}
        {/* <FlavoursScroll /> */}

        {/* ── What We Served Section ─────────────────────────── */}
        <WhatWeServed />

        {/* ── Reels Video CTA Section ────────────────────────── */}
        <SmoothiesCTA />

        {/* ── Limited Edition Hamper Banner Section ──────────── */}
        <LimitedEdition />

        {/* ── Raw Food Process / Spoilage Section ────────────── */}
        <RawFoodProcess />

        {/* ── Freeze-Drying Step Process Section ──────────────── */}
        <FreezeDryingProcess />

        {/* ── Real People transparency Section ────────────────── */}
        {/* <RealPeople /> */}
        <RealPeoplePureLove />

        {/* ── Frequently Bought Together Section ─────────────── */}
        <FrequentlyBought />
        <FreezeDryingMagic />
        {/* ── Instagram Photo Grid Section ───────────────────── */}
        <InstagramGrid />

      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <Footer />
    </>
  );
}
