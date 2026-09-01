"use client";

import React from "react";

export default function FreezeDryingMagic() {
  return (
    <section className="w-full bg-[#fffff9] py-12 md:py-16 border-t border-black/5 select-none relative overflow-hidden">
      {/* Decorative background graphics/blobs */}
      <div className="absolute top-1/2 left-[-100px] w-[300px] h-[300px] bg-[#9EAB75]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-50px] right-[-50px] w-[250px] h-[250px] bg-[#9EAB75]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Side: Title */}
        <div className="lg:col-span-5 flex flex-col items-start text-left">
          <span className="font-primary font-bold text-xs tracking-widest text-[#9EAB75] uppercase mb-2">
            OUR SECRET PROCESS
          </span>
          <h2 className="relative font-primary font-black text-charcoal leading-tight uppercase tracking-tight text-[36px] sm:text-[44px] md:text-[52px]">
            THE MAGIC OF <br />
            <span className="text-[#9EAB75] relative inline-block">
              FREEZE DRYING
              {/* Hand-drawn underline */}
              <span className="absolute left-0 bottom-[-6px] w-full h-[6px] bg-[#9EAB75]/30 rounded-full" />
            </span>
            {/* Custom Heading Accent SVG Burst */}
            <svg 
              viewBox="0 0 40 40" 
              className="absolute -top-6 -right-10 w-9 h-9 text-[#9EAB75] fill-current opacity-85 hidden sm:block transform rotate-12"
            >
              <path d="M 8,24 C 7,20 6,15 5,8 C 8,9 11,11 13,13 C 11,17 9,21 8,24 Z" />
              <path d="M 13,18 C 16,15 21,11 26,7 C 27,10 27,14 27,17 C 22,18 17,18 13,18 Z" />
              <path d="M 16,21 C 21,21 27,21 32,22 C 31,24 28,26 26,27 C 22,25 19,23 16,21 Z" />
            </svg>
          </h2>
          <p className="font-accent text-lg sm:text-xl text-body mt-6 italic max-w-[400px]">
            Locking in natural nutrition, taste and crunch without any artificial preservatives.
          </p>
        </div>

        {/* Right Side: Timeline/Steppers content */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1 */}
          <div className="group bg-white border border-[#CBDCD0]/60 p-6 sm:p-8 hover:shadow-md hover:border-[#9EAB75]/30 transition-all duration-300 flex gap-4 sm:gap-5 items-start">
            <span className="flex-shrink-0 text-[#9EAB75] font-primary font-black text-xl select-none mt-0.5">
              -
            </span>
            <div className="space-y-2 text-left">
              <h3 className="font-primary font-black text-sm uppercase tracking-wider text-charcoal">
                Fresh Harvesting
              </h3>
              <p className="font-primary text-[13px] sm:text-sm text-charcoal/70 leading-relaxed font-semibold">
                We start with{" "}
                <span className="relative inline-block text-dark font-bold">
                  real, fresh fruits
                  <span className="absolute left-0 bottom-[-1px] w-full h-[2.5px] bg-[#9EAB75]/50 rounded-full" />
                </span>
                . Freeze them. Dry them gently.{" "}
                <span className="relative inline-block text-dark font-bold">
                  Keep the goodness
                  <span className="absolute left-0 bottom-[-1px] w-full h-[2.5px] bg-[#9EAB75]/50 rounded-full" />
                </span>
                .
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group bg-white border border-[#CBDCD0]/60 p-6 sm:p-8 hover:shadow-md hover:border-[#9EAB75]/30 transition-all duration-300 flex gap-4 sm:gap-5 items-start">
            <span className="flex-shrink-0 text-[#9EAB75] font-primary font-black text-xl select-none mt-0.5">
              -
            </span>
            <div className="space-y-2 text-left">
              <h3 className="font-primary font-black text-sm uppercase tracking-wider text-charcoal">
                Nutrient Preservation
              </h3>
              <p className="font-primary text-[13px] sm:text-sm text-charcoal/70 leading-relaxed font-semibold">
                What you get is{" "}
                <span className="relative inline-block text-dark font-bold">
                  100% real fruit
                  <span className="absolute left-0 bottom-[-1px] w-full h-[2.5px] bg-[#9EAB75]/50 rounded-full" />
                </span>{" "}
                that&apos;s light, crispy and full of{" "}
                <span className="relative inline-block text-dark font-bold">
                  natural flavour
                  <span className="absolute left-0 bottom-[-1px] w-full h-[2.5px] bg-[#9EAB75]/50 rounded-full" />
                </span>
                .
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group bg-white border border-[#CBDCD0]/60 p-6 sm:p-8 hover:shadow-md hover:border-[#9EAB75]/30 transition-all duration-300 flex gap-4 sm:gap-5 items-start">
            <span className="flex-shrink-0 text-[#9EAB75] font-primary font-black text-xl select-none mt-0.5">
              -
            </span>
            <div className="space-y-2 text-left">
              <h3 className="font-primary font-black text-sm uppercase tracking-wider text-charcoal">
                Pure Transformed
              </h3>
              <p className="font-primary text-[13px] sm:text-sm text-charcoal/70 leading-relaxed font-semibold">
                <span className="relative inline-block text-dark font-bold">
                  Nothing added
                  <span className="absolute left-0 bottom-[-1px] w-full h-[2.5px] bg-[#9EAB75]/50 rounded-full" />
                </span>
                . Just{" "}
                <span className="relative inline-block text-dark font-bold">
                  nature, transformed
                  <span className="absolute left-0 bottom-[-1px] w-full h-[2.5px] bg-[#9EAB75]/50 rounded-full" />
                </span>
                .
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
