"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { uploadFile } from "@/lib/upload";

interface ISlide {
  imageUrl: string;
  title: string;
  description: string;
  titleColor: string;
}

export default function AdminAboutHeroPage() {
  const [slides, setSlides] = useState<ISlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/about-hero");
        if (res.ok) {
          const data = await res.json();
          setSlides(data.slides || []);
        } else {
          setError("Failed to fetch About Us configuration.");
        }
      } catch (err) {
        setError("Error loading configuration from database.");
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(idx);
    setError("");
    setSuccess("");

    const result = await uploadFile(file, { maxSizeMB: 5, allowedTypes: ["image/"] });
    if (result.url) {
      const updated = [...slides];
      updated[idx].imageUrl = result.url;
      setSlides(updated);
      setSuccess(`Slide ${idx + 1} image uploaded successfully.`);
    } else {
      setError(result.error || "Failed to upload image file.");
    }
    setUploadingIndex(null);
  };

  const handleAddSlide = () => {
    setSlides([
      ...slides,
      {
        imageUrl: "/images/sustento-pouch-pineapple.jpg",
        title: "NEW SLIDE \nWHOLE FRUIT",
        description: "Lightweight, Crunchy, \nSingle Ingredient",
        titleColor: "#9EAB75",
      },
    ]);
    setPreviewIndex(slides.length);
    setSuccess("New slide added. Edit details below.");
  };

  const handleRemoveSlide = (idx: number) => {
    if (slides.length <= 1) {
      setError("You must have at least one slide item.");
      return;
    }
    const updated = slides.filter((_, i) => i !== idx);
    setSlides(updated);
    setPreviewIndex(0);
    setSuccess(`Slide ${idx + 1} removed.`);
  };

  const handleMoveSlide = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;

    const updated = [...slides];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    setSlides(updated);
    setPreviewIndex(targetIdx);
  };

  const handleChangeField = (idx: number, field: keyof ISlide, value: string) => {
    const updated = [...slides];
    updated[idx] = { ...updated[idx], [field]: value };
    setSlides(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/about-hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("About Us Hero settings saved successfully!");
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
          Loading About Us Config...
        </p>
      </div>
    );
  }

  const activePreviewSlide = slides[previewIndex] || null;

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
            About Us Hero Settings
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
        {/* Left Column: Form Settings (cols 7) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-black/5 pb-3">
              <h3 className="font-primary font-black text-lg uppercase text-charcoal">
                Slide Items Manager ({slides.length})
              </h3>
              <button
                type="button"
                onClick={handleAddSlide}
                className="bg-[#9EAB75] text-dark hover:bg-[#869360] hover:text-white font-black text-[11px] uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                + Add Slide
              </button>
            </div>

            <div className="space-y-6">
              {slides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    previewIndex === idx
                      ? "border-[#9EAB75] bg-[#9EAB75]/5 shadow-sm"
                      : "border-black/5 bg-[#fafaf8]"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/80">
                      Slide #{idx + 1}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveSlide(idx, "up")}
                        className="px-2 py-1 bg-white hover:bg-black hover:text-white border border-black/5 text-[10px] rounded-lg disabled:opacity-30 transition-all font-bold cursor-pointer"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={idx === slides.length - 1}
                        onClick={() => handleMoveSlide(idx, "down")}
                        className="px-2 py-1 bg-white hover:bg-black hover:text-white border border-black/5 text-[10px] rounded-lg disabled:opacity-30 transition-all font-bold cursor-pointer"
                        title="Move Down"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewIndex(idx)}
                        className="px-3.5 py-1 bg-white hover:bg-[#9EAB75] border border-black/5 text-[10px] uppercase font-black tracking-wider rounded-lg transition-all cursor-pointer"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSlide(idx)}
                        className="px-3.5 py-1 bg-red-50 hover:bg-red-500 hover:text-white border border-red-100 text-red-600 text-[10px] uppercase font-black tracking-wider rounded-lg transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-charcoal/70 mb-1">
                          Right-Side Title (use \n for line breaks)
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={slide.title}
                          onChange={(e) => handleChangeField(idx, "title", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs font-semibold focus:outline-none focus:border-charcoal bg-white"
                          placeholder="e.g. PINEAPPLE \nWHOLE FRUIT"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-charcoal/70 mb-1">
                          Right-Side Description
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={slide.description}
                          onChange={(e) => handleChangeField(idx, "description", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs font-semibold focus:outline-none focus:border-charcoal bg-white"
                          placeholder="e.g. Lightweight, Crunchy, \nSingle Ingredient"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-charcoal/70 mb-1">
                          Pouch Image URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={slide.imageUrl}
                            onChange={(e) => handleChangeField(idx, "imageUrl", e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl border border-black/10 text-xs font-semibold focus:outline-none focus:border-charcoal bg-white"
                          />
                          <label className="shrink-0 px-3 py-2 bg-charcoal text-white hover:bg-black font-primary text-[10px] font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors flex items-center justify-center min-w-[70px]">
                            {uploadingIndex === idx ? "..." : "Upload"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, idx)}
                              disabled={uploadingIndex !== null}
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-charcoal/70 mb-1">
                          Title Text Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={slide.titleColor}
                            onChange={(e) => handleChangeField(idx, "titleColor", e.target.value)}
                            className="w-12 h-9 rounded-lg border border-black/10 cursor-pointer p-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={slide.titleColor}
                            onChange={(e) => handleChangeField(idx, "titleColor", e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl border border-black/10 text-xs font-semibold uppercase focus:outline-none focus:border-charcoal bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-black/5 pt-5 flex justify-end gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 bg-charcoal hover:bg-black text-white font-primary text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </form>

        {/* Right Column: Live Slide Preview (cols 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-sm uppercase tracking-wider text-charcoal border-b border-black/5 pb-2">
              Live Mock Preview
            </h3>

            {activePreviewSlide ? (
              <div className="w-full bg-[#fffff9] border border-black/5 rounded-2xl p-6 flex flex-col items-center select-none relative overflow-hidden min-h-[360px] justify-between">
                {/* Simulated Header block */}
                <div className="w-full flex items-center justify-between text-left border-b border-black/5 pb-2 mb-4">
                  <div className="flex flex-col">
                    <span className="font-primary font-bold text-[9px] text-charcoal/50">WE ARE MAKING</span>
                    <span className="font-primary font-black text-xl text-charcoal leading-none">REAL</span>
                    <span className="font-primary font-black text-xs text-charcoal leading-none border-b-2 border-[#9EAB75] pb-0.5 mt-0.5">FOOD SMARTER</span>
                  </div>
                  <span className="bg-charcoal text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">
                    SLIDE #{previewIndex + 1}
                  </span>
                </div>

                {/* Simulated Pouch */}
                <div className="relative w-44 h-44 my-2 flex items-center justify-center mix-blend-multiply">
                  {activePreviewSlide.imageUrl ? (
                    <Image
                      src={activePreviewSlide.imageUrl}
                      alt={activePreviewSlide.title}
                      fill
                      sizes="180px"
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-100 rounded-xl flex items-center justify-center text-xs text-charcoal/30">
                      No Image Chosen
                    </div>
                  )}
                </div>

                {/* Simulated Right Text block */}
                <div className="w-full text-center mt-3 pt-3 border-t border-black/5">
                  <h4 
                    className="font-primary font-black text-sm tracking-widest uppercase mb-1 leading-tight whitespace-pre-line"
                    style={{ color: activePreviewSlide.titleColor }}
                  >
                    {activePreviewSlide.title || "NO TITLE"}
                  </h4>
                  <p className="font-accent text-xs text-charcoal/50 italic leading-snug whitespace-pre-line">
                    {activePreviewSlide.description || "No description set"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-xs font-bold text-charcoal/40 uppercase">
                No slide to preview. Add one.
              </div>
            )}

            <div className="flex justify-center gap-1.5 flex-wrap">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPreviewIndex(i)}
                  className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                    previewIndex === i ? "bg-[#9EAB75] border-[#9EAB75] scale-110" : "bg-stone-200 border-transparent hover:bg-stone-300"
                  }`}
                  title={`View Slide #${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
