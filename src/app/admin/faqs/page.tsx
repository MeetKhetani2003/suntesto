"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface IFAQ {
  _id?: string;
  question: string;
  answer: string;
  productId?: string | { _id: string; title: string };
  order: number;
}

interface IProduct {
  _id: string;
  title: string;
}

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<IFAQ[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [activeFAQIndex, setActiveFAQIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [faqsRes, productsRes] = await Promise.all([
          fetch("/api/faqs?productId=all"),
          fetch("/api/products"),
        ]);

        if (faqsRes.ok && productsRes.ok) {
          const faqsData = await faqsRes.json();
          const productsData = await productsRes.json();

          setFaqs(faqsData);
          setProducts(productsData);
        } else {
          setError("Failed to fetch FAQs or products lists.");
        }
      } catch (err) {
        setError("Error loading FAQ dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const updateActiveFAQField = (field: keyof IFAQ, value: any) => {
    setFaqs((prev) => {
      const next = [...prev];
      next[activeFAQIndex] = {
        ...next[activeFAQIndex],
        [field]: value,
      };
      return next;
    });
  };

  const moveFAQUp = (idx: number) => {
    if (idx === 0) return;
    setFaqs((prev) => {
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[idx - 1];
      next[idx - 1] = temp;
      return next;
    });
    if (activeFAQIndex === idx) {
      setActiveFAQIndex(idx - 1);
    } else if (activeFAQIndex === idx - 1) {
      setActiveFAQIndex(idx);
    }
  };

  const moveFAQDown = (idx: number) => {
    if (idx === faqs.length - 1) return;
    setFaqs((prev) => {
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[idx + 1];
      next[idx + 1] = temp;
      return next;
    });
    if (activeFAQIndex === idx) {
      setActiveFAQIndex(idx + 1);
    } else if (activeFAQIndex === idx + 1) {
      setActiveFAQIndex(idx);
    }
  };

  const deleteFAQ = (idx: number) => {
    if (faqs.length <= 1) {
      setError("You must keep at least one FAQ.");
      return;
    }
    setFaqs((prev) => prev.filter((_, i) => i !== idx));
    if (activeFAQIndex === idx) {
      setActiveFAQIndex(idx > 0 ? idx - 1 : 0);
    } else if (activeFAQIndex > idx) {
      setActiveFAQIndex(activeFAQIndex - 1);
    }
    setSuccess(`FAQ deleted from local list. Save settings to apply.`);
  };

  const addFAQ = () => {
    const newFAQ: IFAQ = {
      question: "New FAQ Question?",
      answer: "FAQ Answer text here...",
      productId: "", // Global FAQ by default
      order: faqs.length,
    };
    setFaqs((prev) => [...prev, newFAQ]);
    setActiveFAQIndex(faqs.length);
    setSuccess("New FAQ added. Customize it in the editor and click Save.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate that all faqs have question and answer
    const invalidFAQIdx = faqs.findIndex(f => !f.question.trim() || !f.answer.trim());
    if (invalidFAQIdx !== -1) {
      setError(`FAQ ${invalidFAQIdx + 1} has empty question or answer text.`);
      return;
    }

    setSubmitting(true);

    try {
      // Map back references to just string IDs before posting
      const mappedFaqs = faqs.map((f) => ({
        question: f.question,
        answer: f.answer,
        productId: typeof f.productId === "object" ? f.productId?._id : f.productId || null,
      }));

      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faqs: mappedFaqs }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("FAQs saved successfully!");
        // Refresh local state to resolve any object populations
        const refreshRes = await fetch("/api/faqs?productId=all");
        if (refreshRes.ok) {
          const freshData = await refreshRes.json();
          setFaqs(freshData);
        }
      } else {
        setError(data.error || "Failed to save FAQs configuration.");
      }
    } catch (err) {
      setError("Unexpected error saving FAQs.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-xs uppercase tracking-wider text-charcoal/60">
          Loading FAQ Dashboard...
        </p>
      </div>
    );
  }

  const activeFAQ = faqs[activeFAQIndex] || faqs[0] || {};
  const activeFAQProduct = typeof activeFAQ.productId === "object" ? activeFAQ.productId?._id : activeFAQ.productId || "";

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
            FAQ Manager Settings
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
            "Save FAQs Config"
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
        {/* Left Pane - FAQs List */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-sm uppercase tracking-wider text-charcoal border-b border-black/5 pb-2">
              ❓ FAQs List ({faqs.length})
            </h3>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {faqs.map((faq, idx) => {
                const isActive = activeFAQIndex === idx;
                const isGlobal = !faq.productId;
                const associatedProduct = typeof faq.productId === "object" ? faq.productId?.title : products.find(p => p._id === faq.productId)?.title;

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveFAQIndex(idx)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? "bg-[#9EAB75]/10 border-[#9EAB75]"
                        : "bg-stone-50 border-black/5 hover:border-black/10"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-black uppercase text-charcoal/40 block">
                        FAQ {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-charcoal truncate block uppercase tracking-tight">
                        {faq.question}
                      </span>
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider mt-1 ${
                          isGlobal
                            ? "bg-stone-200 text-charcoal/70"
                            : "bg-[#9EAB75]/20 text-charcoal/80 border border-[#9EAB75]/30"
                        }`}
                      >
                        {isGlobal ? "Global FAQ" : `Product-wise: ${associatedProduct || "Unknown"}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {/* Move Up */}
                      <button
                        disabled={idx === 0}
                        onClick={() => moveFAQUp(idx)}
                        className="w-7 h-7 rounded-lg hover:bg-stone-200/60 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center text-xs"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      {/* Move Down */}
                      <button
                        disabled={idx === faqs.length - 1}
                        onClick={() => moveFAQDown(idx)}
                        className="w-7 h-7 rounded-lg hover:bg-stone-200/60 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center text-xs"
                        title="Move Down"
                      >
                        ▼
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => deleteFAQ(idx)}
                        className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center text-xs"
                        title="Delete FAQ"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={addFAQ}
              className="w-full py-3 border-2 border-dashed border-charcoal/20 hover:border-charcoal hover:bg-stone-50 rounded-2xl font-primary text-xs font-black uppercase tracking-wider text-charcoal transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>➕</span> Add New FAQ
            </button>
          </div>
        </div>

        {/* Right Pane - Form Editor */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
            <div className="border-b border-black/5 pb-3">
              <h3 className="font-primary font-black text-lg uppercase text-charcoal">
                📝 FAQ {activeFAQIndex + 1} Editor
              </h3>
            </div>

            <div className="space-y-4">
              {/* Question Text */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter Question text"
                  value={activeFAQ.question || ""}
                  onChange={(e) => updateActiveFAQField("question", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>

              {/* Answer Text */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Answer Description *
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Enter Answer description..."
                  value={activeFAQ.answer || ""}
                  onChange={(e) => updateActiveFAQField("answer", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal resize-none leading-relaxed"
                />
              </div>

              {/* FAQ Association Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  FAQ Type Association *
                </label>
                <select
                  value={activeFAQProduct}
                  onChange={(e) => updateActiveFAQField("productId", e.target.value || null)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal bg-white"
                >
                  <option value="">🌐 Global FAQ (Appears on main FAQ page & all product pages)</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      📦 Product-wise FAQ: {p.title}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-charcoal/50 font-bold mt-1.5 uppercase">
                  Global FAQs appear everywhere. Product-wise FAQs appear only on the details page of the chosen product.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
