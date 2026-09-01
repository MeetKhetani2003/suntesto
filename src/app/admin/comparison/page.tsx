"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { uploadFile } from "@/lib/upload";

interface IProduct {
  _id: string;
  title: string;
}

interface IComparisonColumn {
  imageUrl: string;
  title: string;
  bullets: string[];
  verdict: string;
  verdictType: "red" | "yellow" | "green";
}

export default function AdminComparisonPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  const [title, setTitle] = useState("WHY FRUIT BITES ?");
  const [description, setDescription] = useState("");
  const [columns, setColumns] = useState<IComparisonColumn[]>([
    { imageUrl: "", title: "", bullets: [], verdict: "", verdictType: "red" },
    { imageUrl: "", title: "", bullets: [], verdict: "", verdictType: "red" },
    { imageUrl: "", title: "", bullets: [], verdict: "", verdictType: "red" },
    { imageUrl: "", title: "", bullets: [], verdict: "", verdictType: "red" },
  ]);

  const [loading, setLoading] = useState(true);
  const [fetchingConfig, setFetchingConfig] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          if (data.length > 0) {
            setSelectedProductId(data[0]._id);
          }
        } else {
          setError("Failed to load products list.");
        }
      } catch (err) {
        setError("Error loading products.");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    if (!selectedProductId) return;

    async function fetchConfig() {
      setFetchingConfig(true);
      setError("");
      setSuccess("");
      try {
        const res = await fetch(`/api/comparison?productId=${selectedProductId}`);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title || "WHY FRUIT BITES ?");
          setDescription(data.description || "");
          setColumns(
            data.columns && data.columns.length === 4
              ? data.columns
              : [
                  { imageUrl: "", title: "", bullets: [], verdict: "", verdictType: "red" },
                  { imageUrl: "", title: "", bullets: [], verdict: "", verdictType: "red" },
                  { imageUrl: "", title: "", bullets: [], verdict: "", verdictType: "red" },
                  { imageUrl: "", title: "", bullets: [], verdict: "", verdictType: "red" },
                ]
          );
        } else {
          setError("Failed to fetch comparison sheet config.");
        }
      } catch (err) {
        setError("Error loading comparison details.");
      } finally {
        setFetchingConfig(false);
      }
    }
    fetchConfig();
  }, [selectedProductId]);

  const handleColumnFieldChange = (
    index: number,
    field: keyof IComparisonColumn,
    value: any
  ) => {
    setColumns((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: value,
      };
      return next;
    });
  };

  const handleFileUpload = async (index: number, file: File) => {
    if (!file) return;
    setUploadingIndex(index);
    setError("");

    const result = await uploadFile(file, { maxSizeMB: 5, allowedTypes: ["image/"] });
    if (result.url) {
      handleColumnFieldChange(index, "imageUrl", result.url);
      setSuccess(`Image uploaded successfully for Column ${index + 1}!`);
    } else {
      setError(result.error || "Failed to upload image.");
    }
    setUploadingIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedProductId) {
      setError("Please select a product first.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/comparison", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductId,
          title,
          description,
          columns,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Comparison sheet saved successfully!");
      } else {
        setError(data.error || "Failed to save comparison settings.");
      }
    } catch (err) {
      setError("Unexpected error saving comparison sheet.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-xs uppercase tracking-wider text-charcoal/60">
          Loading comparison settings...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 select-none font-primary text-left">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link
            href="/admin"
            className="text-xs font-bold text-charcoal/60 hover:text-charcoal flex items-center gap-1 mb-1"
          >
            ← Back to Dashboard
          </Link>
          <h2 className="font-primary font-black text-2xl md:text-3xl uppercase tracking-tight text-charcoal">
            Product Comparison Sheets Settings
          </h2>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting || fetchingConfig}
          className="px-8 py-3 bg-[#9EAB75] text-dark hover:bg-[#FFE58F] font-primary text-sm font-black uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
              Saving Settings...
            </>
          ) : (
            "Save Comparison Sheet"
          )}
        </button>
      </div>

      {/* Select Product */}
      <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60">
          Select Product to Configure Comparison Section
        </label>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="w-full max-w-md px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal bg-white"
        >
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>
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

      {fetchingConfig ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-3 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
          <p className="font-bold text-xs uppercase tracking-wider text-charcoal/60">
            Loading details for chosen product...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Settings Pane */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
            {/* Header / Footer */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-4">
              <h3 className="font-primary font-black text-sm uppercase tracking-wider text-charcoal border-b border-black/5 pb-2">
                🏷️ Headers & Footers
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Comparison Section Title (e.g. WHY SUPERSPREADS ?)
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Cursive Bottom Description Text
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Columns Grid Editor */}
            <div className="space-y-6">
              {columns.map((col, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-4"
                >
                  <div className="border-b border-black/5 pb-2 flex justify-between items-center">
                    <h4 className="font-primary font-black text-sm uppercase tracking-wider text-charcoal">
                      📊 Column {idx + 1} Settings {idx === 3 && "(Recommended: Dynamic Product Column)"}
                    </h4>
                    <span className="text-[10px] font-black uppercase bg-stone-100 text-charcoal/50 px-2 py-0.5 rounded">
                      Col {idx + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-1">
                        Column Title
                      </label>
                      <input
                        type="text"
                        required
                        value={col.title}
                        onChange={(e) => handleColumnFieldChange(idx, "title", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal"
                      />
                    </div>

                    {/* Verdict Label */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-1">
                        Verdict Text
                      </label>
                      <input
                        type="text"
                        required
                        value={col.verdict}
                        onChange={(e) => handleColumnFieldChange(idx, "verdict", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Verdict Color */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-1">
                        Verdict Type (Color Highlight)
                      </label>
                      <select
                        value={col.verdictType}
                        onChange={(e) =>
                          handleColumnFieldChange(idx, "verdictType", e.target.value)
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal bg-white"
                      >
                        <option value="red">🔴 Red (Not Healthy)</option>
                        <option value="yellow">🟡 Yellow (Healthier Alternative)</option>
                        <option value="green">🟢 Green (Truly Healthy / Recommendation)</option>
                      </select>
                    </div>

                    {/* Image URL & File Upload */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-1">
                        Icon/Image
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={col.imageUrl}
                          onChange={(e) =>
                            handleColumnFieldChange(idx, "imageUrl", e.target.value)
                          }
                          className="flex-1 px-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal"
                          placeholder="Image URL"
                        />
                        <div className="relative shrink-0">
                          <button
                            type="button"
                            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-charcoal font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                          >
                            {uploadingIndex === idx ? "..." : "Upload"}
                          </button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(idx, file);
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bullet points */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-1">
                      Bullet points (comma-separated)
                    </label>
                    <input
                      type="text"
                      required
                      value={col.bullets.join(", ")}
                      onChange={(e) =>
                        handleColumnFieldChange(
                          idx,
                          "bullets",
                          e.target.value.split(",").map((s) => s.trim())
                        )
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal"
                      placeholder="e.g. Added Sugar +, Palm Oil +, Emulsifiers"
                    />
                  </div>
                </div>
              ))}
            </div>
          </form>

          {/* Right Pane: Live Mock Preview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4 sticky top-6">
              <h3 className="font-primary font-black text-sm uppercase tracking-wider text-charcoal border-b border-black/5 pb-2">
                👁️ Live Mock Preview
              </h3>

              <div className="bg-[#FAF9F5] rounded-3xl p-4 border border-black/5 text-center font-primary space-y-6">
                <div>
                  <h4 className="font-primary font-black text-charcoal leading-tight text-[16px] uppercase">
                    {title}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {columns.map((col, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded-2xl border border-black/5 flex flex-col items-center justify-between text-center min-h-[220px]"
                    >
                      {/* Image */}
                      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                        {col.imageUrl ? (
                          <Image
                            src={col.imageUrl}
                            alt={col.title || `Col ${idx + 1}`}
                            fill
                            sizes="48px"
                            className="object-contain"
                            unoptimized
                          />
                        ) : (
                          <span className="text-xl">📦</span>
                        )}
                      </div>

                      <div className="w-full mt-2 space-y-1">
                        <span className="font-primary font-black text-[10px] text-charcoal uppercase leading-none block">
                          {col.title || `COL ${idx + 1}`}
                        </span>

                        <div className="text-[8px] text-charcoal/50 font-bold uppercase space-y-0.5 py-1.5 border-t border-black/5">
                          {col.bullets.map((b, i) => (
                            <div key={i}>{b}</div>
                          ))}
                        </div>
                      </div>

                      <div className="w-full">
                        <span className="font-primary font-black text-[9px] text-charcoal uppercase block leading-none">
                          {col.verdict || "NOT HEALTHY"}
                        </span>
                        <div
                          className={`h-[2.5px] rounded-full w-2/3 mx-auto mt-1 ${
                            col.verdictType === "green"
                              ? "bg-[#84bd5e]"
                              : col.verdictType === "yellow"
                              ? "bg-[#9EAB75]"
                              : "bg-[#CC2828]"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="font-accent text-[11px] text-body italic leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
