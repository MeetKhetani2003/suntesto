"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InstagramGrid from "@/components/sections/InstagramGrid";
import Link from "next/link";

const CONTACT_ITEMS = [
  {
    icon: "📍",
    label: "Our Address",
    value: "FF-105 Sonamahor Elevate, Opposite Gujrat CNG pump, Kothariya, Rajkot – 360022, Gujarat, India",
    href: "https://maps.google.com/?q=Sonamahor+Elevate+Rajkot+Gujarat",
    isLink: true,
    external: true,
  },
  {
    icon: "📞",
    label: "Phone",
    value: "+91 99245 94414",
    href: "tel:+919924594414",
    isLink: true,
    external: false,
  },
  {
    icon: "✉️",
    label: "Email",
    value: "support@sustentofood.com",
    href: "mailto:support@sustentofood.com",
    isLink: true,
    external: false,
  },
  {
    icon: "🕐",
    label: "Business Hours",
    value: "Mon – Sat · 10:00 AM – 6:00 PM IST",
    isLink: false,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (form.phone && !/^[0-9+\-\s]{7,15}$/.test(form.phone)) e.phone = "Enter a valid phone number.";
    if (!form.message.trim()) e.message = "Please write a message.";
    else if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  };

  return (
    <>
      <Header />

      <main className="w-full bg-[#fffff9] select-none">

        {/* ── HERO BANNER ──────────────────────────────────────────── */}
        <section className="pt-36 pb-16 px-6 text-center relative overflow-hidden">
          {/* Subtle radial bg glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(158,171,117,0.10) 0%, transparent 70%)" }} />
          <div className="relative max-w-[620px] mx-auto">
            <span className="inline-block font-accent text-[#9EAB75] text-lg mb-3 italic">Say Hello 👋</span>
            <h1 className="font-primary font-black text-[36px] sm:text-[52px] text-charcoal uppercase tracking-tight leading-none mb-5">
              Get In<br />
              <span className="text-[#9EAB75]">Touch.</span>
            </h1>
            <p className="text-sm font-medium text-charcoal/55 leading-relaxed max-w-[400px] mx-auto">
              Have a question about an order, partnership, or just want to share some snack love? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* ── TWO COLUMN LAYOUT ──────────────────────────────────────── */}
        <section className="max-w-[1100px] mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* ── LEFT — Info Panel ──────────────────────────────────── */}
            <div className="flex flex-col gap-6">

              {/* Contact cards */}
              <div className="flex flex-col gap-4">
                {CONTACT_ITEMS.map((item) => (
                  <div
                    key={item.label}
                    className="bg-white border border-black/5 rounded-2xl px-6 py-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/40">{item.label}</span>
                      {item.isLink ? (
                        <a
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className="font-primary font-bold text-sm text-dark hover:text-[#9EAB75] transition-colors leading-snug break-words"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="font-primary font-bold text-sm text-dark leading-snug">{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Grievance Officer card */}
              <div className="bg-[#9EAB75]/8 border border-[#9EAB75]/25 rounded-2xl px-6 py-5">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#9EAB75] block mb-3">Grievance Redressal Officer</span>
                <p className="font-primary font-bold text-sm text-dark">Raj Kotadiya</p>
                <a href="mailto:raj@sustentofood.com" className="font-primary text-sm font-semibold text-charcoal/70 hover:text-dark transition-colors mt-1 block">
                  raj@sustentofood.com
                </a>
                <p className="text-[11px] text-charcoal/40 font-semibold italic mt-3">
                  (Under Consumer Protection Act and applicable rules)
                </p>
              </div>

              {/* Company info */}
              <div className="bg-white border border-black/5 rounded-2xl px-6 py-5 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/40 block mb-3">Registered Entity</span>
                <p className="font-primary font-black text-sm text-dark">Sustento Foods Private Limited</p>
                <p className="text-xs text-charcoal/50 font-medium mt-1">CIN: U00000GJ2024PTC000000</p>
              </div>
            </div>

            {/* ── RIGHT — Contact Form ────────────────────────────────── */}
            <div className="bg-white border border-black/5 rounded-3xl p-7 sm:p-9 shadow-sm">

              {/* Form header */}
              <div className="mb-7">
                <h2 className="font-primary font-black text-xl uppercase tracking-tight text-dark">Send Us a Message</h2>
                <p className="text-xs text-charcoal/50 font-medium mt-1.5">We reply within 24 business hours.</p>
              </div>

              {/* Success state */}
              {status === "success" ? (
                <div className="flex flex-col items-center text-center py-10 gap-4">
                  <div className="w-16 h-16 bg-[#9EAB75]/15 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#9EAB75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-primary font-black text-lg uppercase text-dark tracking-tight">Message Sent!</h3>
                    <p className="text-sm text-charcoal/55 font-medium mt-1 leading-relaxed">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-2 px-7 py-3 bg-[#9EAB75] hover:bg-[#8a9a64] text-dark font-primary font-black text-xs uppercase tracking-wider rounded-full transition-all hover:scale-105 cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

                  {/* Error banner */}
                  {status === "error" && errorMsg && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-xs font-semibold text-red-700 flex items-start gap-2">
                      <span className="shrink-0 mt-0.5">⚠️</span>
                      {errorMsg}
                    </div>
                  )}

                  {/* Name + Phone row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="font-primary font-black text-[11px] uppercase tracking-wider text-charcoal/50">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="e.g. Priya Sharma"
                        value={form.name}
                        onChange={handleChange}
                        disabled={status === "loading"}
                        className={`w-full bg-[#FAF9F5] border rounded-full px-5 py-3 text-sm font-medium placeholder:text-charcoal/30 focus:outline-none focus:border-[#9EAB75] focus:bg-white transition-all disabled:opacity-50 ${
                          errors.name ? "border-red-300 bg-red-50/30" : "border-black/10"
                        }`}
                      />
                      {errors.name && <p className="text-[11px] text-red-500 font-semibold px-1">{errors.name}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="phone" className="font-primary font-black text-[11px] uppercase tracking-wider text-charcoal/50">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={form.phone}
                        onChange={handleChange}
                        disabled={status === "loading"}
                        className={`w-full bg-[#FAF9F5] border rounded-full px-5 py-3 text-sm font-medium placeholder:text-charcoal/30 focus:outline-none focus:border-[#9EAB75] focus:bg-white transition-all disabled:opacity-50 ${
                          errors.phone ? "border-red-300 bg-red-50/30" : "border-black/10"
                        }`}
                      />
                      {errors.phone && <p className="text-[11px] text-red-500 font-semibold px-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="font-primary font-black text-[11px] uppercase tracking-wider text-charcoal/50">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="e.g. priya@example.com"
                      value={form.email}
                      onChange={handleChange}
                      disabled={status === "loading"}
                      className={`w-full bg-[#FAF9F5] border rounded-full px-5 py-3 text-sm font-medium placeholder:text-charcoal/30 focus:outline-none focus:border-[#9EAB75] focus:bg-white transition-all disabled:opacity-50 ${
                        errors.email ? "border-red-300 bg-red-50/30" : "border-black/10"
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-red-500 font-semibold px-1">{errors.email}</p>}
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="font-primary font-black text-[11px] uppercase tracking-wider text-charcoal/50">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      value={form.message}
                      onChange={handleChange}
                      disabled={status === "loading"}
                      className={`w-full bg-[#FAF9F5] border rounded-2xl px-5 py-4 text-sm font-medium placeholder:text-charcoal/30 focus:outline-none focus:border-[#9EAB75] focus:bg-white transition-all resize-none disabled:opacity-50 ${
                        errors.message ? "border-red-300 bg-red-50/30" : "border-black/10"
                      }`}
                    />
                    <div className="flex items-center justify-between px-1">
                      {errors.message
                        ? <p className="text-[11px] text-red-500 font-semibold">{errors.message}</p>
                        : <span />
                      }
                      <span className={`text-[11px] font-semibold ${form.message.length > 500 ? "text-red-400" : "text-charcoal/30"}`}>
                        {form.message.length}/500
                      </span>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full mt-1 bg-dark hover:bg-dark/90 disabled:opacity-60 text-white font-primary font-black text-[13px] uppercase tracking-wider py-4 rounded-full shadow-md hover:-rotate-[0.5deg] hover:scale-[1.01] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-charcoal/35 font-medium text-center leading-relaxed">
                    By submitting this form you agree to our{" "}
                    <Link href="/terms-of-service" className="underline hover:text-dark transition-colors">Terms of Service</Link>{" "}
                    and{" "}
                    <Link href="/refund-policy" className="underline hover:text-dark transition-colors">Refund Policy</Link>.
                  </p>
                </form>
              )}
            </div>

          </div>
        </section>

        {/* ── Instagram Grid ───────────────────────────────────────── */}
        <InstagramGrid />

      </main>

      <Footer />
    </>
  );
}
