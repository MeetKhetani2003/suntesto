"use client";

import React from "react";

export default function ProductFormula() {
  return (
    <section className="w-full bg-[#fffff9] py-12 md:py-16 border-t border-black/5 select-none relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#9EAB75]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1200px] mx-auto px-6 text-center">
        {/* Title */}
        <span className="font-primary font-bold text-xs tracking-widest text-[#9EAB75] uppercase mb-2 block">
          THE SUSTENTO FORMULA
        </span>
        <h2 className="font-primary font-black text-charcoal leading-none uppercase tracking-tight text-2xl sm:text-3xl md:text-[40px] mb-12">
          Purity Simplified
        </h2>

        {/* Formula Layout */}
        <div className="flex flex-nowrap items-center justify-center gap-1.5 min-[400px]:gap-2 sm:gap-4 md:gap-5 mx-auto mt-6 sm:mt-8 font-primary font-black uppercase text-[12px] min-[380px]:text-[14px] sm:text-xl md:text-3xl lg:text-4xl leading-none w-full whitespace-nowrap px-2">
          
          <div className="text-[#9EAB75] animate-formula-1">
            Freeze-dried
          </div>

          <div className="text-[#9EAB75] animate-formula-2">
            =
          </div>

          <div className="text-charcoal animate-formula-3">
            Fruits
          </div>

          <div className="text-[#9EAB75] animate-formula-4">
            -
          </div>

          <div className="text-charcoal animate-formula-5">
            Only Water
          </div>

        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes formulaFadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-formula-1 { animation: formulaFadeInUp 0.6s ease-out 0.1s forwards; opacity: 0; }
          .animate-formula-2 { animation: formulaFadeInUp 0.6s ease-out 0.3s forwards; opacity: 0; }
          .animate-formula-3 { animation: formulaFadeInUp 0.6s ease-out 0.5s forwards; opacity: 0; }
          .animate-formula-4 { animation: formulaFadeInUp 0.6s ease-out 0.7s forwards; opacity: 0; }
          .animate-formula-5 { animation: formulaFadeInUp 0.6s ease-out 0.9s forwards; opacity: 0; }
        `}} />
      </div>
    </section>
  );
}
