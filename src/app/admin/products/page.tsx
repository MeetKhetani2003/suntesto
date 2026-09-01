"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  _id: string;
  title: string;
  slug: string;
  category: string;
  costPrice: number;
  originalPrice: number;
  price: number;
  stockQuantity: number;
  inStock: boolean;
  images: string[];
  badge?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== deleteId));
        setDeleteId(null);
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      alert("Error deleting product");
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-primary font-black text-2xl md:text-3xl uppercase tracking-tight text-charcoal">
            Product Catalog & Pricing
          </h2>
          <p className="text-xs font-semibold text-charcoal/60 mt-1">
            Manage cost prices, public MRPs, selling prices, and real-time inventory.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-[#9EAB75] hover:bg-[#869360] text-dark font-black uppercase text-xs px-6 py-3.5 rounded-xl shadow-md transition-all self-start md:self-auto flex items-center gap-2"
        >
          <span>➕ Add New Product</span>
        </Link>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-white p-4 rounded-2xl border border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal"
          />
          <span className="absolute left-3.5 top-2.5 text-charcoal/40 text-sm">🔍</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-charcoal/70">
          <span>Total: <strong className="text-charcoal">{filteredProducts.length}</strong></span>
          <span>•</span>
          <span>In Stock: <strong className="text-emerald-600">{products.filter(p => p.stockQuantity > 0).length}</strong></span>
          <span>•</span>
          <span>Out of Stock: <strong className="text-red-600">{products.filter(p => p.stockQuantity <= 0).length}</strong></span>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="p-12 text-center text-xs font-bold text-charcoal/60 animate-pulse">
          Loading catalog...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-black/5 shadow-sm">
          <span className="text-4xl block mb-2">📦</span>
          <h3 className="font-primary font-black text-lg text-charcoal uppercase">No Products Found</h3>
          <p className="text-xs font-semibold text-charcoal/60 mt-1 mb-4">
            Try adjusting your search query or add a new product.
          </p>
          <Link
            href="/admin/products/new"
            className="inline-block bg-[#9EAB75] text-dark font-black text-xs uppercase px-5 py-2.5 rounded-xl"
          >
            Create First Product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F7F5] border-b border-black/5 text-[11px] font-black uppercase text-charcoal/70 tracking-wider">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-4 text-right">Cost Price (Internal)</th>
                  <th className="py-4 px-4 text-right">MRP (Strikethrough)</th>
                  <th className="py-4 px-4 text-right">Selling Price</th>
                  <th className="py-4 px-4 text-center">Stock Level</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs font-semibold">
                {filteredProducts.map((product) => {
                  const imageSrc =
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : "/images/product-dummy.jpg";

                  return (
                    <tr key={product._id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Product Name & Image */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl bg-gray-100 border border-black/5 overflow-hidden shrink-0">
                            <Image
                              src={imageSrc}
                              alt={product.title}
                              fill
                              className="object-cover"
                              unoptimized={true}
                            />
                          </div>
                          <div>
                            <span className="font-primary font-black text-sm text-charcoal uppercase block">
                              {product.title}
                            </span>
                            <span className="text-[10px] font-bold text-charcoal/50 uppercase">
                              {product.category} • {product.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Cost Price (Internal Client Info) */}
                      <td className="py-4 px-4 text-right">
                        <span className="bg-purple-50 text-purple-800 font-bold px-2.5 py-1 rounded-md text-xs inline-block">
                          ₹{product.costPrice}
                        </span>
                      </td>

                      {/* MRP (Strikethrough) */}
                      <td className="py-4 px-4 text-right text-charcoal/50 line-through">
                        ₹{product.originalPrice}
                      </td>

                      {/* Selling Price */}
                      <td className="py-4 px-4 text-right font-black text-sm text-emerald-700">
                        ₹{product.price}
                      </td>

                      {/* Stock Level */}
                      <td className="py-4 px-4 text-center">
                        {product.stockQuantity <= 0 ? (
                          <span className="bg-red-100 text-red-700 font-bold text-[10px] uppercase px-3 py-1 rounded-full">
                            Out of Stock (0)
                          </span>
                        ) : product.stockQuantity <= 5 ? (
                          <span className="bg-amber-100 text-amber-800 font-bold text-[10px] uppercase px-3 py-1 rounded-full">
                            Low Stock ({product.stockQuantity})
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase px-3 py-1 rounded-full">
                            In Stock ({product.stockQuantity})
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="bg-gray-100 hover:bg-yellow hover:text-dark text-charcoal px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                          >
                            ✏️ Edit
                          </Link>
                          <button
                            onClick={() => setDeleteId(product._id)}
                            className="bg-red-50 hover:bg-red-600 hover:text-white text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-black/5 text-center">
            <span className="text-4xl block mb-2">⚠️</span>
            <h3 className="font-primary font-black text-xl text-charcoal uppercase">
              Delete Product?
            </h3>
            <p className="text-xs font-semibold text-charcoal/60 mt-2 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
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
