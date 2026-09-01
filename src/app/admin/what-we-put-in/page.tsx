"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type IngredientGroup = {
  letter: string;
  items: string[];
};

type GlossaryData = {
  smoothies: IngredientGroup[];
  snacks: IngredientGroup[];
  spreads: IngredientGroup[];
};

export default function AdminWhatWePutInPage() {
  const [activeTab, setActiveTab] = useState<"smoothies" | "snacks" | "spreads">("smoothies");
  const [data, setData] = useState<GlossaryData>({ smoothies: [], snacks: [], spreads: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/what-we-put-in");
        if (res.ok) {
          const fetchedData = await res.json();
          setData({
            smoothies: fetchedData.smoothies || [],
            snacks: fetchedData.snacks || [],
            spreads: fetchedData.spreads || [],
          });
        } else {
          setError("Failed to fetch What We Put In settings.");
        }
      } catch {
        setError("Error loading What We Put In settings.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleLetterChange = (
    tab: "smoothies" | "snacks" | "spreads",
    index: number,
    value: string
  ) => {
    setData((prev) => {
      const updatedList = [...prev[tab]];
      updatedList[index] = { ...updatedList[index], letter: value.toUpperCase().slice(0, 2) };
      return { ...prev, [tab]: updatedList };
    });
  };

  const handleItemsChange = (
    tab: "smoothies" | "snacks" | "spreads",
    index: number,
    value: string
  ) => {
    setData((prev) => {
      const updatedList = [...prev[tab]];
      const items = value.split(",").map((item) => item.trim()).filter((item) => item.length > 0);
      updatedList[index] = { ...updatedList[index], items };
      return { ...prev, [tab]: updatedList };
    });
  };

  const handleAddGroup = (tab: "smoothies" | "snacks" | "spreads") => {
    setData((prev) => ({
      ...prev,
      [tab]: [...prev[tab], { letter: "", items: [] }],
    }));
  };

  const handleRemoveGroup = (tab: "smoothies" | "snacks" | "spreads", index: number) => {
    setData((prev) => ({
      ...prev,
      [tab]: prev[tab].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      // Validate letters are not empty
      for (const tab of ["smoothies", "snacks", "spreads"] as const) {
        for (const group of data[tab]) {
          if (!group.letter.trim()) {
            throw new Error(`Please specify a starting letter/badge for all groups in ${tab}.`);
          }
        }
      }

      const res = await fetch("/api/what-we-put-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (res.ok) {
        setSuccess("Glossary settings saved successfully!");
      } else {
        setError(resData.error || "Failed to save settings.");
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
          Loading Ingredients Glossary...
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
            What We Put In Glossary Settings
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

      {/* Tabs Menu */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-black/5 shadow-sm max-w-md">
        {(["smoothies", "snacks", "spreads"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 transition-all duration-150 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-center ${
              activeTab === tab
                ? "bg-[#9EAB75] text-dark shadow-sm"
                : "text-charcoal/60 hover:text-charcoal hover:bg-black/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
              <div>
                <h3 className="font-primary font-black text-lg uppercase text-charcoal">
                  Edit {activeTab} list
                </h3>
                <p className="text-xs text-charcoal/50 font-semibold mt-1">
                  Manage letter groups and list their ingredients below. Separated by commas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleAddGroup(activeTab)}
                className="bg-charcoal text-white hover:bg-charcoal/90 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all"
              >
                + Add Letter Group
              </button>
            </div>

            {data[activeTab].length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-black/10 rounded-2xl text-charcoal/40 text-xs font-bold uppercase tracking-wider">
                No groups defined for {activeTab}. Click &quot;Add Letter Group&quot; to begin.
              </div>
            ) : (
              <div className="space-y-4">
                {data[activeTab].map((group, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-4 p-4 border border-black/5 rounded-2xl bg-[#F7F7F5]/50 items-start md:items-center justify-between"
                  >
                    {/* Letter badge config */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center font-primary font-black text-sm text-charcoal shrink-0">
                        {group.letter || "?"}
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-charcoal/50 mb-0.5">
                          Letter
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. A"
                          value={group.letter}
                          onChange={(e) => handleLetterChange(activeTab, index, e.target.value)}
                          className="w-16 px-2 py-1.5 rounded-lg border border-black/10 text-xs font-bold text-center uppercase focus:outline-none focus:border-charcoal bg-white"
                        />
                      </div>
                    </div>

                    {/* Ingredients list input */}
                    <div className="flex-1 w-full">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-charcoal/50 mb-0.5">
                        Ingredients (separated by commas)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Activated Cashews, Almond Milk, Apple"
                        value={group.items.join(", ")}
                        onChange={(e) => handleItemsChange(activeTab, index, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal bg-white"
                      />
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveGroup(activeTab, index)}
                      className="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-wider px-3 py-2 rounded-lg hover:bg-red-50 transition-colors md:self-end"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full md:w-auto bg-[#9EAB75] text-dark shadow-md hover:bg-[#869360] transition-all font-black text-xs uppercase tracking-wider py-4 px-10 rounded-2xl ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Saving changes..." : "Save Glossary Settings"}
            </button>
          </div>
        </form>

        {/* Live Preview Pane */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-xs uppercase tracking-wider text-charcoal border-b border-black/5 pb-3">
              👀 Live Frontend Preview
            </h3>

            <div className="border border-stone-200/50 rounded-2xl bg-[#fffff9] p-5 select-none min-h-[300px]">
              <div className="text-center mb-6">
                <h4 className="font-primary font-black text-sm text-charcoal uppercase tracking-tight">
                  What We Put In
                </h4>
                <p className="text-[9px] text-charcoal/50 font-bold">
                  Active Tab: <span className="text-stone-700 uppercase">{activeTab}</span>
                </p>
              </div>

              {data[activeTab].length === 0 ? (
                <div className="text-center py-10 text-stone-300 text-[10px] font-bold uppercase tracking-wider">
                  No ingredients to show
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                  {data[activeTab].map((group, idx) => (
                    <div key={idx} className="flex flex-col items-start">
                      <div className="w-6 h-6 rounded-md bg-stone-100 border border-stone-200/50 flex items-center justify-center font-primary font-black text-xs text-charcoal/80 mb-2">
                        {group.letter || "?"}
                      </div>
                      <ul className="flex flex-col gap-1 font-primary text-[10px] font-bold text-charcoal/70 leading-tight">
                        {group.items.length === 0 ? (
                          <li className="italic text-stone-400">Empty group</li>
                        ) : (
                          group.items.map((item, itemIdx) => (
                            <li key={itemIdx}>{item}</li>
                          ))
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
