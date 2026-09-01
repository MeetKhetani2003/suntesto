"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { uploadFile } from "@/lib/upload";

export default function AdminFooterConfigPage() {
  const [sloganLine1, setSloganLine1] = useState("YOU'VE GOT THE");
  const [sloganLine2, setSloganLine2] = useState("NATURE'S BEST WITH");
  const [sloganLine3, setSloganLine3] = useState("SUSTENTO");
  const [middleGraphicUrl, setMiddleGraphicUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("https://facebook.com");
  const [instagramUrl, setInstagramUrl] = useState("https://instagram.com");
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingGraphic, setUploadingGraphic] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/footer-config");
        if (res.ok) {
          const data = await res.json();
          setSloganLine1(data.sloganLine1 || "YOU'VE GOT THE");
          setSloganLine2(data.sloganLine2 || "NATURE'S BEST WITH");
          setSloganLine3(data.sloganLine3 || "SUSTENTO");
          setMiddleGraphicUrl(data.middleGraphicUrl || "");
          setFacebookUrl(data.facebookUrl || "https://facebook.com");
          setInstagramUrl(data.instagramUrl || "https://instagram.com");
          setLinkedinUrl(data.linkedinUrl || "https://linkedin.com");
        } else {
          setError("Failed to fetch footer configuration.");
        }
      } catch (err) {
        setError("Error loading footer config.");
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleGraphicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGraphic(true);
    setError("");
    setSuccess("");

    const result = await uploadFile(file, { maxSizeMB: 5, allowedTypes: ["image/"] });
    if (result.url) {
      setMiddleGraphicUrl(result.url);
      setSuccess("Graphic uploaded successfully.");
    } else {
      setError(result.error || "Failed to upload graphic file.");
    }
    setUploadingGraphic(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/footer-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sloganLine1,
          sloganLine2,
          sloganLine3,
          middleGraphicUrl,
          facebookUrl,
          instagramUrl,
          linkedinUrl,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Footer configuration saved successfully!");
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
          Loading Footer Config...
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
          <h2 className="font-primary font-black text-2xl uppercase tracking-tight text-charcoal">
            Footer Customization Settings
          </h2>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
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
          
          {/* Section 1: Slogan Text */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
              1. Left Column Brand Slogan
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Slogan Line 1
                </label>
                <input
                  type="text"
                  required
                  value={sloganLine1}
                  onChange={(e) => setSloganLine1(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Slogan Line 2 (Highlighted with Green Underline)
                </label>
                <input
                  type="text"
                  required
                  value={sloganLine2}
                  onChange={(e) => setSloganLine2(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Slogan Line 3 (Rotated Badge Accent)
                </label>
                <input
                  type="text"
                  required
                  value={sloganLine3}
                  onChange={(e) => setSloganLine3(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Social media URLs */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
              2. Social Media Links
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Facebook Profile Link
                </label>
                <input
                  type="url"
                  required
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Instagram Profile Link
                </label>
                <input
                  type="url"
                  required
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  LinkedIn Profile Link
                </label>
                <input
                  type="url"
                  required
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Middle Graphic Image Upload */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
              3. Middle Column Graphic
            </h3>
            <p className="text-xs text-charcoal/50 font-semibold leading-relaxed">
              Upload a custom image/graphic (e.g. strawberry png) to display in the middle column of the footer. Leaving this blank will fallback to the default vector Strawberry design.
            </p>
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Upload Custom Image
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGraphicUpload}
                    className="hidden"
                    id="footer-graphic-input"
                  />
                  <label
                    htmlFor="footer-graphic-input"
                    className="cursor-pointer bg-charcoal text-white hover:bg-charcoal/90 text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all"
                  >
                    {uploadingGraphic ? "Uploading..." : "Choose Image File"}
                  </label>
                  {middleGraphicUrl && (
                    <button
                      type="button"
                      onClick={() => setMiddleGraphicUrl("")}
                      className="text-xs text-red-500 font-bold hover:underline"
                    >
                      Clear Custom Image
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Or Graphic Image URL
                </label>
                <input
                  type="text"
                  value={middleGraphicUrl}
                  onChange={(e) => setMiddleGraphicUrl(e.target.value)}
                  placeholder="Leave empty for default Strawberry SVG"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full md:w-auto bg-[#9EAB75] text-dark shadow-md hover:bg-[#869360] transition-all font-black text-xs uppercase tracking-wider py-4 px-10 rounded-2xl ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Saving changes..." : "Save Footer Settings"}
            </button>
          </div>
        </form>

        {/* Visual Live Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-4 sticky top-6">
            <h3 className="font-primary font-black text-xs uppercase tracking-wider text-charcoal border-b border-black/5 pb-3">
              👀 Live Footer Left Columns Preview
            </h3>
            
            <div className="border border-stone-200 bg-[#fffff9] p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative select-none">
              
              {/* Slogan column */}
              <div className="flex flex-col items-start">
                <h3 className="font-primary font-black text-charcoal leading-[1.1] uppercase tracking-tight text-[18px] mb-4">
                  {sloganLine1} <br />
                  <span className="relative inline-block mt-0.5">
                    {sloganLine2}
                    <span className="absolute left-0 bottom-[-1px] w-full h-[3px] bg-[#9EAB75] rounded-full" />
                  </span>
                  <br />
                  <span className="bg-[#9EAB75] text-dark shadow-sm px-3 py-0.5 rounded-full inline-block mt-2 -rotate-1 text-[13px]">
                    {sloganLine3}
                  </span>
                </h3>

                {/* Social icons */}
                <div className="flex items-center gap-3 text-charcoal/80">
                  <span className="bg-charcoal/5 p-2 rounded-full text-xs font-bold">FB</span>
                  <span className="bg-charcoal/5 p-2 rounded-full text-xs font-bold">IG</span>
                  <span className="bg-charcoal/5 p-2 rounded-full text-xs font-bold">LN</span>
                </div>
              </div>

              {/* Graphic column */}
              <div className="flex items-center justify-center h-32 w-full">
                {middleGraphicUrl ? (
                  <div className="relative w-28 h-32 border border-black/5 bg-[#FAF9F5] rounded-2xl overflow-hidden shadow-sm">
                    <Image
                      src={middleGraphicUrl}
                      alt="Footer Graphic"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                ) : (
                  <div className="text-[#CC2828] fill-current drop-shadow-md select-none text-center">
                    🍓
                    <span className="block text-[10px] text-charcoal/40 font-bold uppercase tracking-wider mt-1">
                      Default Strawberry SVG
                    </span>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
