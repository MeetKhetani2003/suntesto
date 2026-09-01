"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { uploadFile } from "@/lib/upload";

export default function AdminLimitedEditionPage() {
  const [title, setTitle] = useState("LIMITED EDITION");
  const [tagText, setTagText] = useState("Special Fruit hamper");
  const [imageUrl, setImageUrl] = useState("/images/hamper.jpg");
  const [bgBottomColor, setBgBottomColor] = useState("#b4b953");
  const [topAnnotationText, setTopAnnotationText] = useState("Build your own");
  const [topAnnotationHighlight, setTopAnnotationHighlight] = useState("Hamper");
  const [midAnnotationText, setMidAnnotationText] = useState("4 SNACKS");
  const [botAnnotationText, setBotAnnotationText] = useState("2 CHOC-DIPPED");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchLimitedEditionConfig() {
      try {
        const res = await fetch("/api/limited-edition");
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title || "LIMITED EDITION");
          setTagText(data.tagText || "Special Fruit hamper");
          setImageUrl(data.imageUrl || "/images/hamper.jpg");
          setBgBottomColor(data.bgBottomColor || "#b4b953");
          setTopAnnotationText(data.topAnnotationText || "Build your own");
          setTopAnnotationHighlight(data.topAnnotationHighlight || "Hamper");
          setMidAnnotationText(data.midAnnotationText || "4 SNACKS");
          setBotAnnotationText(data.botAnnotationText || "2 CHOC-DIPPED");
        } else {
          setError("Failed to fetch current limited edition configuration.");
        }
      } catch (err) {
        setError("Error loading limited edition config.");
      } finally {
        setLoading(false);
      }
    }
    fetchLimitedEditionConfig();
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
      setSuccess("Hamper box image uploaded successfully.");
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
      const res = await fetch("/api/limited-edition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          tagText,
          imageUrl,
          bgBottomColor,
          topAnnotationText,
          topAnnotationHighlight,
          midAnnotationText,
          botAnnotationText,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Limited edition settings saved successfully!");
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
          Loading Hamper Config...
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
            Limited Edition Settings
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
              1. Title & Tag Content
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Main Section Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LIMITED EDITION"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Tag Text (Inside Rotated Label)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Fruit hamper"
                  value={tagText}
                  onChange={(e) => setTagText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
              2. Design & Media Config
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Hamper Box Image Mockup
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    required
                    placeholder="Enter image URL or upload file"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                  <label className="shrink-0 px-4 py-3 bg-charcoal text-white hover:bg-black font-primary text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors flex items-center justify-center h-11 min-w-[120px]">
                    {uploadingImage ? "Uploading..." : "Upload File"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Bottom Background Split Color
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={bgBottomColor}
                    onChange={(e) => setBgBottomColor(e.target.value)}
                    className="w-12 h-11 border border-black/10 rounded-xl cursor-pointer bg-white p-1"
                  />
                  <input
                    type="text"
                    required
                    placeholder="#b4b953"
                    value={bgBottomColor}
                    onChange={(e) => setBgBottomColor(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
              3. Annotation Pointers
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Top Label: Plain Text
                  </label>
                  <input
                    type="text"
                    required
                    value={topAnnotationText}
                    onChange={(e) => setTopAnnotationText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Top Label: Highlighted Text
                  </label>
                  <input
                    type="text"
                    required
                    value={topAnnotationHighlight}
                    onChange={(e) => setTopAnnotationHighlight(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Middle Right Label (Arrow Pointing Down-Left)
                </label>
                <input
                  type="text"
                  required
                  value={midAnnotationText}
                  onChange={(e) => setMidAnnotationText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Bottom Right Label (Arrow Pointing Up-Left)
                </label>
                <input
                  type="text"
                  required
                  value={botAnnotationText}
                  onChange={(e) => setBotAnnotationText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-[#9EAB75] text-dark hover:bg-[#FFE58F] font-primary text-sm font-black uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Hamper Config"
              )}
            </button>
          </div>
        </form>

        {/* Live Preview Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4 sticky top-6">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-2">
              Live Mock Preview
            </h3>

            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-off-white shadow-inner border border-black/10 flex flex-col justify-between">
              {/* Background Split */}
              <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
                <div className="h-1/2 w-full bg-off-white" />
                <div
                  className="h-1/2 w-full transition-colors duration-300"
                  style={{ backgroundColor: bgBottomColor }}
                />
              </div>

              <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                {/* Left Side Info */}
                <div className="text-left max-w-[60%] mt-2">
                  <h4 className="font-primary font-black text-charcoal leading-[1.1] uppercase tracking-tight text-lg sm:text-xl">
                    {title}
                  </h4>
                  <div className="mt-1.5 bg-[#9EAB75] text-dark shadow-sm border border-black/5 -rotate-2 px-3 py-1.5 rounded-full inline-block">
                    <span className="font-accent text-xs font-bold uppercase tracking-wide">
                      {tagText}
                    </span>
                  </div>
                </div>

                {/* Right Side Hamper Image & Annotations */}
                <div className="absolute right-2 bottom-6 w-[55%] h-[70%] flex items-center justify-center">
                  <div className="relative w-full h-[90%] mix-blend-multiply">
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt="Preview Hamper"
                        fill
                        className="object-cover rounded-xl"
                        unoptimized
                      />
                    )}
                  </div>

                  {/* Top Pointer */}
                  <div className="absolute -top-3 right-4 z-20">
                    <p className="font-primary font-black text-[9px] text-charcoal flex items-center gap-1">
                      {topAnnotationText}
                      <span className="font-accent text-[#b4b953] bg-[#9EAB75]/20 px-1 rounded rotate-2 inline-block font-bold">
                        {topAnnotationHighlight}
                      </span>
                    </p>
                  </div>

                  {/* Mid Pointer */}
                  <div className="absolute top-1/4 -right-1 z-20 flex flex-col items-center rotate-6">
                    <span className="font-primary font-black text-[8px] text-charcoal uppercase tracking-wider">
                      {midAnnotationText}
                    </span>
                  </div>

                  {/* Bot Pointer */}
                  <div className="absolute -bottom-3 right-8 z-20 flex flex-col items-center -rotate-3">
                    <span className="font-accent font-bold text-[10px] text-dark leading-none">
                      {botAnnotationText}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-charcoal/50 font-bold uppercase text-center">
              * The above displays a simplified scale representation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
