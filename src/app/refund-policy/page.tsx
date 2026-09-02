"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RefundPolicyPage() {
  return (
    <>
      {/* ── Sticky Header ────────────────────────────────────── */}
      <Header />

      <main className="w-full bg-[#fffff9] pt-36 pb-24 select-none">
        
        {/* ── Refund Policy Container ─────────────────────────── */}
        <div className="max-w-[720px] mx-auto px-6 text-left font-primary">
          
          {/* Centered Page Title */}
          <h1 className="font-black text-2xl sm:text-[34px] text-charcoal uppercase tracking-tight text-center mb-16">
            RETURN & REFUND POLICY
          </h1>

          <div className="flex flex-col gap-10">
            
            {/* 1. Order Cancellation */}
            <div className="flex flex-col items-start gap-3">
              <h2 className="text-charcoal font-black text-lg flex items-center gap-2">
                <span>🚫</span> Order Cancellation
              </h2>
              <div className="text-charcoal/80 font-bold text-xs sm:text-[13px] leading-relaxed flex flex-col gap-2">
                <p>
                  You can cancel an order any time before it is dispatched for a full refund. Email{" "}
                  <a href="mailto:support@sustentofood.com" className="underline hover:text-black font-bold">
                    support@sustentofood.com
                  </a>{" "}
                  with your order number. Once an order has been dispatched, it cannot be cancelled, and our Final Sale terms below apply.
                </p>
                <p className="mt-2 bg-stone-50 border border-stone-200/50 rounded-2xl p-4.5 text-charcoal/85">
                  At Sustento, we create perishable food products designed to be enjoyed fresh, safe, and in their purest form. For this reason, all products across our collections (Fruit Snacks and others) are considered Final Sale and are not eligible for return or exchange.
                </p>
              </div>
            </div>

            {/* Divider line */}
            <div className="w-full border-t border-black/5" />

            {/* 2. Damages and Issues */}
            <div className="flex flex-col items-start gap-3">
              <h2 className="text-charcoal font-black text-lg flex items-center gap-2">
                <span>❗</span> Damages and Issues
              </h2>
              <div className="text-charcoal/80 font-bold text-xs sm:text-[13px] leading-relaxed flex flex-col gap-2">
                <p>
                  We take great care to deliver our products in perfect condition. However, if your order arrives damaged, defective, or if you receive the wrong item, you must contact us at{" "}
                  <a href="mailto:support@sustentofood.com" className="underline hover:text-black font-bold">
                    support@sustentofood.com
                  </a>{" "}
                  within 48 hours of delivery with the following:
                </p>
                <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-2 text-charcoal/70">
                  <li>Your order number</li>
                  <li>Clear photos of the outer packaging (including the shipping label)</li>
                  <li>Clear photos of the damaged or defective product</li>
                  <li>A brief description of the issue</li>
                </ul>
                <p className="mt-2 text-charcoal/50 italic">
                  Claims reported after 48 hours from delivery, or without the required photos of both packaging and product, may not be eligible for resolution.
                </p>
              </div>
            </div>

            {/* Divider line */}
            <div className="w-full border-t border-black/5" />

            {/* 3. Non-Returnable Items */}
            <div className="flex flex-col items-start gap-3">
              <h2 className="text-charcoal font-black text-lg flex items-center gap-2">
                <span>📦</span> Non-Returnable Items
              </h2>
              <div className="text-charcoal/80 font-bold text-xs sm:text-[13px] leading-relaxed flex flex-col gap-2">
                <p>
                  All food and beverage items are non-returnable. This includes perishable goods, custom products, and any opened or partially used items. We also do not accept returns on sale items or gift cards.
                </p>
                <p>
                  Products that have been opened or used before reporting an issue will be evaluated on a case-by-case basis, and resolution is not guaranteed.
                </p>
              </div>
            </div>

            {/* Divider line */}
            <div className="w-full border-t border-black/5" />

            {/* 4. Refunds */}
            <div className="flex flex-col items-start gap-3">
              <h2 className="text-charcoal font-black text-lg flex items-center gap-2">
                <span>💸</span> Refunds
              </h2>
              <div className="text-charcoal/80 font-bold text-xs sm:text-[13px] leading-relaxed flex flex-col gap-2">
                <p>
                  While we do not offer returns, refunds may be issued in cases of verified damaged, defective, or incorrect products after review. If approved, your refund will be processed to your original payment method within 5-7 business days.
                </p>
                <p>
                  Please note that it may take additional time for your bank or credit card provider to reflect the refund.
                </p>
                <p className="mt-2 text-charcoal/50 italic">
                  If more than 15 business days have passed since your refund was approved, please contact us at{" "}
                  <a href="mailto:support@sustentofood.com" className="underline hover:text-black">
                    support@sustentofood.com
                  </a>.
                </p>
              </div>
            </div>

            {/* Divider line */}
            <div className="w-full border-t border-black/5" />

            {/* 5. Reshipments */}
            <div className="flex flex-col items-start gap-3">
              <h2 className="text-charcoal font-black text-lg flex items-center gap-2">
                <span>🔄</span> Reshipments
              </h2>
              <div className="text-charcoal/80 font-bold text-xs sm:text-[13px] leading-relaxed flex flex-col gap-2">
                <p>
                  In cases where a shipment could not be delivered due to an incorrect address, failed delivery attempts, or a return to origin (RTO), we will work with you to reship your order. Address confirmation may be required before dispatch.
                </p>
              </div>
            </div>

            {/* Divider line */}
            <div className="w-full border-t border-black/5" />

            {/* Contact Footer */}
            <div className="text-charcoal/80 font-bold text-xs sm:text-[13px] leading-relaxed flex flex-col gap-2 pt-2">
              <p>
                For any questions or concerns, feel free to reach out to us at{" "}
                <a href="mailto:support@sustentofood.com" className="underline hover:text-black font-bold">
                  support@sustentofood.com
                </a>. We&apos;re here to help!
              </p>
              <p className="mt-4 text-[#B57C58] font-black uppercase text-[12px] tracking-wider italic">
                This policy ensures the safety, quality, and integrity of our food products for all customers.
              </p>
            </div>

          </div>

        </div>

      </main>

      {/* ── Floating Ask Everaw Chat Widget ─────────────────── */}
      <div className="fixed bottom-6 left-6 z-50">
        <button className="bg-[#9EAB75] text-dark font-primary text-[13px] font-black uppercase tracking-wider px-4 py-2.5 rounded-full shadow-lg border border-black/10 flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform duration-150">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-dark">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Ask Sustento
        </button>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <Footer />
    </>
  );
}

