"use client";

import { useState, useEffect } from "react";
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
  slug: string;
};

/*
const BOUGHT_PRODUCTS: ProductItem[] = [
  {
    id: "fbt-1",
    title: "CHOCOLATE STRAWBERRY",
    subtitle: "Freeze-dried strawberries dipped in dark chocolate",
    price: "₹199",
    originalPrice: "₹240",
    discount: "17% OFF",
    imageSrc: "/images/sustento-pouch-chocolate-strawberry.jpg",
    archClass: "bg-[#EDE8E4]",
    buttonLabel: "Choose Options",
    slug: "chocolate-strawberry",
  },
  {
    id: "fbt-2",
    title: "FREEZE-DRIED STRAWBERRY",
    subtitle: "100% natural, crisp strawberry crunch",
    price: "₹149",
    originalPrice: "₹180",
    discount: "17% OFF",
    imageSrc: "/images/sustento-pouch-strawberry.jpg",
    archClass: "bg-[#FCE2EC]",
    buttonLabel: "Add To Cart",
    slug: "freeze-dried-strawberry",
  },
  {
    id: "fbt-3",
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
    id: "fbt-4",
    title: "FREEZE-DRIED BANANA",
    subtitle: "Sweet and crispy banana crunchies",
    price: "₹129",
    originalPrice: "₹150",
    discount: "14% OFF",
    imageSrc: "/images/sustento-pouch-banana.jpg",
    archClass: "bg-[#E2F3E7]",
    buttonLabel: "Add To Cart",
    slug: "freeze-dried-banana",
  },
];
*/

export default function FrequentlyBought() {
  const { addItem } = useCart();
  const [productsList, setProductsList] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRealProducts() {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const dbProducts = await res.json();
          if (Array.isArray(dbProducts) && dbProducts.length > 0) {
            const bestSellers = dbProducts.filter((p: any) => p.isBestSeller);
            const displayList = bestSellers.length > 0 ? bestSellers : dbProducts;
            const mappedList: ProductItem[] = displayList.slice(0, 4).map((p: any, idx: number) => {
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
                slug: p.slug,
              };
            });
            setProductsList(mappedList);
          }
        }
      } catch (err) {
        console.error("FrequentlyBought fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRealProducts();
  }, []);

  if (loading || productsList.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-warm-white py-8 px-4 md:py-12 select-none">
      {/* ── Section Header ─────────────────────────────────────── */}
      <div className="text-center mb-16 reveal-text">
        <h2 className="font-primary font-black text-2xl sm:text-3xl md:text-[38px] text-charcoal leading-none uppercase tracking-tight relative inline-block">
          OUR BEST SELLERS & TRENDING.
          {/* Horizontal Yellow Underline */}
          <span className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-[200px] h-[4px] bg-[#9EAB75] rounded-full" />
        </h2>
      </div>

      {/* ── Product Cards Grid ─────────────────────────────────── */}
      {(() => {
        const isCentered = productsList.length > 0 && productsList.length < 4;
        return (
          <div className={`flex overflow-x-auto scroll-hide gap-6 pb-6 pt-32 snap-x snap-mandatory px-4 max-w-[1200px] mx-auto lg:overflow-visible ${
            isCentered
              ? "lg:flex lg:flex-wrap lg:justify-center lg:gap-x-8 lg:gap-y-36"
              : "lg:grid lg:grid-cols-4 lg:gap-x-8 lg:gap-y-36"
          }`}>
            {productsList.map((product, idx) => (
              <div
                key={product.id}
                className={`reveal-card reveal-delay-${(idx % 4) * 100} group relative flex flex-col justify-between w-[270px] sm:w-[280px] shrink-0 snap-center min-h-[390px] mx-0 lg:mx-auto rounded-t-3xl rounded-b-3xl shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-black/[0.04] p-4 transition-all duration-500 mt-0 bg-gradient-to-b from-white/40 to-transparent backdrop-blur-[2px] ${
                  isCentered
                    ? "lg:w-[285px] lg:shrink-0 lg:grow-0"
                    : "lg:w-full lg:max-w-[285px] lg:shrink"
                } ${product.archClass}`}
              >

                {/* Top Section: Image */}
                <div className="relative z-10 flex flex-col items-center w-full pt-8">
                  {/* Product Pouch/Jar Image container */}
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

                  {/* Title & Description */}
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="mt-3 font-primary text-[15px] font-black text-dark text-center uppercase tracking-tight px-1 leading-tight h-10 flex items-center justify-center hover:underline">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="font-accent text-[15px] font-bold text-body text-center mt-2 px-3 leading-tight min-h-[38px] line-clamp-2 italic">
                    {product.subtitle}
                  </p>
                </div>

                {/* Bottom Section: Price & Action CTA */}
                <div className="relative z-10 mt-auto w-full">
                  {/* Price Panel */}
                  <div className="flex items-center justify-center gap-3 py-3 border-t border-black/5 mt-4">
                    <span className="font-primary text-[17px] font-black text-dark">
                      {product.price}
                    </span>
                    <span className="font-primary text-sm text-charcoal/40 line-through">
                      {product.originalPrice}
                    </span>
                    <span className="font-primary text-xs font-black bg-[#CC2828]/10 text-[#CC2828] px-2 py-0.5 rounded-md">
                      {product.discount}
                    </span>
                  </div>

                  {/* Action Button */}
                  {product.buttonLabel === "Add To Cart" ? (
                    <button
                      onClick={() => {
                        const priceNum = parseInt(product.price.replace("₹", "")) || 0;
                        const origPriceNum = parseInt(product.originalPrice.replace("₹", "")) || 0;
                        addItem({
                          id: product.id,
                          slug: product.slug,
                          title: product.title,
                          price: priceNum,
                          originalPrice: origPriceNum,
                          imageSrc: product.imageSrc,
                          variant: "single",
                          archClass: product.archClass,
                        }, 1);
                      }}
                      className="group/btn relative overflow-hidden flex items-center justify-center gap-2 w-full rounded-full py-3 font-primary text-[13px] font-black uppercase tracking-wider text-charcoal bg-white hover:bg-dark hover:text-white transition-all duration-300 shadow-sm hover:shadow border border-charcoal/20 hover:border-dark cursor-pointer"
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
                      className="group/btn relative overflow-hidden flex items-center justify-center gap-2 w-full rounded-full py-3 font-primary text-[13px] font-black uppercase tracking-wider text-charcoal bg-white hover:bg-dark hover:text-white transition-all duration-300 shadow-sm hover:shadow border border-charcoal/20 hover:border-dark"
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
            ))}
          </div>
        );
      })()}
    </section>
  );
}
