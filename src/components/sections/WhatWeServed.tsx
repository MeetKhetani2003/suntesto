"use client";

export default function WhatWeServed() {
  return (
    <section className="w-full bg-[#fffff9] py-16 md:py-20 border-t border-black/5 select-none relative overflow-hidden">
      <div className="w-full max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* Minimalist Visual Layout */}
        <div className="max-w-[800px] mx-auto text-center flex flex-col items-center space-y-12">
          
          {/* Tag & Heading */}
          <div className="space-y-3">
            <h2 className="font-primary font-black text-[36px] sm:text-[44px] md:text-[52px] text-charcoal leading-tight uppercase tracking-tight text-center">
              WHAT WE SERVED
            </h2>
          </div>

          {/* Clean Graphic Comparison Block */}
          <div className="w-full bg-white rounded-none border border-black/5 p-4 sm:p-8 md:p-12 shadow-[0_16px_48px_rgba(0,0,0,0.02)] flex flex-row items-center justify-center gap-2 sm:gap-8 max-w-[680px]">
            
            {/* 20g Pack Block */}
            <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2 w-1/3">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#9EAB75] text-dark flex items-center justify-center font-primary font-black text-sm sm:text-lg shadow-sm">
                20g
              </div>
              <span className="font-primary font-black text-[9px] sm:text-xs uppercase tracking-wider text-charcoal/60 leading-tight">
                Freeze-Dried Fruits
              </span>
            </div>

            {/* Equivalency Connector */}
            <div className="flex flex-col items-center justify-center w-1/3 shrink-0">
              <span className="font-primary font-black text-xl sm:text-2xl text-[#9EAB75]">=</span>
              <span className="font-primary font-black text-[7px] sm:text-[9px] tracking-widest text-charcoal/40 uppercase mt-1 text-center">
                EQUIVALENT TO
              </span>
            </div>

            {/* 200g-220g Fruits Block */}
            <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2 w-1/3">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-charcoal text-white flex items-center justify-center font-primary font-black text-sm sm:text-lg shadow-sm">
                220g
              </div>
              <span className="font-primary font-black text-[9px] sm:text-xs uppercase tracking-wider text-charcoal/60 leading-tight">
                Approx. Fresh Fruits
              </span>
            </div>

          </div>

          {/* Main Content Text */}
          <div className="max-w-[650px] mx-auto">
            <p className="font-primary text-lg sm:text-xl md:text-2xl text-charcoal leading-relaxed font-semibold uppercase tracking-tight">
              In one single pack of{" "}
              <span className="text-[#9EAB75] font-black">20gm freeze-dried fruits</span>{" "}
              is equivalent to approx{" "}
              <span className="text-[#9EAB75] font-black">200gm-220gm of fresh fruits</span>.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
