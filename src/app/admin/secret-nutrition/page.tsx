"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminSecretNutritionPage() {
  const [sectionTitle, setSectionTitle] = useState("THE SECRET TO PURE,\nREAL NUTRITION");
  const [sectionSubtitle, setSectionSubtitle] = useState("The Tech Behind the Crunch");
  const [techTitle, setTechTitle] = useState("Vacuum Freeze-Drying");
  const [techDescription, setTechDescription] = useState("");
  const [equationLeft, setEquationLeft] = useState("Freeze Drying");
  const [equationMiddle, setEquationMiddle] = useState("Fruit");
  const [equationRight, setEquationRight] = useState("Water");
  const [tempText, setTempText] = useState("-31°C");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/secret-nutrition");
        if (res.ok) {
          const data = await res.json();
          setSectionTitle(data.sectionTitle || "THE SECRET TO PURE,\nREAL NUTRITION");
          setSectionSubtitle(data.sectionSubtitle || "The Tech Behind the Crunch");
          setTechTitle(data.techTitle || "Vacuum Freeze-Drying");
          setTechDescription(data.techDescription || "");
          setEquationLeft(data.equationLeft || "Freeze Drying");
          setEquationMiddle(data.equationMiddle || "Fruit");
          setEquationRight(data.equationRight || "Water");
          setTempText(data.tempText || "-31°C");
        } else {
          setError("Failed to fetch Secret Nutrition settings.");
        }
      } catch (err) {
        setError("Error loading Secret Nutrition settings.");
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/secret-nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionTitle,
          sectionSubtitle,
          techTitle,
          techDescription,
          equationLeft,
          equationMiddle,
          equationRight,
          tempText,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Secret Nutrition settings saved successfully!");
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
          Loading Tech Settings...
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
            Secret Nutrition Section Settings
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
          {/* Section Titles */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
              1. Section Titles & Subtitles
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Main Section Title
                </label>
                <textarea
                  required
                  rows={2}
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal leading-snug resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Section Subtitle (Italic description text)
                </label>
                <input
                  type="text"
                  required
                  value={sectionSubtitle}
                  onChange={(e) => setSectionSubtitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>
          </div>

          {/* Tech Description */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
              2. Technology Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Tech Block Title
                </label>
                <input
                  type="text"
                  required
                  value={techTitle}
                  onChange={(e) => setTechTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Tech Block Description text
                </label>
                <textarea
                  required
                  rows={4}
                  value={techDescription}
                  onChange={(e) => setTechDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Equation & Temperature */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
              3. Equation & Temperature
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Equation: Left
                  </label>
                  <input
                    type="text"
                    required
                    value={equationLeft}
                    onChange={(e) => setEquationLeft(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Equation: Middle
                  </label>
                  <input
                    type="text"
                    required
                    value={equationMiddle}
                    onChange={(e) => setEquationMiddle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Equation: Right
                  </label>
                  <input
                    type="text"
                    required
                    value={equationRight}
                    onChange={(e) => setEquationRight(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Thermometer Temperature text
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. -31°C"
                  value={tempText}
                  onChange={(e) => setTempText(e.target.value)}
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
                "Save Tech Config"
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

            <div className="bg-[#FAF9F5] rounded-3xl p-6 border border-black/5 text-left font-primary space-y-6">
              <div>
                <h4 className="font-black text-charcoal leading-tight text-lg uppercase whitespace-pre-line">
                  {sectionTitle}
                </h4>
                <p className="text-xs text-charcoal/50 font-bold italic mt-1">{sectionSubtitle}</p>
              </div>

              <div className="bg-white border-2 border-charcoal/10 rounded-2xl p-4 space-y-3">
                <h5 className="font-black text-sm text-charcoal uppercase">{techTitle}</h5>
                <p className="text-[11px] text-charcoal/70 leading-normal font-semibold">{techDescription}</p>

                {/* Equation */}
                <div className="bg-stone-50 border border-charcoal/5 rounded-xl p-2.5 flex items-center justify-center gap-1.5 font-black text-[10px] text-charcoal uppercase leading-none">
                  <span>{equationLeft}</span>
                  <span className="text-[#CC2828]">=</span>
                  <span>{equationMiddle}</span>
                  <span className="text-[#CC2828]">-</span>
                  <span>{equationRight}</span>
                </div>
              </div>

              {/* Temperature Display */}
              <div className="flex justify-between items-center bg-[#9EAB75]/10 p-3 rounded-2xl border border-[#9EAB75]/30">
                <span className="text-[10px] font-black uppercase text-charcoal">Preview Temperature</span>
                <span className="bg-[#9EAB75] text-dark font-black text-xs px-2.5 py-1 rounded-md shadow-sm">
                  ❄ {tempText}
                </span>
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
