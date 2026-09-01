"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { uploadFile } from "@/lib/upload";

interface IPromoCard {
  _id?: string;
  videoUrl: string;
  badgeText?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  order: number;
}

export default function AdminPromoCardsPage() {
  const [cards, setCards] = useState<IPromoCard[]>([
    {
      videoUrl: "",
      badgeText: "",
      title: "",
      subtitle: "",
      description: "",
      order: 0,
    }
  ]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchPromoCards() {
      try {
        const res = await fetch("/api/promo-cards");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCards(data);
          }
        } else {
          setError("Failed to fetch promotional video cards.");
        }
      } catch (err) {
        setError("Error loading promotional video cards.");
      } finally {
        setLoading(false);
      }
    }
    fetchPromoCards();
  }, []);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    setError("");
    setSuccess("");

    const result = await uploadFile(file, { maxSizeMB: 15, allowedTypes: ["video/"] });
    if (result.url) {
      updateActiveCardField("videoUrl", result.url);
      setSuccess(`Video for Card ${activeCardIndex + 1} uploaded successfully.`);
    } else {
      setError(result.error || "Failed to upload video file.");
    }
    setUploadingVideo(false);
  };

  const updateActiveCardField = (field: keyof IPromoCard, value: string) => {
    setCards((prev) => {
      const next = [...prev];
      next[activeCardIndex] = {
        ...next[activeCardIndex],
        [field]: value,
      };
      return next;
    });
  };

  const moveCardUp = (idx: number) => {
    if (idx === 0) return;
    setCards((prev) => {
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[idx - 1];
      next[idx - 1] = temp;
      return next;
    });
    if (activeCardIndex === idx) {
      setActiveCardIndex(idx - 1);
    } else if (activeCardIndex === idx - 1) {
      setActiveCardIndex(idx);
    }
  };

  const moveCardDown = (idx: number) => {
    if (idx === cards.length - 1) return;
    setCards((prev) => {
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[idx + 1];
      next[idx + 1] = temp;
      return next;
    });
    if (activeCardIndex === idx) {
      setActiveCardIndex(idx + 1);
    } else if (activeCardIndex === idx + 1) {
      setActiveCardIndex(idx);
    }
  };

  const deleteCard = (idx: number) => {
    if (cards.length <= 1) {
      setError("You must keep at least one card.");
      return;
    }
    setCards((prev) => prev.filter((_, i) => i !== idx));
    if (activeCardIndex === idx) {
      setActiveCardIndex(idx > 0 ? idx - 1 : 0);
    } else if (activeCardIndex > idx) {
      setActiveCardIndex(activeCardIndex - 1);
    }
    setSuccess(`Card ${idx + 1} deleted from local list. Save settings to apply.`);
  };

  const addCard = () => {
    const newCard: IPromoCard = {
      videoUrl: "",
      badgeText: "New Reel",
      title: "Title Here",
      subtitle: "",
      description: "",
      order: cards.length,
    };
    setCards((prev) => [...prev, newCard]);
    setActiveCardIndex(cards.length);
    setSuccess("New card added. Update its details, upload video, and click Save.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate that all cards have a video URL
    const invalidCardIdx = cards.findIndex(c => !c.videoUrl);
    if (invalidCardIdx !== -1) {
      setError(`Card ${invalidCardIdx + 1} is missing a background Video URL.`);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/promo-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Promotional video cards saved successfully!");
      } else {
        setError(data.error || "Failed to save configurations.");
      }
    } catch (err) {
      setError("Unexpected error saving promo cards.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-xs uppercase tracking-wider text-charcoal/60">
          Loading Promo Cards...
        </p>
      </div>
    );
  }

  const activeCard = cards[activeCardIndex] || cards[0] || {};

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
            Promo Video Cards Settings
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
            "Save Promo Config"
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
        {/* Left Pane - Cards Listing */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-sm uppercase tracking-wider text-charcoal border-b border-black/5 pb-2">
              🎥 Video Reels List ({cards.length})
            </h3>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {cards.map((card, idx) => {
                const isActive = activeCardIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveCardIndex(idx)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? "bg-[#9EAB75]/10 border-[#9EAB75]"
                        : "bg-stone-50 border-black/5 hover:border-black/10"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-black uppercase text-charcoal/40 block">
                        Reel {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-charcoal truncate block uppercase tracking-tight">
                        {card.title || card.badgeText || "(Empty Card Text)"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {/* Move Up */}
                      <button
                        disabled={idx === 0}
                        onClick={() => moveCardUp(idx)}
                        className="w-7 h-7 rounded-lg hover:bg-stone-200/60 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center text-xs"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      {/* Move Down */}
                      <button
                        disabled={idx === cards.length - 1}
                        onClick={() => moveCardDown(idx)}
                        className="w-7 h-7 rounded-lg hover:bg-stone-200/60 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center text-xs"
                        title="Move Down"
                      >
                        ▼
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => deleteCard(idx)}
                        className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center text-xs"
                        title="Delete Card"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={addCard}
              className="w-full py-3 border-2 border-dashed border-charcoal/20 hover:border-charcoal hover:bg-stone-50 rounded-2xl font-primary text-xs font-black uppercase tracking-wider text-charcoal transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>➕</span> Add New Reel Card
            </button>
          </div>
        </div>

        {/* Right Pane - Form Editor & Mock Card Preview */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
            <div className="border-b border-black/5 pb-3 flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-primary font-black text-lg uppercase text-charcoal">
                📝 Reel {activeCardIndex + 1} Card Editor
              </h3>
            </div>

            <div className="space-y-4">
              {/* Video URL & Uploader */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Background Reel Video *
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    required
                    placeholder="Enter MP4 Video URL or upload one"
                    value={activeCard.videoUrl || ""}
                    onChange={(e) => updateActiveCardField("videoUrl", e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                  <label className="shrink-0 px-4 py-3 bg-charcoal text-white hover:bg-black font-primary text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors flex items-center justify-center h-11 min-w-[120px]">
                    {uploadingVideo ? "Uploading..." : "Upload Video"}
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      disabled={uploadingVideo}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[10px] text-charcoal/50 font-bold mt-1 uppercase">
                  Autoplays infinitely on loop. MP4 format is highly recommended.
                </p>
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Badge Text (Top Pill tag)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. KID-APPROVED"
                    value={activeCard.badgeText || ""}
                    onChange={(e) => updateActiveCardField("badgeText", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Title (Large Text)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. WHAT IS FREEZE-DRYING?"
                    value={activeCard.title || ""}
                    onChange={(e) => updateActiveCardField("title", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Subtitle (Italic text below Title)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. (The Tech)"
                    value={activeCard.subtitle || ""}
                    onChange={(e) => updateActiveCardField("subtitle", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Bottom Description box
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FREEZE DRYING = FRUIT - WATER"
                    value={activeCard.description || ""}
                    onChange={(e) => updateActiveCardField("description", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Active Card Mock Preview */}
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-2">
              Reel {activeCardIndex + 1} Layout Preview
            </h3>

            <div className="flex items-center justify-center p-4 bg-stone-50 rounded-2xl border border-black/5">
              <div className="relative w-[240px] sm:w-[260px] aspect-[9/16] rounded-[32px] overflow-hidden bg-charcoal shadow-lg border border-black/10">
                {/* Loop Video Layer */}
                {activeCard.videoUrl && (
                  <video
                    key={activeCard.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  >
                    <source src={activeCard.videoUrl} type="video/mp4" />
                  </video>
                )}

                {/* Mask Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/35 z-10" />

                {/* Overlay Text Content */}
                <div className="relative z-20 w-full h-full flex flex-col justify-between p-5 text-white text-center">
                  {/* Top Badge */}
                  {activeCard.badgeText ? (
                    <div className="text-center">
                      <span className="font-primary font-black text-[10px] uppercase tracking-wider bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-md inline-block text-[#9EAB75] border border-white/10">
                        {activeCard.badgeText}
                      </span>
                    </div>
                  ) : (
                    <div />
                  )}

                  {/* Middle Title / Subtitle */}
                  <div className="my-auto">
                    {activeCard.title && (
                      <span className="block font-primary font-black text-lg uppercase tracking-wider leading-tight drop-shadow-md">
                        {activeCard.title}
                      </span>
                    )}
                    {activeCard.subtitle && (
                      <span className="block font-accent text-[10px] text-[#9EAB75]/90 mt-1 italic drop-shadow">
                        {activeCard.subtitle}
                      </span>
                    )}
                  </div>

                  {/* Bottom description box */}
                  {activeCard.description ? (
                    <div className="text-center mt-auto font-primary font-bold text-[10px] tracking-wide bg-black/25 backdrop-blur-sm py-1.5 px-2 rounded-lg border border-white/5 leading-normal">
                      {activeCard.description}
                    </div>
                  ) : (
                    <div />
                  )}
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
