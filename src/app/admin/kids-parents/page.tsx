"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { uploadFile } from "@/lib/upload";

export default function AdminKidsParentsPage() {
  const [headerTitleLine1, setHeaderTitleLine1] = useState("CLEAN LABEL.");
  const [headerTitleLine2, setHeaderTitleLine2] = useState("FULL DISCLOSURE.");
  const [headerSubtitle, setHeaderSubtitle] = useState("So clean, we proudly declare every ingredient.");
  const [titleLine1, setTitleLine1] = useState("KIDS LOVE");
  const [titleLine2, setTitleLine2] = useState("AND PARENTS TRUST");
  const [paraPrefix, setParaPrefix] = useState("Wholesome, delicious, and made with");
  const [paraHighlight, setParaHighlight] = useState("care for families.");
  const [btnLabel, setBtnLabel] = useState("Explore Now");
  const [btnLink, setBtnLink] = useState("/collections/all");
  const [imageUrl, setImageUrl] = useState("/images/mother-child.jpg");
  const [imageAlt, setImageAlt] = useState("Kids love and parents trust Sustento");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/kids-parents");
        if (res.ok) {
          const data = await res.json();
          setHeaderTitleLine1(data.headerTitleLine1 || "CLEAN LABEL.");
          setHeaderTitleLine2(data.headerTitleLine2 || "FULL DISCLOSURE.");
          setHeaderSubtitle(data.headerSubtitle || "So clean, we proudly declare every ingredient.");
          setTitleLine1(data.titleLine1 || "KIDS LOVE");
          setTitleLine2(data.titleLine2 || "AND PARENTS TRUST");
          setParaPrefix(data.paraPrefix || "Wholesome, delicious, and made with");
          setParaHighlight(data.paraHighlight || "care for families.");
          setBtnLabel(data.btnLabel || "Explore Now");
          setBtnLink(data.btnLink || "/collections/all");
          setImageUrl(data.imageUrl || "/images/mother-child.jpg");
          setImageAlt(data.imageAlt || "Kids love and parents trust Sustento");
        } else {
          setError("Failed to fetch Kids & Parents settings.");
        }
      } catch {
        setError("Error loading Kids & Parents settings.");
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");
    setSuccess("");

    const result = await uploadFile(file, { maxSizeMB: 5, allowedTypes: ["image/"] });
    if (result.url) {
      setImageUrl(result.url);
      setSuccess("Section image uploaded successfully.");
    } else {
      setError(result.error || "Failed to upload image file.");
    }
    setUploadingImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/kids-parents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headerTitleLine1,
          headerTitleLine2,
          headerSubtitle,
          titleLine1,
          titleLine2,
          paraPrefix,
          paraHighlight,
          btnLabel,
          btnLink,
          imageUrl,
          imageAlt,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Kids & Parents settings saved successfully!");
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
          Loading Section Settings...
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
            Kids & Parents Section Settings
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
          {/* Section 1: Header */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
              1. Upper Right Header block
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Header Title Line 1
                  </label>
                  <input
                    type="text"
                    required
                    value={headerTitleLine1}
                    onChange={(e) => setHeaderTitleLine1(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Header Title Line 2
                  </label>
                  <input
                    type="text"
                    required
                    value={headerTitleLine2}
                    onChange={(e) => setHeaderTitleLine2(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Header Subtitle (Italic description text)
                </label>
                <input
                  type="text"
                  required
                  value={headerSubtitle}
                  onChange={(e) => setHeaderSubtitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Main Copy */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
              2. Main Layout Copy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Title Line 1
                </label>
                <input
                  type="text"
                  required
                  value={titleLine1}
                  onChange={(e) => setTitleLine1(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Title Line 2 (Highlighted dark)
                </label>
                <input
                  type="text"
                  required
                  value={titleLine2}
                  onChange={(e) => setTitleLine2(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Description Paragraph Prefix
                </label>
                <input
                  type="text"
                  required
                  value={paraPrefix}
                  onChange={(e) => setParaPrefix(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Description Paragraph Highlight (Underlined)
                </label>
                <input
                  type="text"
                  required
                  value={paraHighlight}
                  onChange={(e) => setParaHighlight(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Button Link */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
              3. CTA Button Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Button Label
                </label>
                <input
                  type="text"
                  required
                  value={btnLabel}
                  onChange={(e) => setBtnLabel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Button Link URL
                </label>
                <input
                  type="text"
                  required
                  value={btnLink}
                  onChange={(e) => setBtnLink(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Image */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
              4. Section Image
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Upload Image
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="kids-parents-file-input"
                  />
                  <label
                    htmlFor="kids-parents-file-input"
                    className="cursor-pointer bg-charcoal text-white hover:bg-charcoal/90 text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all"
                  >
                    {uploadingImage ? "Uploading..." : "Choose Image File"}
                  </label>
                  {imageUrl && (
                    <span className="text-xs text-charcoal/50 font-bold truncate max-w-xs">
                      {imageUrl}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Or Image URL Path
                </label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Image Alternative Text
                </label>
                <input
                  type="text"
                  required
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
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
              {submitting ? "Saving changes..." : "Save Section Settings"}
            </button>
          </div>
        </form>

        {/* Live Preview Pane */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-4 sticky top-6">
            <h3 className="font-primary font-black text-xs uppercase tracking-wider text-charcoal border-b border-black/5 pb-3">
              👀 Visual Frontend Preview
            </h3>

            <div className="border border-stone-200/50 rounded-2xl bg-warm-white p-6 select-none relative overflow-hidden">
              {/* Header preview */}
              <div className="text-right mb-10">
                <h4 className="font-primary font-black text-sm text-charcoal uppercase leading-tight">
                  {headerTitleLine1 || "CLEAN LABEL."} <br />
                  {headerTitleLine2 || "FULL DISCLOSURE."}
                </h4>
                <p className="font-accent text-xs text-body italic leading-tight mt-1">
                  {headerSubtitle || "So clean, we declare every ingredient."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Text Block */}
                <div className="flex flex-col items-start">
                  <h5 className="font-primary font-black text-lg text-charcoal leading-tight uppercase">
                    {titleLine1 || "KIDS LOVE"} <br />
                    <span className="text-dark">{titleLine2 || "AND PARENTS TRUST"}</span>
                  </h5>
                  <p className="font-accent text-xs text-body mt-4 leading-relaxed italic">
                    {paraPrefix}{" "}
                    <span className="relative inline-block font-bold text-dark not-italic">
                      {paraHighlight}
                      <span className="absolute left-0 bottom-[-2px] w-full h-[3px] bg-[#9EAB75] rounded-full" />
                    </span>
                  </p>
                  <span className="inline-block mt-6 bg-[#9EAB75] text-dark text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm -rotate-2">
                    {btnLabel || "Explore Now"}
                  </span>
                </div>

                {/* Arch Image Container */}
                <div>
                  <div className="relative w-28 aspect-[4/5] mx-auto bg-[#9EAB75] rounded-t-[50px] p-1 pb-0 flex items-end overflow-hidden border border-white/20">
                    <div className="relative w-full h-full rounded-t-[45px] overflow-hidden bg-stone-100">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt={imageAlt}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
