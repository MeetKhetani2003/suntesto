"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { uploadFile } from "@/lib/upload";

export default function AdminLifestyleBannerPage() {
  const [title, setTitle] = useState("REAL FRUIT.\nUNREAL SNACK.");
  const [tagline, setTagline] = useState("Just one ingredient. That's it.");
  const [buttonText, setButtonText] = useState("Explore All Products");
  const [buttonLink, setButtonLink] = useState("/collections/all");
  const [desktopImageUrl, setDesktopImageUrl] = useState("");
  const [mobileImageUrl, setMobileImageUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/lifestyle-banner");
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title || "REAL FRUIT.\nUNREAL SNACK.");
          setTagline(data.tagline || "Just one ingredient. That's it.");
          setButtonText(data.buttonText || "Explore All Products");
          setButtonLink(data.buttonLink || "/collections/all");
          setDesktopImageUrl(data.desktopImageUrl || "");
          setMobileImageUrl(data.mobileImageUrl || "");
        } else {
          setError("Failed to fetch current lifestyle banner configuration.");
        }
      } catch (err) {
        setError("Error loading lifestyle banner config.");
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleDesktopUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDesktop(true);
    setError("");
    setSuccess("");

    const result = await uploadFile(file, { maxSizeMB: 5, allowedTypes: ["image/"] });
    if (result.url) {
      setDesktopImageUrl(result.url);
      setSuccess("Desktop banner image uploaded successfully.");
    } else {
      setError(result.error || "Failed to upload desktop image file.");
    }
    setUploadingDesktop(false);
  };

  const handleMobileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMobile(true);
    setError("");
    setSuccess("");

    const result = await uploadFile(file, { maxSizeMB: 5, allowedTypes: ["image/"] });
    if (result.url) {
      setMobileImageUrl(result.url);
      setSuccess("Mobile banner image uploaded successfully.");
    } else {
      setError(result.error || "Failed to upload mobile image file.");
    }
    setUploadingMobile(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/lifestyle-banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          tagline,
          buttonText,
          buttonLink,
          desktopImageUrl,
          mobileImageUrl,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Lifestyle banner settings saved successfully!");
      } else {
        setError(data.error || "Failed to save settings.");
      }
    } catch (err) {
      setError("Unexpected error saving settings.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-xs uppercase tracking-wider text-charcoal/60">
          Loading Banner Config...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 select-none font-primary">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin"
            className="text-xs font-bold text-charcoal/60 hover:text-charcoal flex items-center gap-1 mb-1"
          >
            ← Back to Dashboard
          </Link>
          <h2 className="font-primary font-black text-2xl md:text-3xl uppercase tracking-tight text-charcoal">
            Lifestyle Banner Settings
          </h2>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold">
          ✅ {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Settings Pane */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
              1. Title & Tagline Content
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Main Title (Supports \n for line breaks)
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="REAL FRUIT.\nUNREAL SNACK."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Tagline Text
                </label>
                <input
                  type="text"
                  required
                  placeholder="Just one ingredient. That's it."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
              2. CTA (Call To Action) Button
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Button Label
                </label>
                <input
                  type="text"
                  required
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Button Redirect Link
                </label>
                <input
                  type="text"
                  required
                  value={buttonLink}
                  onChange={(e) => setButtonLink(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
              3. Banner Media (Desktop & Mobile Options)
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Desktop Banner Image URL
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    required
                    placeholder="Enter URL or upload file"
                    value={desktopImageUrl}
                    onChange={(e) => setDesktopImageUrl(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                  <label className="shrink-0 px-4 py-3 bg-charcoal text-white hover:bg-black font-primary text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors flex items-center justify-center h-11 min-w-[120px]">
                    {uploadingDesktop ? "Uploading..." : "📁 Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDesktopUpload}
                      disabled={uploadingDesktop}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Mobile Banner Image URL
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    required
                    placeholder="Enter URL or upload file"
                    value={mobileImageUrl}
                    onChange={(e) => setMobileImageUrl(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                  <label className="shrink-0 px-4 py-3 bg-charcoal text-white hover:bg-black font-primary text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors flex items-center justify-center h-11 min-w-[120px]">
                    {uploadingMobile ? "Uploading..." : "📁 Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMobileUpload}
                      disabled={uploadingMobile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#9EAB75] hover:bg-[#869360] text-dark font-black uppercase text-xs py-4 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Saving Configuration..." : "Save Lifestyle Banner Configuration"}
          </button>
        </form>

        {/* Live Preview Pane */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-6 sticky top-6">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
              Live Mockup Preview
            </h3>

            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase text-charcoal/40 tracking-wider">Desktop Preview Layout</span>
              <div className="relative w-full aspect-[16/9] border border-black/10 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
                {desktopImageUrl ? (
                  <Image
                    src={desktopImageUrl}
                    alt="Desktop preview"
                    fill
                    className="object-cover"
                    unoptimized={true}
                  />
                ) : (
                  <span className="text-xs font-semibold text-charcoal/40">No desktop image set</span>
                )}
              </div>

              <span className="text-[10px] font-black uppercase text-charcoal/40 tracking-wider block mt-4">Mobile Preview Layout</span>
              <div className="relative w-1/2 aspect-[9/16] border border-black/10 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center mx-auto">
                {mobileImageUrl ? (
                  <Image
                    src={mobileImageUrl}
                    alt="Mobile preview"
                    fill
                    className="object-cover"
                    unoptimized={true}
                  />
                ) : (
                  <span className="text-xs font-semibold text-charcoal/40">No mobile image set</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
