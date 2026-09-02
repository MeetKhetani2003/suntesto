"use client";

import Image from "next/image";

export default function RawFoodProcess() {
  return (
    <section className="w-full bg-warm-white py-8 px-4 md:py-12 select-none">
      {/* ── Heading Block with Exclamation Mark ────────────────── */}
      <div className="relative max-w-[600px] mx-auto text-center mb-12 reveal-text">
        <h2 className="relative z-10 font-primary font-black text-charcoal leading-none uppercase tracking-tight text-[36px] sm:text-[46px] md:text-[54px]">
          FRESH FRUITS <br />
          SPOILS FAST
        </h2>
      </div>

      {/* ── Text above banana image: FRESH TODAY, GONE TOMORROW ── */}
      <div className="text-center mb-6 max-w-[600px] mx-auto reveal-text">
        <h3 className="font-primary font-black text-lg sm:text-2xl text-charcoal uppercase tracking-tight leading-tight">
          FRESH TODAY, GONE TOMORROW
        </h3>
      </div>

      {/* ── Central Banana Image ────────────────── */}
      <div className="w-full max-w-[800px] mx-auto px-4 mb-8 relative reveal">
        <div className="group relative w-full aspect-[16/8] mix-blend-multiply hover:scale-[1.1] transition-transform duration-400 cursor-pointer">
          <Image
            src="/images/raw-food.png"
            alt="Banana sliced from fresh to freeze-dried transition"
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-contain transition-opacity duration-500 group-hover:opacity-0"
            priority
          />
          <Image
            src="/images/sustento-pouch-banana.jpg"
            alt="Banana Freeze-Dried Packet"
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-contain absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            unoptimized
          />
        </div>
      </div>

      {/* ── Cursive Subtitle ─────────────────────────────────── */}
      <div className="max-w-[700px] mx-auto text-center px-6 reveal-section border-t border-black/5 pt-8">
        <p className="font-accent text-lg sm:text-xl md:text-[24px] text-body leading-relaxed italic">
          We achieve lasting freshness and lock-in whole nutrition using advanced technology.
        </p>
      </div>
    </section>
  );
}
