"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InstagramGrid from "@/components/sections/InstagramGrid";

interface IFAQ {
  _id?: string;
  question: string;
  answer: string;
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<IFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGlobalFAQs() {
      try {
        const res = await fetch("/api/faqs");
        if (res.ok) {
          const data = await res.json();
          setFaqs(data);
        }
      } catch (err) {
        console.error("Failed to load global FAQs dynamically:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGlobalFAQs();
  }, []);

  return (
    <>
      {/* ── Sticky Header ────────────────────────────────────── */}
      <Header />

      <main className="w-full bg-[#fffff9] pt-36 pb-12 select-none">
        
        {/* ── FAQ Block ───────────────────────────────────────── */}
        <div className="max-w-[760px] mx-auto px-6 text-center mb-20">
          
          {/* Main Title Banner */}
          <h1 className="font-primary font-black text-2xl sm:text-[36px] text-charcoal leading-tight mb-8">
            Got questions? We&apos;ve got <br />
            answers.
          </h1>

          {/* Underlined Subcategory Badge */}
          <div className="mb-14 relative inline-block">
            <span className="font-primary font-black text-sm uppercase tracking-wider text-charcoal/90 italic cursor-default px-4">
              All FAQs
            </span>
            <span className="absolute left-4 bottom-[-6px] w-[calc(100%-32px)] h-[3px] bg-[#9EAB75] rounded-full" />
          </div>

          {/* Collapsible FAQs Accordion Grid */}
          <div className="flex flex-col gap-4 w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <div className="w-6 h-6 border-3 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-bold text-charcoal/40 uppercase">Loading answers...</p>
              </div>
            ) : faqs.length === 0 ? (
              <div className="text-center py-8 text-charcoal/50 text-xs font-bold uppercase tracking-wider border-2 border-dashed border-charcoal/10 rounded-2xl">
                No FAQs available.
              </div>
            ) : (
              faqs.map((item, idx) => {
                const key = item._id || String(idx);
                const isExpanded = expandedId === key;
                return (
                  <div
                    key={key}
                    className="w-full bg-white border border-[#CBDCD0] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-200"
                  >
                    {/* Accordion Trigger Header */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : key)}
                      className="w-full px-6 py-4.5 flex items-center justify-between font-primary font-black text-sm md:text-[15px] text-charcoal text-left select-none outline-none focus:outline-none"
                    >
                      <span>{item.question}</span>
                      {/* Chevron Toggle Icon */}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`text-charcoal/70 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>

                    {/* Answer Content Box */}
                    <div
                      className={`transition-all duration-300 overflow-hidden ${
                        isExpanded ? "max-h-[300px] border-t border-black/5" : "max-h-0"
                      }`}
                    >
                      <div className="px-6 py-4.5 text-left font-primary text-xs sm:text-[13px] text-charcoal/75 leading-relaxed font-semibold">
                        {item.answer}
                      </div>
                    </div>

                  </div>
                );
              })
            )}
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
