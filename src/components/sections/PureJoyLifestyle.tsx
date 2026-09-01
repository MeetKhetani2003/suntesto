"use client";

export default function PureJoyLifestyle() {
  return (
    <section className="w-full py-16 md:py-24 bg-[#fffff9] border-t border-black/5 select-none relative overflow-hidden">
      {/* Subtle organic background blobs */}
      <div className="absolute top-0 right-[-10%] w-[300px] h-[300px] bg-[#9EAB75]/5 rounded-full blur-[85px] pointer-events-none" />
      <div className="absolute bottom-0 left-[-10%] w-[300px] h-[300px] bg-[#9EAB75]/5 rounded-full blur-[85px] pointer-events-none" />

      <div className="w-full max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Card 1: Zero Compromise, Pure Joy */}
          <div className="bg-white rounded-none border border-black/5 p-8 md:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.015)] hover:border-[#9EAB75]/30 hover:shadow-[0_16px_50px_rgba(158,171,117,0.06)] hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-6">
              {/* Card Label / Index */}
              <div className="flex items-center justify-between">
                <span className="font-primary font-black text-xs tracking-widest text-[#9EAB75] uppercase bg-[#9EAB75]/10 px-3 py-1 rounded-full">
                  PURE JOY
                </span>
              </div>
              
              {/* Card Title */}
              <h3 className="font-primary font-black text-2xl sm:text-3xl text-charcoal uppercase tracking-tight leading-tight">
                ZERO COMPROMISE, <br />
                PURE JOY
              </h3>
              
              {/* Card Description */}
              <p className="font-primary text-sm sm:text-base text-charcoal/70 leading-relaxed font-semibold">
                Experience a genuinely satisfying lightweight crunch that perfectly bridges the gap between clean eating and delicious cravings.
              </p>
            </div>
            
            {/* Visual bottom accent line */}
            <div className="w-8 h-[3px] bg-[#9EAB75]/30 group-hover:w-16 group-hover:bg-[#9EAB75] transition-all duration-300 rounded-full mt-8" />
          </div>

          {/* Card 2: Fuel Your Modern Lifestyle */}
          <div className="bg-white rounded-none border border-black/5 p-8 md:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.015)] hover:border-[#9EAB75]/30 hover:shadow-[0_16px_50px_rgba(158,171,117,0.06)] hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-6">
              {/* Card Label / Index */}
              <div className="flex items-center justify-between">
                <span className="font-primary font-black text-xs tracking-widest text-[#9EAB75] uppercase bg-[#9EAB75]/10 px-3 py-1 rounded-full">
                  LIFESTYLE
                </span>
              </div>
              
              {/* Card Title */}
              <h3 className="font-primary font-black text-2xl sm:text-3xl text-charcoal uppercase tracking-tight leading-tight">
                FUEL YOUR <br />
                MODERN LIFESTYLE
              </h3>
              
              {/* Card Description */}
              <p className="font-primary text-sm sm:text-base text-charcoal/70 leading-relaxed font-semibold">
                Vibrant, portable and packed with natural energy, our snacks are crafted to elevate your daily routine without the guilt.
              </p>
            </div>
            
            {/* Visual bottom accent line */}
            <div className="w-8 h-[3px] bg-[#9EAB75]/30 group-hover:w-16 group-hover:bg-[#9EAB75] transition-all duration-300 rounded-full mt-8" />
          </div>

        </div>
      </div>
    </section>
  );
}
