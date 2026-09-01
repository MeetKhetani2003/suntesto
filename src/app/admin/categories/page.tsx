"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create Form State
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        setError("Failed to fetch product categories.");
      }
    } catch (err) {
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newName.trim()) {
      setError("Category name is required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDescription }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(`Category "${data.name}" created successfully!`);
        setNewName("");
        setNewDescription("");
        loadCategories();
      } else {
        setError(data.error || "Failed to create category.");
      }
    } catch (err) {
      setError("Failed to create category. Connection error.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (cat: ICategory) => {
    setEditingId(cat._id);
    setEditName(cat.name);
    setEditDescription(cat.description || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  const handleUpdate = async (id: string) => {
    setError("");
    setSuccess("");

    if (!editName.trim()) {
      setError("Category name is required for update.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, description: editDescription }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(`Category "${data.name}" updated successfully!`);
        handleCancelEdit();
        loadCategories();
      } else {
        setError(data.error || "Failed to update category.");
      }
    } catch (err) {
      setError("Failed to update category. Connection error.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the category "${name}"?`)) {
      return;
    }

    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(`Category "${name}" deleted successfully!`);
        loadCategories();
      } else {
        setError(data.error || "Failed to delete category.");
      }
    } catch (err) {
      setError("Failed to delete category. Connection error.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-charcoal border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-charcoal/40 uppercase tracking-wider">Loading Categories...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-6">
      
      {/* ── HEADER BLOCK ──────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 pb-6 mb-8">
        <div>
          <h1 className="font-primary font-black text-3xl text-charcoal uppercase tracking-tight leading-none">
            CATEGORIES
          </h1>
          <p className="text-xs font-bold text-charcoal/50 uppercase tracking-wider mt-2">
            Create, edit, and delete product classifications.
          </p>
        </div>
        <Link 
          href="/admin/products"
          className="bg-white border border-charcoal/20 hover:border-dark text-charcoal font-primary font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-200 text-center"
        >
          Manage Products
        </Link>
      </div>

      {/* ── ALERTS ────────────────────────────────────────────── */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-sm font-semibold">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── LEFT: LIST TABLE (8 cols) ─────────────────────────── */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-black/5 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/5 bg-[#FAF9F5]">
                    <th className="px-6 py-4 font-primary font-black text-[11px] uppercase tracking-wider text-charcoal/60">Category Name</th>
                    <th className="px-6 py-4 font-primary font-black text-[11px] uppercase tracking-wider text-charcoal/60">Slug</th>
                    <th className="px-6 py-4 font-primary font-black text-[11px] uppercase tracking-wider text-charcoal/60">Description</th>
                    <th className="px-6 py-4 font-primary font-black text-[11px] uppercase tracking-wider text-charcoal/60 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {categories.map((cat) => {
                    const isEditing = editingId === cat._id;
                    return (
                      <tr key={cat._id} className="hover:bg-warm-white/20 transition-colors">
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-3 py-1.5 border border-black/10 rounded-lg text-sm font-semibold"
                            />
                          ) : (
                            <span className="font-primary font-black text-sm text-charcoal uppercase">{cat.name}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-charcoal/60">
                          {isEditing ? (
                            <span className="italic text-charcoal/40">Auto-generated</span>
                          ) : (
                            cat.slug
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <textarea
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              className="w-full px-3 py-1.5 border border-black/10 rounded-lg text-sm font-semibold h-12"
                            />
                          ) : (
                            <span className="text-xs text-charcoal/70 font-semibold line-clamp-1">{cat.description || "-"}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isEditing ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleUpdate(cat._id)}
                                disabled={submitting}
                                className="bg-[#9EAB75] text-dark font-primary font-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg border border-black/5 hover:scale-105 active:scale-95 transition-transform"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="bg-white border border-charcoal/20 text-charcoal font-primary font-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg hover:scale-105 active:scale-95 transition-transform"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleStartEdit(cat)}
                                className="bg-white border border-charcoal/10 hover:border-charcoal/30 text-charcoal font-primary font-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(cat._id, cat.name)}
                                className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-primary font-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── RIGHT: CREATE NEW category FORM (4 cols) ──────────── */}
        <div className="lg:col-span-4">
          <div className="bg-[#fdfcfa] border-2 border-charcoal/10 rounded-3xl p-6 shadow-sm">
            <h2 className="font-primary font-black text-lg text-charcoal uppercase tracking-tight mb-4">
              Add Category
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Nut Butters"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Short description..."
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal bg-white h-24"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#9EAB75] text-dark font-primary font-black text-xs uppercase tracking-wider py-3.5 rounded-xl border border-black/5 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-sm cursor-pointer"
              >
                {submitting ? "Creating..." : "Create Category"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
