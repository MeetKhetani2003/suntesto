"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductTheme } from "@/lib/productThemes";

type Product = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  originalPrice: string;
  discount: string;
  badge: string;
  archClass: string;
  badgeBg: string;
  badgeText: string;
  buttonBorder: string;
  imageSrc: string;
  slug: string;
  category?: string;
};

type TabData = {
  [key: string]: Product[];
};

/*
const PRODUCTS_DATA: TabData = {
  "ALL": [
    {
      id: "all-1",
      title: "FREEZE-DRIED STRAWBERRY",
      subtitle: "100% natural, crisp strawberry crunch",
      price: "₹149",
      originalPrice: "₹180",
      discount: "17% OFF",
      badge: "Best Seller",
      archClass: "bg-[#FCE2EC]",
      badgeBg: "bg-[#F9C5D8]",
      badgeText: "text-pink-800",
      buttonBorder: "border-pink-300",
      imageSrc: "/images/sustento-pouch-strawberry.jpg",
      slug: "freeze-dried-strawberry",
    },
    {
      id: "all-2",
      title: "CHOCOLATE STRAWBERRY",
      subtitle: "Freeze-dried strawberries dipped in dark chocolate",
      price: "₹199",
      originalPrice: "₹240",
      discount: "17% OFF",
      badge: "Indulgent",
      archClass: "bg-[#EDE8E4]",
      badgeBg: "bg-[#DFCFC5]",
      badgeText: "text-amber-900",
      buttonBorder: "border-stone-300",
      imageSrc: "/images/sustento-pouch-chocolate-strawberry.jpg",
      slug: "chocolate-strawberry",
    },
    {
      id: "all-3",
      title: "FREEZE-DRIED MANGO",
      subtitle: "Deliciously sweet and crispy Alphonso mango slices",
      price: "₹149",
      originalPrice: "₹180",
      discount: "17% OFF",
      badge: "Fresh & Crispy",
      archClass: "bg-[#F7EAD7]",
      badgeBg: "bg-[#DFCFC5]",
      badgeText: "text-amber-900",
      buttonBorder: "border-stone-300",
      imageSrc: "/images/sustento-pouch-mango.jpg",
      slug: "freeze-dried-mango",
    },
    {
      id: "all-4",
      title: "FREEZE-DRIED BANANA",
      subtitle: "Sweet and crispy natural banana crunchies",
      price: "₹129",
      originalPrice: "₹150",
      discount: "14% OFF",
      badge: "High Fiber",
      archClass: "bg-[#E2F3E7]",
      badgeBg: "bg-[#C4E9CE]",
      badgeText: "text-green-800",
      buttonBorder: "border-green-300",
      imageSrc: "/images/sustento-pouch-banana.jpg",
      slug: "freeze-dried-banana",
    },
    {
      id: "all-5",
      title: "FREEZE-DRIED PINEAPPLE",
      subtitle: "Tangy and tropical crispy pineapple chunks",
      price: "₹149",
      originalPrice: "₹180",
      discount: "17% OFF",
      badge: "Vitamin C Boost",
      archClass: "bg-[#E2F0FD]",
      badgeBg: "bg-[#BFE0FF]",
      badgeText: "text-blue-800",
      buttonBorder: "border-blue-300",
      imageSrc: "/images/sustento-pouch-pineapple.jpg",
      slug: "freeze-dried-pineapple",
    },
    {
      id: "all-6",
      title: "FREEZE-DRIED LEMON",
      subtitle: "Zingy, refreshing freeze-dried lemon wedges",
      price: "₹129",
      originalPrice: "₹150",
      discount: "14% OFF",
      badge: "Zesty Crunch",
      archClass: "bg-[#EAE5DF]",
      badgeBg: "bg-[#DFCFC5]",
      badgeText: "text-amber-900",
      buttonBorder: "border-stone-300",
      imageSrc: "/images/sustento-pouch-lemon.jpg",
      slug: "freeze-dried-lemon",
    },
  ],
  "FRUIT SNACKS": [
    {
      id: "fs-1",
      title: "FREEZE-DRIED STRAWBERRY",
      subtitle: "100% natural, crisp strawberry crunch",
      price: "₹149",
      originalPrice: "₹180",
      discount: "17% OFF",
      badge: "Best Seller",
      archClass: "bg-[#FCE2EC]",
      badgeBg: "bg-[#F9C5D8]",
      badgeText: "text-pink-800",
      buttonBorder: "border-pink-300",
      imageSrc: "/images/sustento-pouch-strawberry.jpg",
      slug: "freeze-dried-strawberry",
    },
    {
      id: "fs-2",
      title: "FREEZE-DRIED MANGO",
      subtitle: "Deliciously sweet and crispy Alphonso mango slices",
      price: "₹149",
      originalPrice: "₹180",
      discount: "17% OFF",
      badge: "Fresh & Crispy",
      archClass: "bg-[#F7EAD7]",
      badgeBg: "bg-[#DFCFC5]",
      badgeText: "text-amber-900",
      buttonBorder: "border-stone-300",
      imageSrc: "/images/sustento-pouch-mango.jpg",
      slug: "freeze-dried-mango",
    },
    {
      id: "fs-3",
      title: "FREEZE-DRIED BANANA",
      subtitle: "Sweet and crispy natural banana crunchies",
      price: "₹129",
      originalPrice: "₹150",
      discount: "14% OFF",
      badge: "High Fiber",
      archClass: "bg-[#E2F3E7]",
      badgeBg: "bg-[#C4E9CE]",
      badgeText: "text-green-800",
      buttonBorder: "border-green-300",
      imageSrc: "/images/sustento-pouch-banana.jpg",
      slug: "freeze-dried-banana",
    },
    {
      id: "fs-4",
      title: "FREEZE-DRIED PINEAPPLE",
      subtitle: "Tangy and tropical crispy pineapple chunks",
      price: "₹149",
      originalPrice: "₹180",
      discount: "17% OFF",
      badge: "Vitamin C Boost",
      archClass: "bg-[#E2F0FD]",
      badgeBg: "bg-[#BFE0FF]",
      badgeText: "text-blue-800",
      buttonBorder: "border-blue-300",
      imageSrc: "/images/sustento-pouch-pineapple.jpg",
      slug: "freeze-dried-pineapple",
    },
    {
      id: "fs-5",
      title: "FREEZE-DRIED LEMON",
      subtitle: "Zingy, refreshing freeze-dried lemon wedges",
      price: "₹129",
      originalPrice: "₹150",
      discount: "14% OFF",
      badge: "Zesty Crunch",
      archClass: "bg-[#EAE5DF]",
      badgeBg: "bg-[#DFCFC5]",
      badgeText: "text-amber-900",
      buttonBorder: "border-stone-300",
      imageSrc: "/images/sustento-pouch-lemon.jpg",
      slug: "freeze-dried-lemon",
    },
    {
      id: "fs-6",
      title: "CHOCOLATE STRAWBERRY",
      subtitle: "Freeze-dried strawberries dipped in dark chocolate",
      price: "₹199",
      originalPrice: "₹240",
      discount: "17% OFF",
      badge: "Indulgent",
      archClass: "bg-[#EDE8E4]",
      badgeBg: "bg-[#DFCFC5]",
      badgeText: "text-amber-900",
      buttonBorder: "border-stone-300",
      imageSrc: "/images/sustento-pouch-chocolate-strawberry.jpg",
      slug: "chocolate-strawberry",
    },
  ],
};
*/

// const TABS = Object.keys(PRODUCTS_DATA);

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState<string>("");
  const [tabsData, setTabsData] = useState<TabData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories")
        ]);

        if (prodRes.ok) {
          const dbProducts = await prodRes.json();
          let dbCategories: any[] = [];
          if (catRes.ok) {
            dbCategories = await catRes.json();
          }

          if (Array.isArray(dbProducts) && dbProducts.length > 0) {
            const mappedList: Product[] = dbProducts.map((p: any, idx: number) => {
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
                badge: p.badge || (p.stockQuantity <= 0 ? "Out of Stock" : "Fresh Pack"),
                archClass: theme.archClass,
                badgeBg: theme.badgeBg,
                badgeText: theme.badgeText,
                buttonBorder: theme.buttonBorder,
                imageSrc:
                  p.images && p.images.length > 0
                    ? p.images[0]
                    : "/images/sustento-pouch-strawberry.jpg",
                slug: p.slug,
                category: p.category,
              };
            });

            const dynamicTabs: TabData = {};

            // Map categories from database if present
            if (Array.isArray(dbCategories) && dbCategories.length > 0) {
              dbCategories.forEach((cat: any) => {
                const catKey = cat.name.toUpperCase();
                const filtered = mappedList.filter(
                  (p: any) => p.category && p.category.toLowerCase() === cat.name.toLowerCase()
                );
                if (filtered.length > 0) {
                  dynamicTabs[catKey] = filtered;
                }
              });
            } else {
              // Fallback dynamically from products category field
              dbProducts.forEach((p: any, idx: number) => {
                let catKey = (p.category || "FRUIT SNACKS").toUpperCase();
                if (!dynamicTabs[catKey]) {
                  dynamicTabs[catKey] = [];
                }
                const theme = getProductTheme(p.slug, p.archClass, idx);
                const alreadyAdded = dynamicTabs[catKey].some((item) => item.id === p._id);
                if (!alreadyAdded) {
                  dynamicTabs[catKey].push({
                    id: p._id,
                    title: p.title,
                    subtitle: p.subtitle || "100% natural, crisp nutrition crunch",
                    price: `₹${p.price}`,
                    originalPrice: `₹${p.originalPrice}`,
                    discount:
                      p.originalPrice > p.price
                        ? `${Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF`
                        : "",
                    badge: p.badge || (p.stockQuantity <= 0 ? "Out of Stock" : "Fresh Pack"),
                    archClass: theme.archClass,
                    badgeBg: theme.badgeBg,
                    badgeText: theme.badgeText,
                    buttonBorder: theme.buttonBorder,
                    imageSrc:
                      p.images && p.images.length > 0
                        ? p.images[0]
                        : "/images/sustento-pouch-strawberry.jpg",
                    slug: p.slug,
                  });
                }
              });
            }

            setTabsData(dynamicTabs);
            const keys = Object.keys(dynamicTabs);
            if (keys.length > 0) {
              setActiveTab(keys[0]);
            }
          }
        }
      } catch (err) {
        console.error("ProductTabs fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const tabsList = Object.keys(tabsData);
  const displayProducts = (tabsData[activeTab] || (tabsList.length > 0 ? tabsData[tabsList[0]] : [])).slice(0, 4);
  const isCentered = displayProducts.length > 0 && displayProducts.length < 4;

  if (loading) {
    return (
      <section className="w-full bg-warm-white py-8 px-4 md:py-12 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
        <p className="font-primary font-bold text-xs uppercase tracking-wider text-charcoal/50">
          Loading Menu...
        </p>
      </section>
    );
  }

  if (tabsList.length === 0 || displayProducts.length === 0) {
    return (
      <section className="w-full bg-warm-white py-8 px-4 md:py-12 text-center">
        <p className="font-accent text-lg md:text-[22px] text-body/60 italic">
          Our products are being stocked. Check back soon!
        </p>
      </section>
    );
  }

  return (
    <section className="w-full bg-warm-white py-8 px-4 md:py-12">
      {/* ── Section Header ─────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto relative mb-12 px-4 reveal-text">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1.5 flex-wrap">
            <div className="relative">
              <span className="font-accent text-3xl md:text-[38px] font-bold text-body rotate-[-2deg]">
                We serve
              </span>
              {/* Cursive Sunburst Graphic representation */}
              {/* <div className="w-8 h-8 relative shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-yellow">
                <path d="M50 15 L55 35 L75 30 L60 45 L78 60 L57 60 L62 80 L50 65 L38 80 L43 60 L22 60 L40 45 L25 30 L45 35 Z" />
              </svg>
            </div> */}
              <svg
                viewBox="0 0 40 40"
                className="absolute -top-4 -right-12 w-12 h-12 text-[#9EAB75] fill-current select-none pointer-events-none transform rotate-12"
              >
                <path d="M 8,24 C 7,20 6,15 5,8 C 8,9 11,11 13,13 C 11,17 9,21 8,24 Z" />
                <path d="M 13,18 C 16,15 21,11 26,7 C 27,10 27,14 27,17 C 22,18 17,18 13,18 Z" />
                <path d="M 16,21 C 21,21 27,21 32,22 C 31,24 28,26 26,27 C 22,25 19,23 16,21 Z" />
              </svg>
            </div>
          </div>
          <h2 className="font-primary font-black text-3xl sm:text-[40px] md:text-[49px] text-charcoal leading-tight uppercase tracking-tight">
            PURE FRUITS GOODNESS
          </h2>
        </div>

        {/* View All Button (Desktop) */}
        <div className="absolute right-4 bottom-0 hidden md:block">
          <Link
            href="/collection/all"
            className="group/btn flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-black/10 font-primary text-[12px] md:text-[13px] font-black uppercase tracking-wider !text-dark bg-[#9EAB75] transition-all duration-300 shadow-sm"
          >
            <span>View All</span>
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover/btn:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ── Tabs Navigation ────────────────────────────────────── */}
      {tabsList.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 max-w-[1000px] mx-auto mb-16 px-2 reveal">
          {tabsList.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full font-primary text-[13px] md:text-[15px] font-black uppercase tracking-wider transition-all duration-300 ${isActive
                  ? "bg-[#9EAB75] text-dark shadow-md border border-black/5 -rotate-2 scale-105"
                  : "text-charcoal/80 hover:text-dark hover:border-yellow border-b-2 border-transparent"
                  }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Product Cards Grid ─────────────────────────────────── */}
      <div className={`flex overflow-x-auto scroll-hide gap-6 pb-6 pt-32 snap-x snap-mandatory px-4 max-w-[1200px] mx-auto lg:overflow-visible ${isCentered
        ? "lg:flex lg:flex-wrap lg:justify-center lg:gap-x-8 lg:gap-y-36"
        : "lg:grid lg:grid-cols-4 lg:gap-x-8 lg:gap-y-36"
        }`}>
        {displayProducts.map((product, idx) => (
          <div
            key={product.id}
            className={`reveal-card reveal-delay-${(idx % 4) * 100} group relative flex flex-col justify-between w-[270px] sm:w-[280px] shrink-0 snap-center min-h-[390px] mx-0 lg:mx-auto rounded-t-3xl rounded-b-3xl shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-black/[0.04] p-4 transition-all duration-500 mt-0 bg-gradient-to-b from-white/40 to-transparent backdrop-blur-[2px] ${isCentered
              ? "lg:w-[285px] lg:shrink-0 lg:grow-0"
              : "lg:w-full lg:max-w-[285px] lg:shrink"
              } ${product.archClass}`}
          >

            {/* Top Section: Image, Badge */}
            <div className="relative z-10 flex flex-col items-center w-full pt-8">
              {/* Product Pouch Image container */}
              <Link href={`/products/${product.slug}`} className="group/img relative w-[180px] h-[180px] -mt-[110px] transition-all duration-500 hover:scale-[1.1] hover:-translate-y-2 flex items-center justify-center z-20">
                <Image
                  src={product.imageSrc}
                  alt={product.title}
                  fill
                  sizes="180px"
                  className="object-contain drop-shadow-[0_15px_24px_rgba(0,0,0,0.15)] group-hover/img:drop-shadow-[0_25px_35px_rgba(0,0,0,0.22)] mix-blend-multiply transition-all duration-500"
                  unoptimized={true}
                />

                {/* Floating Badge Sticker */}
                <div className={`absolute -top-1 -right-2 z-20 rounded-full px-3 py-1.5 text-[10px] md:text-[11px] font-black uppercase tracking-wider rotate-12 shadow-md hover:rotate-6 transition-all duration-300 border border-white/40 flex items-center gap-1 ${product.badgeBg} ${product.badgeText}`}>
                  <span>✦</span>
                  <span>{product.badge}</span>
                </div>
              </Link>

              {/* Title & Description */}
              <Link href={`/products/${product.slug}`}>
                <h3 className="mt-3 font-primary text-[16px] font-black text-dark text-center uppercase tracking-tight px-1 hover:underline">
                  {product.title}
                </h3>
              </Link>
              <p className="font-accent text-[15px] font-bold text-body text-center mt-2.5 px-3 leading-tight min-h-[38px] line-clamp-2">
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

              {/* Action Link Button */}
              <Link
                href={`/products/${product.slug}`}
                className={`group/btn relative overflow-hidden flex items-center justify-center gap-2 w-full rounded-full py-3 font-primary text-[13px] font-black uppercase tracking-wider text-charcoal bg-white hover:bg-dark hover:text-white transition-all duration-300 shadow-sm hover:shadow border ${product.buttonBorder}`}
              >
                <span>Choose Options</span>
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
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View All Button (at the bottom) */}
      <div className="flex justify-center mt-12 md:hidden">
        <Link
          href="/collection/all"
          className="group/btn flex items-center gap-1.5 px-8 py-3.5 rounded-full border border-black/10 font-primary text-[15px] font-black uppercase tracking-wider !text-dark bg-[#9EAB75] hover:bg-dark hover:!text-white transition-all duration-300 shadow-md"
        >
          <span>View All</span>
          <svg
            className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
