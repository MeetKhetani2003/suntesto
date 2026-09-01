"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface IReview {
  _id: string;
  productId?: {
    _id: string;
    title: string;
    slug: string;
    images?: string[];
  };
  name: string;
  email: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [actioningId, setActioningId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchReviews() {
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      } else {
        setError("Failed to fetch product reviews.");
      }
    } catch (err) {
      setError("Error loading product reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    setActioningId(id);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });

      if (res.ok) {
        setSuccess(`Review status updated successfully.`);
        fetchReviews();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update review status.");
      }
    } catch (err) {
      setError("Unexpected error updating review status.");
    } finally {
      setActioningId(null);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    setActioningId(id);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSuccess("Review deleted successfully.");
        fetchReviews();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete review.");
      }
    } catch (err) {
      setError("Unexpected error deleting review.");
    } finally {
      setActioningId(null);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    // 1. Status Filter
    if (filter === "pending" && review.isApproved) return false;
    if (filter === "approved" && !review.isApproved) return false;

    // 2. Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const reviewerName = review.name.toLowerCase();
      const reviewerEmail = review.email.toLowerCase();
      const comment = review.comment.toLowerCase();
      const productTitle = review.productId?.title?.toLowerCase() || "";

      return (
        reviewerName.includes(query) ||
        reviewerEmail.includes(query) ||
        comment.includes(query) ||
        productTitle.includes(query)
      );
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-xs uppercase tracking-wider text-charcoal/60">
          Loading Moderation Queue...
        </p>
      </div>
    );
  }

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
            Product Reviews Moderation
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

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(["all", "pending", "approved"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                filter === tab
                  ? "bg-[#9EAB75] text-dark shadow-sm"
                  : "bg-stone-50 hover:bg-stone-100 text-charcoal/60 border border-black/5"
              }`}
            >
              {tab === "all"
                ? "All Reviews"
                : tab === "pending"
                ? `Pending Approval`
                : "Approved"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search by reviewer, product, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal bg-stone-50"
          />
        </div>
      </div>

      {/* Reviews Table List */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-charcoal/50 font-bold text-sm uppercase tracking-wider">
            No reviews found matching the criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-stone-50 border-b border-black/5">
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-charcoal/50 w-[20%]">Product</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-charcoal/50 w-[15%]">Reviewer</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-charcoal/50 w-[10%]">Rating</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-charcoal/50 w-[35%]">Comment</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-charcoal/50 w-[10%]">Status</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-charcoal/50 w-[10%] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredReviews.map((review) => {
                  const product = review.productId;
                  const imageSrc = product?.images && product.images.length > 0 ? product.images[0] : "/images/sustento-pouch-strawberry.jpg";
                  const isActioning = actioningId === review._id;

                  return (
                    <tr key={review._id} className="hover:bg-stone-50/40 transition-colors">
                      {/* Product details */}
                      <td className="p-4 align-top">
                        {product ? (
                          <Link href={`/products/${product.slug}`} target="_blank" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 relative bg-stone-100 rounded-lg overflow-hidden border border-black/5 shrink-0">
                              <Image
                                src={imageSrc}
                                alt=""
                                fill
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                            <span className="font-bold text-xs text-charcoal group-hover:underline leading-tight block truncate max-w-[150px]">
                              {product.title}
                            </span>
                          </Link>
                        ) : (
                          <span className="text-xs font-bold text-red-500 uppercase">Product Removed</span>
                        )}
                      </td>

                      {/* Reviewer info */}
                      <td className="p-4 align-top">
                        <div className="font-bold text-xs text-charcoal truncate block max-w-[150px]">
                          {review.name}
                        </div>
                        <div className="text-[10px] font-bold text-charcoal/40 mt-0.5 truncate block max-w-[150px]">
                          {review.email}
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="p-4 align-top">
                        <div className="flex text-[#9EAB75] text-sm tracking-tight leading-none">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>
                        <div className="text-[9px] font-bold text-charcoal/30 mt-1 uppercase">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Comment text */}
                      <td className="p-4 align-top text-xs font-semibold text-charcoal/70 leading-relaxed whitespace-pre-line break-words max-w-[320px]">
                        {review.comment}
                      </td>

                      {/* Status */}
                      <td className="p-4 align-top">
                        <span
                          className={`inline-block px-2 py-1 text-[9px] font-black uppercase tracking-wider rounded-md border ${
                            review.isApproved
                              ? "bg-green-50 border-green-200 text-green-700"
                              : "bg-amber-50 border-amber-200 text-amber-700 animate-pulse"
                          }`}
                        >
                          {review.isApproved ? "Approved" : "Pending"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 align-top">
                        <div className="flex flex-col gap-1.5 items-center justify-center">
                          {/* Approve / Reject */}
                          <button
                            disabled={isActioning}
                            onClick={() => handleToggleApproval(review._id, review.isApproved)}
                            className={`w-full py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer ${
                              review.isApproved
                                ? "bg-stone-100 hover:bg-stone-200 text-charcoal border border-black/5"
                                : "bg-[#9EAB75] hover:bg-[#FFE58F] text-dark"
                            }`}
                          >
                            {isActioning ? "Wait..." : review.isApproved ? "Unapprove" : "Approve"}
                          </button>

                          {/* Delete */}
                          <button
                            disabled={isActioning}
                            onClick={() => handleDeleteReview(review._id)}
                            className="w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
