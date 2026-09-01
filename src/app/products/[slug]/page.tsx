"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PRODUCTS_MAP, ProductData } from "@/lib/data/products";
import { useCart } from "@/context/CartContext";
import { getProductTheme } from "@/lib/productThemes";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { addItem } = useCart();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeVariant, setActiveVariant] = useState<"single" | "pack3" | "pack5">("single");
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  // Swipe/Drag gestures handlers for media carousel (declared at the top to satisfy Rules of Hooks)
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // Reviews state hooks
  const [dbReviews, setDbReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewEmail, setNewReviewEmail] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewError, setReviewError] = useState("");

  const productId = product?.id || (product as any)?._id;

  // Load reviews when product resolves
  useEffect(() => {
    if (!productId) return;
    async function loadReviews() {
      try {
        const res = await fetch(`/api/reviews?productId=${productId}&approvedOnly=true`);
        if (res.ok) {
          const data = await res.json();
          setDbReviews(data);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    }
    loadReviews();
  }, [productId]);

  // FAQs state hooks
  const [dbFaqs, setDbFaqs] = useState<any[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);

  // Load FAQs when product resolves
  useEffect(() => {
    if (!productId) return;
    async function loadFAQs() {
      try {
        const res = await fetch(`/api/faqs?productId=${productId}`);
        if (res.ok) {
          const data = await res.json();
          setDbFaqs(data);
        }
      } catch (err) {
        console.error("Failed to load FAQs:", err);
      } finally {
        setFaqsLoading(false);
      }
    }
    loadFAQs();
  }, [productId]);

  // Secret Nutrition tech config state hook
  const [techConfig, setTechConfig] = useState<any>(null);

  // Load Secret Nutrition tech config
  useEffect(() => {
    async function loadTechConfig() {
      try {
        const res = await fetch("/api/secret-nutrition");
        if (res.ok) {
          const data = await res.json();
          setTechConfig(data);
        }
      } catch (err) {
        console.error("Failed to load tech details config:", err);
      }
    }
    loadTechConfig();
  }, []);

  // Comparison section config state hooks
  const [comparisonConfig, setComparisonConfig] = useState<any>(null);
  const [comparisonLoading, setComparisonLoading] = useState(true);

  // Load Product Comparison section
  useEffect(() => {
    if (!productId) return;
    async function loadComparison() {
      try {
        const res = await fetch(`/api/comparison?productId=${productId}`);
        if (res.ok) {
          const data = await res.json();
          setComparisonConfig(data);
        }
      } catch (err) {
        console.error("Failed to load product comparison details:", err);
      } finally {
        setComparisonLoading(false);
      }
    }
    loadComparison();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    
    setReviewError("");
    setReviewSuccess("");
    setReviewSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          name: newReviewName,
          email: newReviewEmail,
          rating: newReviewRating,
          comment: newReviewComment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setReviewSuccess("Thank you! Your review has been submitted and is pending approval by the moderator.");
        setNewReviewName("");
        setNewReviewEmail("");
        setNewReviewRating(5);
        setNewReviewComment("");
        setShowReviewForm(false);
      } else {
        setReviewError(data.error || "Failed to submit review.");
      }
    } catch (err) {
      setReviewError("Unexpected error submitting review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchRelated() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          // Filter out current product
          const filtered = data.filter((p: any) => p.slug !== slug).slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (err) {
        console.error("Failed to load related products", err);
      }
    }
    if (slug) {
      fetchRelated();
    }
  }, [slug]);

  // Load product data
  useEffect(() => {
    if (!slug) return;

    async function getProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const p = await res.json();
          if (p) {
            const mapped: ProductData & { images?: string[] } = {
              id: p._id,
              slug: p.slug,
              title: p.title,
              subtitle: p.subtitle || "100% natural, crisp fruit crunch",
              category: p.category,
              weight: p.weight || "30G",
              price: `₹${p.price}`,
              originalPrice: `₹${p.originalPrice}`,
              discount:
                p.originalPrice > p.price
                  ? `${Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF`
                  : "",
              rating: p.rating || 4.8,
              reviewsCount: p.reviewsCount || 12,
              imageSrc:
                p.images && p.images.length > 0
                  ? p.images[0]
                  : "/images/sustento-pouch-strawberry.jpg",
              images: p.images || [],
              archClass: p.archClass || "bg-[#FCE2EC]",
              bgClass: p.bgClass || "bg-[#FCE2EC]/40",
              badge: p.badge || (p.stockQuantity <= 0 ? "Out of Stock" : "Fresh Pack"),
              badgeBg: "bg-[#9EAB75]",
              badgeText: "text-dark",
              buttonBorder: "border-yellow",
              description:
                p.description ||
                "Made with 100% natural freeze-dried whole fruits. Zero added sugar or preservatives.",
              ingredientsText: "100% Freeze-Dried Whole Fruits & nothing else.",
              ingredientsList: p.ingredientsList && p.ingredientsList.length > 0 ? p.ingredientsList : [{ label: p.title || "Fruit", percentage: "100%" }],
              ingredientImage:
                p.ingredientsImage || (p.images && p.images.length > 0
                  ? p.images[0]
                  : "/images/sustento-pouch-strawberry.jpg"),
              nutritionServingSize: p.nutritionServingSize || "Per Serving (30G)",
              nutritionList: p.nutritionList && p.nutritionList.length > 0 ? p.nutritionList : [
                { name: "Energy", value: "112 Kcal", rda: "5%" },
                { name: "Proteins", value: "0.8g", rda: "1.5%" },
                { name: "Carbohydrates", value: "26g", rda: "8%" },
                { name: "Added Sugars", value: "0g", rda: "0%" },
                { name: "Fats", value: "0.1g", rda: "0.1%" },
              ],
              faqList: [
                {
                  question: "Are there any added sugars?",
                  answer:
                    "Zero. All sweetness comes entirely from the natural sugars present in the fruit itself.",
                },
                {
                  question: "Is this suitable for kids?",
                  answer: "Yes, it is 100% natural, preservative-free, and parent-approved.",
                },
              ],
            };
            setProduct(mapped);
            return;
          }
        }
      } catch (err) {
        console.error("Error loading product dynamically:", err);
      }

      // Fallback to static products map
      if (PRODUCTS_MAP[slug]) {
        setProduct(PRODUCTS_MAP[slug]);
      } else {
        router.push("/collections/all");
      }
    }

    getProduct();
  }, [slug, router]);

  if (!product) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center font-primary text-charcoal">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow border-t-transparent rounded-full animate-spin" />
          <p className="font-bold uppercase tracking-wider text-xs">Loading Sustento Bites...</p>
        </div>
      </div>
    );
  }

  // Calculate pricing based on variant selected
  let currentPrice = product.price;
  let currentOriginalPrice = product.originalPrice;
  let currentDiscount = product.discount;

  if (activeVariant === "pack3") {
    const rawPrice = parseInt(product.price.replace("₹", ""));
    currentPrice = `₹${Math.round(rawPrice * 3 * 0.95)}`; // 5% extra bundle discount
    currentOriginalPrice = `₹${rawPrice * 3}`;
    currentDiscount = "15% OFF";
  } else if (activeVariant === "pack5") {
    const rawPrice = parseInt(product.price.replace("₹", ""));
    currentPrice = `₹${Math.round(rawPrice * 5 * 0.9)}`; // 10% extra bundle discount
    currentOriginalPrice = `₹${rawPrice * 5}`;
    currentDiscount = "22% OFF";
  }

  const handleAddToCart = () => {
    if (!product) return;
    const priceNum = parseInt(currentPrice.replace("₹", "")) || 0;
    const origPriceNum = parseInt(currentOriginalPrice.replace("₹", "")) || 0;

    addItem({
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: priceNum,
      originalPrice: origPriceNum,
      imageSrc: product.imageSrc,
      variant: activeVariant,
      archClass: product.archClass,
    }, quantity);
  };

  const dynamicCount = dbReviews.length;
  const dynamicRating = dynamicCount > 0
    ? Math.round(dbReviews.reduce((sum, r) => sum + r.rating, 0) / dynamicCount)
    : Math.round(product.rating || 5);

  // Secret Nutrition tech config helpers
  const displaySecTitle = techConfig?.sectionTitle || "THE SECRET TO PURE,\nREAL NUTRITION";
  const displaySecSubtitle = techConfig?.sectionSubtitle || "The Tech Behind the Crunch";
  const displayTechTitle = techConfig?.techTitle || "Vacuum Freeze-Drying";
  const displayTechDesc = techConfig?.techDescription || "Our vacuum freeze-drying technology locks in flavor, color, and 95%+ of the raw fruit's natural vitamins. We freeze the fresh fruit at extreme cold temperatures (-31°C) and remove the moisture by sublimation.";
  const displayEqLeft = techConfig?.equationLeft || "Freeze Drying";
  const displayEqMid = techConfig?.equationMiddle || "Fruit";
  const displayEqRight = techConfig?.equationRight || "Water";
  const displayTempText = techConfig?.tempText || "-31°C";

  // Carousel images list (primary + dynamic ingredients/nutrition context)
  const carouselImages = product.images && product.images.length > 0
    ? product.images
    : [product.imageSrc, "/images/review-placeholder.jpg", product.imageSrc];


  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setActiveImageIndex((prev) => (prev + 1) % carouselImages.length);
    } else if (isRightSwipe) {
      setActiveImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStartX !== null) {
      setTouchEndX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (touchStartX === null || touchEndX === null) {
      setTouchStartX(null);
      return;
    }
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setActiveImageIndex((prev) => (prev + 1) % carouselImages.length);
    } else if (isRightSwipe) {
      setActiveImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Render comparison helper function to avoid duplicating JSX between mobile and desktop layout slots
  const renderComparisonSection = (isMobile: boolean) => {
    if (!comparisonConfig) return null;
    return (
      <section className={`${isMobile ? "block lg:hidden pt-8 pb-4" : "hidden lg:block border-t border-black/5 pt-16 pb-12"} flex flex-col w-full bg-white select-none`}>
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 w-full space-y-12">
          
          {/* Heading */}
          <div className="text-center relative">
            <span className="absolute left-[54%] top-[-30px] -translate-x-1/2 font-primary font-black text-[130px] text-[#9EAB75] opacity-25 select-none rotate-12 pointer-events-none">
              ?
            </span>
            <h2 className="relative z-10 font-primary font-black text-2xl sm:text-[36px] text-charcoal leading-[1.05] uppercase tracking-tight">
              {comparisonConfig.title}
            </h2>
          </div>

          {/* 4-Columns Grid */}
          <div className="flex overflow-x-auto scroll-hide gap-6 pb-6 pt-24 snap-x snap-mandatory px-4 lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible">
            {comparisonConfig.columns.map((col: any, idx: number) => {
              const isLast = idx === 3;
              const verdictColor = 
                col.verdictType === "green" 
                  ? "text-[#84bd5e]" 
                  : col.verdictType === "yellow" 
                  ? "text-[#c2a230]" 
                  : "text-[#CC2828]";
              const underlineColor = 
                col.verdictType === "green" 
                  ? "bg-[#84bd5e]" 
                  : col.verdictType === "yellow" 
                  ? "bg-[#9EAB75]" 
                  : "bg-[#CC2828]";

              return (
                <div 
                  key={idx} 
                  className={`w-[250px] sm:w-[260px] shrink-0 snap-center lg:w-full flex flex-col items-center justify-between text-center min-h-[320px] rounded-3xl p-6 border transition-all duration-300 ${
                    isLast 
                      ? "bg-[#FAF9F5]/80 border-[#9EAB75]/40 shadow-[0_8px_24px_rgba(255,218,88,0.06)] lg:scale-105" 
                      : "border-black/5 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.01)]"
                  } mx-0 lg:mx-auto mt-0`}
                >
                  {/* Icon / Image */}
                  <div className="relative w-30 h-30 flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110 shrink-0">
                    <Image
                      src={col.imageUrl}
                      alt={col.title}
                      fill
                      sizes="120px"
                      className="object-contain"
                      unoptimized={true}
                    />
                  </div>

                  {/* Title & Bullets */}
                  <div className="w-full space-y-3 flex-1 flex flex-col justify-start">
                    <h4 className="font-primary font-black text-sm uppercase text-charcoal tracking-tight px-1 leading-tight">
                      {col.title}
                    </h4>

                    <div className="font-accent text-xs font-bold text-body italic space-y-1 py-2 border-t border-black/5 flex flex-col items-center justify-center">
                      {col.bullets.map((bullet: string, bIdx: number) => (
                        <div key={bIdx} className="leading-tight">
                          {bullet}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verdict Status */}
                  <div className="w-full pt-4 border-t border-black/5 mt-auto">
                    <span className={`font-primary font-black text-[11px] sm:text-xs uppercase tracking-wider block ${verdictColor}`}>
                      {col.verdict}
                    </span>
                    <div className={`h-[3px] rounded-full w-2/3 mx-auto mt-2 ${underlineColor}`} />
                  </div>

                </div>
              );
            })}
          </div>

          {/* Bottom Cursive Description Paragraph */}
          <div className="max-w-[850px] mx-auto text-center px-4 pt-6 border-t border-black/5">
            <p className="font-accent text-lg sm:text-[21px] text-body leading-relaxed italic">
              {comparisonConfig.description}
            </p>
          </div>

        </div>
      </section>
    );
  };

  return (
    <>
      <Header />

      <main className="w-full bg-[#fffff9] pt-32 pb-20 select-none relative">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ── 1. MEDIA CAROUSEL & THUMBNAILS (Mobile: 1st, Desktop: Right Top) ── */}
          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1 flex flex-col items-center w-full">
            
            {/* Image Frame Container */}
            <div 
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => setTouchStartX(null)}
              className={`relative w-full aspect-square rounded-[40px] sm:rounded-[60px] p-6 flex items-center justify-center shadow-[0_16px_48px_rgba(0,0,0,0.04)] border border-black/5 overflow-hidden select-none cursor-grab active:cursor-grabbing ${product.bgClass}`}
            >
              
              {/* Main Carousel Display Image */}
              <div className="relative w-full h-full max-w-[85%] max-h-[85%] transition-all duration-300 hover:scale-[1.03] flex items-center justify-center pointer-events-none">
                <Image
                  src={carouselImages[activeImageIndex]}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.12)] mix-blend-multiply pointer-events-none"
                  priority
                  unoptimized={true}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>

              {/* Left Arrow */}
              <button 
                onClick={() => setActiveImageIndex(prev => (prev - 1 + carouselImages.length) % carouselImages.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-charcoal w-10 h-10 rounded-full flex items-center justify-center border border-black/5 shadow-sm active:scale-95 transition-all z-10"
              >
                &lt;
              </button>
              
              {/* Right Arrow */}
              <button 
                onClick={() => setActiveImageIndex(prev => (prev + 1) % carouselImages.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-charcoal w-10 h-10 rounded-full flex items-center justify-center border border-black/5 shadow-sm active:scale-95 transition-all z-10"
              >
                &gt;
              </button>

              {/* Indicators dots */}
              <div className="absolute bottom-6 flex items-center gap-2">
                {carouselImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                      activeImageIndex === idx ? "bg-charcoal scale-110" : "bg-charcoal/20"
                    }`}
                  />
                ))}
              </div>

            </div>

            {/* Thumbnails Gallery Strip */}
            <div className="flex items-center gap-3.5 mt-6 overflow-x-auto w-full py-1.5 scroll-hide">
              {carouselImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative shrink-0 w-20 aspect-square rounded-2xl overflow-hidden border-2 bg-white transition-all ${
                    activeImageIndex === idx ? "border-[#9EAB75] scale-105 shadow-sm" : "border-black/5 hover:border-black/15"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-contain p-1"
                    unoptimized={true}
                  />
                </button>
              ))}
            </div>

          </div>

          {/* ── 2. STICKY BUY PANEL (Mobile: 2nd, Desktop: Left Column) ── */}
          <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-28 flex flex-col items-start text-left z-20 w-full">
            
            {/* Quick Sticky Scroll Anchors */}
            <div className="flex items-center gap-6 mb-8 text-[11px] font-black uppercase tracking-wider text-charcoal/40 border-b border-black/5 pb-3 w-full font-primary">
              <a href="#reviews" className="hover:text-dark transition-colors">REVIEWS</a>
              <a href="#faqs" className="hover:text-dark transition-colors">FAQ&apos;S</a>
              <a href="#ingredients" className="hover:text-dark transition-colors">INGREDIENTS</a>
            </div>

            {/* Category Breadcrumb */}
            <span className="text-[#B57C58] font-primary font-black text-xs uppercase tracking-wider mb-1">
              {product.category}
            </span>
            
            {/* Weight */}
            <span className="text-charcoal/50 font-primary font-black text-xs uppercase tracking-wider mb-2.5">
              {activeVariant === "single" ? product.weight : activeVariant === "pack3" ? `${parseInt(product.weight) * 3}G` : `${parseInt(product.weight) * 5}G`}
            </span>

            {/* Product Title */}
            <h1 className="font-primary font-black text-[28px] sm:text-[36px] md:text-[44px] text-charcoal uppercase leading-[1.05] tracking-tight mb-2">
              {product.title}
            </h1>

            {/* Short Subtitle / Tagline */}
            {product.subtitle && (
              <p className="font-accent text-[#B57C58] text-base sm:text-lg font-bold mb-4.5 leading-snug">
                {product.subtitle}
              </p>
            )}

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 mb-1.5 font-primary">
              <span className="text-[26px] sm:text-[30px] font-black text-[#CC2828]">{currentPrice}</span>
              <span className="text-lg text-charcoal/40 line-through font-bold">{currentOriginalPrice}</span>
              <span className="text-sm font-black text-white bg-[#CC2828] px-2 py-0.5 rounded-md rotate-1 ml-1">{currentDiscount}</span>
            </div>
            <span className="text-charcoal/40 font-primary font-black text-[10px] uppercase tracking-wider mb-6">
              MRP Inclusive Of All The Taxes
            </span>

            {/* Variant Selector Pills */}
            <div className="flex items-center gap-3.5 mb-8 w-full">
              <button 
                onClick={() => { setActiveVariant("single"); setQuantity(1); }}
                className={`px-5 py-2.5 rounded-full font-primary text-[11px] font-black uppercase tracking-wider transition-all duration-200 border ${
                  activeVariant === "single"
                    ? "bg-[#9EAB75] border-black/10 text-dark scale-105 shadow-sm -rotate-1"
                    : "border-black/5 hover:border-black/20 text-charcoal/60"
                }`}
              >
                SINGLE POUCH
              </button>
              <button 
                onClick={() => { setActiveVariant("pack3"); setQuantity(1); }}
                className={`px-5 py-2.5 rounded-full font-primary text-[11px] font-black uppercase tracking-wider transition-all duration-200 border ${
                  activeVariant === "pack3"
                    ? "bg-[#9EAB75] border-black/10 text-dark scale-105 shadow-sm rotate-1"
                    : "border-black/5 hover:border-black/20 text-charcoal/60"
                }`}
              >
                PACK OF 3
              </button>
              <button 
                onClick={() => { setActiveVariant("pack5"); setQuantity(1); }}
                className={`px-5 py-2.5 rounded-full font-primary text-[11px] font-black uppercase tracking-wider transition-all duration-200 border ${
                  activeVariant === "pack5"
                    ? "bg-[#9EAB75] border-black/10 text-dark scale-105 shadow-sm -rotate-2"
                    : "border-black/5 hover:border-black/20 text-charcoal/60"
                }`}
              >
                PACK OF 5
              </button>
            </div>

            {/* Action Bar (Add to Cart + Quantity Selector) */}
            <div className="flex items-center gap-4 w-full max-w-[420px] mb-8">
              <div 
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-between bg-[#9e8f85] hover:bg-[#8d7c71] text-white rounded-full h-[52px] px-6 font-primary font-black uppercase tracking-wider shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer"
              >
                <span>Add to cart</span>
                <div className="flex items-center gap-4 text-[18px]">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setQuantity(prev => Math.max(1, prev - 1)); }}
                    className="hover:scale-125 transition-transform px-1"
                  >
                    -
                  </button>
                  <span className="font-black w-6 text-center select-none text-[15px]">{quantity}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setQuantity(prev => prev + 1); }}
                    className="hover:scale-125 transition-transform px-1"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Dotted Ticket Promo Coupons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[420px] mb-8">
              {/* Ticket 1 */}
              <div className="flex-1 border-[3px] border-dashed border-[#9EAB75] rounded-2xl p-3 flex flex-col items-center justify-center text-center bg-[#9EAB75]/5 relative rotate-[-1deg]">
                <span className="font-primary font-black text-[10px] text-charcoal/40 uppercase tracking-widest leading-none mb-1">ORDER VALUE 499/-</span>
                <span className="font-primary font-black text-sm text-charcoal uppercase tracking-wide leading-none">FREE SHIPPING</span>
              </div>
              {/* Ticket 2 */}
              <div className="flex-1 border-[3px] border-dashed border-[#9EAB75] rounded-2xl p-3 flex flex-col items-center justify-center text-center bg-[#9EAB75]/5 relative rotate-[1deg]">
                <span className="font-primary font-black text-[10px] text-charcoal/40 uppercase tracking-widest leading-none mb-1">ORDER VALUE 1199/-</span>
                <span className="font-primary font-black text-sm text-charcoal uppercase tracking-wide leading-none">EXTRA 5% OFF</span>
              </div>
            </div>

            {/* Stars & Customer reviews count */}
            <a href="#reviews-section" className="flex items-center gap-2 select-none hover:opacity-80 transition-opacity" id="reviews">
              <div className="flex text-[#9EAB75] text-[20px] leading-none">
                {"★".repeat(dynamicRating)}
                {"☆".repeat(5 - dynamicRating)}
              </div>
              <span className="font-accent text-charcoal text-[16px] italic leading-none pt-1">
                {dynamicCount > 0 ? `${dynamicCount} reviews` : `${product.reviewsCount} reviews`}
              </span>
            </a>

          </div>

          {/* ── 3. DETAILED CONTENT (Mobile: 3rd, Desktop: Right Bottom) ── */}
          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-2 flex flex-col gap-24 w-full">
            
            {/* Short Review snippet */}
            <div className="w-full text-left font-primary font-medium text-[15px] sm:text-base leading-relaxed text-charcoal/70">
              <p>
                {showFullDesc ? product.description : `${product.description.slice(0, 160)}...`}
                <button 
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="text-dark font-black underline ml-2 hover:text-black cursor-pointer"
                >
                  {showFullDesc ? "Read less" : "Read more"}
                </button>
              </p>
            </div>

            {renderComparisonSection(true)}

            {/* 📍 SECTION 2: INGREDIENTS BREAKDOWN ("WHAT YOU SEE IS WHAT YOU EAT.") */}
            <div className="flex flex-col items-center w-full border-t border-black/5 pt-16" id="ingredients">
              
              <div className="text-left w-full mb-12">
                <h2 className="font-primary font-black text-2xl sm:text-[32px] text-charcoal leading-[1.1] uppercase tracking-tight">
                  WHAT YOU SEE IS <br />
                  WHAT YOU EAT.
                </h2>
                {/* Curved underline */}
                <div className="relative inline-block mt-2">
                  <span className="font-accent text-lg text-charcoal/50 italic font-bold">Here&apos;s a breakdown:</span>
                  <span className="absolute left-0 bottom-[-4px] w-full h-[3px] bg-[#9EAB75] rounded-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full">
                
                {/* Ingredients composition composite image */}
                <div className="relative w-full aspect-square bg-[#fffff9] border-4 border-[#9EAB75]/20 rounded-[40px] p-8 flex items-center justify-center shadow-inner overflow-hidden">
                  <div className="relative w-full h-full max-w-[100%] max-h-[100%] flex items-center justify-center">
                    <Image
                      src={product.ingredientImage}
                      alt="Ingredients visual breakdown illustration"
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.1)] mix-blend-multiply"
                      unoptimized={true}
                    />
                  </div>
                </div>

                {/* Right Bullet items */}
                <div className="flex flex-col items-start gap-4 font-primary text-left">
                  {product.ingredientsList.map((item, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-[20px] font-black text-charcoal tracking-tight">
                        {item.percentage}
                      </span>
                      <span className="text-[13px] font-bold text-charcoal/50 uppercase tracking-widest">
                        {item.label}
                      </span>
                    </div>
                  ))}

                  {/* 100% Clean Underlined */}
                  <div className="relative inline-block mt-4 border-b-2 border-black/80 pb-0.5">
                    <span className="font-accent text-[22px] font-bold text-[#CC2828] italic">100% Clean</span>
                  </div>
                </div>

              </div>

            </div>

            {/* 📍 SECTION 3: NUTRITIONAL INFO ("CLEAN INGREDIENTS, HONEST NUMBERS") */}
            <div className="flex flex-col items-center w-full border-t border-black/5 pt-16">
              
              <div className="text-left w-full mb-10 relative">
                <h2 className="font-primary font-black text-2xl sm:text-[32px] text-charcoal leading-[1.1] uppercase tracking-tight">
                  CLEAN INGREDIENTS,<br />
                  HONEST NUMBERS
                </h2>
                <div className="relative inline-block mt-2">
                  <span className="font-accent text-lg text-charcoal/50 italic font-bold">From pouch to label</span>
                  <span className="absolute left-0 bottom-[-4px] w-full h-[3px] bg-[#9EAB75] rounded-full" />
                </div>

                {/* Floating smear graphic mockup */}
                {/* <div className="absolute right-2 -top-12 z-0 w-24 h-24 select-none opacity-20 pointer-events-none md:opacity-100">
                  <Image 
                    src="/images/pineapple-transition.jpg"
                    alt="Smear context decoration"
                    fill
                    sizes="96px"
                    className="object-contain rotate-12"
                  />
                </div> */}
              </div>

              {/* Nutritional values grid table */}
              <div className="w-full border-2 border-charcoal rounded-[32px] overflow-hidden bg-[#fffff9] font-primary shadow-sm">
                
                {/* Table Header block */}
                <div className="bg-[#DFCFC5] px-6 py-4.5 border-b-2 border-charcoal">
                  <h3 className="font-black text-lg text-charcoal uppercase tracking-wider text-left">NUTRITIONAL INFORMATION</h3>
                  <span className="block font-accent text-sm text-charcoal/70 text-left mt-1 italic">{product.nutritionServingSize}</span>
                </div>

                {/* Grid Header column row */}
                <div className="grid grid-cols-12 border-b border-black/10 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-charcoal/45 text-left select-none">
                  <div className="col-span-6">Nutrient Name</div>
                  <div className="col-span-3 text-center">Per Serving</div>
                  <div className="col-span-3 text-center">RDA%</div>
                </div>

                {/* Rows listing */}
                <div className="flex flex-col text-left text-xs font-bold text-charcoal/80">
                  {product.nutritionList.map((row, idx) => (
                    <div 
                      key={idx} 
                      className={`grid grid-cols-12 px-6 py-3 hover:bg-stone-50 transition-colors ${
                        idx < product.nutritionList.length - 1 ? "border-b border-black/5" : ""
                      }`}
                    >
                      <div className="col-span-6 font-black uppercase text-charcoal">{row.name}</div>
                      <div className="col-span-3 text-center">{row.value}</div>
                      <div className="col-span-3 text-center">{row.rda}</div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

            {/* 📍 SECTION 3.2: THE SECRET TO PURE, REAL NUTRITION (THE TECH) */}
            <div className="flex flex-col items-center w-full border-t border-black/5 pt-16">
              
              <div className="text-left w-full mb-10 reveal-text">
                <h2 className="font-primary font-black text-2xl sm:text-[32px] text-charcoal leading-[1.1] uppercase tracking-tight whitespace-pre-line">
                  {displaySecTitle}
                </h2>
                <div className="relative inline-block mt-2">
                  <span className="font-accent text-lg text-charcoal/50 italic font-bold">{displaySecSubtitle}</span>
                  <span className="absolute left-0 bottom-[-4px] w-full h-[3px] bg-[#9EAB75] rounded-full" />
                </div>
              </div>

              {/* Interactive technology block */}
              <div className="w-full bg-[#fdfcfa] border-2 border-charcoal/10 rounded-[40px] p-8 sm:p-10 flex flex-col md:flex-row items-center gap-10 shadow-sm relative overflow-hidden reveal-section">
                
                {/* Tech explanation copy */}
                <div className="flex-1 text-left font-primary">
                  <h3 className="font-black text-xl text-charcoal uppercase tracking-tight mb-4">
                    {displayTechTitle}
                  </h3>
                  <p className="text-sm font-semibold text-charcoal/70 leading-relaxed mb-6">
                    {displayTechDesc}
                  </p>
                  
                  {/* Equation illustration */}
                  <div className="bg-white border-2 border-charcoal rounded-2xl p-4 flex flex-col items-center justify-center relative shadow-sm max-w-xs">
                    <div className="flex items-center gap-2 font-black text-sm sm:text-base text-charcoal uppercase tracking-wide">
                      <span>{displayEqLeft}</span>
                      <span className="text-[#CC2828] font-bold text-lg">=</span>
                      <span>{displayEqMid}</span>
                      <span className="text-[#CC2828] font-bold text-lg">-</span>
                      <div className="relative flex flex-col items-center">
                        <span className="absolute -top-3.5 font-accent text-[9px] text-charcoal/50 italic font-bold tracking-normal lowercase">just</span>
                        <span>{displayEqRight}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated visual display container */}
                <div className="w-full max-w-[280px] aspect-square rounded-[36px] bg-sky-50/50 border border-sky-100/50 flex items-center justify-center relative overflow-hidden p-6 shadow-inner select-none">
                  
                  {/* Thermometer indicator */}
                  <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm border border-black/5 rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                    <span className="text-sky-500 text-base leading-none">❄</span>
                    <span className="font-primary font-black text-[10px] sm:text-xs text-charcoal tracking-wide">{displayTempText}</span>
                  </div>

                  {/* Rotating Snowflake background */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 animate-[spin_40s_linear_infinite] pointer-events-none">
                    <svg className="w-48 h-48 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-9-9h18m-3-6L6 18M18 18L6 6" />
                    </svg>
                  </div>

                  {/* Floating H2O Molecules (Bubbles) */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                    <div className="absolute w-2 h-2 bg-sky-300/40 rounded-full animate-ping top-1/4 left-1/3" />
                    <div className="absolute w-3 h-3 bg-sky-300/30 rounded-full animate-[pulse_2s_infinite] bottom-1/4 right-1/4" />
                    <div className="absolute w-1.5 h-1.5 bg-sky-300/50 rounded-full animate-bounce top-2/3 left-1/4" />
                    {/* Floating Vapor text trails */}
                    <span className="absolute text-[8px] font-black text-sky-400/50 uppercase tracking-widest top-1/2 left-[15%] rotate-[-15deg] animate-[pulse_3s_infinite]">H₂O Vapor</span>
                    <span className="absolute text-[8px] font-black text-sky-400/50 uppercase tracking-widest bottom-[20%] right-[15%] rotate-[15deg] animate-[pulse_4s_infinite]">H₂O Vapor</span>
                  </div>

                  {/* Central Product Image container */}
                  <div className="relative w-40 h-40 z-20 flex items-center justify-center animate-[pulse_6s_ease-in-out_infinite]">
                    <Image
                      src={product.imageSrc}
                      alt={`${product.title} freeze drying showcase`}
                      fill
                      sizes="160px"
                      className="object-contain drop-shadow-[0_12px_24px_rgba(56,189,248,0.25)] mix-blend-multiply"
                      unoptimized={true}
                    />
                  </div>
                  
                </div>

              </div>

            </div>

            {/* 📍 SECTION 4: PRODUCT FAQS SECTION */}
            <div className="flex flex-col items-center w-full border-t border-black/5 pt-16 pb-12" id="faqs">
              
              <div className="text-left w-full mb-12">
                <h2 className="font-primary font-black text-2xl sm:text-[32px] text-charcoal leading-none uppercase tracking-tight">
                  FREQUENTLY ASKED
                </h2>
                <div className="relative inline-block mt-2">
                  <span className="font-accent text-lg text-charcoal/50 italic font-bold">Have questions? We got you.</span>
                  <span className="absolute left-0 bottom-[-4px] w-full h-[3px] bg-[#9EAB75] rounded-full" />
                </div>
              </div>

              {/* Accordion Questions */}
              <div className="flex flex-col gap-4 w-full text-left">
                {faqsLoading ? (
                  <div className="flex flex-col items-center justify-center py-6 gap-2">
                    <div className="w-6 h-6 border-3 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] font-bold text-charcoal/40 uppercase">Loading FAQs...</p>
                  </div>
                ) : (
                  (dbFaqs.length > 0 ? dbFaqs : product.faqList).map((faq, idx) => (
                    <div 
                      key={faq._id || idx}
                      className="border-2 border-charcoal/10 rounded-2xl p-5 bg-white shadow-sm flex flex-col gap-2 font-primary"
                    >
                      <h3 className="font-black text-sm sm:text-base text-dark uppercase tracking-tight leading-snug">
                        {faq.question}
                      </h3>
                      <p className="text-[13px] sm:text-sm text-charcoal/70 font-semibold leading-relaxed mt-1">
                        {faq.answer}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </div>

        {/* ── SECTION 4.2: PRODUCT COMPARISON SECTION ────────────────── */}
        {renderComparisonSection(false)}

        {/* ── SECTION 4.5: CUSTOMER REVIEWS SECTION ────────────────── */}
        <section className="flex flex-col w-full border-t border-black/5 pt-16 pb-12" id="reviews-section">
          <div className="max-w-[800px] mx-auto px-4 sm:px-6 w-full space-y-12">
            
            {/* Section Header */}
            <div className="text-center">
              <h2 className="font-primary font-black text-2xl sm:text-[32px] text-charcoal leading-none uppercase tracking-tight relative inline-block">
                CUSTOMER REVIEWS
                <span className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-[140px] h-[3px] bg-[#9EAB75] rounded-full" />
              </h2>
            </div>

            {/* Ratings Summary Box */}
            <div className="bg-[#FAF9F5] rounded-3xl p-6 sm:p-8 border border-black/5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <span className="font-primary font-black text-4xl sm:text-5xl text-charcoal">
                    {dynamicCount > 0 
                      ? (dbReviews.reduce((sum, r) => sum + r.rating, 0) / dynamicCount).toFixed(1) 
                      : (product.rating || 4.8).toFixed(1)}
                  </span>
                  <div>
                    <div className="flex text-[#9EAB75] text-xl leading-none">
                      {"★".repeat(dynamicRating)}
                      {"☆".repeat(5 - dynamicRating)}
                    </div>
                    <p className="text-xs font-bold text-charcoal/40 uppercase mt-1">
                      Based on {dynamicCount > 0 ? dynamicCount : product.reviewsCount} reviews
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowReviewForm(!showReviewForm);
                  setReviewSuccess("");
                  setReviewError("");
                }}
                className="px-6 py-3 bg-charcoal text-white hover:bg-black font-primary text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
              >
                {showReviewForm ? "Cancel Review" : "Write a review"}
              </button>
            </div>

            {/* Success Alert */}
            {reviewSuccess && (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold">
                ✅ {reviewSuccess}
              </div>
            )}

            {/* Error Alert */}
            {reviewError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                ⚠️ {reviewError}
              </div>
            )}

            {/* Write a Review Submission Form */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm space-y-4 animate-fadeIn">
                <h3 className="font-primary font-black text-sm uppercase tracking-wider text-charcoal border-b border-black/5 pb-2">
                  ✍️ Write your review
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-charcoal/60 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-charcoal/60 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={newReviewEmail}
                      onChange={(e) => setNewReviewEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal bg-stone-50"
                    />
                  </div>
                </div>

                {/* Star rating selector */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-charcoal/60 mb-1">
                    Rating
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className="text-2xl transition-transform hover:scale-115 active:scale-95 cursor-pointer leading-none text-[#9EAB75]"
                      >
                        {star <= newReviewRating ? "★" : "☆"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-charcoal/60 mb-1">
                    Review Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share your thoughts about this product..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal bg-stone-50 resize-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="px-6 py-2.5 bg-[#9EAB75] text-dark hover:bg-[#FFE58F] font-primary text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    {reviewSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            )}

            {/* Approved Reviews List Feed */}
            <div className="space-y-6">
              {reviewsLoading ? (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <div className="w-6 h-6 border-3 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] font-bold text-charcoal/40 uppercase">Loading comments...</p>
                </div>
              ) : dbReviews.length === 0 ? (
                <div className="text-center py-8 text-charcoal/50 text-xs font-bold uppercase tracking-wider border-2 border-dashed border-charcoal/10 rounded-3xl">
                  No approved reviews yet. Be the first to write a review!
                </div>
              ) : (
                <div className="divide-y divide-black/5">
                  {dbReviews.map((rev) => (
                    <div key={rev._id} className="py-6 first:pt-0 last:pb-0 space-y-2 text-left">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-primary font-black text-xs text-charcoal uppercase">
                            {rev.name}
                          </span>
                          <span className="bg-green-50 border border-green-200 text-green-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-0.5">
                            ✓ Verified Buyer
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-charcoal/40 uppercase">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex text-[#9EAB75] text-sm leading-none">
                        {"★".repeat(rev.rating)}
                        {"☆".repeat(5 - rev.rating)}
                      </div>

                      <p className="text-xs font-semibold text-charcoal/70 leading-relaxed whitespace-pre-line">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </section>

          {/* 📍 SECTION 5: RELATED PRODUCTS SECTION */}
          {relatedProducts.length > 0 && (
            <div className="flex flex-col w-full border-t border-black/5 pt-16 pb-12 select-none" id="related-products">
              <div className="max-w-[1240px] xl:mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                  <h2 className="font-primary font-black text-2xl sm:text-[32px] text-charcoal leading-none uppercase tracking-tight relative inline-block">
                    YOU MAY ALSO LIKE.
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-[140px] h-[3px] bg-[#9EAB75] rounded-full" />
                  </h2>
                </div>

                {(() => {
                  const isCentered = relatedProducts.length > 0 && relatedProducts.length < 4;
                  return (
                    <div className={`flex overflow-x-auto scroll-hide gap-6 pb-6 pt-32 snap-x snap-mandatory px-4 max-w-[1200px] mx-auto lg:overflow-visible ${
                      isCentered
                        ? "lg:flex lg:flex-wrap lg:justify-center lg:gap-x-8 lg:gap-y-36"
                        : "lg:grid lg:grid-cols-4 lg:gap-x-8 lg:gap-y-36"
                    }`}>
                      {relatedProducts.map((p, idx) => {
                        const rawPrice = p.price;
                        const rawOriginalPrice = p.originalPrice;
                        const priceVal = `₹${p.price}`;
                        const originalPriceVal = p.originalPrice ? `₹${p.originalPrice}` : "";
                        const discountVal = p.originalPrice && p.price && p.originalPrice > p.price ? `${Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF` : "";
                        const imageSrc = p.images && p.images.length > 0 ? p.images[0] : "/images/sustento-pouch-strawberry.jpg";
                        const theme = getProductTheme(p.slug, p.archClass, idx);

                        return (
                          <div
                            key={p._id}
                            className={`group relative flex flex-col justify-between w-[270px] sm:w-[280px] shrink-0 snap-center min-h-[390px] mx-0 lg:mx-auto rounded-t-3xl rounded-b-3xl shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-black/[0.04] p-4 transition-all duration-500 mt-0 bg-gradient-to-b from-white/40 to-transparent backdrop-blur-[2px] ${
                              isCentered
                                ? "lg:w-[285px] lg:shrink-0 lg:grow-0"
                                : "lg:w-full lg:max-w-[285px] lg:shrink"
                            } ${theme.archClass}`}
                          >
                            {/* Top Section: Image */}
                            <div className="relative z-10 flex flex-col items-center w-full pt-8">
                              <Link href={`/products/${p.slug}`} className="group/img relative w-[180px] h-[180px] -mt-[110px] transition-all duration-500 hover:scale-[1.1] hover:-translate-y-2 flex items-center justify-center z-20">
                                <Image
                                  src={imageSrc}
                                  alt={p.title}
                                  fill
                                  sizes="180px"
                                  className="object-contain drop-shadow-[0_15px_24px_rgba(0,0,0,0.15)] group-hover/img:drop-shadow-[0_25px_35px_rgba(0,0,0,0.22)] mix-blend-multiply transition-all duration-500"
                                  unoptimized={true}
                                />
                              </Link>

                              {/* Title & Description */}
                              <Link href={`/products/${p.slug}`} className="w-full">
                                <h3 className="mt-3 font-primary text-[14px] sm:text-[15px] font-black text-dark text-center uppercase tracking-tight px-1 leading-tight h-10 flex items-center justify-center hover:underline">
                                  {p.title}
                                </h3>
                              </Link>
                              <p className="font-accent text-[15px] font-bold text-body text-center mt-2 px-3 leading-tight min-h-[38px] line-clamp-2 italic">
                                {p.subtitle || "Freeze-dried 100% natural fruit bites."}
                              </p>
                            </div>

                            {/* Bottom Section: Price & Action CTA */}
                            <div className="relative z-10 mt-auto w-full">
                              {/* Price Panel */}
                              <div className="flex items-center justify-center gap-3 py-3 border-t border-black/5 mt-4">
                                <span className="font-primary text-[17px] font-black text-dark">
                                  {priceVal}
                                </span>
                                {originalPriceVal && (
                                  <span className="font-primary text-sm text-charcoal/40 line-through">
                                    {originalPriceVal}
                                  </span>
                                )}
                                {discountVal && (
                                  <span className="font-primary text-xs font-black bg-[#CC2828]/10 text-[#CC2828] px-2 py-0.5 rounded-md">
                                    {discountVal}
                                  </span>
                                )}
                              </div>

                              {/* Add To Cart CTA Button */}
                              <button
                                onClick={() => {
                                  addItem({
                                    id: p._id,
                                    slug: p.slug,
                                    title: p.title,
                                    price: rawPrice,
                                    originalPrice: rawOriginalPrice,
                                    imageSrc: imageSrc,
                                    variant: "single",
                                    archClass: theme.archClass,
                                  }, 1);
                                }}
                                className={`group/btn relative overflow-hidden flex items-center justify-center gap-2 w-full rounded-full py-3 font-primary text-[13px] font-black uppercase tracking-wider text-charcoal bg-white hover:bg-dark hover:text-white transition-all duration-300 shadow-sm hover:shadow border ${theme.buttonBorder}`}
                              >
                                <span>Add To Cart</span>
                                <svg
                                  className="w-4 h-4 transform translate-x-[-4px] opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all duration-300"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
      </main>

      <Footer />
    </>
  );
}

