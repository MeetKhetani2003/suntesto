"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { uploadFile } from "@/lib/upload";

export default function AdminFruitCrunchPage() {
  const [desktopImageUrl, setDesktopImageUrl] = useState("");
  const [mobileImageUrl, setMobileImageUrl] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/fruit-meets-crunch");
        if (res.ok) {
          const data = await res.json();
          setDesktopImageUrl(data.desktopImageUrl || "");
          setMobileImageUrl(data.mobileImageUrl || "");
          setIsEnabled(data.isEnabled ?? true);
        } else {
          setError("Failed to fetch Fruit Meets Crunch settings.");
        }
      } catch {
        setError("Error loading Fruit Meets Crunch settings.");
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "desktop" | "mobile") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (target === "desktop") {
      setUploadingDesktop(true);
    } else {
      setUploadingMobile(true);
    }
    setError("");
    setSuccess("");

    const result = await uploadFile(file, { maxSizeMB: 5, allowedTypes: ["image/"] });
    if (result.url) {
      if (target === "desktop") {
        setDesktopImageUrl(result.url);
      } else {
        setMobileImageUrl(result.url);
      }
      setSuccess(`${target === "desktop" ? "Desktop" : "Mobile"} image uploaded successfully.`);
    } else {
      setError(result.error || "Failed to upload image file.");
    }

    if (target === "desktop") {
      setUploadingDesktop(false);
    } else {
      setUploadingMobile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/fruit-meets-crunch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          desktopImageUrl,
          mobileImageUrl,
          isEnabled,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Fruit Meets Crunch settings saved successfully!");
      } else {
        setError(data.error || "Failed to save settings.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error saving settings.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-xs uppercase tracking-wider text-charcoal/60">
          Loading Settings...
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
            Fruit Meets Crunch Settings
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
        {/* Editor Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          
          {/* Status Toggle */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
              1. General Status
            </h3>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#9EAB75]/10 border border-[#9EAB75]/35">
              <div>
                <h4 className="text-sm font-black uppercase text-dark">Enable Dynamic Image</h4>
                <p className="text-xs font-bold text-charcoal/60 mt-1 leading-normal">
                  If enabled, the standard floating pouches collage is replaced with your dynamic uploaded images.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          {/* Desktop & Mobile Images */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
              2. Collage Images
            </h3>
            
            {/* Desktop Image */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80">
                Desktop Image (Recommended: Transparent PNG or customized collage)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "desktop")}
                  className="hidden"
                  id="crunch-desktop-file-input"
                />
                <label
                  htmlFor="crunch-desktop-file-input"
                  className="cursor-pointer bg-charcoal text-white hover:bg-charcoal/90 text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all"
                >
                  {uploadingDesktop ? "Uploading..." : "Upload Desktop File"}
                </label>
                {desktopImageUrl && (
                  <span className="text-xs text-charcoal/50 font-bold truncate max-w-xs">
                    {desktopImageUrl}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={desktopImageUrl}
                onChange={(e) => setDesktopImageUrl(e.target.value)}
                placeholder="Or paste Desktop Image URL path"
                className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
              />
            </div>

            {/* Mobile Image */}
            <div className="space-y-3 pt-3 border-t border-black/5">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80">
                Mobile Image (Recommended: Compact Transparent PNG)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "mobile")}
                  className="hidden"
                  id="crunch-mobile-file-input"
                />
                <label
                  htmlFor="crunch-mobile-file-input"
                  className="cursor-pointer bg-charcoal text-white hover:bg-charcoal/90 text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all"
                >
                  {uploadingMobile ? "Uploading..." : "Upload Mobile File"}
                </label>
                {mobileImageUrl && (
                  <span className="text-xs text-charcoal/50 font-bold truncate max-w-xs">
                    {mobileImageUrl}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={mobileImageUrl}
                onChange={(e) => setMobileImageUrl(e.target.value)}
                placeholder="Or paste Mobile Image URL path"
                className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full md:w-auto bg-[#9EAB75] text-dark shadow-md hover:bg-[#869360] transition-all font-black text-xs uppercase tracking-wider py-4 px-10 rounded-2xl ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Saving changes..." : "Save Settings"}
            </button>
          </div>
        </form>

        {/* Preview Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-4 sticky top-6">
            <h3 className="font-primary font-black text-xs tracking-wider text-charcoal border-b border-black/5 pb-3">
              👀 Section Preview
            </h3>
            
            <div className="border border-stone-200/50 rounded-2xl overflow-hidden bg-[#f9f8f3] p-4 space-y-4">
              {/* Desktop Preview */}
              <div>
                <span className="block text-[10px] font-black uppercase text-charcoal/50 mb-1">Desktop Layout View</span>
                <div className="relative w-full aspect-[4/3] bg-stone-100/50 rounded-xl overflow-hidden border border-black/5 flex items-center justify-center">
                  {desktopImageUrl ? (
                    <Image
                      src={desktopImageUrl}
                      alt="Desktop collage preview"
                      fill
                      className="object-contain p-4"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-charcoal/30">
                      No Desktop Image Configured
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Preview */}
              <div>
                <span className="block text-[10px] font-black uppercase text-charcoal/50 mb-1">Mobile Layout View</span>
                <div className="relative w-full max-w-[200px] aspect-square bg-stone-100/50 rounded-xl overflow-hidden border border-black/5 mx-auto flex items-center justify-center">
                  {mobileImageUrl ? (
                    <Image
                      src={mobileImageUrl}
                      alt="Mobile collage preview"
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-charcoal/30 text-center px-4">
                      No Mobile Image Configured
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
