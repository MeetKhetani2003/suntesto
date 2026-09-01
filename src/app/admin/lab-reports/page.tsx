"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { uploadFile } from "@/lib/upload";

interface ILabReport {
  _id: string;
  title: string;
  imageUrl: string;
  sortOrder: number;
  createdAt: string;
}

export default function AdminLabReportsPage() {
  const [reports, setReports] = useState<ILabReport[]>([]);
  const [loading, setLoading] = useState(true);

  // New report form states
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState<number | "">(0);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchReports() {
    try {
      const res = await fetch("/api/lab-reports");
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess("");

    const result = await uploadFile(file, { maxSizeMB: 5, allowedTypes: ["image/"] });
    if (result.url) {
      setImageUrl(result.url);
      setSuccess("Report image uploaded successfully.");
    } else {
      setError(result.error || "Failed to upload image file.");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !imageUrl) {
      setError("Title and Report Image are required.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/lab-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          imageUrl,
          sortOrder: Number(sortOrder) || 0,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Lab report added successfully!");
        setTitle("");
        setImageUrl("");
        setSortOrder(0);
        // Refresh list
        setReports((prev) => [data, ...prev].sort((a, b) => a.sortOrder - b.sortOrder));
      } else {
        setError(data.error || "Failed to add lab report.");
      }
    } catch (err) {
      setError("Unexpected error saving report.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/lab-reports/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSuccess("Report deleted successfully.");
        setReports((prev) => prev.filter((r) => r._id !== deleteId));
        setDeleteId(null);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete report.");
      }
    } catch (err) {
      setError("Error deleting report.");
    } finally {
      setDeleting(false);
    }
  };

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
          Lab Reports Manager
        </h2>
        <p className="text-xs font-semibold text-charcoal/60 mt-1">
          Upload and manage quality testing lab reports displayed to public buyers.
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
        {/* Left Form: Add New Report */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-6">
          <h3 className="font-primary font-black text-sm uppercase tracking-wider text-charcoal border-b border-black/5 pb-2">
            ➕ Add Lab Report Image
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                Report Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Strawberry Lab Report"
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
                Upload Report Image
              </label>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  required
                  placeholder="Image URL or upload"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal"
                />
                <label className="w-full py-3 bg-charcoal text-white hover:bg-black font-primary text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors flex items-center justify-center h-11">
                  {uploading ? "Uploading..." : "📁 Choose File"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {imageUrl && (
              <div className="pt-2">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50 mb-2 font-primary">
                  Report Preview
                </span>
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-black/10 bg-gray-100">
                  <Image
                    src={imageUrl}
                    alt="Report Preview"
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#9EAB75] hover:bg-[#869360] text-dark font-black uppercase text-xs py-3.5 rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Adding..." : "Add Report"}
            </button>
          </form>
        </div>

        {/* Right Pane: Table of Reports */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
          <h3 className="font-primary font-black text-sm uppercase tracking-wider text-charcoal border-b border-black/5 pb-2">
            📄 Uploaded Lab Reports ({reports.length})
          </h3>

          {loading ? (
            <div className="text-center py-12 text-xs font-bold text-charcoal/40 animate-pulse">
              Loading reports list...
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 text-xs font-bold text-charcoal/40">
              No lab reports uploaded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#F7F7F5] border-b border-black/5 text-[10px] font-black uppercase tracking-wider text-charcoal/70">
                    <th className="py-3 px-4">Preview</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4 text-center">Sort Order</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 text-xs font-semibold">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="relative w-12 h-16 rounded border border-black/10 bg-stone-50 overflow-hidden">
                          <Image
                            src={report.imageUrl}
                            alt={report.title}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 uppercase text-dark">
                        {report.title}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {report.sortOrder}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setDeleteId(report._id)}
                          className="bg-red-50 hover:bg-red-600 hover:text-white text-red-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              Delete Report?
            </h3>
            <p className="text-xs font-semibold text-charcoal/60 mt-2 mb-6">
              Are you sure you want to delete this lab report? This action cannot be undone.
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
