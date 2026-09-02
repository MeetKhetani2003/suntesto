"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InstagramGrid from "@/components/sections/InstagramGrid";

export default function ShippingPolicyPage() {
  return (
    <>
      {/* ── Sticky Header ────────────────────────────────────── */}
      <Header />

      <main className="w-full bg-[#fffff9] pt-36 pb-12 select-none">
        
        {/* ── Shipping Policy Container ───────────────────────── */}
        <div className="max-w-[720px] mx-auto px-6 text-left font-primary mb-20">
          
          {/* Centered Page Title */}
          <h1 className="font-black text-2xl sm:text-[34px] text-charcoal uppercase tracking-tight text-center mb-10">
            SHIPPING POLICY
          </h1>

          {/* Intro Paragraph */}
          <p className="text-charcoal/80 font-bold text-sm sm:text-[15px] leading-relaxed mb-12 text-center max-w-[620px] mx-auto">
            At Sustento, we&apos;re dedicated to delivering your favorite and nutritious snacks fresh, fast, and hassle-free. Here&apos;s everything you need to know about our shipping process:
          </p>

          <div className="flex flex-col gap-10">
            
            {/* 1. Order Processing Time */}
            <div className="flex flex-col items-start gap-3">
              <h2 className="text-charcoal font-black text-lg flex items-center gap-2">
                <span>🚚</span> Order Processing Time
              </h2>
              <div className="text-charcoal/80 font-bold text-xs sm:text-[13px] leading-relaxed flex flex-col gap-2">
                <p>
                  <strong className="text-charcoal">Processing Time:</strong> Orders are processed within 1-2 business days after payment confirmation.
                </p>
                <p>
                  <strong className="text-charcoal">Business Days:</strong> Monday to Friday (excluding public holidays).
                </p>
                <p>
                  <strong className="text-charcoal">High-Demand Periods:</strong> During sales, festivals, or high-volume seasons, processing times may be slightly longer. We appreciate your patience during such times.
                </p>
              </div>
            </div>

            {/* Divider line */}
            <div className="w-full border-t border-black/5" />

            {/* 2. Shipping & Delivery Time */}
            <div className="flex flex-col items-start gap-3">
              <h2 className="text-charcoal font-black text-lg flex items-center gap-2">
                <span>📦</span> Shipping & Delivery Time
              </h2>
              <div className="text-charcoal/80 font-bold text-xs sm:text-[13px] leading-relaxed flex flex-col gap-2">
                <p>
                  <strong className="text-charcoal">Standard Delivery:</strong> 3-7 business days, depending on your location.
                </p>
                <p>
                  <strong className="text-charcoal">Remote Areas:</strong> Delivery may take an additional 2-3 days.
                </p>
                <p>
                  <strong className="text-charcoal">Tracking:</strong> Once your order is shipped, you&apos;ll receive a tracking number via email or SMS to monitor your shipment&apos;s progress.
                </p>
              </div>
            </div>

            {/* Divider line */}
            <div className="w-full border-t border-black/5" />

            {/* 3. Shipping Locations */}
            <div className="flex flex-col items-start gap-3">
              <h2 className="text-charcoal font-black text-lg flex items-center gap-2">
                <span>🌍</span> Shipping Locations
              </h2>
              <div className="text-charcoal/85 font-bold text-xs sm:text-[13px] leading-relaxed flex flex-col gap-2">
                <p>We currently deliver <strong className="text-charcoal">across India.</strong></p>
                <p className="text-charcoal/50 italic">
                  For international shipping inquiries, please contact us at{" "}
                  <a href="mailto:info@sustentofood.com" className="underline hover:text-black">
                    info@sustentofood.com
                  </a>.
                </p>
              </div>
            </div>

            {/* Divider line */}
            <div className="w-full border-t border-black/5" />

            {/* 4. Shipping Charges */}
            <div className="flex flex-col items-start gap-3">
              <h2 className="text-charcoal font-black text-lg flex items-center gap-2">
                <span>💸</span> Shipping Charges
              </h2>
              <div className="text-charcoal/85 font-bold text-xs sm:text-[13px] leading-relaxed w-full flex flex-col gap-4">
                <ul className="list-disc pl-5 flex flex-col gap-2 text-charcoal/80">
                  <li>
                    <strong className="text-charcoal">Free Shipping:</strong> On all orders above ₹499.
                  </li>
                  <li>
                    <strong className="text-charcoal">Standard Shipping Fee:</strong> ₹100 for orders below ₹499.
                  </li>
                </ul>
                <p className="bg-stone-50 border border-stone-200/50 rounded-2xl p-4.5 text-charcoal/80 leading-relaxed font-bold">
                  <strong className="text-charcoal block mb-1">Cash on Delivery:</strong>
                  We offer Partial COD across India on eligible orders. You pay ₹99 upfront when you place the order and the remaining balance in cash on delivery.
                </p>
              </div>
            </div>

            {/* Divider line */}
            <div className="w-full border-t border-black/5" />

            {/* 5. Order Tracking */}
            <div className="flex flex-col items-start gap-3">
              <h2 className="text-charcoal font-black text-lg flex items-center gap-2">
                <span>🚩</span> Order Tracking
              </h2>
              <div className="text-charcoal/85 font-bold text-xs sm:text-[13px] leading-relaxed w-full flex flex-col gap-4">
                <p>
                  You&apos;ll receive an email/SMS/WhatsApp with tracking details once your order is dispatched. To track your order:
                </p>
                <ol className="list-decimal pl-5 flex flex-col gap-2 text-charcoal/80">
                  <li>Visit the courier&apos;s tracking page.</li>
                  <li>Enter your tracking ID.</li>
                  <li>Monitor your delivery status in real-time.</li>
                </ol>
              </div>
            </div>

            {/* Divider line */}
            <div className="w-full border-t border-black/5" />

            {/* 6. Delivery Delays */}
            <div className="flex flex-col items-start gap-3">
              <h2 className="text-charcoal font-black text-lg flex items-center gap-2">
                <span>⚠️</span> Delivery Delays
              </h2>
              <div className="text-charcoal/80 font-bold text-xs sm:text-[13px] leading-relaxed flex flex-col gap-2">
                <p>While we strive for timely delivery, delays may occur due to:</p>
                <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1 text-charcoal/70">
                  <li>Weather conditions</li>
                  <li>Transportation strikes</li>
                  <li>Public holidays</li>
                  <li>Remote area logistics</li>
                </ul>
                <p className="mt-2 text-charcoal/50 italic">We appreciate your understanding in such situations.</p>
              </div>
            </div>

            {/* Divider line */}
            <div className="w-full border-t border-black/5" />

            {/* 7. Damaged or Missing Items */}
            <div className="flex flex-col items-start gap-3">
              <h2 className="text-charcoal font-black text-lg flex items-center gap-2">
                <span>❗</span> Damaged or Missing Items
              </h2>
              <div className="text-charcoal/80 font-bold text-xs sm:text-[13px] leading-relaxed flex flex-col gap-2">
                <p>If your order arrives damaged, tampered, or incomplete:</p>
                <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1 text-charcoal/70 mb-2">
                  <li>Do not accept the package if visibly damaged.</li>
                  <li>Take clear photos of the package and products.</li>
                  <li>
                    Contact us within 48 hours at{" "}
                    <a href="mailto:support@sustentofood.com" className="underline hover:text-black">
                      support@sustentofood.com
                    </a>{" "}
                    with your order details and images.
                  </li>
                </ul>
                <p>We&apos;ll investigate the issue and offer a suitable resolution, which may include a replacement or refund.</p>
              </div>
            </div>

            {/* Divider line */}
            <div className="w-full border-t border-black/5" />

            {/* 8. Incorrect Address or Failed Delivery */}
            <div className="flex flex-col items-start gap-3">
              <h2 className="text-charcoal font-black text-lg flex items-center gap-2">
                <span>📦</span> Incorrect Address or Failed Delivery
              </h2>
              <div className="text-charcoal/80 font-bold text-xs sm:text-[13px] leading-relaxed flex flex-col gap-2">
                <p>
                  <strong className="text-charcoal">Incorrect Address:</strong> If the address provided is incorrect, the order may be returned to us. Reshipping will incur additional charges.
                </p>
                <p>
                  <strong className="text-charcoal">Undelivered Packages:</strong> If the courier cannot deliver after multiple attempts, the package will be returned. Re-delivery will be chargeable.
                </p>
              </div>
            </div>

            {/* Divider line */}
            <div className="w-full border-t border-black/5" />

            {/* 9. Need Help? */}
            <div className="flex flex-col items-start gap-3">
              <h2 className="text-charcoal font-black text-lg flex items-center gap-2">
                <span>🤝</span> Need Help?
              </h2>
              <div className="text-charcoal/80 font-bold text-xs sm:text-[13px] leading-relaxed flex flex-col gap-2">
                <p>For any shipping-related queries, reach out to us:</p>
                <p className="mt-1">
                  📧 <strong className="text-charcoal">Email:</strong>{" "}
                  <a href="mailto:support@sustentofood.com" className="hover:text-black transition-colors font-bold underline">
                    support@sustentofood.com
                  </a>
                </p>
                <p>
                  📞 <strong className="text-charcoal">Phone:</strong>{" "}
                  <a href="tel:+919924594414" className="hover:text-black transition-colors font-bold">
                    +91 99245 94414
                  </a>
                </p>
                <p className="mt-3 text-charcoal/50 font-semibold italic">
                  We&apos;re here to ensure your Sustento experience is smooth and satisfying!
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* ── On The #Gram Instagram Grid Section ──────────────── */}
        <InstagramGrid />

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

