"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InstagramGrid from "@/components/sections/InstagramGrid";

export default function BulkOrdersPage() {
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [shippingLocation, setShippingLocation] = useState("");
  const [orderDetails, setOrderDetails] = useState("");
  const [timeline, setTimeline] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bulk-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contactNumber,
          email,
          companyName,
          shippingLocation,
          orderDetails,
          timeline,
          notes,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        // Clear form
        setName("");
        setContactNumber("");
        setEmail("");
        setCompanyName("");
        setShippingLocation("");
        setOrderDetails("");
        setTimeline("");
        setNotes("");
      } else {
        setError(data.error || "Failed to submit request.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <main className="w-full bg-[#fffff9] pt-36 pb-12 select-none">
        <div className="max-w-[700px] mx-auto px-6 text-left mb-20 font-primary">
          <h1 className="font-primary font-black text-2xl sm:text-[32px] text-charcoal uppercase tracking-tight text-center mb-6">
            Bulk / Corporate Order Requests
          </h1>

          <p className="text-center font-accent text-body text-sm leading-relaxed mb-12 max-w-[580px] mx-auto italic">
            Hey 👋 Thanks for thinking of Sustento for your team, community, or loved ones! We’re
            all about clean, convenient, and honest nutrition — whether you need a small batch or a
            big shipment, we’ve got you covered ❤️
          </p>

          {success ? (
            <div className="bg-green-50 border border-green-200 p-8 rounded-3xl text-center space-y-4">
              <span className="text-4xl">🎉</span>
              <h3 className="font-black text-lg text-green-800 uppercase tracking-tight">
                Request Submitted Successfully!
              </h3>
              <p className="text-green-700/80 text-sm leading-relaxed max-w-[450px] mx-auto">
                Thank you for reaching out. Your details have been received and our team will get
                back to you swiftly to help coordinate your bulk order!
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 px-6 py-2.5 bg-[#9EAB75] text-dark hover:bg-[#FFE58F] font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold">
                  ⚠️ {error}
                </div>
              )}

              {/* Your Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-[#B57C58] flex items-center gap-1">
                  Your name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your answer"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal bg-white"
                />
              </div>

              {/* Contact Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-[#B57C58]">
                  Your contact number. If international contact, please mention WhatsApp number.{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Your answer"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal bg-white"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-[#B57C58]">
                  Your email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your answer"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal bg-white"
                />
              </div>

              {/* Company Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-[#B57C58]">
                  Your company name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your answer"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal bg-white"
                />
              </div>

              {/* Shipping Location */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-[#B57C58]">
                  Shipping location. If single point delivery then mention the address; If multiple,
                  then the area of delivery, for example: All across India{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={shippingLocation}
                  onChange={(e) => setShippingLocation(e.target.value)}
                  placeholder="Your answer"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal bg-white resize-none"
                />
              </div>

              {/* What would you like to order */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-[#B57C58]">
                  What would you like to order? Kindly paste the link to the things you would like
                  to order from the website with the required quantity.{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={orderDetails}
                  onChange={(e) => setOrderDetails(e.target.value)}
                  placeholder="Your answer"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal bg-white resize-none"
                />
              </div>

              {/* How soon do you need this */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-[#B57C58]">
                  How soon do you need this? <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="Your answer"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal bg-white"
                />
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-[#B57C58]">
                  Any other notes or comments?
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Your answer"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal bg-white resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4 text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-10 py-3.5 bg-[#9EAB75] text-dark hover:bg-[#FFE58F] disabled:bg-stone-150 font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Bulk Request"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <InstagramGrid />
      </main>

      <Footer />
    </>
  );
}
