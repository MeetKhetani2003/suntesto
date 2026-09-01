"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InstagramGrid from "@/components/sections/InstagramGrid";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { getProductTheme } from "@/lib/productThemes";

/* ── Product Data ─────────────────────────────────────────────── */
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
  category: string;
  slug: string;
};

/*
const ALL_PRODUCTS: ProductItem[] = [
  // Fruit Snacks
  {
    id: "all-sn-1", title: "FREEZE-DRIED STRAWBERRY", subtitle: "100% natural, crisp strawberry crunch",
    price: "₹149", originalPrice: "₹180", discount: "17% OFF",
    imageSrc: "/images/sustento-pouch-strawberry.jpg", archClass: "bg-[#F2D1CE]", buttonLabel: "Add To Cart", category: "Fruit Snacks",
    slug: "freeze-dried-strawberry",
  },
  {
    id: "all-sn-2", title: "FREEZE-DRIED MANGO", subtitle: "Deliciously sweet and crispy Alphonso mango slices",
    price: "₹149", originalPrice: "₹180", discount: "17% OFF",
    imageSrc: "/images/sustento-pouch-mango.jpg", archClass: "bg-[#F7EAD7]", buttonLabel: "Add To Cart", category: "Fruit Snacks",
    slug: "freeze-dried-mango",
  },
  {
    id: "all-sn-3", title: "FREEZE-DRIED BANANA", subtitle: "Sweet and crispy natural banana crunchies",
    price: "₹129", originalPrice: "₹150", discount: "14% OFF",
    imageSrc: "/images/sustento-pouch-banana.jpg", archClass: "bg-[#E2EAD7]", buttonLabel: "Add To Cart", category: "Fruit Snacks",
    slug: "freeze-dried-banana",
  },
  {
    id: "all-sn-4", title: "FREEZE-DRIED PINEAPPLE", subtitle: "Tangy and tropical crispy pineapple chunks",
    price: "₹149", originalPrice: "₹180", discount: "17% OFF",
    imageSrc: "/images/sustento-pouch-pineapple.jpg", archClass: "bg-[#E2EAD7]", buttonLabel: "Add To Cart", category: "Fruit Snacks",
    slug: "freeze-dried-pineapple",
  },
  {
    id: "all-sn-5", title: "FREEZE-DRIED LEMON", subtitle: "Zingy, refreshing freeze-dried lemon wedges",
    price: "₹129", originalPrice: "₹150", discount: "14% OFF",
    imageSrc: "/images/sustento-pouch-lemon.jpg", archClass: "bg-[#EAE5DF]", buttonLabel: "Add To Cart", category: "Fruit Snacks",
    slug: "freeze-dried-lemon",
  },
  // Chocolate Dipped
  // {
  //   id: "all-cd-1", title: "CHOCOLATE STRAWBERRY", subtitle: "Freeze-dried strawberries dipped in dark chocolate",
  //   price: "₹199", originalPrice: "₹240", discount: "17% OFF",
  //   imageSrc: "/images/sustento-pouch-chocolate-strawberry.jpg", archClass: "bg-[#EDE8E4]", buttonLabel: "Add To Cart", category: "Fruit Snacks",
  //   slug: "chocolate-strawberry",
  // },
];
*/

const RIBBON_ITEMS = [
  "Anti-oxidants", "Vitamins", "100% Real Fruit", "Good Fats",
  "Plant based", "No added Sugar", "No Preservatives", "Fibre Rich",
  "Anti-oxidants", "Vitamins", "100% Real Fruit", "Good Fats",
  "Plant based", "No added Sugar", "No Preservatives", "Fibre Rich",
];

/* ── Product Card ─────────────────────────────────────────────── */
function ProductCard({ product, index = 0, isCentered = false }: { product: ProductItem; index?: number; isCentered?: boolean }) {
  const { addItem } = useCart();
  const theme = getProductTheme(product.slug, product.archClass);
  const rawPrice = parseInt(product.price.replace("₹", "")) || 0;
  const rawOriginalPrice = parseInt(product.originalPrice.replace("₹", "")) || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    if (product.buttonLabel === "Add To Cart") {
      e.preventDefault();
      e.stopPropagation();
      addItem({
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: rawPrice,
        originalPrice: rawOriginalPrice,
        imageSrc: product.imageSrc,
        variant: "single",
        archClass: theme.archClass,
      }, 1);
    }
  };

  return (
    <div className={`reveal-card reveal-delay-${(index % 4) * 100} group relative flex flex-col justify-between w-[270px] sm:w-[280px] shrink-0 snap-center min-h-[390px] mx-0 lg:mx-auto rounded-t-3xl rounded-b-3xl shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-black/[0.04] p-4 transition-all duration-500 mt-0 bg-gradient-to-b from-white/40 to-transparent backdrop-blur-[2px] ${
      isCentered
        ? "lg:w-[280px] lg:shrink-0 lg:grow-0"
        : "lg:w-full lg:max-w-[280px] lg:shrink"
    } ${theme.archClass}`}>
      {/* Image */}
      <div className="relative z-10 flex flex-col items-center w-full pt-8">
        <Link href={`/products/${product.slug}`} className="group/img relative w-[180px] h-[180px] -mt-[110px] transition-all duration-500 hover:scale-[1.1] hover:-translate-y-2 flex items-center justify-center z-20">
          <Image src={product.imageSrc} alt={product.title} fill sizes="180px"
            className="object-contain drop-shadow-[0_15px_24px_rgba(0,0,0,0.15)] group-hover/img:drop-shadow-[0_25px_35px_rgba(0,0,0,0.22)] mix-blend-multiply transition-all duration-500" unoptimized={true} />
        </Link>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-3 font-primary text-[14px] sm:text-[15px] font-black text-dark text-center uppercase tracking-tight px-1 leading-tight h-10 flex items-center justify-center hover:underline">
            {product.title}
          </h3>
        </Link>
        <p className="font-accent text-[14px] font-bold text-body text-center mt-2 px-3 leading-tight min-h-[38px] line-clamp-2 italic">
          {product.subtitle}
        </p>
      </div>
      {/* Price & Button */}
      <div className="relative z-10 mt-auto w-full">
        <div className="flex items-center justify-center gap-3 py-3 border-t border-black/5 mt-4">
          <span className="font-primary text-[16px] font-black text-dark">{product.price}</span>
          <span className="font-primary text-sm text-charcoal/40 line-through">{product.originalPrice}</span>
          <span className="font-primary text-xs font-black bg-[#CC2828]/10 text-[#CC2828] px-2 py-0.5 rounded-md">{product.discount}</span>
        </div>
        {product.disabled ? (
          <button disabled className="w-full border border-charcoal/10 rounded-full py-3 font-primary text-[13px] font-black uppercase tracking-wider text-charcoal/40 bg-[#FAF9F5] cursor-not-allowed">
            {product.buttonLabel}
          </button>
        ) : product.buttonLabel === "Add To Cart" ? (
          <button 
            onClick={handleAddToCart}
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
}

/* ── FAQ Accordion Component ──────────────────────────────────── */
const FAQS = [
  {
    q: "What is freeze-dried fruit?",
    a: "Freeze-drying is a process where fresh fruit is frozen and then placed in a vacuum, causing the ice to sublimate directly into vapor — preserving up to 95%+ of the nutrients, colour, and natural flavour without any added sugar or preservatives.",
  },
  {
    q: "What does it taste like?",
    a: "It tastes just like fresh fruit — intensely flavourful, naturally sweet, and incredibly crunchy. It's essentially the concentrated essence of real fruit in a light, airy, crispy form.",
  },
  {
    q: "How is this different from sun dried or dehydrated fruits?",
    a: "Sun-dried and dehydrated fruits use heat, which destroys up to 50–80% of nutrients and creates a chewy, sticky texture. Freeze-drying uses no heat, retaining 95%+ of nutrients and giving you a satisfying crunch instead of a chewy texture.",
  },
  {
    q: "Can I use this in recipes?",
    a: "Absolutely! Sustento freeze-dried fruit is perfect for smoothie bowls, yoghurt toppings, oatmeal, baking, trail mixes, or even eaten straight from the pack. The crunch adds a delightful texture to any recipe.",
  },
  {
    q: "Is it safe for kids?",
    a: "Yes! Sustento snacks contain just one ingredient — real fruit. No added sugar, no artificial flavours, no preservatives. They make an ideal healthy snack for children of all ages.",
  },
  {
    q: "How do I eat this?",
    a: "Open the pack and enjoy it as-is for a satisfying crunch. You can also crumble it over yoghurt, cereal, or ice cream. For a softer texture, simply add a few drops of water or toss it into a smoothie.",
  },
  {
    q: "How long does it last?",
    a: "Unopened, our snacks last up to 2 years from the date of manufacture. Once opened, consume within 2–3 days and reseal tightly to maintain freshness and crunch.",
  },
  {
    q: "Does it need refrigeration?",
    a: "No refrigeration needed! Store in a cool, dry place away from direct sunlight. The freeze-drying process removes moisture, making it shelf-stable at room temperature.",
  },
];

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full bg-[#fafaf5] py-16 px-6">
      <div className="max-w-[540px] mx-auto">
        {/* Title */}
        <h2 className="font-primary font-black text-[28px] md:text-[34px] text-dark uppercase tracking-tight text-center mb-10">
          FAQS
        </h2>

        {/* Accordion items */}
        <div className="flex flex-col gap-3">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="border border-[#d6d4cd] rounded-lg overflow-hidden transition-all duration-200"
              >
                {/* Question row */}
                <button
                  id={`faq-btn-${i}`}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-[#fafaf5] transition-colors duration-150 cursor-pointer"
                >
                  <span className="font-primary font-black text-[14px] md:text-[15px] text-dark">
                    {item.q}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`shrink-0 ml-4 w-4 h-4 text-charcoal/60 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                      }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Answer panel */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <p className="font-primary font-bold text-[13px] md:text-[14px] text-body leading-relaxed px-5 pb-5 pt-1 bg-white">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function CollectionsAllPage() {
  const [productsList, setProductsList] = useState<ProductItem[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("default");
  const [loading, setLoading] = useState(true);

  // Dynamic categories computed from loaded categories from admin panel
  const categoriesList = categories.length > 0
    ? ["All", ...categories.map((c) => c.name)]
    : [];

  useEffect(() => {
    if (typeof window !== "undefined" && categories.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category");
      if (catParam) {
        const decoded = decodeURIComponent(catParam).replace(/-/g, " ").toLowerCase();
        const matched = categories.find(
          (c) => c.name?.toLowerCase() === decoded
        );
        if (matched) {
          setSelectedCategory(matched.name);
        }
      }
    }
  }, [categories]);

  useEffect(() => {
    async function fetchCollectionsData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories")
        ]);

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (Array.isArray(prodData)) {
            const mapped: ProductItem[] = prodData.map((p: any, idx: number) => {
              const theme = getProductTheme(p.slug, p.archClass, idx);
              return {
                id: p._id,
                title: p.title,
                subtitle: p.subtitle || "100% natural freeze-dried nutrition",
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
                category: p.category || "Fruit Snacks",
                slug: p.slug,
              };
            });
            setProductsList(mapped);

            const trending = prodData.filter((p: any) => p.isTrending);
            const displayTrending = trending.length > 0 ? trending : prodData;
            const mappedTrending: ProductItem[] = displayTrending.slice(0, 4).map((p: any, idx: number) => {
              const theme = getProductTheme(p.slug, p.archClass, idx);
              return {
                id: p._id,
                title: p.title,
                subtitle: p.subtitle || "100% natural freeze-dried nutrition",
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
                category: p.category || "Fruit Snacks",
                slug: p.slug,
              };
            });
            setTrendingProducts(mappedTrending);
          }
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          if (Array.isArray(catData)) {
            setCategories(catData);
          }
        }
      } catch (err) {
        console.error("Failed to fetch collections page data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCollectionsData();
  }, []);

  const [bannerConfig, setBannerConfig] = useState<{
    desktopImageUrl: string;
    mobileImageUrl: string;
    bannerLink: string;
    isEnabled: boolean;
  } | null>(null);

  useEffect(() => {
    async function fetchBannerConfig() {
      try {
        const res = await fetch("/api/collections-banner");
        if (res.ok) {
          const data = await res.json();
          setBannerConfig(data);
        }
      } catch (err) {
        console.error("Failed to fetch collections banner config:", err);
      }
    }
    fetchBannerConfig();
  }, []);

  const [crunchConfig, setCrunchConfig] = useState<{
    desktopImageUrl: string;
    mobileImageUrl: string;
    isEnabled: boolean;
  } | null>(null);

  useEffect(() => {
    async function fetchCrunchConfig() {
      try {
        const res = await fetch("/api/fruit-meets-crunch");
        if (res.ok) {
          const data = await res.json();
          setCrunchConfig(data);
        }
      } catch (err) {
        console.error("Failed to fetch Fruit Meets Crunch config:", err);
      }
    }
    fetchCrunchConfig();
  }, []);

  const [lifestyleConfig, setLifestyleConfig] = useState<{
    title: string;
    tagline: string;
    buttonText: string;
    buttonLink: string;
    desktopImageUrl: string;
    mobileImageUrl: string;
  } | null>(null);

  useEffect(() => {
    async function fetchLifestyle() {
      try {
        const res = await fetch("/api/lifestyle-banner");
        if (res.ok) {
          const data = await res.json();
          setLifestyleConfig(data);
        }
      } catch (err) {
        console.error("Failed to fetch Lifestyle Banner config:", err);
      }
    }
    fetchLifestyle();
  }, []);

  const [assortedConfig, setAssortedConfig] = useState<{
    title: string;
    tagline: string;
    buttonText: string;
    buttonLink: string;
    desktopImageUrl: string;
    mobileImageUrl: string;
  } | null>(null);

  useEffect(() => {
    async function fetchAssorted() {
      try {
        const res = await fetch("/api/assorted-box");
        if (res.ok) {
          const data = await res.json();
          setAssortedConfig(data);
        }
      } catch (err) {
        console.error("Failed to fetch Assorted Box config:", err);
      }
    }
    fetchAssorted();
  }, []);

  // Sort & Filter logic
  const filteredProducts = productsList.filter((product) => {
    if (selectedCategory === "All") return true;
    return product.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const parsePrice = (priceStr: string) => {
      return parseInt(priceStr.replace(/[₹,]/g, "")) || 0;
    };
    const priceA = parsePrice(a.price);
    const priceB = parsePrice(b.price);
    if (sortOrder === "low-to-high") return priceA - priceB;
    if (sortOrder === "high-to-low") return priceB - priceA;
    return 0; // Default
  });

  return (
    <>
      <Header />

      <main className="w-full bg-[#fffff9] select-none">

        {/* ── HERO SECTION ─────────────────────────────────────── */}
        <section className={`relative w-full bg-[#fafaf8] overflow-hidden flex flex-col ${(bannerConfig && bannerConfig.isEnabled && (bannerConfig.desktopImageUrl || bannerConfig.mobileImageUrl)) ? "" : "min-h-[540px]"}`}>
          {bannerConfig && bannerConfig.isEnabled && (bannerConfig.desktopImageUrl || bannerConfig.mobileImageUrl) ? (
            <div className="relative w-full z-10 pt-20 md:pt-24 flex-1">
              <Link
                href={bannerConfig.bannerLink || "#"}
                className={bannerConfig.bannerLink ? "cursor-pointer block w-full h-full" : "cursor-default block w-full h-full"}
              >
                {bannerConfig.desktopImageUrl && (
                  <div className="relative w-full aspect-[21/9] hidden md:block overflow-hidden">
                    <Image
                      src={bannerConfig.desktopImageUrl}
                      alt="Collections Banner Desktop"
                      fill
                      priority
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                {bannerConfig.mobileImageUrl && (
                  <div className="relative w-full aspect-[4/5] md:hidden overflow-hidden">
                    <Image
                      src={bannerConfig.mobileImageUrl}
                      alt="Collections Banner Mobile"
                      fill
                      priority
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </Link>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-[1280px] mx-auto px-8 pt-32 pb-0 gap-8 flex-1">

              {/* LEFT — Headline */}
              <div className="flex flex-col items-start justify-center shrink-0 z-20 max-w-[340px] pb-12">
                <h1 className="font-primary font-black text-[52px] sm:text-[68px] md:text-[80px] text-dark leading-[0.92] uppercase tracking-[-1px] select-none">
                  WORLD&apos;S<br />
                  LIGHTEST<br />
                  SNACK
                </h1>
                {/* Yellow hand-drawn underline */}
                <div className="relative mt-5 w-[240px] h-[10px]">
                  <svg viewBox="0 0 240 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M4 6.5 C60 2, 120 9, 180 5 S220 2, 236 5" stroke="#9EAB75" strokeWidth="6" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
              </div>

              {/* CENTER — Product Collage */}
              <div className="relative flex-1 flex items-end justify-center min-h-[360px] md:min-h-[460px] w-full z-10">
                {/* Large center pouch */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] md:w-[240px] aspect-[3/4] drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] z-10">
                  <Image src="/images/sustento-pouch-mango.jpg" alt="Mango pouch" fill sizes="240px" className="object-contain" />
                </div>
                {/* Left-back pouch */}
                <div className="absolute bottom-12 left-[8%] md:left-[12%] w-[130px] md:w-[170px] aspect-[3/4] drop-shadow-[0_16px_32px_rgba(0,0,0,0.10)] z-0 rotate-[-8deg]">
                  <Image src="/images/sustento-pouch-strawberry.jpg" alt="Strawberry pouch" fill sizes="170px" className="object-contain" />
                </div>
                {/* Right-back pouch */}
                <div className="absolute bottom-10 right-[8%] md:right-[12%] w-[120px] md:w-[155px] aspect-[3/4] drop-shadow-[0_16px_32px_rgba(0,0,0,0.10)] z-0 rotate-[8deg]">
                  <Image src="/images/sustento-pouch-pineapple.jpg" alt="Pineapple pouch" fill sizes="155px" className="object-contain" />
                </div>
                {/* Far-left small pouch */}
                <div className="hidden md:block absolute bottom-6 left-[2%] w-[130px] aspect-[3/4] drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)] z-0 rotate-[-15deg]">
                  <Image src="/images/sustento-pouch-banana.jpg" alt="Banana pouch" fill sizes="130px" className="object-contain" />
                </div>
                {/* Far-right box */}
                <div className="hidden md:block absolute bottom-4 right-[2%] w-[160px] aspect-[3/4] drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)] z-0 rotate-[12deg]">
                  <Image src="/images/sustento-pouch-chocolate-strawberry.jpg" alt="Chocolate Strawberry pouch" fill sizes="160px" className="object-contain" />
                </div>

              </div>

              {/* RIGHT — 100% real fruit text (matches reference) */}
              <div className="hidden md:flex flex-col items-end justify-end shrink-0 max-w-[240px] pb-14 z-20">
                <span className="font-primary font-black text-[22px] text-dark leading-tight text-right">
                  100% real fruit<br />
                  <span className="text-charcoal/50 font-bold text-[16px]">& nothing else</span>
                </span>
              </div>

            </div>
          )}

          {/* ── Yellow Ribbon ─────────────────────────────────── */}
          <div className="relative w-full overflow-hidden bg-[#9EAB75] h-[52px] flex items-center mt-auto shrink-0">
            <div className="flex animate-[marquee_28s_linear_infinite] whitespace-nowrap items-center gap-0">
              {RIBBON_ITEMS.map((item, i) => (
                <span key={i} className="font-accent font-bold text-[16px] text-dark/90 px-5 italic shrink-0">
                  {item} <span className="mx-2 text-dark/50">✦</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── FRUIT MEETS CRUNCH SECTION ────────────────────────── */}
        <section className="relative w-full overflow-hidden bg-[#f9f8f3]">
          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between min-h-[420px] px-6 md:px-16 gap-0">

            {/* LEFT — Dynamic or Static Collage */}
            <div className="relative flex-1 flex items-center justify-center min-h-[360px] md:min-h-[440px] w-full max-w-[520px] shrink-0">
              {crunchConfig && crunchConfig.isEnabled && (crunchConfig.desktopImageUrl || crunchConfig.mobileImageUrl) ? (
                <>
                  {/* Desktop Image */}
                  {crunchConfig.desktopImageUrl && (
                    <div className="hidden md:block absolute inset-0 w-full h-full">
                      <Image
                        src={crunchConfig.desktopImageUrl}
                        alt="Fruit Meets Crunch Desktop collage layout"
                        fill
                        sizes="520px"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  )}
                  {/* Mobile Image */}
                  {crunchConfig.mobileImageUrl ? (
                    <div className="block md:hidden absolute inset-0 w-full h-full">
                      <Image
                        src={crunchConfig.mobileImageUrl}
                        alt="Fruit Meets Crunch Mobile collage layout"
                        fill
                        sizes="520px"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : crunchConfig.desktopImageUrl ? (
                    <div className="block md:hidden absolute inset-0 w-full h-full">
                      <Image
                        src={crunchConfig.desktopImageUrl}
                        alt="Fruit Meets Crunch Desktop collage layout"
                        fill
                        sizes="520px"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  {/* Back / upper pouch — Strawberry, tilted left */}
                  <div
                    className="absolute top-[8%] left-[18%] w-[160px] md:w-[190px] aspect-[3/4] z-10 drop-shadow-[0_16px_36px_rgba(0,0,0,0.13)]"
                    style={{ transform: "rotate(-18deg) translateY(10px)" }}
                  >
                    <Image src="/images/sustento-pouch-strawberry.jpg" alt="Strawberry snack pouch" fill sizes="190px" className="object-contain" />
                  </div>

                  {/* Front / lower pouch — Pineapple, tilted right */}
                  <div
                    className="absolute bottom-[4%] right-[12%] w-[170px] md:w-[205px] aspect-[3/4] z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.14)]"
                    style={{ transform: "rotate(10deg) translateY(-10px)" }}
                  >
                    <Image src="/images/sustento-pouch-pineapple.jpg" alt="Pineapple snack pouch" fill sizes="205px" className="object-contain" />
                  </div>
                </>
              )}
            </div>

            {/* RIGHT — Headline copy */}
            <div className="flex-1 flex flex-col items-start justify-center pb-12 md:pb-0 max-w-[420px] z-20">
              {/* "FRUIT MEETS" — Montserrat Black */}
              <div className="font-primary font-black text-[52px] sm:text-[64px] md:text-[72px] text-dark leading-[0.9] uppercase tracking-[-1.5px] select-none">
                FRUIT<br />
                MEETS
              </div>

              {/* "Crunch" — Kalam script yellow */}
              <div className="relative mt-1 select-none">
                <span
                  className="font-accent font-bold text-[58px] sm:text-[72px] md:text-[84px] leading-none"
                  style={{ color: "#9EAB75", letterSpacing: "-1px" }}
                >
                  Crunch
                </span>
                {/* Scattered dot accent top-right of Crunch */}
                <div className="absolute -top-3 -right-4 flex gap-[3px] opacity-70">
                  {[...Array(6)].map((_, i) => (
                    <span
                      key={i}
                      className="block rounded-full bg-[#9EAB75]"
                      style={{ width: `${3 + (i % 2)}px`, height: `${3 + (i % 2)}px`, opacity: 0.5 + i * 0.08 }}
                    />
                  ))}
                </div>
              </div>

              {/* Tagline */}
              <p className="mt-5 font-accent text-[15px] sm:text-[16px] font-bold text-charcoal/70 leading-relaxed max-w-[300px] italic text-left">
                Nature&apos;s simple gift, packed with nutrition, crafted without compromise. The world&apos;s lightest &amp; healthiest snack.
              </p>
            </div>

          </div>
        </section>

        {/* ── FILTER CATEGORY TABS ──────────────────────────────── */}
        <section className="w-full bg-[#fffff9] py-8 px-6 border-b border-black/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-[1200px] mx-auto w-full">
            
            {/* Category tabs */}
            <div className="flex items-center gap-3 flex-wrap">
              {categoriesList.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`font-primary font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-full border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-dark text-white border-dark shadow-md"
                        : "border-charcoal/20 bg-white text-charcoal hover:bg-dark hover:text-white hover:border-dark"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Price Sort Control */}
            <div className="flex items-center gap-3">
              <span className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50">Sort By:</span>
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="appearance-none font-primary font-black text-xs uppercase tracking-wider bg-white border-2 border-charcoal/10 hover:border-charcoal/30 rounded-full pl-5 pr-10 py-2.5 text-charcoal focus:outline-none focus:border-dark transition-all duration-200 cursor-pointer"
                >
                  <option value="default">Featured</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                </select>
                {/* Custom arrow indicator */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal/50">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── ALL PRODUCTS GRID ─────────────────────────────────── */}
        <section className="w-full py-16 px-6 bg-warm-white">
          <div className="max-w-[1280px] mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
                <p className="font-primary font-bold text-xs uppercase tracking-wider text-charcoal/50">
                  Loading Products...
                </p>
              </div>
            ) : productsList.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-black/5 shadow-sm">
                <p className="font-accent text-lg md:text-[22px] text-body/60 italic">
                  No products found in the collection.
                </p>
              </div>
            ) : (
              Array.from(new Set(sortedProducts.map((p) => p.category).filter(Boolean)))
                .filter((category) => selectedCategory === "All" || selectedCategory.toLowerCase() === category.toLowerCase())
                .map((category) => {
                  const categoryProducts = sortedProducts.filter((p) => p.category === category);
                  if (categoryProducts.length === 0) return null;
                  return (
                    <div key={category} className="mb-20">
                      {/* Category Header */}
                      <div className="text-center mb-14 reveal-text">
                        <h2 className="font-primary font-black text-xl sm:text-2xl md:text-[32px] text-charcoal uppercase tracking-tight relative inline-block">
                          {category}
                          <span className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-[100px] h-[4px] bg-[#9EAB75] rounded-full" />
                        </h2>
                      </div>
                      {/* Products */}
                      {(() => {
                        const isCentered = categoryProducts.length > 0 && categoryProducts.length < 4;
                        return (
                          <div className={`flex overflow-x-auto scroll-hide gap-6 pb-6 pt-32 snap-x snap-mandatory px-2 -mx-2 sm:px-4 sm:-mx-4 lg:px-0 lg:mx-0 lg:overflow-visible ${
                            isCentered
                              ? "lg:flex lg:flex-wrap lg:justify-center lg:gap-x-8 lg:gap-y-36"
                              : "lg:grid lg:grid-cols-4 lg:gap-x-8 lg:gap-y-36"
                          }`}>
                            {categoryProducts.map((product, idx) => (
                              <ProductCard key={product.id} product={product} index={idx} isCentered={isCentered} />
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  );
                })
            )}
          </div>
        </section>

        {/* ── REAL FRUIT. UNREAL SNACK. LIFESTYLE BANNER ────────── */}
        <section className="relative w-full overflow-hidden bg-[#f5f0e8] min-h-[520px] md:min-h-[600px]">
          {/* Full-bleed layout */}
          <div className="relative w-full h-full flex flex-col md:flex-row items-stretch min-h-[520px] md:min-h-[600px]">

            {/* LEFT — Lifestyle image panel (65% width) */}
            <div className="relative w-full md:w-[64%] min-h-[340px] md:min-h-[600px] overflow-hidden bg-[#ece8df]">
              {/* Desktop Image */}
              {lifestyleConfig?.desktopImageUrl ? (
                <div className="hidden md:block absolute inset-0">
                  <Image
                    src={lifestyleConfig.desktopImageUrl}
                    alt="Lifestyle Banner"
                    fill
                    sizes="65vw"
                    className="object-cover"
                    unoptimized={true}
                  />
                </div>
              ) : (
                /* Fallback gradient if no image */
                <div
                  className="hidden md:block absolute inset-0"
                  style={{
                    background: "linear-gradient(160deg, #e8d9c4 0%, #d4b898 28%, #c9a882 55%, #e2d5c0 80%, #f0ece3 100%)",
                  }}
                />
              )}

              {/* Mobile Image */}
              {lifestyleConfig?.mobileImageUrl ? (
                <div className="block md:hidden absolute inset-0">
                  <Image
                    src={lifestyleConfig.mobileImageUrl}
                    alt="Lifestyle Banner Mobile"
                    fill
                    sizes="100vw"
                    className="object-cover"
                    unoptimized={true}
                  />
                </div>
              ) : (
                /* Fallback if no mobile image */
                <div
                  className="block md:hidden absolute inset-0"
                  style={{
                    background: "linear-gradient(160deg, #e8d9c4 0%, #d4b898 28%, #c9a882 55%, #e2d5c0 80%, #f0ece3 100%)",
                  }}
                />
              )}
            </div>

            {/* RIGHT — Copy panel (35% width) */}
            <div className="relative w-full md:w-[36%] flex flex-col justify-end items-start px-8 md:px-12 py-12 md:py-16 bg-[#f5f0e8]">
              {/* Headline */}
              <h2 className="font-primary font-black text-[40px] sm:text-[52px] md:text-[60px] text-dark uppercase leading-[0.88] tracking-[-1.5px] select-none">
                {lifestyleConfig?.title ? (
                  lifestyleConfig.title.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < lifestyleConfig.title.split("\n").length - 1 && <br />}
                    </span>
                  ))
                ) : (
                  <>
                    REAL FRUIT.<br />
                    UNREAL SNACK.
                  </>
                )}
              </h2>
              {/* Script tagline */}
              <p className="mt-5 font-accent font-bold text-[22px] sm:text-[26px] text-[#9EAB75] italic leading-snug select-none">
                {lifestyleConfig?.tagline || "Just one ingredient. That's it."}
              </p>
              {/* Optional CTA nudge */}
              <Link
                href={lifestyleConfig?.buttonLink || "/collections/all"}
                className="mt-8 inline-flex items-center gap-2 font-primary font-black text-[13px] uppercase tracking-wider text-dark border-b-2 border-[#9EAB75] pb-0.5 hover:border-dark transition-colors duration-200 group"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {lifestyleConfig?.buttonText || "Explore All Products"}
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

          </div>
        </section>

        {/* ── MAKE YOUR ASSORTED BOX ────────────────────────────── */}
        <section className="relative w-full overflow-hidden min-h-[380px] md:min-h-[440px]">
          {/* Diagonal split background */}
          {/* Top-left amber panel */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background: "#F5D990",
              clipPath: "polygon(0 0, 100% 0, 55% 100%, 0 100%)",
            }}
          />
          {/* Bottom-right cream panel */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background: "#FAF6ED",
              clipPath: "polygon(55% 100%, 100% 0, 100% 100%)",
            }}
          />

          {/* Content row */}
          <div className="relative z-10 max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between min-h-[380px] md:min-h-[440px] px-8 md:px-16 gap-8">

            {/* LEFT — Copy */}
            <div className="flex flex-col items-start justify-center shrink-0 max-w-[340px] py-14">
              <h2 className="font-primary font-black text-[36px] sm:text-[44px] md:text-[52px] text-dark uppercase leading-[0.9] tracking-[-1px] select-none">
                {assortedConfig?.title ? (
                  assortedConfig.title.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < assortedConfig.title.split("\n").length - 1 && <br />}
                    </span>
                  ))
                ) : (
                  <>
                    MAKE YOUR<br />
                    ASSORTED BOX
                  </>
                )}
              </h2>
              {/* Kalam script tagline */}
              <div className="mt-4 relative">
                <p className="font-accent font-bold text-[20px] sm:text-[22px] text-dark/80 italic leading-tight">
                  {assortedConfig?.tagline ? (
                    assortedConfig.tagline.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < assortedConfig.tagline.split("\n").length - 1 && <br />}
                      </span>
                    ))
                  ) : (
                    <>
                      Try out our top 5<br />favorites
                    </>
                  )}
                </p>
                {/* Green underline squiggle */}
                <svg viewBox="0 0 160 8" fill="none" xmlns="http://www.w3.org/2000/svg"
                  className="mt-1 w-[160px] h-[8px]">
                  <path d="M2 5 C40 1, 80 7, 120 4 S148 2, 158 4"
                    stroke="#9EAB75" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              {/* CTA button */}
              <Link
                href={assortedConfig?.buttonLink || "/collections/all"}
                className="mt-8 bg-[#9EAB75] text-dark font-primary font-black text-[15px] uppercase tracking-wider px-8 py-3.5 rounded-full hover:bg-dark hover:text-white transition-colors duration-200 shadow-md"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {assortedConfig?.buttonText || "Shop Now"}
              </Link>
            </div>

            {/* RIGHT — Banner Image */}
            <div className="relative flex-1 w-full min-h-[320px] md:min-h-[420px] rounded-2xl overflow-hidden self-stretch my-4 md:my-8">
              {/* Desktop Image */}
              {assortedConfig?.desktopImageUrl ? (
                <div className={assortedConfig.mobileImageUrl ? "hidden md:block absolute inset-0" : "absolute inset-0"}>
                  <Image
                    src={assortedConfig.desktopImageUrl}
                    alt="Assorted Box Banner"
                    fill
                    sizes="50vw"
                    className="object-cover"
                    unoptimized={true}
                  />
                </div>
              ) : null}

              {/* Mobile Image */}
              {assortedConfig?.mobileImageUrl ? (
                <div className={assortedConfig.desktopImageUrl ? "block md:hidden absolute inset-0" : "absolute inset-0"}>
                  <Image
                    src={assortedConfig.mobileImageUrl}
                    alt="Assorted Box Banner Mobile"
                    fill
                    sizes="100vw"
                    className="object-cover"
                    unoptimized={true}
                  />
                </div>
              ) : null}

              {/* Fallback if no images configured at all */}
              {!assortedConfig?.desktopImageUrl && !assortedConfig?.mobileImageUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                  <span className="text-xs font-semibold text-charcoal/40">No banner image configured</span>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ── COMPARISON TABLE ──────────────────────────────────── */}
        <section className="relative w-full bg-[#fafaf5] py-16 px-4 overflow-hidden">



          {/* Table */}
          <div className="max-w-[860px] mx-auto relative z-20 w-full overflow-x-auto pb-2 custom-scrollbar">
            <div className="min-w-[540px] md:min-w-0 px-1">
              <table className="w-full border-collapse font-primary text-[13px] md:text-[14px]">

              {/* ── Header Row ── */}
              <thead>
                <tr>
                  {/* Row-label column spacer */}
                  <th className="w-[28%] pb-6" />

                  {/* Sustento column header */}
                  <th className="w-[24%] pb-0 align-bottom">
                    <div className="bg-[#9EAB75] rounded-t-2xl px-4 pt-5 pb-4 flex flex-col items-center">
                      <span className="font-primary font-black text-[22px] md:text-[28px] text-dark italic tracking-[-0.5px] leading-none uppercase">
                        sustento
                      </span>
                      <span className="font-primary font-bold text-[9px] uppercase tracking-[2px] text-dark/60 mt-1">
                        FREEZE-DRIED FRUIT
                      </span>
                    </div>
                  </th>

                  {/* Alternatives column header */}
                  <th className="w-[24%] pb-6 align-bottom text-center px-3">
                    <span className="font-primary font-black text-[12px] md:text-[13px] uppercase tracking-wide text-charcoal leading-tight">
                      ALTERNATIVES<br />
                      <span className="font-bold text-[11px] text-body normal-case tracking-normal">(Sun-Dried)</span>
                    </span>
                  </th>

                  {/* Other Snacks column header */}
                  <th className="w-[24%] pb-6 align-bottom text-center px-3">
                    <span className="font-primary font-black text-[12px] md:text-[13px] uppercase tracking-wide text-charcoal leading-tight">
                      OTHER SNACKS<br />
                      <span className="font-bold text-[11px] text-body normal-case tracking-normal">(Chips, Namkeens)</span>
                    </span>
                  </th>
                </tr>
              </thead>

              {/* ── Body Rows ── */}
              <tbody>
                {[
                  { label: "Nutrients", sustento: "Retained (95%+)", alt: "Moderate", other: "Low" },
                  { label: "Additives", sustento: "None", alt: "Sometimes", other: "Yes" },
                  { label: "Artificial Flavour", sustento: "No", alt: "No", other: "Yes" },
                  { label: "Preservatives", sustento: "No", alt: "Sometimes", other: "Yes" },
                  { label: "Added Sugar", sustento: "None", alt: "Present", other: "High" },
                  { label: "Shelf Life", sustento: "2 Years", alt: "6-12 Months", other: "6-12 Months" },
                  { label: "Taste", sustento: "Natural, Crunchy", alt: "Sweet, Chewy", other: "Artificially Flavoured" },
                  { label: "Healthy", sustento: "Yes", alt: "Moderate", other: "No", lastRow: true },
                ].map((row, i) => (
                  <tr key={i} className="border-t border-black/[0.06]">
                    {/* Row label */}
                    <td className="py-3.5 pr-4 font-black text-dark text-[13px] md:text-[14px] whitespace-nowrap">
                      {row.label}
                    </td>
                    {/* Sustento cell — amber highlight */}
                    <td
                      className={`py-3.5 px-4 text-center font-bold text-dark text-[13px] md:text-[14px] bg-[#9EAB75] ${(row as { lastRow?: boolean }).lastRow ? "rounded-b-2xl" : ""
                        }`}
                    >
                      {row.sustento}
                    </td>
                    {/* Alternatives cell */}
                    <td className="py-3.5 px-3 text-center font-bold text-body text-[13px] md:text-[14px]">
                      {row.alt}
                    </td>
                    {/* Other Snacks cell */}
                    <td className="py-3.5 px-3 text-center font-bold text-body text-[13px] md:text-[14px]">
                      {row.other}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </section>

        {/* ── FAQS SECTION ─────────────────────────────────────── */}
        <FaqSection />

        {/* ── PEOPLE FREQUENTLY BOUGHT TOGETHER ────────────────── */}
        <section className="w-full bg-[#fafaf5] py-16 px-6">
          <div className="max-w-[1100px] mx-auto">

            {/* Title */}
            <div className="text-center mb-14">
              <h2 className="font-primary font-black text-[20px] sm:text-[24px] md:text-[28px] text-dark uppercase tracking-tight inline-block relative">
                OUR BEST SELLERS & TRENDING.
                {/* Green underline */}
                <span className="absolute left-0 right-0 bottom-[-4px] h-[3px] bg-[#9EAB75] rounded-full" />
              </h2>
            </div>

            {/* 4-column product row */}
            {(() => {
              const isCentered = trendingProducts.length > 0 && trendingProducts.length < 4;
              return (
                <div className={`flex overflow-x-auto scroll-hide gap-6 pb-6 pt-32 snap-x snap-mandatory px-4 max-w-[1200px] mx-auto lg:overflow-visible ${
                  isCentered
                    ? "lg:flex lg:flex-wrap lg:justify-center lg:gap-x-8 lg:gap-y-36"
                    : "lg:grid lg:grid-cols-4 lg:gap-x-8 lg:gap-y-36"
                }`}>
                  {trendingProducts.map((p, idx) => (
                    <ProductCard key={p.id} product={p} index={idx} isCentered={isCentered} />
                  ))}
                </div>
              );
            })()}

            {/* Explore collections CTA */}
            <div className="text-center mt-14">
              <Link
                href="/collections"
                className="inline-block font-accent font-bold text-[20px] sm:text-[22px] text-[#E8A825] italic border-b-2 border-[#E8A825] pb-0.5 hover:text-dark hover:border-dark transition-colors duration-200"
              >
                Explore collections
              </Link>
            </div>

          </div>
        </section>

        {/* ── ON THE #GRAM INSTAGRAM GRID ───────────────────────── */}
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
