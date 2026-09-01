"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { uploadFile } from "@/lib/upload";

interface ITestimonial {
  _id: string;
  name: string;
  title: string;
  videoUrl: string;
  isApproved: boolean;
  isAdminCreated: boolean;
  sortOrder: number;
  createdAt: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // New testimonial form states (Admin creates directly)
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [sortOrder, setSortOrder] = useState<number | "">(0);

  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Video playback preview references
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  async function loadTestimonials() {
    try {
      const res = await fetch("/api/testimonials?all=true");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      } else {
        setError("Failed to load testimonials.");
      }
    } catch (err) {
      setError("Error calling testimonials API.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess("");

    const result = await uploadFile(file, { maxSizeMB: 15, allowedTypes: ["video/"] });
    if (result.url) {
      setVideoUrl(result.url);
      setSuccess("Video uploaded successfully.");
    } else {
      setError(result.error || "Failed to upload video.");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !title.trim() || !videoUrl) {
      setError("Name, title/quote, and video are required.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          title: title.trim(),
          videoUrl,
          sortOrder: Number(sortOrder) || 0,
          isApproved: true,
          isAdminCreated: true,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Testimonial added and auto-approved successfully!");
        setName("");
        setTitle("");
        setVideoUrl("");
        setSortOrder(0);
        setTestimonials((prev) => [data, ...prev].sort((a, b) => a.sortOrder - b.sortOrder));
        setActiveTab("approved");
      } else {
        setError(data.error || "Failed to save testimonial.");
      }
    } catch (err) {
      setError("Unexpected error creating testimonial.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id: string) => {
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });

      if (res.ok) {
        setSuccess("Testimonial approved successfully!");
        setTestimonials((prev) =>
          prev.map((t) => (t._id === id ? { ...t, isApproved: true } : t))
        );
      } else {
        const data = await res.json();
        setError(data.error || "Failed to approve testimonial.");
      }
    } catch (err) {
      setError("Error approving testimonial.");
    }
  };

  const handleUpdateSortOrder = async (id: string, newOrder: number) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: newOrder }),
      });

      if (res.ok) {
        setTestimonials((prev) =>
          prev
            .map((t) => (t._id === id ? { ...t, sortOrder: newOrder } : t))
            .sort((a, b) => a.sortOrder - b.sortOrder)
        );
      }
    } catch (err) {
      console.error("Failed to update sortOrder:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/testimonials/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSuccess("Testimonial deleted successfully.");
        setTestimonials((prev) => prev.filter((t) => t._id !== deleteId));
        setDeleteId(null);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete testimonial.");
      }
    } catch (err) {
      setError("Error deleting testimonial.");
    } finally {
      setDeleting(false);
    }
  };

  const pendingTestimonials = testimonials.filter((t) => !t.isApproved);
  const approvedTestimonials = testimonials.filter((t) => t.isApproved);

  const displayList = activeTab === "pending" ? pendingTestimonials : approvedTestimonials;

  return (
    <div className="max-w-7xl mx-auto space-y-6 select-none font-primary text-left">
      {/* Header */}
      <div>
        <Link
          href="/admin"
          className="text-xs font-bold text-charcoal/60 hover:text-charcoal flex items-center gap-1 mb-1"
        >
          ← Back to Dashboard
        </Link>
        <h2 className="font-primary font-black text-2xl md:text-3xl uppercase tracking-tight text-charcoal">
          Testimonials Manager
        </h2>
        <p className="text-xs font-semibold text-charcoal/60 mt-1">
          Review user uploads, approve requests, and publish customer dynamic video reviews to the homepage.
        </p>
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
        {/* Left Form: Admin Creates Testimonial directly */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-6">
          <h3 className="font-primary font-black text-sm uppercase tracking-wider text-charcoal border-b border-black/5 pb-2">
            ➕ Add Video Testimonial
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Swarrangi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                Review Quote / Title (Max 80 chars)
              </label>
              <input
                type="text"
                required
                maxLength={80}
                placeholder="e.g. Can't stop eating it... finishing it in a week! 😂"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                Sort Order (Lower numbers show first)
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                Upload customer video (MP4, Max 15MB)
              </label>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  required
                  placeholder="Video URL or upload"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal"
                />
                <label className="w-full py-3 bg-charcoal text-white hover:bg-black font-primary text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors flex items-center justify-center h-11">
                  {uploading ? "Uploading..." : "📁 Choose Video File"}
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {videoUrl && (
              <div className="pt-2">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50 mb-2 font-primary">
                  Video Preview
                </span>
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-black/10 bg-black">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || uploading}
              className="w-full bg-[#9EAB75] hover:bg-[#869360] text-dark font-black uppercase text-xs py-3.5 rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Saving..." : "Save Testimonial"}
            </button>
          </form>
        </div>

        {/* Right Pane: Testimonial Lists (Pending and Approved Tabs) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-6">
          {/* Tabs */}
          <div className="flex gap-4 border-b border-black/5 pb-2">
            <button
              onClick={() => setActiveTab("pending")}
              className={`pb-2 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === "pending"
                  ? "border-[#9EAB75] text-charcoal"
                  : "border-transparent text-charcoal/50 hover:text-charcoal"
              }`}
            >
              ⏳ Pending Approval ({pendingTestimonials.length})
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`pb-2 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === "approved"
                  ? "border-[#9EAB75] text-charcoal"
                  : "border-transparent text-charcoal/50 hover:text-charcoal"
              }`}
            >
              ✅ Published Testimonials ({approvedTestimonials.length})
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-xs font-bold text-charcoal/40 animate-pulse">
              Loading testimonials list...
            </div>
          ) : displayList.length === 0 ? (
            <div className="text-center py-12 text-xs font-bold text-charcoal/40">
              No testimonials in this list.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayList.map((item) => (
                <div
                  key={item._id}
                  className="border border-black/5 rounded-3xl p-4 bg-stone-50/50 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Video preview container */}
                    <div className="relative w-full aspect-[4/5] bg-black rounded-2xl overflow-hidden border border-black/10">
                      <video
                        ref={(el) => { videoRefs.current[item._id] = el; }}
                        src={item.videoUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Customer quotes & details */}
                    <div>
                      <span className="block text-[9px] font-black uppercase bg-[#9EAB75]/20 text-[#4A4A4A] px-2 py-0.5 rounded w-max mb-1">
                        {item.isAdminCreated ? "Admin Upload" : "User Upload"}
                      </span>
                      <p className="font-bold text-sm uppercase text-charcoal leading-tight">
                        &ldquo;{item.title}&rdquo;
                      </p>
                      <span className="block text-[11px] text-charcoal/50 font-black uppercase tracking-widest mt-1">
                        By {item.name}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-black/5 pt-3 mt-4 space-y-3">
                    {/* Sort Order Manager (Only for approved) */}
                    {item.isApproved && (
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-charcoal/50">
                          Sort Order:
                        </label>
                        <input
                          type="number"
                          value={item.sortOrder}
                          onChange={(e) => handleUpdateSortOrder(item._id, Number(e.target.value))}
                          className="w-16 px-2 py-1 border border-black/10 rounded-lg text-xs font-bold focus:outline-none focus:border-charcoal bg-white"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      {!item.isApproved && (
                        <button
                          onClick={() => handleApprove(item._id)}
                          className="flex-1 bg-[#84bd5e] hover:bg-[#72a34f] text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer text-center"
                        >
                          Approve & Publish
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteId(item._id)}
                        className="bg-red-50 hover:bg-red-600 hover:text-white text-red-600 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-black/5 text-center">
            <span className="text-4xl block mb-2">🗑️</span>
            <h3 className="font-primary font-black text-lg text-charcoal uppercase">
              Delete Testimonial?
            </h3>
            <p className="text-xs font-semibold text-charcoal/60 mt-2 mb-6">
              Are you sure you want to delete this testimonial review? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-5 py-2.5 rounded-xl border border-black/10 text-xs font-bold text-charcoal hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{ backgroundColor: deleting ? "#f87171" : "#ef4444", color: "white" }}
                className="px-5 py-2.5 rounded-xl border border-black/10 text-xs font-bold disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
