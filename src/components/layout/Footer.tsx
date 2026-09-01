"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

/* ── SVG Icons ───────────────────────────────────────────────── */
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1H13c-3 0-4 2-4 4v3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

export default function Footer() {
  const [config, setConfig] = useState({
    sloganLine1: "YOU'VE GOT THE",
    sloganLine2: "NATURE'S BEST WITH",
    sloganLine3: "SUSTENTO",
    middleGraphicUrl: "",
    facebookUrl: "https://facebook.com",
    instagramUrl: "https://instagram.com",
    linkedinUrl: "https://linkedin.com",
  });

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/footer-config");
        if (res.ok) {
          const data = await res.json();
          setConfig({
            sloganLine1: data.sloganLine1 || "YOU'VE GOT THE",
            sloganLine2: data.sloganLine2 || "NATURE'S BEST WITH",
            sloganLine3: data.sloganLine3 || "SUSTENTO",
            middleGraphicUrl: data.middleGraphicUrl || "",
            facebookUrl: data.facebookUrl || "https://facebook.com",
            instagramUrl: data.instagramUrl || "https://instagram.com",
            linkedinUrl: data.linkedinUrl || "https://linkedin.com",
          });
        }
      } catch (err) {
        console.error("Failed to load footer config in component", err);
      }
    }
    fetchConfig();
  }, []);

  return (
    <footer className="w-full bg-[#fffff9] pt-16 pb-8 border-t border-black/5 relative z-[900] overflow-hidden select-none">
      
      {/* ── Main Layout Grid ─────────────────────────────────── */}
      <div className="w-full max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-start relative pb-12 border-b border-black/5">
        
        {/* Left Column: Slogan, circular stamp, socials (cols 4) */}
        <div className="md:col-span-4 flex flex-col items-start">
          
          {/* Website Logo */}
          <div className="relative mb-6 select-none">
            <Link href="/" aria-label="Sustento Home" className="block transition-transform hover:scale-105">
              <Image
                src="/images/sustento-logo-black.png"
                alt="Sustento Logo"
                width={200}
                height={50}
                priority
                className="w-[120px] sm:w-[150px] h-auto object-contain"
              />
            </Link>
          </div>

          {/* Core Slogan Text */}
          <h3 className="font-primary font-black text-charcoal leading-[1.1] uppercase tracking-tight text-[22px] sm:text-[26px] mb-6">
            {config.sloganLine1} <br />
            <span className="relative inline-block mt-0.5">
              {config.sloganLine2}
              <span className="absolute left-0 bottom-[-2px] w-full h-[4px] bg-[#9EAB75] rounded-full" />
            </span>
            <br />
            <span className="bg-[#9EAB75] text-dark shadow-sm px-4 py-0.5 rounded-full inline-block mt-3 -rotate-1 text-[16px] sm:text-[18px]">
              {config.sloganLine3}
            </span>
          </h3>

          {/* Social Connect Icons */}
          <div className="flex items-center gap-4 text-charcoal/80 hover:text-dark mb-4">
            <a href={config.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-150" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href={config.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-150" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href={config.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-150" aria-label="LinkedIn">
              <LinkedinIcon />
            </a>
          </div>

        </div>

        {/* Center Column: Big Strawberry Graphics (cols 3) */}
        <div className="md:col-span-3 flex items-center justify-center pointer-events-none md:-mt-6">
          {config.middleGraphicUrl ? (
            <div className="relative w-36 h-44 sm:w-40 sm:h-48">
              <Image
                src={config.middleGraphicUrl}
                alt="Footer Accent Graphic"
                fill
                sizes="(max-width: 768px) 150px, 200px"
                className="object-contain"
                unoptimized={true}
              />
            </div>
          ) : (
            <svg viewBox="0 0 100 120" className="w-36 h-44 sm:w-40 sm:h-48 text-[#CC2828] fill-current drop-shadow-md select-none">
              {/* Strawberry body */}
              <path d="M50 110 C32 110 8 78 8 46 C8 15 32 12 50 12 C68 12 92 15 92 46 C92 78 68 110 50 110 Z" />
              {/* Leaf crown (green colors) */}
              <path d="M50 15 C52 2 62 2 65 7 C58 12 55 15 50 17 C45 15 42 12 35 7 C38 2 48 2 50 15 Z" fill="#7ba635" />
              <path d="M50 15 C55 9 70 5 75 11 C65 15 58 17 50 17 C42 17 35 15 25 11 C30 5 45 9 50 15 Z" fill="#5c8222" />
              {/* Strawberry seed dots (yellow) */}
              <circle cx="30" cy="35" r="1.5" fill="#9EAB75" />
              <circle cx="50" cy="40" r="1.5" fill="#9EAB75" />
              <circle cx="70" cy="35" r="1.5" fill="#9EAB75" />
              <circle cx="40" cy="55" r="1.5" fill="#9EAB75" />
              <circle cx="60" cy="55" r="1.5" fill="#9EAB75" />
              <circle cx="30" cy="70" r="1.5" fill="#9EAB75" />
              <circle cx="50" cy="75" r="1.5" fill="#9EAB75" />
              <circle cx="70" cy="70" r="1.5" fill="#9EAB75" />
              <circle cx="40" cy="90" r="1.5" fill="#9EAB75" />
              <circle cx="60" cy="90" r="1.5" fill="#9EAB75" />
            </svg>
          )}
        </div>

        {/* Right Column: Newsletter & Navigation Links (cols 5) */}
        <div className="md:col-span-5 flex flex-col items-start lg:pl-6 w-full">
          
          {/* Newsletter signup container */}
          <div className="relative w-full max-w-[420px] mb-12">
            <h4 className="font-primary font-black text-sm text-charcoal tracking-wider mb-2.5 text-left">
              Never run out of your favorite healthy crunch?
            </h4>
            <div className="relative w-full">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full h-[45px] bg-transparent border-[5.97px] border-[#9EAB75] rounded-full px-6 py-2 pr-12 font-primary text-xs font-semibold text-charcoal outline-none focus:shadow-none"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#9EAB75] hover:bg-yellow text-white w-8 h-8 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-150" aria-label="Subscribe">
                <span className="font-primary font-black text-xs leading-none">&gt;</span>
              </button>
            </div>
            
            {/* Cursive helper tag with arrow */}
            <div className="absolute right-10 bottom-[-40px] flex items-start gap-1.5 select-none pointer-events-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#9EAB75] rotate-[-45deg]">
                <path d="M6,18 C10,12 12,10 18,6 M18,6 L14,6 M18,6 L18,10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-accent text-[12px] text-body leading-none font-bold rotate-6">
                Subscribe to your <br />
                family loved kit
              </span>
            </div>
          </div>

          {/* Dual Column Navigation links */}
          <div className="grid grid-cols-2 gap-8 w-full">
            
            {/* Help Column */}
            <div className="flex flex-col items-start">
              <span className="font-primary font-black text-[13px] text-charcoal uppercase tracking-wider mb-3 select-none">
                HELP
              </span>
              <ul className="flex flex-col gap-2 font-primary text-[12px] font-bold text-charcoal/80 text-left">
                <li><Link href="/contact" className="hover:text-dark">Contact Us</Link></li>
                <li><Link href="/pages/lab-reports" className="hover:text-dark">Lab Reports</Link></li>
                <li><Link href="/shipping-policy" className="hover:text-dark">Orders and Shipping</Link></li>
                <li><Link href="/refund-policy" className="hover:text-dark">Return and Refund</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-dark">Terms of Service</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-dark">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Shop Column */}
            <div className="flex flex-col items-start">
              <span className="font-primary font-black text-[13px] text-charcoal uppercase tracking-wider mb-3 select-none">
                Shop
              </span>
              <ul className="flex flex-col gap-2 font-primary text-[12px] font-bold text-charcoal/80 text-left">
                <li><Link href="/collections/all" className="hover:text-dark">Shop All</Link></li>
                <li><Link href="/about-us" className="hover:text-dark">About us</Link></li>
                <li><Link href="/faqs" className="hover:text-dark">FAQs</Link></li>
                <li><Link href="/pages/bulk-orders" className="hover:text-dark">Bulk Orders</Link></li>
              </ul>
            </div>

          </div>

        </div>

      </div>

      {/* ── Footer Baseline ───────────────────────────────────── */}
      <div className="w-full max-w-[1200px] mx-auto px-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Payment partners logos */}
        <div className="flex items-center gap-3.5 flex-wrap text-[10px] text-body select-none">
          <img
            src="/payment_modes_2.avif"
            alt="Payment Methods"
            className="h-4 sm:h-4.5 w-80 md:w-96 object-contain"
          />
        </div>

        {/* Developed by and Copyright */}
        <div className="flex flex-col items-center sm:items-end text-center sm:text-right select-none leading-tight">
          {/* <span className="font-accent text-[12px] text-charcoal/90 font-bold select-none italic">
            Designed &amp; Developed by Habitype Superfoods
          </span> */}
          <span className="font-primary text-[10px] text-body select-none mt-1">
            © 2026, Sustento Foods Private Limited. All rights reserved.
          </span>
        </div>

      </div>

    </footer>
  );
}
