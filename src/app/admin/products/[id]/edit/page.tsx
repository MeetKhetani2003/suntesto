"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { uploadFile } from "@/lib/upload";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("Fruit Snacks");
  const [categories, setCategories] = useState<any[]>([]);
  const [weight, setWeight] = useState("30G");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to load categories in product edit form:", err);
      }
    }
    fetchCategories();
  }, []);
  
  // 3 Pricing Tiers
  const [costPrice, setCostPrice] = useState<number | "">(0);
  const [originalPrice, setOriginalPrice] = useState<number | "">(0);
  const [price, setPrice] = useState<number | "">(0);

  // Stock Management
  const [stockQuantity, setStockQuantity] = useState<number | "">(0);
  const [lowStockThreshold, setLowStockThreshold] = useState<number | "">(5);

  const [description, setDescription] = useState("");
  const [badge, setBadge] = useState("Fresh Pack");
  const [archClass, setArchClass] = useState("bg-[#FCE2EC]");
  const [bgClass, setBgClass] = useState("bg-[#FCE2EC]/40");
  const [images, setImages] = useState<string[]>([]);
  const [ingredientsImage, setIngredientsImage] = useState("");
  const [uploadingIngredients, setUploadingIngredients] = useState(false);
  const [ingredientsList, setIngredientsList] = useState<{ label: string; percentage: string }[]>([]);

  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  const [nutritionServingSize, setNutritionServingSize] = useState("Per Serving (30G)");
  const [nutritionList, setNutritionList] = useState<{ name: string; value: string; rda: string }[]>([]);

  const handleNutritionChange = (index: number, field: "name" | "value" | "rda", value: string) => {
    const next = [...nutritionList];
    next[index][field] = value;
    setNutritionList(next);
  };

  const addNutritionRow = () => {
    setNutritionList((prev) => [...prev, { name: "", value: "", rda: "" }]);
  };

  const removeNutritionRow = (index: number) => {
    setNutritionList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleIngredientChange = (index: number, field: "label" | "percentage", value: string) => {
    const next = [...ingredientsList];
    next[index][field] = value;
    setIngredientsList(next);
  };

  const addIngredient = () => {
    setIngredientsList((prev) => [...prev, { label: "", percentage: "" }]);
  };

  const removeIngredient = (index: number) => {
    setIngredientsList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const p = await res.json();
          setTitle(p.title || "");
          setSlug(p.slug || "");
          setSubtitle(p.subtitle || "");
          setCategory(p.category || "FREEZE-DRIED FRUIT SNACK");
          setWeight(p.weight || "30G");
          setCostPrice(p.costPrice ?? 60);
          setOriginalPrice(p.originalPrice ?? 180);
          setPrice(p.price ?? 149);
          setStockQuantity(p.stockQuantity ?? 0);
          setLowStockThreshold(p.lowStockThreshold ?? 5);
          setDescription(p.description || "");
          setBadge(p.badge || "");
          setImages(p.images || []);
          setIngredientsList(p.ingredientsList && p.ingredientsList.length > 0 ? p.ingredientsList : [{ label: "", percentage: "" }]);
          setIngredientsImage(p.ingredientsImage || "");
          setNutritionServingSize(p.nutritionServingSize || "Per Serving (30G)");
          setNutritionList(p.nutritionList && p.nutritionList.length > 0 ? p.nutritionList : [
            { name: "Energy", value: "", rda: "" },
            { name: "Proteins", value: "", rda: "" },
            { name: "Carbohydrates", value: "", rda: "" },
            { name: "Added Sugars", value: "", rda: "" },
            { name: "Fats", value: "", rda: "" },
          ]);
          setIsBestSeller(p.isBestSeller || false);
          setIsTrending(p.isTrending || false);
          setArchClass(p.archClass || "bg-[#FCE2EC]");
          setBgClass(p.bgClass || "bg-[#FCE2EC]/40");
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Error loading product");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(autoSlug);
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const result = await uploadFile(file, { maxSizeMB: 5, allowedTypes: ["image/"] });
    if (result.url) {
      setImages((prev) => {
        const next = [...prev];
        if (next.length === 0) {
          return [result.url!];
        } else {
          next[0] = result.url!;
          return next;
        }
      });
    } else {
      setError(result.error || "Failed to upload thumbnail.");
    }
    setUploading(false);
  };

  const handleIngredientsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIngredients(true);
    setError("");

    const result = await uploadFile(file, { maxSizeMB: 5, allowedTypes: ["image/"] });
    if (result.url) {
      setIngredientsImage(result.url);
    } else {
      setError(result.error || "Failed to upload ingredients breakdown image.");
    }
    setUploadingIngredients(false);
  };

  const handleOtherImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const result = await uploadFile(file, { maxSizeMB: 5, allowedTypes: ["image/"] });
        if (result.url) {
          return result.url;
        } else {
          throw new Error(result.error || "Failed to upload one of the images.");
        }
      });

      const urls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...urls]);
    } catch (err: any) {
      setError(err.message || "Error uploading gallery images.");
    } finally {
      setUploading(false);
    }
  };

  const removeThumbnail = () => {
    setImages((prev) => {
      const next = [...prev];
      next.shift();
      return next;
    });
  };

  const removeOtherImage = (indexInOther: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexInOther + 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (images.length === 0 || !images[0]) {
      setError("Product Thumbnail Image is required.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          subtitle,
          category,
          weight,
          costPrice: Number(costPrice),
          originalPrice: Number(originalPrice),
          price: Number(price),
          stockQuantity: Number(stockQuantity) || 0,
          lowStockThreshold: Number(lowStockThreshold) || 5,
          description,
          badge,
          archClass,
          bgClass,
          images,
          ingredientsList: ingredientsList.filter((item) => item.label.trim() !== ""),
          ingredientsImage,
          nutritionServingSize,
          nutritionList: nutritionList.filter((item) => item.name.trim() !== ""),
          isBestSeller,
          isTrending,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/admin/products");
      } else {
        setError(data.error || "Failed to update product.");
      }
    } catch (err) {
      setError("Unexpected error updating product.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-bold text-charcoal/60 animate-pulse">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/products"
            className="text-xs font-bold text-charcoal/60 hover:text-charcoal flex items-center gap-1 mb-1"
          >
            ← Back to Products
          </Link>
          <h2 className="font-primary font-black text-2xl md:text-3xl uppercase tracking-tight text-charcoal">
            Edit Product: {title}
          </h2>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Basic Info */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
          <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
            1. Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
              />
            </div>

            <div className="hidden">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal bg-white"
              >
                {categories.length === 0 ? (
                  <option value={category}>{category}</option>
                ) : (
                  <>
                    {!categories.some((cat) => cat.name === category) && (
                      <option value={category}>{category}</option>
                    )}
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                Net Weight / Pack Size
              </label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
              Short Subtitle / Tagline
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
              Product Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="w-5 h-5 accent-charcoal rounded border-black/10 cursor-pointer"
              />
              <span className="text-sm font-bold uppercase tracking-wide text-charcoal">
                Mark as Best Seller (Show in Best Sellers section)
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
                className="w-5 h-5 accent-charcoal rounded border-black/10 cursor-pointer"
              />
              <span className="text-sm font-bold uppercase tracking-wide text-charcoal">
                Mark as Trending (Show in other related sections)
              </span>
            </label>
          </div>
        </div>

        {/* ── Product Card Background Color ─────────────────── */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
          <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
            Product Card Background Color
          </h3>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={archClass.startsWith("bg-[#") ? archClass.match(/bg-\[#([A-Fa-f0-9]{6})\]/i)?.[1] ? `#${archClass.match(/bg-\[#([A-Fa-f0-9]{6})\]/i)?.[1]}` : "#FCE2EC" : "#FCE2EC"}
              onChange={(e) => {
                const hex = e.target.value;
                setArchClass(`bg-[${hex}]`);
                setBgClass(`bg-[${hex}]/40`);
              }}
              className="w-12 h-10 rounded-lg border border-black/10 cursor-pointer p-0 bg-transparent"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
                Select Color: {archClass.startsWith("bg-[#") ? archClass.match(/bg-\[#([A-Fa-f0-9]{6})\]/i)?.[1] ? `#${archClass.match(/bg-\[#([A-Fa-f0-9]{6})\]/i)?.[1].toUpperCase()}` : "#FCE2EC" : "#FCE2EC"}
              </span>
              <p className="text-[11px] font-semibold text-charcoal/50 mt-1">
                This color will be used as the background arch fill for the product card.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Pricing Tiers */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
          <div className="border-b border-black/5 pb-3 flex items-center justify-between">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal">
              2. Three-Tier Pricing Structure
            </h3>
            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold uppercase px-3 py-1 rounded-full">
              Includes Confidential Client Cost
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-950 mb-1">
                1. Cost Price (Internal) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-sm font-bold text-purple-900">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-purple-200 text-sm font-black focus:outline-none focus:border-purple-600 bg-white"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-black/5">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                2. Original MRP (Public) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-sm font-bold text-charcoal">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-black/10 text-sm font-black focus:outline-none focus:border-charcoal bg-white"
                />
              </div>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-950 mb-1">
                3. Final Selling Price *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-sm font-bold text-emerald-900">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-emerald-200 text-sm font-black text-emerald-900 focus:outline-none focus:border-emerald-600 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Inventory Stock */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
          <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
            3. Inventory Stock Control
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                Stock Quantity (Units Available) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-black focus:outline-none focus:border-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                Low Stock Threshold
              </label>
              <input
                type="number"
                min="1"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
              />
            </div>
          </div>
        </div>

        {/* 4. Images */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
          <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
            4. Media & Image Upload
          </h3>

          {/* Media Images split into Thumbnail and Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            {/* Section 1: Thumbnail Image */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-2 font-primary">
                  Product Thumbnail Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  disabled={uploading}
                  className="block w-full text-xs text-charcoal/80 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-yellow file:text-dark hover:file:bg-[#869360] cursor-pointer"
                />
              </div>

              {images.length > 0 && images[0] && (
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50 mb-2 font-primary">
                    Current Thumbnail
                  </span>
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-black/10 bg-gray-100 group">
                    <Image
                      src={images[0]}
                      alt="Product Thumbnail Preview"
                      fill
                      className="object-cover"
                      unoptimized={images[0].startsWith("data:")}
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full w-6 h-6 text-xs font-bold flex items-center justify-center shadow-md hover:bg-red-700 opacity-90 transition-opacity cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Other Gallery Images */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-2 font-primary font-bold">
                  Other Product Gallery Images (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleOtherImagesUpload}
                  disabled={uploading}
                  className="block w-full text-xs text-charcoal/80 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-yellow file:text-dark hover:file:bg-[#869360] cursor-pointer"
                />
              </div>

              {images.length > 1 && (
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50 mb-2 font-primary">
                    Other Gallery Images ({images.length - 1})
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {images.slice(1).map((imgUrl, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-black/10 bg-gray-100 group">
                        <Image
                          src={imgUrl}
                          alt={`Gallery Image Preview ${idx + 1}`}
                          fill
                          className="object-cover"
                          unoptimized={imgUrl.startsWith("data:")}
                        />
                        <button
                          type="button"
                          onClick={() => removeOtherImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-[10px] font-bold flex items-center justify-center shadow-md hover:bg-red-700 opacity-90 transition-opacity cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 5. Ingredients List Editor ────────────────────────── */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
          <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
            5. Ingredients Visual Breakdown
          </h3>

          <div className="space-y-4">
            {ingredientsList.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50 mb-1">
                    Ingredient Name / Label (e.g. Whole Strawberries)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Whole Strawberries"
                    value={item.label}
                    onChange={(e) => handleIngredientChange(idx, "label", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal font-primary"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50 mb-1">
                    Percentage (e.g. 100%)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100%"
                    value={item.percentage}
                    onChange={(e) => handleIngredientChange(idx, "percentage", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal font-primary font-bold"
                  />
                </div>
                {ingredientsList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(idx)}
                    className="mt-5 p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border border-red-200 cursor-pointer"
                    title="Remove Ingredient"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addIngredient}
              className="mt-2 text-xs font-black uppercase text-dark bg-[#9EAB75]/20 hover:bg-[#9EAB75]/35 border border-[#9EAB75] px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              + Add Ingredient
            </button>

            {/* Ingredients Section Specific Image Upload */}
            <div className="border-t border-black/5 pt-6 mt-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-2 font-primary">
                  Ingredients Visual Breakdown Image (Optional - falls back to thumbnail)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIngredientsImageUpload}
                  disabled={uploadingIngredients}
                  className="block w-full text-xs text-charcoal/80 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-yellow file:text-dark hover:file:bg-[#869360] cursor-pointer"
                />
              </div>

              {ingredientsImage && (
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50 mb-2 font-primary">
                    Current Ingredients Image
                  </span>
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-black/10 bg-gray-100 group">
                    <Image
                      src={ingredientsImage}
                      alt="Ingredients Preview"
                      fill
                      className="object-cover"
                      unoptimized={ingredientsImage.startsWith("data:")}
                    />
                    <button
                      type="button"
                      onClick={() => setIngredientsImage("")}
                      className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full w-6 h-6 text-xs font-bold flex items-center justify-center shadow-md hover:bg-red-700 opacity-90 transition-opacity cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 6. Nutritional Information Editor ────────────────── */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
          <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
            6. Nutritional Information
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
              Serving Size / Label (e.g. Per Serving (30G) or Per Pouch (30G))
            </label>
            <input
              type="text"
              placeholder="e.g. Per Serving (30G)"
              value={nutritionServingSize}
              onChange={(e) => setNutritionServingSize(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal font-primary"
            />
          </div>

          <div className="space-y-4">
            <h4 className="block text-xs font-bold uppercase tracking-wider text-charcoal/50">
              Nutrient Rows
            </h4>
            {nutritionList.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50 mb-1">
                    Nutrient Name (e.g. Energy)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Energy"
                    value={item.name}
                    onChange={(e) => handleNutritionChange(idx, "name", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal font-primary"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50 mb-1">
                    Value Per Serving (e.g. 112 Kcal)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 112 Kcal"
                    value={item.value}
                    onChange={(e) => handleNutritionChange(idx, "value", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal font-primary"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50 mb-1">
                    RDA% (e.g. 5%)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5%"
                    value={item.rda}
                    onChange={(e) => handleNutritionChange(idx, "rda", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal font-primary font-bold"
                  />
                </div>
                {nutritionList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeNutritionRow(idx)}
                    className="mt-5 p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border border-red-200 cursor-pointer"
                    title="Remove Nutrient Row"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addNutritionRow}
              className="mt-2 text-xs font-black uppercase text-dark bg-[#9EAB75]/20 hover:bg-[#9EAB75]/35 border border-[#9EAB75] px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              + Add Nutrient Row
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#9EAB75] hover:bg-[#869360] text-dark font-black uppercase text-sm px-8 py-4 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting ? "Updating Product..." : "Update Product"}
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-4 rounded-xl border border-black/10 text-xs font-bold text-charcoal hover:bg-gray-100"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
