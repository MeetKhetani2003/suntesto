"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { uploadFile } from "@/lib/upload";

interface IHeroSlide {
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  titleHighlight: string;
  backgroundImageUrl?: string;
  backgroundVideoUrl?: string;
  mobileBackgroundImageUrl?: string;
  mobileBackgroundVideoUrl?: string;
}

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<IHeroSlide[]>([
    {
      badgeText: "Snacks",
      titleLine1: "WORLD'S LIGHTEST",
      titleLine2: "WHOLE FRUIT",
      titleLine3: "FREEZE-DRIED",
      titleHighlight: "Snacks",
      backgroundImageUrl: "",
      backgroundVideoUrl: "",
      mobileBackgroundImageUrl: "",
      mobileBackgroundVideoUrl: "",
    }
  ]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [autoPlayIntervalSeconds, setAutoPlayIntervalSeconds] = useState(5); // interval in seconds (4-8)

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingMobileImage, setUploadingMobileImage] = useState(false);
  const [uploadingMobileVideo, setUploadingMobileVideo] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchHeroSettings() {
      try {
        const res = await fetch("/api/hero");
        if (res.ok) {
          const data = await res.json();
          if (data.slides && data.slides.length > 0) {
            setSlides(data.slides);
          }
          setAutoPlayIntervalSeconds((data.autoPlayInterval || 5000) / 1000);
        } else {
          setError("Failed to fetch current hero settings.");
        }
      } catch (err) {
        setError("Error loading hero settings.");
      } finally {
        setLoading(false);
      }
    }
    fetchHeroSettings();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");
    setSuccess("");

    const result = await uploadFile(file, { maxSizeMB: 5, allowedTypes: ["image/"] });
    if (result.url) {
      updateActiveSlideField("backgroundImageUrl", result.url);
      setSuccess(`Background image for Slide ${activeSlideIndex + 1} uploaded successfully.`);
    } else {
      setError(result.error || "Failed to upload background image.");
    }
    setUploadingImage(false);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    setError("");
    setSuccess("");

    const result = await uploadFile(file, { maxSizeMB: 15, allowedTypes: ["video/"] });
    if (result.url) {
      updateActiveSlideField("backgroundVideoUrl", result.url);
      setSuccess(`Background video for Slide ${activeSlideIndex + 1} uploaded successfully.`);
    } else {
      setError(result.error || "Failed to upload background video.");
    }
    setUploadingVideo(false);
  };

  const handleMobileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMobileImage(true);
    setError("");
    setSuccess("");

    const result = await uploadFile(file, { maxSizeMB: 5, allowedTypes: ["image/"] });
    if (result.url) {
      updateActiveSlideField("mobileBackgroundImageUrl", result.url);
      setSuccess(`Mobile background image for Slide ${activeSlideIndex + 1} uploaded successfully.`);
    } else {
      setError(result.error || "Failed to upload mobile background image.");
    }
    setUploadingMobileImage(false);
  };

  const handleMobileVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMobileVideo(true);
    setError("");
    setSuccess("");

    const result = await uploadFile(file, { maxSizeMB: 15, allowedTypes: ["video/"] });
    if (result.url) {
      updateActiveSlideField("mobileBackgroundVideoUrl", result.url);
      setSuccess(`Mobile background video for Slide ${activeSlideIndex + 1} uploaded successfully.`);
    } else {
      setError(result.error || "Failed to upload mobile background video.");
    }
    setUploadingMobileVideo(false);
  };

  const updateActiveSlideField = (field: keyof IHeroSlide, value: string) => {
    setSlides((prev) => {
      const next = [...prev];
      next[activeSlideIndex] = {
        ...next[activeSlideIndex],
        [field]: value,
      };
      return next;
    });
  };

  const moveSlideUp = (idx: number) => {
    if (idx === 0) return;
    setSlides((prev) => {
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[idx - 1];
      next[idx - 1] = temp;
      return next;
    });
    if (activeSlideIndex === idx) {
      setActiveSlideIndex(idx - 1);
    } else if (activeSlideIndex === idx - 1) {
      setActiveSlideIndex(idx);
    }
  };

  const moveSlideDown = (idx: number) => {
    if (idx === slides.length - 1) return;
    setSlides((prev) => {
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[idx + 1];
      next[idx + 1] = temp;
      return next;
    });
    if (activeSlideIndex === idx) {
      setActiveSlideIndex(idx + 1);
    } else if (activeSlideIndex === idx + 1) {
      setActiveSlideIndex(idx);
    }
  };

  const deleteSlide = (idx: number) => {
    if (slides.length <= 1) {
      setError("You must keep at least one slide.");
      return;
    }
    setSlides((prev) => prev.filter((_, i) => i !== idx));
    if (activeSlideIndex === idx) {
      setActiveSlideIndex(idx > 0 ? idx - 1 : 0);
    } else if (activeSlideIndex > idx) {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
    setSuccess(`Slide ${idx + 1} deleted from local list. Save configuration to apply.`);
  };

  const addSlide = () => {
    const newSlide: IHeroSlide = {
      badgeText: "New Slide",
      titleLine1: "CHANGE ME",
      titleLine2: "WHOLE FRUIT",
      titleLine3: "FREEZE-DRIED",
      titleHighlight: "Snacks",
      backgroundImageUrl: "",
      backgroundVideoUrl: "",
      mobileBackgroundImageUrl: "",
      mobileBackgroundVideoUrl: "",
    };
    setSlides((prev) => [...prev, newSlide]);
    setActiveSlideIndex(slides.length);
    setSuccess("New slide added to the list. Configure its details and click Save.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slides,
          autoPlayInterval: autoPlayIntervalSeconds * 1000,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Hero section slides and auto-play configuration saved successfully!");
      } else {
        setError(data.error || "Failed to save settings.");
      }
    } catch (err) {
      setError("Unexpected error saving hero settings.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-xs uppercase tracking-wider text-charcoal/60">
          Loading Hero Slides...
        </p>
      </div>
    );
  }

  const activeSlide = slides[activeSlideIndex] || slides[0] || {};
  const activeBgImage = activeSlide.mobileBackgroundImageUrl || activeSlide.backgroundImageUrl;
  const activeBgVideo = activeSlide.mobileBackgroundVideoUrl || activeSlide.backgroundVideoUrl;

  return (
    <div className="max-w-7xl mx-auto space-y-6 select-none font-primary">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link
            href="/admin"
            className="text-xs font-bold text-charcoal/60 hover:text-charcoal flex items-center gap-1 mb-1"
          >
            ← Back to Dashboard
          </Link>
          <h2 className="font-primary font-black text-2xl md:text-3xl uppercase tracking-tight text-charcoal">
            Hero Slider Settings
          </h2>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-8 py-3 bg-[#9EAB75] text-dark hover:bg-[#FFE58F] font-primary text-sm font-black uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
              Saving Settings...
            </>
          ) : (
            "Save Slider Config"
          )}
        </button>
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
        {/* Left Pane - Slides List & Global Options */}
        <div className="lg:col-span-4 space-y-6">
          {/* Global Carousel Config */}
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-sm uppercase tracking-wider text-charcoal border-b border-black/5 pb-2">
              ⚙️ Slider Controls
            </h3>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80">
                Auto-play Interval: {autoPlayIntervalSeconds} Seconds
              </label>
              <input
                type="range"
                min="4"
                max="8"
                step="1"
                value={autoPlayIntervalSeconds}
                onChange={(e) => setAutoPlayIntervalSeconds(Number(e.target.value))}
                className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#9EAB75]"
              />
              <div className="flex justify-between text-[10px] text-charcoal/40 font-bold uppercase">
                <span>4s</span>
                <span>5s</span>
                <span>6s</span>
                <span>7s</span>
                <span>8s</span>
              </div>
            </div>
          </div>

          {/* Slides List Card */}
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 pb-2">
              <h3 className="font-primary font-black text-sm uppercase tracking-wider text-charcoal">
                🖼️ Slides List ({slides.length})
              </h3>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {slides.map((slide, idx) => {
                const isActive = activeSlideIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? "bg-[#9EAB75]/10 border-[#9EAB75]"
                        : "bg-stone-50 border-black/5 hover:border-black/10"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-black uppercase text-charcoal/40 block">
                        Slide {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-charcoal truncate block uppercase tracking-tight">
                        {slide.titleLine1 || "Untitled"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {/* Move Up */}
                      <button
                        disabled={idx === 0}
                        onClick={() => moveSlideUp(idx)}
                        className="w-7 h-7 rounded-lg hover:bg-stone-200/60 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center text-xs"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      {/* Move Down */}
                      <button
                        disabled={idx === slides.length - 1}
                        onClick={() => moveSlideDown(idx)}
                        className="w-7 h-7 rounded-lg hover:bg-stone-200/60 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center text-xs"
                        title="Move Down"
                      >
                        ▼
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => deleteSlide(idx)}
                        className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center text-xs"
                        title="Delete Slide"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={addSlide}
              className="w-full py-3 border-2 border-dashed border-charcoal/20 hover:border-charcoal hover:bg-stone-50 rounded-2xl font-primary text-xs font-black uppercase tracking-wider text-charcoal transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>➕</span> Add New Slide
            </button>
          </div>
        </div>

        {/* Right Pane - Form Editor & Mock Preview */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
            <div className="border-b border-black/5 pb-3 flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-primary font-black text-lg uppercase text-charcoal">
                📝 Slide {activeSlideIndex + 1} Editor
              </h3>
              <span className="bg-stone-100 text-charcoal/70 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                Editing Mode
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Badge Text (Top Script Text)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Snacks"
                  value={activeSlide.badgeText || ""}
                  onChange={(e) => updateActiveSlideField("badgeText", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Title Line 1
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="WORLD'S LIGHTEST"
                    value={activeSlide.titleLine1 || ""}
                    onChange={(e) => updateActiveSlideField("titleLine1", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Title Line 2
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="WHOLE FRUIT"
                    value={activeSlide.titleLine2 || ""}
                    onChange={(e) => updateActiveSlideField("titleLine2", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Title Line 3
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="FREEZE-DRIED"
                    value={activeSlide.titleLine3 || ""}
                    onChange={(e) => updateActiveSlideField("titleLine3", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Title Highlight Text (Cursive Text at End)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Snacks"
                  value={activeSlide.titleHighlight || ""}
                  onChange={(e) => updateActiveSlideField("titleHighlight", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>

              {/* Media Settings */}
              <div className="border-t border-black/5 pt-4 mt-6 space-y-4">
                <h4 className="font-primary font-black text-sm uppercase tracking-wider text-charcoal">
                  Background Media Config (Desktop)
                </h4>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Background Image
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="text"
                      placeholder="Enter Image URL or upload one"
                      value={activeSlide.backgroundImageUrl || ""}
                      onChange={(e) => updateActiveSlideField("backgroundImageUrl", e.target.value)}
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
                    Background Video
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="text"
                      placeholder="Enter Video URL or upload one"
                      value={activeSlide.backgroundVideoUrl || ""}
                      onChange={(e) => updateActiveSlideField("backgroundVideoUrl", e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                    />
                    <label className="shrink-0 px-4 py-3 bg-charcoal text-white hover:bg-black font-primary text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors flex items-center justify-center h-11 min-w-[120px]">
                      {uploadingVideo ? "Uploading..." : "Upload File"}
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        disabled={uploadingVideo}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <h4 className="font-primary font-black text-sm uppercase tracking-wider text-charcoal pt-4 border-t border-black/5">
                  Background Media Config (Mobile)
                </h4>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Mobile Background Image
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="text"
                      placeholder="Enter Mobile Image URL or upload one"
                      value={activeSlide.mobileBackgroundImageUrl || ""}
                      onChange={(e) => updateActiveSlideField("mobileBackgroundImageUrl", e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                    />
                    <label className="shrink-0 px-4 py-3 bg-charcoal text-white hover:bg-black font-primary text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors flex items-center justify-center h-11 min-w-[120px]">
                      {uploadingMobileImage ? "Uploading..." : "Upload File"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMobileImageUpload}
                        disabled={uploadingMobileImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Mobile Background Video
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="text"
                      placeholder="Enter Mobile Video URL or upload one"
                      value={activeSlide.mobileBackgroundVideoUrl || ""}
                      onChange={(e) => updateActiveSlideField("mobileBackgroundVideoUrl", e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                    />
                    <label className="shrink-0 px-4 py-3 bg-charcoal text-white hover:bg-black font-primary text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors flex items-center justify-center h-11 min-w-[120px]">
                      {uploadingMobileVideo ? "Uploading..." : "Upload File"}
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleMobileVideoUpload}
                        disabled={uploadingMobileVideo}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Preview */}
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <div className="border-b border-black/5 pb-2 flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-primary font-black text-lg uppercase text-charcoal">
                Slide {activeSlideIndex + 1} Layout Preview
              </h3>
              <div className="flex bg-stone-100 p-0.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    previewMode === "desktop" ? "bg-white text-charcoal shadow-sm" : "text-charcoal/60 hover:text-charcoal"
                  }`}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    previewMode === "mobile" ? "bg-white text-charcoal shadow-sm" : "text-charcoal/60 hover:text-charcoal"
                  }`}
                >
                  Mobile
                </button>
              </div>
            </div>

            <div className={`relative ${previewMode === "desktop" ? "aspect-[16/9] w-full" : "aspect-[9/16] w-[260px] mx-auto"} rounded-2xl overflow-hidden bg-charcoal flex items-center justify-center text-center shadow-inner border border-black/10 transition-all duration-300`}>
              {/* Media Layer */}
              <div className="absolute inset-0 w-full h-full z-0">
                {previewMode === "desktop" ? (
                  <>
                    {activeSlide.backgroundImageUrl && (
                      <Image
                        src={activeSlide.backgroundImageUrl}
                        alt="Preview background"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                    {activeSlide.backgroundVideoUrl && (
                      <video
                        key={`desktop-preview-${activeSlide.backgroundVideoUrl}`}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover z-1"
                      >
                        <source src={activeSlide.backgroundVideoUrl} type="video/mp4" />
                      </video>
                    )}
                  </>
                ) : (
                  <>
                    {activeBgImage && (
                      <Image
                        src={activeBgImage}
                        alt="Preview background"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                    {activeBgVideo && (
                      <video
                        key={`mobile-preview-${activeBgVideo}`}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover z-1"
                      >
                        <source src={activeBgVideo} type="video/mp4" />
                      </video>
                    )}
                  </>
                )}
                <div className="absolute inset-0 bg-black/35 z-2" />
              </div>

              {/* Text Layer */}
              <div className="relative z-10 p-4 flex flex-col items-center">
                <p className={`font-accent text-[#9EAB75] mb-1 -rotate-3 select-none ${previewMode === "desktop" ? "text-lg" : "text-sm"}`}>
                  {activeSlide.badgeText || "badge"}
                </p>
                <h4 className="font-primary font-black text-white leading-[1.1] uppercase tracking-tight flex flex-col items-center select-none">
                  <span className={previewMode === "desktop" ? "text-[12px] sm:text-[16px] md:text-[18px] lg:text-[20px]" : "text-[10px]"}>
                    {activeSlide.titleLine1 || "title line 1"}
                  </span>
                  <span className={previewMode === "desktop" ? "text-[14px] sm:text-[20px] md:text-[22px] lg:text-[24px]" : "text-[12px] mt-0.5"}>
                    {activeSlide.titleLine2 || "title line 2"}
                  </span>
                  <span className={previewMode === "desktop" ? "text-[14px] sm:text-[20px] md:text-[22px] lg:text-[24px]" : "text-[12px] mt-0.5"}>
                    {activeSlide.titleLine3 || "title line 3"}{" "}
                    <em className="font-accent text-[#9EAB75] not-italic inline-block -rotate-2 ml-1">
                      {activeSlide.titleHighlight || "highlight"}
                    </em>
                  </span>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
