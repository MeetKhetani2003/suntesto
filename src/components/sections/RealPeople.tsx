"use client";

import Image from "next/image";

export default function RealPeople() {
  return (
    <section className="w-full bg-warm-white py-12 md:py-20 select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-[1200px] mx-auto items-center px-6">
        
        {/* Left Column: Landscape Lab Image */}
        <div className="w-full reveal-left">
          <div className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-white/20">
            <Image
              src="/images/real-people.jpg"
              alt="Sustento production lab technicians packing healthy snacks"
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Right Column: Copy text block */}
        <div className="flex flex-col items-start lg:pl-4 reveal-right">
          <span className="font-accent text-lg sm:text-xl md:text-[24px] text-body italic leading-none mb-3">
            Raw food made convenient by
          </span>
          
          <h2 className="relative font-primary font-black text-[38px] sm:text-[50px] md:text-[60px] text-charcoal leading-none uppercase tracking-tight mb-8">
            REAL
            {/* Small yellow hand-drawn sunburst vector */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#9EAB75] absolute top-[-10px] left-[110px] sm:left-[140px] md:left-[165px]">
              <path d="M12,2 L12,6 M12,18 L12,22 M2,12 L6,12 M18,12 L22,12 M5,5 L8,8 M16,16 L19,19 M5,19 L8,16 M16,8 L19,5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <br />
            <span className="relative inline-block">
              PEOPLE
              {/* Highlight yellow underline */}
              <span className="absolute left-0 bottom-[-4px] w-full h-[6px] bg-[#9EAB75] rounded-full -rotate-0.5" />
            </span>
          </h2>

          <p className="font-accent text-xl sm:text-2xl md:text-[26px] text-body leading-relaxed max-w-[480px] italic">
            Whether it&apos;s the ingredients, the process, or the people - we literally have{" "}
            <span className="font-bold text-dark not-italic font-primary tracking-wide">
              #nothingtohide.
            </span>
          </p>
        </div>

      </div>
    </section>
  );
}
