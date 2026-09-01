"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ILimitedEdition {
  title: string;
  tagText: string;
  imageUrl: string;
  bgBottomColor: string;
  topAnnotationText: string;
  topAnnotationHighlight: string;
  midAnnotationText: string;
  botAnnotationText: string;
}

export default function LimitedEdition() {
  const [config, setConfig] = useState<ILimitedEdition>({
    title: "LIMITED EDITION",
    tagText: "Special Fruit hamper",
    imageUrl: "/images/hamper.jpg",
    bgBottomColor: "#b4b953",
    topAnnotationText: "Build your own",
    topAnnotationHighlight: "Hamper",
    midAnnotationText: "4 SNACKS",
    botAnnotationText: "2 CHOC-DIPPED",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/limited-edition");
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
        }
      } catch (err) {
        console.error("Failed to load limited edition config dynamically:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-[#FAF9F5] py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-3 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
        <p className="font-primary font-bold text-xs uppercase tracking-wider text-charcoal/50">
          Loading Hamper Details...
        </p>
      </div>
    );
  }

  return (
    <section className="relative w-full overflow-hidden select-none min-h-[500px] bg-off-white">
      {/* ── Background Horizontal Split ────────────────────────── */}
      <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
        <div className="h-1/2 w-full bg-off-white" />
        <div
          className="h-1/2 w-full transition-colors duration-300"
          style={{ backgroundColor: config.bgBottomColor }}
        />
      </div>

      {/* ── Content Container ─────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto py-8 px-6 md:px-0 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
        
        {/* Left Side: Limited Edition Header (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-start text-left lg:mb-12 lg:-translate-y-3 reveal-left">
          <h2 className="font-primary font-black text-charcoal leading-[1.05] uppercase tracking-tight text-[44px] sm:text-[56px] md:text-[72px]">
            <span className="relative inline-block text-center md:text-left">
              {config.title}
              {/* Heading Accent Burst */}
              <svg 
                viewBox="0 0 40 40" 
                className="absolute -top-4 lg:-top-6 -right-12 lg:-right-16 w-12 h-12 lg:w-16 lg:h-16 text-[#9EAB75] fill-current select-none pointer-events-none transform rotate-12"
              >
                <path d="M 8,24 C 7,20 6,15 5,8 C 8,9 11,11 13,13 C 11,17 9,21 8,24 Z" />
                <path d="M 13,18 C 16,15 21,11 26,7 C 27,10 27,14 27,17 C 22,18 17,18 13,18 Z" />
                <path d="M 16,21 C 21,21 27,21 32,22 C 31,24 28,26 26,27 C 22,25 19,23 16,21 Z" />
              </svg>
            </span>
          </h2>
          
          <div className="mt-4 bg-[#9EAB75] text-dark shadow-sm border border-black/5 -rotate-2 px-6 py-2.5 rounded-full inline-block">
            <span className="font-accent text-xl sm:text-2xl font-bold tracking-wide uppercase">
              {config.tagText}
            </span>
          </div>
        </div>

        {/* Right Side: Hamper Mockup & Floating Hand-Drawn Annotations (7 cols) */}
        <div className="lg:col-span-7 relative w-full flex items-center justify-center py-8 reveal-right">
          
          {/* Main Product Composite Group Container (no card wrapper, blends directly) */}
          <div className="relative w-full max-w-[550px] aspect-[16/9] mix-blend-multiply">
            {config.imageUrl && (
              <Image
                src={config.imageUrl}
                alt="Sustento Special Fruit Hamper Box & products"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover lg:scale-110"
                unoptimized
                priority
              />
            )}
          </div>

          {/* ── Floating Annotation Pointers (Card-Free, Floating) ── */}
          
          {/* Top Annotation: Build your own 'Hamper' */}
          {config.topAnnotationText && (
            <div className="absolute -top-6 right-20 z-20 select-none">
              <p className="font-primary font-black text-sm md:text-[18px] text-charcoal flex items-center gap-1.5">
                {config.topAnnotationText}
                {config.topAnnotationHighlight && (
                  <span className="font-accent text-black bg-[#9EAB75] px-3 py-0.5 rounded rotate-2 inline-block font-bold">
                    {config.topAnnotationHighlight}
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Middle Right Annotation: 4 Snacks */}
          {config.midAnnotationText && (
            <div className="absolute top-1/4 -right-4 md:right-0 z-20 flex flex-col items-center select-none rotate-6">
              <span className="font-primary font-black text-[13px] md:text-sm text-charcoal uppercase tracking-wider">
                {config.midAnnotationText}
              </span>
              {/* Curved arrow pointing to fruit sachets */}
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-charcoal mt-0.5 rotate-80">
                <path
                  d="M6,6 C10,12 12,14 18,18 M18,18 L14,18 M18,18 L18,14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}

          {/* Bottom Right Annotation: 2 Choc-Dipped */}
          {config.botAnnotationText && (
            <div className="absolute -bottom-6 right-16 md:right-20 z-20 flex flex-col items-center select-none -rotate-3">
              {/* Curved arrow pointing to spreads */}
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-dark mb-0.5">
                <path
                  d="M18,6 C14,10 12,12 6,18 M6,18 L10,18 M6,18 L6,14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-accent font-bold text-[16px] md:text-[18px] text-dark leading-none">
                {config.botAnnotationText}
              </span>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
