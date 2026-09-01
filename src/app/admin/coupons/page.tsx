"use client";

import { useEffect, useState } from "react";

interface Coupon {
  _id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  isActive: boolean;
  usageCount: number;
  expiresAt?: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Form State
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState<number | "">(10);
  const [minOrderValue, setMinOrderValue] = useState<number | "">(499);
  const [maxDiscount, setMaxDiscount] = useState<number | "">("");
  const [isActive, setIsActive] = useState(true);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function fetchCoupons() {
    try {
      const res = await fetch("/api/coupons");
      if (res.ok) {
        const data = await res.json();
        setCoupons(data);
      }
    } catch (err) {
      console.error("Failed to fetch coupons", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.toUpperCase().trim(),
          description,
          discountType,
          discountValue: Number(discountValue),
          minOrderValue: Number(minOrderValue) || 0,
          maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
          isActive,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCoupons((prev) => [data, ...prev]);
        setIsModalOpen(false);
        // Reset form
        setCode("");
        setDescription("");
        setDiscountValue(10);
        setMinOrderValue(499);
      } else {
        setError(data.error || "Failed to create coupon.");
      }
    } catch (err) {
      setError("Unexpected error creating coupon.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert("Failed to delete coupon.");
      }
    } catch (err) {
      alert("Error deleting coupon.");
    }
  };

  const toggleCouponStatus = async (coupon: Coupon) => {
    try {
      const res = await fetch(`/api/coupons/${coupon._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCoupons((prev) => prev.map((c) => (c._id === coupon._id ? updated : c)));
      }
    } catch (err) {
      alert("Error updating coupon status.");
    }
  };

  return (
    <div className="space-y-6 select-none max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-primary font-black text-2xl md:text-3xl uppercase tracking-tight text-charcoal">
            Global Store Coupons
          </h2>
          <p className="text-xs font-semibold text-charcoal/60 mt-1">
            Create and manage store-wide promotional discount codes for cart & checkout.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#9EAB75] hover:bg-[#869360] text-dark font-black uppercase text-xs px-6 py-3.5 rounded-xl shadow-md transition-all self-start md:self-auto flex items-center gap-2"
        >
          <span>🏷️ Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      {loading ? (
        <div className="p-12 text-center text-xs font-bold text-charcoal/60 animate-pulse">
          Loading coupons...
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-black/5 shadow-sm">
          <span className="text-4xl block mb-2">🏷️</span>
          <h3 className="font-primary font-black text-lg text-charcoal uppercase">
            No Coupons Created Yet
          </h3>
          <p className="text-xs font-semibold text-charcoal/60 mt-1 mb-4">
            Create your first global store coupon code like SUSTENTO10 or FIRST10.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#9EAB75] text-dark font-black text-xs uppercase px-6 py-3 rounded-xl"
          >
            Create Coupon
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F7F5] border-b border-black/5 text-[11px] font-black uppercase text-charcoal/70 tracking-wider">
                  <th className="py-4 px-6">Coupon Code</th>
                  <th className="py-4 px-4">Discount</th>
                  <th className="py-4 px-4">Min Order Value</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs font-semibold">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-mono font-black text-sm text-charcoal tracking-wide bg-yellow/20 text-dark px-3 py-1 rounded-md inline-block w-fit">
                          {coupon.code}
                        </span>
                        {coupon.description && (
                          <span className="text-[11px] text-charcoal/60 mt-1 font-medium">
                            {coupon.description}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-black text-sm text-emerald-700">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}% OFF`
                        : `₹${coupon.discountValue} OFF`}
                    </td>

                    <td className="py-4 px-4 font-bold text-charcoal/80">
                      ₹{coupon.minOrderValue}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => toggleCouponStatus(coupon)}
                        className={`text-[10px] font-black uppercase px-3 py-1 rounded-full transition-all ${
                          coupon.isActive
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {coupon.isActive ? "Active ✅" : "Disabled ⏸️"}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleDeleteCoupon(coupon._id)}
                        className="bg-red-50 hover:bg-red-600 hover:text-white text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-black/5">
            <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-6">
              <h3 className="font-primary font-black text-xl text-charcoal uppercase">
                Create Global Store Coupon
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-charcoal/50 hover:text-charcoal font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Coupon Code * (Uppercase)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUSTENTO10"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm font-black tracking-wider uppercase focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Description / Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10% off on orders above ₹499"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs font-semibold focus:outline-none focus:border-charcoal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder={discountType === "percentage" ? "10" : "50"}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm font-black focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="499"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Max Cap (₹, Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="150"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="couponActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-black/20 accent-charcoal"
                />
                <label htmlFor="couponActive" className="text-xs font-bold text-charcoal select-none">
                  Activate this coupon code immediately
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-black/10 text-xs font-bold text-charcoal hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#9EAB75] text-dark font-black text-xs uppercase shadow-md hover:bg-[#869360] disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
