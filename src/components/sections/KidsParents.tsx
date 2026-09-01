"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function KidsParents() {
  const [config, setConfig] = useState({
    headerTitleLine1: "CLEAN LABEL.",
    headerTitleLine2: "FULL DISCLOSURE.",
    headerSubtitle: "So clean, we proudly declare every ingredient.",
    titleLine1: "KIDS LOVE",
    titleLine2: "AND PARENTS TRUST",
    paraPrefix: "Wholesome, delicious, and made with",
    paraHighlight: "care for families.",
    btnLabel: "Explore Now",
    btnLink: "/collections/all",
    imageUrl: "/images/mother-child.jpg",
    imageAlt: "Kids love and parents trust Sustento",
  });

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/kids-parents");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setConfig({
              headerTitleLine1: data.headerTitleLine1 || "CLEAN LABEL.",
              headerTitleLine2: data.headerTitleLine2 || "FULL DISCLOSURE.",
              headerSubtitle: data.headerSubtitle || "So clean, we proudly declare every ingredient.",
              titleLine1: data.titleLine1 || "KIDS LOVE",
              titleLine2: data.titleLine2 || "AND PARENTS TRUST",
              paraPrefix: data.paraPrefix || "Wholesome, delicious, and made with",
              paraHighlight: data.paraHighlight || "care for families.",
              btnLabel: data.btnLabel || "Explore Now",
              btnLink: data.btnLink || "/collections/all",
              imageUrl: data.imageUrl || "/images/mother-child.jpg",
              imageAlt: data.imageAlt || "Kids love and parents trust Sustento",
            });
          }
        }
      } catch (err) {
        console.error("Failed to load KidsParents section settings", err);
      }
    }
    fetchConfig();
  }, []);

  return (
    <section className="w-full bg-warm-white py-8 md:py-10 select-none">
      {/* ── Upper Right Header Block: Clean Label ───────────── */}
      <div className="w-full max-w-[1200px] mx-auto px-6 text-right mb-8 md:mb-10 reveal-section">
        <h2 className="font-primary font-black text-2xl sm:text-3xl md:text-[40px] text-charcoal uppercase tracking-tight leading-tight">
          {config.headerTitleLine1} <br />
          {config.headerTitleLine2}
        </h2>
        <p className="font-accent text-lg sm:text-xl md:text-[28px] text-body mt-2 md:mt-3 leading-tight italic">
          {config.headerSubtitle}
        </p>
      </div>

      {/* ── Main Layout Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-[1200px] mx-auto items-center px-6">
        
        {/* Left Side: Copy and Button */}
        <div className="flex flex-col items-start order-2 md:order-1 reveal-left">
          <h3 className="font-primary font-black text-[32px] sm:text-[42px] md:text-[50px] text-charcoal leading-[1.1] uppercase tracking-tight text-left">
            {config.titleLine1} <br />
            <span className="text-dark">{config.titleLine2}</span>
          </h3>
          
          <p className="font-accent text-xl sm:text-2xl md:text-[28px] text-body text-left mt-8 leading-relaxed max-w-[480px]">
            {config.paraPrefix}{" "}
            <span className="relative inline-block font-bold text-dark">
              {config.paraHighlight}
              <span className="absolute left-0 bottom-[-4px] w-full h-[6px] bg-[#9EAB75] rounded-full -rotate-1 z-[-1]" />
            </span>
          </p>

          <Link
            href={config.btnLink}
            className="inline-block mt-12 bg-[#9EAB75] !text-dark shadow-md border border-black/5 -rotate-2 hover:rotate-0 hover:scale-105 active:scale-95 transition-all duration-200 px-8 py-3 rounded-full font-primary text-[16px] md:text-[18px] font-black uppercase tracking-wider"
          >
            {config.btnLabel}
          </Link>
        </div>

        {/* Right Side: Arch-shaped Mother & Child Image */}
        <div className="order-1 md:order-2 reveal-right">
          {/* Outer yellow border/accent arch container */}
          <div className="relative w-full max-w-[420px] aspect-[4/5] mx-auto bg-transparent rounded-t-[220px] md:rounded-t-[260px] p-3 pb-0 flex items-end overflow-hidden border border-white/20">
            {/* Inner clipped image container */}
            <div className="relative w-full h-full rounded-t-[200px] md:rounded-t-[240px] overflow-hidden">
              <Image
                src={config.imageUrl}
                alt={config.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
