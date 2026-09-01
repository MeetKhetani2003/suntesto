"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InstagramGrid from "@/components/sections/InstagramGrid";
import PureJoyLifestyle from "@/components/sections/PureJoyLifestyle";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { getProductTheme } from "@/lib/productThemes";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ── Glossary Data ───────────────────────────────────────────── */
type IngredientGroup = {
  letter: string;
  items: string[];
};

type TabData = {
  [key in "smoothies" | "snacks" | "spreads"]: IngredientGroup[];
};

const INGREDIENTS_DATA: TabData = {
  smoothies: [
    { letter: "A", items: ["Activated Cashew Butter", "Almond Milk", "Apple"] },
    { letter: "B", items: ["Banana", "Blue Spirulina"] },
    { letter: "C", items: ["Cherry", "Cocoa Powder"] },
    { letter: "D", items: ["Dates", "Dragon Fruit"] },
    { letter: "F", items: ["Fresh Ginger"] },
    { letter: "K", items: ["Kiwi"] },
    { letter: "L", items: ["Lemon Juice", "Lemongrass", "Lime Juice"] },
    { letter: "M", items: ["Mango", "Matcha Powder"] },
    { letter: "O", items: ["Orange"] },
    { letter: "P", items: ["Pineapple"] },
    { letter: "R", items: ["Raspberries"] },
    { letter: "S", items: ["Spinach Leaves", "Strawberries", "Sweet Potato"] },
    { letter: "T", items: ["Turmeric"] },
  ],
  snacks: [
    { letter: "A", items: ["Apple"] },
    { letter: "B", items: ["Blueberry"] },
    { letter: "G", items: ["Green Apple"] },
    { letter: "K", items: ["Kala Jamun"] },
    { letter: "M", items: ["Mango", "Mulberry"] },
    { letter: "P", items: ["Pear", "Pineapple"] },
    { letter: "S", items: ["Strawberry"] },
  ],
  spreads: [
    { letter: "A", items: ["Activated Almonds", "Activated Cashews", "Allulose"] },
    { letter: "B", items: ["Butterfly Pea Flower"] },
    { letter: "C", items: ["Cocoa Nibs", "Cocoa Powder", "Coconut"] },
    { letter: "F", items: ["Freeze-Dried Mangoes", "Freeze-Dried Pineapple", "Freeze-Dried Strawberries"] },
    { letter: "G", items: ["Grapeseed Oil"] },
    { letter: "J", items: ["Japanese Matcha Powder"] },
    { letter: "N", items: ["Natural Vanilla"] },
    { letter: "R", items: ["Roasted Hazelnuts"] },
    { letter: "S", items: ["Sprouted Peanuts", "Stevia", "Sunflower Lecithin"] },
    { letter: "V", items: ["Vanilla Extract"] },
  ],
};

/* ── Exclusions Data ─────────────────────────────────────────── */
type ExcludeItem = {
  id: string;
  title: string;
  description: string;
};

const EXCLUSIONS_DATA: ExcludeItem[] = [
  {
    id: "ex-1",
    title: "Added Sugars",
    description: "We never add refined or processed sugars. The only sweetness in our products comes from whole fruits or minimal natural sweeteners like dates and stevia. No agave nectar, corn syrup, dextrose, fructose, glucose, high-fructose corn syrup, honey, maltose, maple syrup, molasses, rice syrup, or sucrose."
  },
  {
    id: "ex-2",
    title: "Anti-Caking Agents",
    description: "We do not use anti-caking agents to prevent clumping. Our powdered and freeze-dried ingredients are kept free of chemical flow agents like silicon dioxide, tricalcium phosphate, or sodium aluminosilicate."
  },
  {
    id: "ex-3",
    title: "Artificial Sweeteners",
    description: "Zero artificial sweeteners like aspartame, sucralose, saccharin, acesulfame potassium, or neotame. We trust only real fruit and natural extracts for sweetness."
  },
  {
    id: "ex-4",
    title: "Colouring Agents",
    description: "No synthetic food dyes or artificial colouring agents. All vibrant colours in our products come directly from the natural pigments of whole fruits and superfoods like blue spirulina."
  },
  {
    id: "ex-5",
    title: "Emulsifiers",
    description: "We exclude artificial emulsifiers like polysorbates, carboxymethylcellulose, and carrageenan. Any texture holding is done using wholesome organic nut butter fats."
  },
  {
    id: "ex-6",
    title: "Fat Replacers",
    description: "We do not add synthetic fat replacers or modified starches. The natural fats in our activated almonds, cashews, and coconuts provide the richness."
  },
  {
    id: "ex-7",
    title: "Preservatives",
    description: "100% free of artificial preservatives like sodium benzoate, potassium sorbate, sulfur dioxide, or BHA/BHT. We preserve foods naturally using freeze-drying technology which removes water and locks in freshness."
  },
  {
    id: "ex-8",
    title: "Stabilisers, Thickeners & Binders",
    description: "We say no to xanthan gum, guar gum, gellan gum, or modified food starch. The structure of our spreads is achieved purely by slow cold-milling of whole nuts."
  },
  {
    id: "ex-9",
    title: "Nutritional Additives",
    description: "We do not fortify our foods with synthetic vitamins or minerals. We believe in getting nutrients from organic raw food sources in their natural, bioavailable state."
  },
  {
    id: "ex-10",
    title: "Firming Agents",
    description: "We exclude firming agents like calcium chloride. The firm, crunchy texture of our whole fruit snacks is preserved purely through advanced freeze-drying."
  }
];

/* ── Frequently Bought Data ───────────────────────────────────── */
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

const BOUGHT_PRODUCTS_FALLBACK: ProductItem[] = [];



interface IAboutHeroSlide {
  imageUrl: string;
  title: string;
  description: string;
  titleColor: string;
}

interface IAboutVideoConfig {
  heading: string;
  videoUrl: string;
  description: string;
}

export default function AboutUsPage() {
  const [activeTab, setActiveTab] = useState<"smoothies" | "snacks" | "spreads">("smoothies");
  const [expandedId, setExpandedId] = useState<string | null>("ex-1");
  const [boughtProducts, setBoughtProducts] = useState<ProductItem[]>(BOUGHT_PRODUCTS_FALLBACK);
  const [ingredientsData, setIngredientsData] = useState<TabData>(INGREDIENTS_DATA);
  const [slides, setSlides] = useState<IAboutHeroSlide[]>([]);
  const [slidesLoading, setSlidesLoading] = useState(true);
  const [videoConfig, setVideoConfig] = useState<IAboutVideoConfig | null>(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchAboutHero() {
      try {
        const res = await fetch("/api/about-hero");
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.slides)) {
            setSlides(data.slides);
          }
        }
      } catch (err) {
        console.error("Failed to load About Us Hero slider details", err);
      } finally {
        setSlidesLoading(false);
      }
    }
    fetchAboutHero();
  }, []);

  useEffect(() => {
    async function fetchAboutVideo() {
      try {
        const res = await fetch("/api/about-video");
        if (res.ok) {
          const data = await res.json();
          setVideoConfig(data);
        }
      } catch (err) {
        console.error("Failed to load About Us Video config", err);
      } finally {
        setVideoLoading(false);
      }
    }
    fetchAboutVideo();
  }, []);

  useEffect(() => {
    async function fetchIngredients() {
      try {
        const res = await fetch("/api/what-we-put-in");
        if (res.ok) {
          const data = await res.json();
          if (data && (data.smoothies || data.snacks || data.spreads)) {
            setIngredientsData({
              smoothies: data.smoothies || [],
              snacks: data.snacks || [],
              spreads: data.spreads || [],
            });
          }
        }
      } catch (err) {
        console.error("Failed to load ingredients glossary from database", err);
      }
    }
    fetchIngredients();
  }, []);


  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const bestSellers = data.filter((p: any) => p.isBestSeller);
            const displayList = bestSellers.length > 0 ? bestSellers : data;
            const mapped: ProductItem[] = displayList.slice(0, 4).map((p: any, idx: number) => {
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
            setBoughtProducts(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to load products on about-us page", err);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || slides.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector(".about-img_text");
    if (!section) return;

    // Set initial states for all slides
    slides.forEach((_, idx) => {
      const img = document.querySelector(`.imgblock-${idx}`);
      const text = document.querySelector(`.textblock-${idx}`);
      if (img && text) {
        gsap.set(img, { scale: idx === 0 ? 1 : 0.8, opacity: idx === 0 ? 1 : 0, zIndex: idx === 0 ? 2 : 1 });
        gsap.set(text, { opacity: idx === 0 ? 1 : 0, zIndex: idx === 0 ? 2 : 1 });
      }
    });

    if (slides.length <= 1) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${(slides.length - 1) * 450}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
      }
    });

    for (let i = 0; i < slides.length - 1; i++) {
      const currentImg = document.querySelector(`.imgblock-${i}`);
      const nextImg = document.querySelector(`.imgblock-${i + 1}`);
      const currentText = document.querySelector(`.textblock-${i}`);
      const nextText = document.querySelector(`.textblock-${i + 1}`);

      if (currentImg && nextImg && currentText && nextText) {
        tl.to(currentImg, { scale: 0.8, opacity: 0, ease: "none" }, i)
          .to(nextImg, { scale: 1, opacity: 1, ease: "none" }, i)
          .to(currentText, { opacity: 0, ease: "none" }, i)
          .to(nextText, { opacity: 1, ease: "none" }, i);
      }
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [slides]);

  return (
    <>
      {/* ── Navbar Header ───────────────────────────────────── */}
      <Header />
      
      <main className="w-full bg-[#fffff9]">
        
        {/* ── About Us Hero Section ───────────────────────────── */}
        <section className="about-img_text relative w-full overflow-hidden select-none min-h-[580px] bg-[#fffff9] pt-32 pb-16 flex items-center">
          <div className="w-full max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Slogans (cols 4) */}
            <div className="lg:col-span-4 flex flex-col items-start text-left">
              <span className="font-primary font-bold text-sm tracking-widest text-charcoal/70 uppercase">
                WE ARE REDEFINING
              </span>
              <h1 className="font-primary font-black text-charcoal leading-none uppercase tracking-tight text-[56px] sm:text-[76px] md:text-[90px] mt-1 select-none">
                REAL
              </h1>
              <h2 className="relative font-primary font-black text-charcoal leading-none uppercase tracking-tight text-[24px] sm:text-[32px] md:text-[38px] mt-3">
                HEALTHY SNACK
                {/* Underline */}
                <span className="absolute left-0 bottom-[-4px] w-full h-[5px] bg-[#9EAB75] rounded-full" />
              </h2>
            </div>

            {/* Center Column: Dynamic Pouch Mockups (cols 5) */}
            <div className="lg:col-span-5 relative w-full flex items-center justify-center py-6">
              {slidesLoading ? (
                <div className="w-10 h-10 border-4 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="about-img_text_media relative w-full max-w-[560px] aspect-square overflow-hidden mix-blend-multiply">
                  {slides.map((slide, idx) => (
                    <div key={idx} className={`imgblock-${idx} absolute inset-0 w-full h-full`}>
                      {slide.imageUrl && (
                        <Image
                          src={slide.imageUrl}
                          alt={slide.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 600px"
                          className="object-contain"
                          priority={idx === 0}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Dynamic Slide Text Blocks (cols 3) */}
            <div className="lg:col-span-3 relative w-full min-h-[140px] flex flex-col justify-start lg:pl-4 text-left">
              {!slidesLoading && slides.map((slide, idx) => (
                <div key={idx} className={`textblock-${idx} absolute inset-0 flex flex-col items-start`}>
                  <h3 
                    className="font-primary font-black text-[14px] sm:text-[16px] uppercase tracking-widest leading-none mb-2 whitespace-pre-line"
                    style={{ color: slide.titleColor }}
                  >
                    {slide.title}
                  </h3>
                  <p className="font-accent text-sm sm:text-md text-charcoal/50 italic leading-snug whitespace-pre-line">
                    {slide.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── What We Put In Section ───────────────────────────── */}
        <section className="hidden w-full py-16 px-6 bg-[#fffff9] border-t border-black/5 select-none">
          <div className="max-w-[1000px] mx-auto text-center">
            
            {/* Header copy */}
            <h2 className="font-primary font-black text-2xl sm:text-[36px] text-charcoal leading-none mb-4 uppercase tracking-tight">
              What We Put In
            </h2>
            <p className="font-primary text-[12px] sm:text-xs text-charcoal/60 leading-relaxed max-w-[650px] mx-auto mb-10 font-semibold">
              The only ingredients you&apos;ll ever find in Sustento products are whole fruits and nuts. <br className="hidden sm:block" />
              Nothing added, nothing taken out - and that&apos;s a promise.
            </p>

            {/* Interactive Tabs Menu */}
            <div className="flex items-center justify-center gap-6 md:gap-10 mb-14 font-primary text-[16px] font-black uppercase tracking-wider">
              <button
                onClick={() => setActiveTab("smoothies")}
                className={`transition-all duration-150 py-1.5 px-4 rounded-full ${
                  activeTab === "smoothies"
                    ? "bg-[#9EAB75] text-dark shadow-sm border border-black/5"
                    : "text-charcoal/60 hover:text-dark"
                }`}
              >
                smoothies
              </button>
              <button
                onClick={() => setActiveTab("snacks")}
                className={`transition-all duration-150 py-1.5 px-4 rounded-full ${
                  activeTab === "snacks"
                    ? "bg-[#9EAB75] text-dark shadow-sm border border-black/5"
                    : "text-charcoal/60 hover:text-dark"
                }`}
              >
                snacks
              </button>
              <button
                onClick={() => setActiveTab("spreads")}
                className={`transition-all duration-150 py-1.5 px-4 rounded-full ${
                  activeTab === "spreads"
                    ? "bg-[#9EAB75] text-dark shadow-sm border border-black/5"
                    : "text-charcoal/60 hover:text-dark"
                }`}
              >
                spreads
              </button>
            </div>

            {/* Glossary Directory Grid (Responsive, 4 Columns) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 text-left max-w-[900px] mx-auto min-h-[350px] content-start">
              {ingredientsData[activeTab].map((group) => (
                <div key={group.letter} className="flex flex-col items-start">
                  {/* Alphabet badge */}
                  <div className="w-8 h-8 rounded-lg bg-stone-100/80 border border-stone-200/40 flex items-center justify-center font-primary font-black text-sm text-charcoal/80 mb-3.5 select-none">
                    {group.letter}
                  </div>

                  {/* List of items */}
                  <ul className="flex flex-col gap-2 font-primary text-[13px] font-bold text-charcoal/80 leading-tight">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── Pure Joy & Modern Lifestyle Highlights ──────────────── */}
        <PureJoyLifestyle />

        {/* ── Brand Video / Story Section ────────────────────────── */}
        {!videoLoading && videoConfig && (
          <section className="w-full py-8 px-6 bg-[#fffff9] border-t border-black/5 select-none">
            <div className="max-w-[800px] mx-auto text-center flex flex-col items-center">
              
              {/* Header */}
              <h2 className="font-primary font-black text-2xl sm:text-[36px] text-charcoal leading-none mb-6 uppercase tracking-tight relative inline-block">
                <span className="relative inline-block">
                  {videoConfig.heading}
                  {/* Heading Accent Burst */}
                  <svg 
                    viewBox="0 0 40 40" 
                    className="absolute -top-7 -right-8 w-8 h-8 text-[#9EAB75] fill-current select-none pointer-events-none transform rotate-12"
                  >
                    <path d="M 8,24 C 7,20 6,15 5,8 C 8,9 11,11 13,13 C 11,17 9,21 8,24 Z" />
                    <path d="M 13,18 C 16,15 21,11 26,7 C 27,10 27,14 27,17 C 22,18 17,18 13,18 Z" />
                    <path d="M 16,21 C 21,21 27,21 32,22 C 31,24 28,26 26,27 C 22,25 19,23 16,21 Z" />
                  </svg>
                </span>
              </h2>

              {/* Video Player */}
              {videoConfig.videoUrl && (
                <div className="w-full aspect-video rounded-3xl overflow-hidden bg-black border border-black/5 shadow-lg relative my-6 max-w-[760px]">
                  <video
                    src={videoConfig.videoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Description */}
              <p className="font-primary text-[13px] sm:text-sm text-charcoal/70 leading-relaxed max-w-[650px] mx-auto font-semibold">
                {videoConfig.description}
              </p>

            </div>
          </section>
        )}

        {/* ── What We Leave Out Section ────────────────────────── */}
        <section className="w-full py-16 px-6 bg-[#fffff9] border-t border-black/5 select-none">
          <div className="max-w-[760px] mx-auto text-center">
            
            {/* Header Copy */}
            <h2 className="font-primary font-black text-2xl sm:text-[36px] text-charcoal leading-none mb-4 uppercase tracking-tight">
              What We Leave Out
            </h2>
            <p className="font-primary text-[12px] sm:text-xs text-charcoal/60 leading-relaxed max-w-[650px] mx-auto mb-12 font-semibold">
              All the colour, flavour and nutrients in our products come from natural sources. Our <br className="hidden sm:block" />
              processes are designed to create safe, shelf-stable foods without any artificial additives. <br className="hidden sm:block" />
              Here&apos;s what we screen for and exclude.
            </p>

            {/* Accordion List */}
            <div className="flex flex-col gap-4 w-full">
              {EXCLUSIONS_DATA.map((item) => (
                <div
                  key={item.id}
                  className="w-full bg-white border border-[#CBDCD0] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-200"
                >
                  {/* Accordion Trigger Header */}
                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="w-full px-6 py-4 flex items-center justify-between font-primary font-black text-sm md:text-[15px] text-charcoal text-left select-none outline-none focus:outline-none"
                  >
                    <span>{item.title}</span>
                    {/* Toggle Icon */}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`text-charcoal/70 transition-transform duration-200 ${
                        expandedId === item.id ? "rotate-180" : ""
                      }`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {/* Expanded Content Box */}
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      expandedId === item.id ? "max-h-[300px] border-t border-black/5" : "max-h-0"
                    }`}
                  >
                    <div className="px-6 py-4 text-left font-primary text-xs sm:text-[13px] text-charcoal/70 leading-relaxed font-bold">
                      {item.description}
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── Team Section: We Put Our Names On Everything ──────── */}
        <section className="hidden w-full py-16 px-6 bg-warm-white border-t border-black/5">
          <div className="max-w-[1000px] mx-auto text-center mb-16">
            <h2 className="font-primary font-black text-2xl sm:text-[32px] text-charcoal leading-none">
              &ldquo;We put <span className="font-accent text-yellow lowercase tracking-wide italic text-3xl sm:text-4xl">our names</span> on everything - literally&rdquo;
            </h2>

            {/* Team Members Arch Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-[900px] mx-auto">
              
              {/* Card 1: Raj Kotadiya */}
              <div className="relative flex flex-col items-center justify-between w-full max-w-[260px] h-[380px] mx-auto bg-[#CBDCD0] rounded-t-[130px] rounded-b-[130px] p-6 shadow-sm border border-white/20 select-none">
                <p className="font-accent text-[15px] sm:text-[16px] text-charcoal leading-relaxed text-center px-1 italic">
                  Meet Raj Kotadiya, <br />
                  his favourite spread is <br />
                  <span className="font-bold font-primary not-italic text-[13px] uppercase tracking-wider block my-0.5 text-dark">Blue Vanilla Spread</span>
                  and his superpower is turning chaos into clarity.
                </p>
                
                {/* Raj Kotadiya Vector illustration portrait */}
                <div className="w-full flex items-end justify-center mt-auto h-[160px] relative overflow-hidden">
                  <svg viewBox="0 0 120 120" className="w-[140px] h-[140px] text-charcoal/90 fill-current">
                    {/* Blazer */}
                    <path d="M20,120 C20,95 35,80 60,80 C85,80 100,95 100,120 Z" />
                    <path d="M45,80 L60,105 L75,80" stroke="white" strokeWidth="2" />
                    {/* Face & Neck */}
                    <path d="M50,80 L50,68 C50,68 53,72 60,72 C67,72 70,68 70,68 L70,80 Z" fill="#e8c3a7" />
                    <circle cx="60" cy="50" r="22" fill="#e8c3a7" />
                    {/* Glasses */}
                    <rect x="43" y="44" width="14" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
                    <rect x="63" y="44" width="14" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
                    <line x1="57" y1="49" x2="63" y2="49" stroke="currentColor" strokeWidth="2.5" />
                    {/* Hair */}
                    <path d="M38,50 C38,25 82,25 82,50 C82,35 38,35 38,50 Z" fill="currentColor" />
                  </svg>
                </div>
              </div>

              {/* Card 2: Kanika Kishnani */}
              <div className="relative flex flex-col items-center justify-between w-full max-w-[260px] h-[380px] mx-auto bg-[#EADFAA] rounded-t-[130px] rounded-b-[130px] p-6 shadow-sm border border-white/20 select-none">
                <p className="font-accent text-[15px] sm:text-[16px] text-charcoal leading-relaxed text-center px-1 italic">
                  Meet Kanika Kishnani, <br />
                  her favourite spread is <br />
                  <span className="font-bold font-primary not-italic text-[13px] uppercase tracking-wider block my-0.5 text-dark">Strawberry Cashew</span>
                  and her superpower is turning words into worlds.
                </p>

                {/* Kanika Kishnani Vector illustration portrait */}
                <div className="w-full flex items-end justify-center mt-auto h-[160px] relative overflow-hidden">
                  <svg viewBox="0 0 120 120" className="w-[140px] h-[140px] text-charcoal/90 fill-current">
                    {/* Blazer */}
                    <path d="M20,120 C20,95 35,80 60,80 C85,80 100,95 100,120 Z" />
                    <path d="M48,80 L60,102 L72,80" stroke="white" strokeWidth="2" />
                    {/* Face & Neck */}
                    <path d="M52,80 L52,70 C52,70 55,73 60,73 C65,73 68,70 68,70 L68,80 Z" fill="#ebcca0" />
                    <circle cx="60" cy="52" r="21" fill="#ebcca0" />
                    {/* Hair */}
                    <path d="M36,65 C33,40 40,25 60,25 C80,25 87,40 84,65 C88,50 82,33 60,33 C38,33 32,50 36,65 Z" fill="currentColor" />
                  </svg>
                </div>
              </div>

              {/* Card 3: Raj Kotadiya */}
              <div className="relative flex flex-col items-center justify-between w-full max-w-[260px] h-[380px] mx-auto bg-[#D1C4C9] rounded-t-[130px] rounded-b-[130px] p-6 shadow-sm border border-white/20 select-none">
                <p className="font-accent text-[15px] sm:text-[16px] text-charcoal leading-relaxed text-center px-1 italic">
                  Meet Raj Kotadiya, <br />
                  his favourite spread is <br />
                  <span className="font-bold font-primary not-italic text-[13px] uppercase tracking-wider block my-0.5 text-dark">Cocoa Almond</span>
                  and his superpower is being the lab geek who makes it all work.
                </p>

                {/* Raj Kotadiya Vector illustration portrait */}
                <div className="w-full flex items-end justify-center mt-auto h-[160px] relative overflow-hidden">
                  <svg viewBox="0 0 120 120" className="w-[140px] h-[140px] text-charcoal/90 fill-current">
                    {/* Blazer */}
                    <path d="M20,120 C20,95 35,80 60,80 C85,80 100,95 100,120 Z" />
                    <path d="M45,80 L60,105 L75,80" stroke="white" strokeWidth="2" />
                    {/* Face & Neck */}
                    <path d="M50,80 L50,68 C50,68 53,72 60,72 C67,72 70,68 70,68 L70,80 Z" fill="#dfb395" />
                    <circle cx="60" cy="50" r="22" fill="#dfb395" />
                    {/* Glasses */}
                    <rect x="43" y="44" width="14" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
                    <rect x="63" y="44" width="14" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
                    <line x1="57" y1="49" x2="63" y2="49" stroke="currentColor" strokeWidth="2.5" />
                    {/* Beard */}
                    <path d="M42,55 C42,70 78,70 78,55 C78,63 42,63 42,55 Z" fill="currentColor" />
                    {/* Hair */}
                    <path d="M38,48 C38,22 82,22 82,48 C82,32 38,32 38,48 Z" fill="currentColor" />
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Brand Backstory: Built for Busy Lives. Loved by All. ── */}
        <section className="w-full py-16 px-6 bg-[#fffff9] border-t border-black/5">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="font-primary font-black text-2xl sm:text-[32px] text-charcoal leading-none uppercase mb-12 text-center reveal-text">
              <span className="relative inline-block pb-2">
                Built for Busy Lives. Loved by All.
                {/* Yellow Underline indicator */}
                <span className="absolute left-0 bottom-0 w-full h-[5px] bg-[#9EAB75] rounded-full" />
              </span>
            </h2>

            {/* Backstory text paragraphs */}
            <div className="flex flex-col gap-6 font-primary text-sm sm:text-md text-charcoal/90 leading-relaxed font-bold reveal-section">
              <p>
                We started with one question that bothered us more than it should have: why does eating well have to be such a compromise?
              </p>
              <p>
                Too processed. Too bland. Too much guilt for something that&apos;s supposed to be good for you.
              </p>
              <p>
                So we went back to basics, all the way back. Our Whole Fruit Snacks are exactly that: one ingredient, one fruit, nothing added. Just what the fruit already knew how to be.
              </p>
              <p>
                Then we pushed further. We took India&apos;s most-loved habit, spreading something on everything and made it honest. Our fruit-infused nut butters bring real fruit into every jar. Naturally sweet. Genuinely nourishing. The kind of thing parents read the label on and actually feel good about.
              </p>
              <p>
                That&apos;s always been the standard: If we wouldn&apos;t give it to our own kids without reading the label twice, it doesn&apos;t leave our kitchen.
              </p>
            </div>
          </div>
        </section>

        {/* ── Frequently Bought Together Section ───────────────── */}
        <section className="w-full bg-[#fffff9] py-16 px-4 border-t border-black/5 select-none">
          {/* Section Header */}
          <div className="text-center mb-16 reveal-text">
            <h2 className="font-primary font-black text-2xl sm:text-3xl md:text-[38px] text-charcoal leading-none uppercase tracking-tight relative inline-block">
              OUR BEST SELLERS & TRENDING.
              {/* Horizontal Yellow Underline */}
              <span className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-[200px] h-[4px] bg-[#9EAB75] rounded-full" />
            </h2>
          </div>

          {/* Product Cards Grid */}
          {boughtProducts.length === 0 ? (
            <p className="text-center text-charcoal/40 font-bold uppercase text-xs tracking-wider py-12">Loading products...</p>
          ) : (
            (() => {
              const isCentered = boughtProducts.length > 0 && boughtProducts.length < 4;
              return (
                <div className={`flex overflow-x-auto scroll-hide gap-6 pb-6 pt-32 snap-x snap-mandatory px-4 max-w-[1200px] mx-auto lg:overflow-visible ${
                  isCentered
                    ? "lg:flex lg:flex-wrap lg:justify-center lg:gap-x-8 lg:gap-y-36"
                    : "lg:grid lg:grid-cols-4 lg:gap-x-8 lg:gap-y-36"
                }`}>
                  {boughtProducts.map((product, idx) => {
                    const rawPrice = parseInt(product.price.replace(/[₹,]/g, "")) || 0;
                    const rawOriginalPrice = parseInt(product.originalPrice.replace(/[₹,]/g, "")) || 0;
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

                        {/* Top Section: Image */}
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

                          {/* Title & Description */}
                          <Link href={`/products/${product.slug}`} className="w-full">
                            <h3 className="mt-3 font-primary text-[14px] sm:text-[15px] font-black text-dark text-center uppercase tracking-tight px-1 leading-tight h-10 flex items-center justify-center hover:underline">
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
                    );
                  })}
                </div>
              );
            })()
          )}
        </section>

        {/* ── On The #Gram Instagram Grid Section ──────────────── */}
        <InstagramGrid />

      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <Footer />
    </>
  );
}
