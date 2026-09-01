"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InstagramGrid from "@/components/sections/InstagramGrid";
import Image from "next/image";



export default function ContactPage() {
  return (
    <>
      {/* ── Sticky Header ────────────────────────────────────── */}
      <Header />

      <main className="w-full bg-[#fffff9] pt-36 pb-12 select-none">
        
        {/* ── Contact Card Container ──────────────────────────── */}
        <div className="max-w-[700px] mx-auto px-6 text-left mb-20">
          
          {/* Centered Main Title */}
          <h1 className="font-primary font-black text-2xl sm:text-[32px] text-charcoal uppercase tracking-tight text-center mb-16">
            CONTACT INFORMATION
          </h1>

          {/* Contact Details List */}
          <div className="flex flex-col gap-8 font-primary">
            
            {/* Trade Name */}
            <div className="flex flex-col items-start gap-1">
              <span className="text-[#9EAB75] text-xs font-black uppercase tracking-wider">
                TRADE NAME
              </span>
              <span className="text-charcoal font-bold text-sm sm:text-[15px]">
                Sustento Foods Private Limited
              </span>
            </div>

            {/* Registered Entity */}
            <div className="flex flex-col items-start gap-1">
              <span className="text-[#9EAB75] text-xs font-black uppercase tracking-wider">
                REGISTERED ENTITY
              </span>
              <span className="text-charcoal font-bold text-sm sm:text-[15px]">
                Sustento Foods Private Limited
              </span>
            </div>

            {/* Phone */}
            <div className="flex flex-col items-start gap-1">
              <span className="text-[#9EAB75] text-xs font-black uppercase tracking-wider">
                PHONE
              </span>
              <a 
                href="tel:+919924594414" 
                className="text-charcoal font-bold text-sm sm:text-[15px] hover:text-black transition-colors"
              >
                +91 99245 94414
              </a>
            </div>

            {/* Email */}
            <div className="flex flex-col items-start gap-1">
              <span className="text-[#9EAB75] text-xs font-black uppercase tracking-wider">
                EMAIL
              </span>
              <a 
                href="mailto:support@sustentofood.com" 
                className="text-charcoal font-bold text-sm sm:text-[15px] hover:text-black transition-colors"
              >
                support@sustentofood.com
              </a>
            </div>

            {/* Address */}
            <div className="flex flex-col items-start gap-1">
              <span className="text-[#9EAB75] text-xs font-black uppercase tracking-wider">
                ADDRESS
              </span>
              <span className="text-charcoal font-bold text-sm sm:text-[15px] leading-relaxed max-w-[500px]">
                FF-105 Sonamahor Elevate, Opposite Gujrat CNG pump, <br />
                kothariya, Rajkot - 360022, Gujarat, India
              </span>
            </div>

            {/* Divider line */}
            <div className="w-full border-t border-black/10 my-4" />

            {/* Grievance Redressal Officer block */}
            <div className="flex flex-col items-start gap-2">
              <span className="text-[#9EAB75] text-xs font-black uppercase tracking-wider mb-1">
                GRIEVANCE REDRESSAL OFFICER
              </span>
              <div className="text-charcoal text-sm sm:text-[15px] leading-normal font-medium">
                <p>
                  <strong className="font-bold">Name:</strong> Raj Kotadiya
                </p>
                <p className="mt-1">
                  <strong className="font-bold">Email:</strong>{" "}
                  <a 
                    href="mailto:raj@sustentofood.com" 
                    className="hover:text-black transition-colors font-bold"
                  >
                    raj@sustentofood.com
                  </a>
                </p>
                <p className="mt-3 text-charcoal/40 text-xs sm:text-[13px] italic font-semibold">
                  (under Consumer Protection Act and applicable rules)
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* ── On The #Gram Instagram Grid Section ──────────────── */}
        <InstagramGrid />

      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <Footer />
    </>
  );
}
