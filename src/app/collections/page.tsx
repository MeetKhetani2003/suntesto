"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InstagramGrid from "@/components/sections/InstagramGrid";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { getProductTheme } from "@/lib/productThemes";

type ProductItem = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  originalPrice: string;
  discount: string;
  imageSrc: string;
  archClass: string;
  buttonLabel: string;
  disabled?: boolean;
  category?: string;
  slug: string;
};

const FRUIT_SNACK_PRODUCTS: ProductItem[] = [
  {
    id: "col-sn-1",
    title: "FREEZE-DRIED STRAWBERRY",
    subtitle: "100% natural, crisp strawberry crunch",
    price: "₹149",
    originalPrice: "₹180",
    discount: "17% OFF",
    imageSrc: "/images/sustento-pouch-strawberry.jpg",
    archClass: "bg-[#F2D1CE]",
    buttonLabel: "Add To Cart",
    slug: "freeze-dried-strawberry",
  },
  {
    id: "col-sn-2",
    title: "FREEZE-DRIED MANGO",
    subtitle: "Delicious Alphonso mango crunchies",
    price: "₹149",
    originalPrice: "₹180",
    discount: "17% OFF",
    imageSrc: "/images/sustento-pouch-mango.jpg",
    archClass: "bg-[#F7EAD7]",
    buttonLabel: "Add To Cart",
    slug: "freeze-dried-mango",
  },
  {
    id: "col-sn-3",
    title: "FREEZE-DRIED BANANA",
    subtitle: "Sweet and crispy natural banana crunchies",
    price: "₹129",
    originalPrice: "₹150",
    discount: "14% OFF",
    imageSrc: "/images/sustento-pouch-banana.jpg",
    archClass: "bg-[#E2EAD7]",
    buttonLabel: "Add To Cart",
    slug: "freeze-dried-banana",
  },
  {
    id: "col-sn-4",
    title: "FREEZE-DRIED PINEAPPLE",
    subtitle: "Tangy and tropical crispy pineapple chunks",
    price: "₹149",
    originalPrice: "₹180",
    discount: "17% OFF",
    imageSrc: "/images/sustento-pouch-pineapple.jpg",
    archClass: "bg-[#E2EAD7]",
    buttonLabel: "Add To Cart",
    slug: "freeze-dried-pineapple",
  },
  {
    id: "col-sn-5",
    title: "FREEZE-DRIED LEMON",
    subtitle: "Zingy, refreshing freeze-dried lemon wedges",
    price: "₹129",
    originalPrice: "₹150",
    discount: "14% OFF",
    imageSrc: "/images/sustento-pouch-lemon.jpg",
    archClass: "bg-[#EAE5DF]",
    buttonLabel: "Add To Cart",
    slug: "freeze-dried-lemon",
  },
  {
    id: "col-cd-1",
    title: "CHOCOLATE STRAWBERRY",
    subtitle: "Freeze-dried strawberries dipped in dark chocolate",
    price: "₹199",
    originalPrice: "₹240",
    discount: "17% OFF",
    imageSrc: "/images/sustento-pouch-chocolate-strawberry.jpg",
    archClass: "bg-[#EDE8E4]",
    buttonLabel: "Add To Cart",
    slug: "chocolate-strawberry",
  },
];



export default function CollectionsPage() {
  const { addItem } = useCart();
  const [fruitSnacks, setFruitSnacks] = useState<ProductItem[]>(FRUIT_SNACK_PRODUCTS);

  useEffect(() => {
    async function fetchRealProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped: ProductItem[] = data.map((p: any, idx: number) => {
              const theme = getProductTheme(p.slug, p.archClass, idx);
              return {
                id: p._id,
                title: p.title,
                subtitle: p.subtitle || "100% natural, crisp nutrition crunch",
                price: `₹${p.price}`,
                originalPrice: `₹${p.originalPrice}`,
                discount:
                  p.originalPrice > p.price
                    ? `${Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF`
                    : "",
                imageSrc:
                  p.images && p.images.length > 0
                    ? p.images[0]
                    : "/images/sustento-pouch-strawberry.jpg",
                archClass: theme.archClass,
                buttonLabel: p.stockQuantity <= 0 ? "Out of Stock" : "Add To Cart",
                disabled: p.stockQuantity <= 0,
                slug: p.slug,
                category: p.category || "",
              };
            });

            // Filter for Fruit Snacks (now contains all products)
            const fs = mapped;
            if (fs.length > 0) setFruitSnacks(fs);
          }
        }
      } catch (err) {
        console.error("Failed to fetch products dynamically:", err);
      }
    }
    fetchRealProducts();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: ProductItem) => {
    if (product.buttonLabel === "Add To Cart") {
      e.preventDefault();
      e.stopPropagation();
      const rawPrice = parseInt(product.price.replace("₹", "")) || 0;
      const rawOriginalPrice = parseInt(product.originalPrice.replace("₹", "")) || 0;
      addItem({
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: rawPrice,
        originalPrice: rawOriginalPrice,
        imageSrc: product.imageSrc,
        variant: "single",
        archClass: product.archClass,
      }, 1);
    }
  };

  return (
    <>
      <Header />

      <main className="w-full bg-[#fffff9] pt-32 pb-20 select-none relative">
        
        {/* ── DYNAMIC SECTIONS GROUPED BY CATEGORY ────────────────────── */}
        {Array.from(new Set(fruitSnacks.map((p) => p.category).filter(Boolean))).map((category) => {
          const categoryProducts = fruitSnacks.filter((p) => p.category === category);
          if (categoryProducts.length === 0) return null;

          return (
            <section key={category} className="w-full mb-20">
              <div className="w-full text-center relative max-w-[900px] mx-auto px-6 mb-16 reveal-text">
                <h2 className="font-primary font-black text-2xl sm:text-3xl md:text-[38px] text-charcoal leading-none uppercase tracking-tight relative inline-block animate-delay">
                  {category}
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-[140px] h-[4px] bg-[#9EAB75] rounded-full" />
                </h2>
              </div>

              {(() => {
                const isCentered = categoryProducts.length > 0 && categoryProducts.length < 4;
                return (
                  <div className={`flex overflow-x-auto scroll-hide gap-6 pb-6 pt-32 snap-x snap-mandatory px-4 max-w-[1200px] mx-auto lg:overflow-visible ${
                    isCentered
                      ? "lg:flex lg:flex-wrap lg:justify-center lg:gap-x-8 lg:gap-y-36"
                      : "lg:grid lg:grid-cols-4 lg:gap-x-8 lg:gap-y-36"
                  }`}>
                    {categoryProducts.map((product, idx) => {
                      const theme = getProductTheme(product.slug, product.archClass, idx);
                      return (
                        <div
                          key={product.id}
                          className={`reveal-card reveal-delay-${(idx % 4) * 100} group relative flex flex-col justify-between w-[270px] sm:w-[280px] shrink-0 snap-center min-h-[390px] mx-0 lg:mx-auto rounded-t-3xl rounded-b-3xl shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-black/[0.04] p-4 transition-all duration-500 mt-0 bg-gradient-to-b from-white/40 to-transparent backdrop-blur-[2px] ${
                            isCentered
                              ? "lg:w-[285px] lg:shrink-0 lg:grow-0"
                              : "lg:w-full lg:max-w-[285px] lg:shrink"
                          } ${theme.archClass}`}
                        >
                          <div className="relative z-10 flex flex-col items-center w-full pt-8">
                            <Link href={`/products/${product.slug}`} className="group/img relative w-[180px] h-[180px] -mt-[110px] transition-all duration-500 hover:scale-[1.1] hover:-translate-y-2 flex items-center justify-center z-20">
                              <Image
                                src={product.imageSrc}
                                alt={product.title}
                                fill
                                sizes="180px"
                                className="object-contain drop-shadow-[0_15px_24px_rgba(0,0,0,0.15)] group-hover/img:drop-shadow-[0_25px_35px_rgba(0,0,0,0.22)] mix-blend-multiply transition-all duration-500"
                                unoptimized={true}
                              />
                            </Link>

                            <Link href={`/products/${product.slug}`}>
                              <h3 className="mt-3 font-primary text-[14px] sm:text-[15px] font-black text-dark text-center uppercase tracking-tight px-1 leading-tight h-10 flex items-center justify-center hover:underline">
                                {product.title}
                              </h3>
                            </Link>
                            <p className="font-accent text-[15px] font-bold text-body text-center mt-2 px-3 leading-tight min-h-[38px] line-clamp-2 italic">
                              {product.subtitle}
                            </p>
                          </div>

                          <div className="relative z-10 mt-auto w-full">
                            <div className="flex items-center justify-center gap-3 py-3 border-t border-black/5 mt-4">
                              <span className="font-primary text-[16px] font-black text-dark">
                                {product.price}
                              </span>
                              <span className="font-primary text-sm text-charcoal/40 line-through">
                                {product.originalPrice}
                              </span>
                              <span className="font-primary text-xs font-black bg-[#CC2828]/10 text-[#CC2828] px-2 py-0.5 rounded-md">
                                {product.discount}
                              </span>
                            </div>

                            {product.disabled ? (
                              <button disabled className="w-full border border-charcoal/10 rounded-full py-3 font-primary text-[13px] font-black uppercase tracking-wider text-charcoal/40 bg-[#FAF9F5] cursor-not-allowed">
                                {product.buttonLabel}
                              </button>
                            ) : product.buttonLabel === "Add To Cart" ? (
                              <button 
                                onClick={(e) => handleAddToCart(e, product)}
                                className="group/btn relative overflow-hidden flex items-center justify-center gap-2 w-full rounded-full py-3 border border-charcoal/20 hover:border-dark font-primary text-[13px] font-black uppercase tracking-wider text-charcoal bg-white hover:bg-dark hover:text-white transition-all duration-300 shadow-sm hover:shadow cursor-pointer"
                              >
                                <span>{product.buttonLabel}</span>
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
                            ) : (
                              <Link 
                                href={`/products/${product.slug}`} 
                                className="group/btn relative overflow-hidden flex items-center justify-center gap-2 w-full rounded-full py-3 border border-charcoal/20 hover:border-dark font-primary text-[13px] font-black uppercase tracking-wider text-charcoal bg-white hover:bg-dark hover:text-white transition-all duration-300 shadow-sm hover:shadow"
                              >
                                <span>{product.buttonLabel}</span>
                                <svg
                                  className="w-4 h-4 transform translate-x-[-4px] opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all duration-300"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </section>
          );
        })}

        {/* ── SECTION 3: ON THE #GRAM ──────────────────────────── */}
        <InstagramGrid />

      </main>

      {/* ── Floating Ask Sustento Chat Widget ─────────────────── */}
      <div className="fixed bottom-6 left-6 z-50">
        <button className="bg-[#9EAB75] text-dark font-primary text-[13px] font-black uppercase tracking-wider px-4 py-2.5 rounded-full shadow-lg border border-black/10 flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform duration-150">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-dark">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Ask Sustento
        </button>
      </div>

      <Footer />
    </>
  );
}
