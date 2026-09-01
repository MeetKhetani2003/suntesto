"use client";

import Image from "next/image";

type FlavorItem = {
  id: string;
  name: string;
  desc: string;
  imageSrc: string;
};

const FLAVORS: FlavorItem[] = [
  {
    id: "strawberry",
    name: "FREEZE-DRIED STRAWBERRY",
    desc: "100% natural, crisp strawberry crunch",
    imageSrc: "/images/sustento-pouch-strawberry.jpg",
  },
  {
    id: "chocolate-strawberry",
    name: "CHOCOLATE STRAWBERRY",
    desc: "Freeze-dried strawberries dipped in dark chocolate",
    imageSrc: "/images/sustento-pouch-chocolate-strawberry.jpg",
  },
  {
    id: "mango",
    name: "FREEZE-DRIED MANGO",
    desc: "Deliciously sweet Alphonso mango slices",
    imageSrc: "/images/sustento-pouch-mango.jpg",
  },
  {
    id: "banana",
    name: "FREEZE-DRIED BANANA",
    desc: "Sweet and crispy banana crunchies",
    imageSrc: "/images/sustento-pouch-banana.jpg",
  },
  {
    id: "pineapple",
    name: "FREEZE-DRIED PINEAPPLE",
    desc: "Tangy and tropical pineapple chunks",
    imageSrc: "/images/sustento-pouch-pineapple.jpg",
  },
  {
    id: "lemon",
    name: "FREEZE-DRIED LEMON",
    desc: "Zingy, refreshing freeze-dried lemon wedges",
    imageSrc: "/images/sustento-pouch-lemon.jpg",
  },
];

export default function FlavoursScroll() {
  return (
    <section className="w-full bg-warm-white py-16 overflow-hidden select-none">
      {/* ── Header Block ─────────────────────────────────────── */}
      <div className="w-full max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
        
        {/* Left Column: Heading */}
        <div className="flex flex-col items-start">
          <h2 className="font-primary font-black text-3xl sm:text-4xl md:text-[49px] text-charcoal leading-none uppercase tracking-tight">
            6 FLAVOURS <br />
            ZERO FAKING
          </h2>
          <p className="font-accent text-md sm:text-lg text-body mt-2.5 italic">
            just fruit &amp; superfood goodness
          </p>
        </div>

        {/* Right Column: Copy text block */}
        <div className="flex flex-col">
          <p className="font-primary font-bold text-lg sm:text-xl md:text-[26px] text-charcoal leading-snug max-w-[560px]">
            Our sachets are colorful, sometimes inconsistent{" "}
            <span className="font-accent text-yellow font-bold italic inline-block mx-1">
              (because real fruit doesn&apos;t do uniform)
            </span>{" "}
            that&apos;s how you know it&apos;s honest.
          </p>
        </div>

      </div>

      {/* ── Horizontal Scrolling Flavors Gallery (Clipped to background) ── */}
      <div className="w-full px-4 md:px-8">
        <div className="scroll-hide flex gap-8 md:gap-12 pb-8 overflow-x-auto w-full max-w-[1400px] mx-auto px-4">
          {FLAVORS.map((flavor) => (
            <div
              key={flavor.id}
              className="relative flex flex-col items-center shrink-0 w-[250px] md:w-[290px] transition-transform duration-300 hover:scale-[1.03]"
            >
              {/* Product Pouch + Scattered Ingredients Composite Image */}
              <div className="relative w-full aspect-square flex items-center justify-center">
                <Image
                  src={flavor.imageSrc}
                  alt={flavor.name}
                  fill
                  sizes="(max-width: 768px) 250px, 290px"
                  className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)] rounded-[32px]"
                  priority
                />
              </div>

              {/* Flavor Label Details */}
              <div className="text-center w-full mt-4">
                <span className="block font-primary font-black text-sm md:text-md text-charcoal tracking-wide uppercase">
                  {flavor.name}
                </span>
                <span className="block font-accent text-xs md:text-sm text-body/90 mt-1 italic">
                  {flavor.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
