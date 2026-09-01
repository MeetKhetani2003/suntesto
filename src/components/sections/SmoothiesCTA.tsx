"use client";

import { useState, useEffect, useRef } from "react";

interface IPromoCard {
  _id?: string;
  videoUrl: string;
  badgeText?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  order: number;
}

export default function SmoothiesCTA() {
  const [cards, setCards] = useState<IPromoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchPromoCards() {
      try {
        const res = await fetch("/api/promo-cards");
        if (res.ok) {
          const data = await res.json();
          setCards(data);
        }
      } catch (err) {
        console.error("Failed to load promo video cards dynamically:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPromoCards();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
      const scrollAmount = 300; // Average card width (280px) + gap (24px)
      
      if (direction === "left") {
        if (scrollLeft <= 5) {
          // Wrap to the end of the scroll container
          scrollRef.current.scrollTo({
            left: scrollWidth - clientWidth,
            behavior: "smooth"
          });
        } else {
          scrollRef.current.scrollBy({
            left: -scrollAmount,
            behavior: "smooth"
          });
        }
      } else {
        // If we are at the end, wrap back to the start
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          scrollRef.current.scrollTo({
            left: 0,
            behavior: "smooth"
          });
        } else {
          scrollRef.current.scrollBy({
            left: scrollAmount,
            behavior: "smooth"
          });
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-[#FAF9F5] py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-3 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
        <p className="font-primary font-bold text-xs uppercase tracking-wider text-charcoal/50">
          Loading Snacking Reels...
        </p>
      </div>
    );
  }

  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-warm-white py-8 px-4 md:py-12 select-none overflow-hidden relative">
      {/* ── Section Header ─────────────────────────────────────── */}
      <div className="text-center mb-12 md:mb-16">
        <div className="inline-block bg-[#9EAB75] text-dark shadow-sm border border-black/5 -rotate-1 px-8 py-3 rounded-full">
          <h2 className="font-primary font-black text-lg sm:text-[22px] tracking-wider uppercase leading-none">
            TRY OUR FRUIT SNACKS NOW!
          </h2>
        </div>
      </div>

      {/* ── 9:16 Reels Video Cards Horizontal Slider ───────────── */}
      <div className="relative w-full max-w-[1240px] mx-auto px-4 group/carousel">
        {/* Left Arrow Button */}
        {cards.length > 1 && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-2 sm:left-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-[#9EAB75] text-charcoal border border-black/5 w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer opacity-0 group-hover/carousel:opacity-100 duration-300"
            aria-label="Scroll Left"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scroll-hide gap-5 md:gap-6 w-full py-4 snap-x snap-mandatory scroll-smooth"
        >
          {cards.map((card, idx) => (
            <div
              key={card._id || idx}
              className="snap-start shrink-0 w-[240px] sm:w-[280px] aspect-[9/16] rounded-[32px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 relative group"
            >
              {/* Loop Background Video */}
              {card.videoUrl && (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover z-0"
                >
                  <source src={card.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Dark gradient overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/35 z-10 transition-opacity duration-300 group-hover:from-black/85" />

              {/* Overlay Text Content */}
              <div className="relative z-20 w-full h-full flex flex-col justify-between p-5 sm:p-6 text-white text-center">
                {/* Top Badge */}
                {card.badgeText ? (
                  <div className="text-center">
                    <span className="font-primary font-black text-xs uppercase tracking-wider bg-black/25 backdrop-blur-sm px-3 py-1.5 rounded-lg inline-block text-[#9EAB75] border border-white/10">
                      {card.badgeText}
                    </span>
                  </div>
                ) : (
                  <div />
                )}

                {/* Middle Title / Subtitle */}
                <div className="my-auto">
                  {card.title && (
                    <span className="block font-primary font-black text-xl sm:text-2xl uppercase tracking-wider leading-tight drop-shadow-md">
                      {card.title}
                    </span>
                  )}
                  {card.subtitle && (
                    <span className="block font-accent text-xs sm:text-sm text-[#9EAB75]/90 mt-1 italic drop-shadow">
                      {card.subtitle}
                    </span>
                  )}
                </div>

                {/* Bottom Description */}
                {card.description ? (
                  <div className="text-center mt-auto font-primary font-bold text-xs tracking-wide bg-black/25 backdrop-blur-sm py-2 px-3 rounded-xl border border-white/5 leading-normal">
                    {card.description}
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        {cards.length > 1 && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-2 sm:right-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-[#9EAB75] text-charcoal border border-black/5 w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer opacity-0 group-hover/carousel:opacity-100 duration-300"
            aria-label="Scroll Right"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
