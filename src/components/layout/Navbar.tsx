"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";

/* ── Nav data ────────────────────────────────────────────────── */
// Unused static NAV_LEFT constant removed to prevent duplication/hardcoding.

/* ── SVG Icons ───────────────────────────────────────────────── */
const SearchIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const AccountIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CartIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const HamburgerIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronDown = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ── Sustento Logo ─────────────────────────────────────────────── */
function SustentoLogo({ variant }: { variant: "white" | "dark" }) {
  return (
    <Link href="/" aria-label="Sustento Home" className="block transition-transform hover:scale-105">
      <Image
        src={variant === "white" ? "/images/sustento-logo-white.png" : "/images/sustento-logo-black.png"}
        alt="Sustento"
        width={200}
        height={50}
        priority
        className="w-[110px] sm:w-[140px] md:w-[160px] h-auto object-contain"
      />
    </Link>
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const { cartCount, setCartOpen } = useCart();
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchNavbarData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories")
        ]);

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (Array.isArray(prodData)) {
            setProducts(prodData);
          }
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          if (Array.isArray(catData)) {
            setCategories(catData.map((c: any) => c.name));
          }
        } else {
          // Fallback if categories endpoint fails
          fetch("/api/products")
            .then((res) => res.json())
            .then((data) => {
              if (Array.isArray(data)) {
                const uniqueCats = Array.from(
                  new Set(data.map((p: any) => p.category?.trim()).filter(Boolean))
                ) as string[];
                setCategories(uniqueCats);
              }
            });
        }
      } catch (err) {
        console.error("Navbar fetch error:", err);
      }
    }
    fetchNavbarData();
  }, []);

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setSearchQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShopDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // In the glassmorphism capsule, color is dark charcoal since the glass background is light and transparent
  const textColor = "text-charcoal";
  const iconColor = "#353534";

  const shopDropdown = [
    { label: "All Products", href: "/collections/all" },
    ...categories.map((cat) => ({
      label: cat,
      href: `/collections/all?category=${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, "-"))}`,
    })),
  ];

  const navLinks = [
    {
      label: "ALL PRODUCTS",
      href: "/collections/all",
      hasDropdown: false,
    },
    {
      label: "SHOP",
      href: "/collections/all",
      hasDropdown: true,
      dropdown: shopDropdown,
    },
    { label: "ABOUT US", href: "/about-us", hasDropdown: false },
  ];

  return (
    <>
      {/* ── Floating Sticky Navbar Capsule ────────────────────── */}
      <header
        className={`flex items-center justify-center fixed left-0 right-0 z-[999] px-4 transition-all duration-300 ${
          scrolled ? "top-[12px]" : "top-[44px]"
        }`}
      >
        <div className="mx-auto w-full max-w-[1200px]">
          <nav className="relative flex h-16 w-full items-center justify-between rounded-full border border-white/20 bg-white/40 px-4 sm:px-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-md transition-all duration-300 lg:px-8 hover:bg-white/60">
            
            {/* Desktop Left: Nav Links */}
            <div className="hidden flex-1 items-center gap-8 lg:flex">
              {navLinks.map((item) =>
                item.hasDropdown ? (
                  <div key={item.label} className="relative" ref={dropdownRef}>
                    <button
                      className={`flex items-center gap-1.5 font-primary text-[15px] font-bold tracking-wide uppercase transition-all duration-200 hover:opacity-75 ${textColor}`}
                      onClick={() => setShopDropdownOpen((o) => !o)}
                      aria-expanded={shopDropdownOpen}
                      id="shop-all-btn"
                    >
                      {item.label}
                      <span className={`transition-transform duration-200 ${shopDropdownOpen ? "rotate-180" : ""}`}>
                        <ChevronDown color={iconColor} />
                      </span>
                    </button>

                    {/* Glassmorphic Dropdown */}
                    {shopDropdownOpen && (
                      <div className="absolute top-[calc(100%+16px)] left-0 min-w-[200px] rounded-2xl border border-white/20 bg-white/90 p-2 shadow-xl backdrop-blur-lg animate-in fade-in slide-in-from-top-2 duration-150">
                        {item.dropdown!.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="block rounded-lg px-4 py-2.5 font-primary text-[13px] font-bold uppercase tracking-wide text-charcoal transition-all hover:bg-yellow hover:text-dark"
                            onClick={() => setShopDropdownOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`font-primary text-[15px] font-bold tracking-wide uppercase transition-all duration-200 hover:opacity-75 ${textColor}`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            {/* Desktop & Mobile Center: Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-shrink-0">
              <SustentoLogo variant="dark" />
            </div>

            {/* Desktop Right: Icons */}
            <div className="hidden flex-1 items-center justify-end gap-5 lg:flex">
              <button 
                onClick={() => setSearchOpen(true)}
                className="text-charcoal hover:scale-110 transition-transform duration-200 cursor-pointer" 
                aria-label="Search"
              >
                <SearchIcon color={iconColor} />
              </button>
              {session ? (
                <Link href="/profile" className="hover:scale-105 transition-all duration-200 flex items-center justify-center relative w-8 h-8 rounded-full overflow-hidden border-2 border-[#9EAB75]" aria-label="Account">
                  {session.user?.image ? (
                    <Image 
                      src={session.user.image} 
                      alt={session.user.name || "Profile"} 
                      fill 
                      sizes="32px" 
                      className="object-cover" 
                      unoptimized={true}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#9EAB75] text-dark flex items-center justify-center font-primary font-black text-xs uppercase leading-none">
                      {session.user?.name ? session.user.name.charAt(0) : "U"}
                    </div>
                  )}
                </Link>
              ) : (
                <Link href="/login" className="text-charcoal hover:scale-110 transition-transform duration-200 flex items-center justify-center" aria-label="Account">
                  <AccountIcon color={iconColor} />
                </Link>
              )}
              <button 
                onClick={() => setCartOpen(true)}
                className="relative text-charcoal hover:scale-110 transition-transform duration-200 cursor-pointer" 
                aria-label={`Cart, ${mounted ? cartCount : 0} items`}
              >
                <CartIcon color={iconColor} />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#ebb904] text-[9px] font-bold text-dark">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Nav Interface */}
            <div className="flex w-full items-center justify-between lg:hidden">
              <button
                className="text-charcoal active:scale-95 transition-transform duration-150"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((o) => !o)}
              >
                {mobileOpen ? <CloseIcon color={iconColor} /> : <HamburgerIcon color={iconColor} />}
              </button>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSearchOpen(true)}
                  className="text-charcoal cursor-pointer" 
                  aria-label="Search"
                >
                  <SearchIcon color={iconColor} />
                </button>
                <button 
                  onClick={() => setCartOpen(true)}
                  className="relative text-charcoal cursor-pointer" 
                  aria-label={`Cart, ${mounted ? cartCount : 0} items`}
                >
                  <CartIcon color={iconColor} />
                  {mounted && cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#ebb904] text-[9px] font-bold text-dark">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

          </nav>
        </div>
      </header>

      {/* ── Mobile Drawer ─────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[1000] bg-black/45 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 bottom-0 z-[1001] w-4/5 max-w-[340px] bg-[#fffff9] shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
          <SustentoLogo variant="dark" />
          <button className="text-charcoal" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <CloseIcon color="#1e1e1e" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <div className="flex flex-col gap-1">
            {navLinks.map((item) =>
              item.hasDropdown ? (
                <div key={item.label} className="flex flex-col">
                  <button
                    className="flex items-center justify-between rounded-xl px-4 py-3 font-primary text-[15px] font-bold uppercase tracking-wide text-charcoal hover:bg-yellow/10"
                    onClick={() => setMobileShopOpen((o) => !o)}
                    aria-expanded={mobileShopOpen}
                  >
                    <span>{item.label}</span>
                    <span className={`transition-transform duration-200 ${mobileShopOpen ? "rotate-180" : ""}`}>
                      <ChevronDown color="#1e1e1e" />
                    </span>
                  </button>
                  {mobileShopOpen && (
                    <div className="ml-4 mt-1 border-l-2 border-yellow bg-black/5 pl-4 rounded-r-lg">
                      {item.dropdown!.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block py-2.5 font-primary text-[14px] font-bold tracking-wide text-[#353534] hover:text-dark"
                          onClick={() => setMobileOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block rounded-xl px-4 py-3 font-primary text-[15px] font-bold uppercase tracking-wide text-charcoal hover:bg-yellow/10"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}

            <div className="my-4 h-[1px] bg-black/5 mx-4" />

            {session ? (
              <>
                <Link
                  href="/profile"
                  className="block rounded-xl px-4 py-3 font-primary text-[15px] font-bold uppercase tracking-wide text-charcoal hover:bg-yellow/10"
                  onClick={() => setMobileOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileOpen(false);
                  }}
                  className="block w-full text-left rounded-xl px-4 py-3 font-primary text-[15px] font-bold uppercase tracking-wide text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block rounded-xl px-4 py-3 font-primary text-[15px] font-bold uppercase tracking-wide text-charcoal hover:bg-yellow/10"
                onClick={() => setMobileOpen(false)}
              >
                Login / Sign Up
              </Link>
            )}

            <div className="my-4 h-[1px] bg-black/5 mx-4" />

            <Link
              href="/contact"
              className="block px-4 py-2 font-primary text-[14px] font-semibold text-[#616160] hover:text-dark"
              onClick={() => setMobileOpen(false)}
            >
              Contact Us
            </Link>
            
            <Link
              href="/faqs"
              className="block px-4 py-2 font-primary text-[14px] font-semibold text-[#616160] hover:text-dark"
              onClick={() => setMobileOpen(false)}
            >
              FAQ
            </Link>
          </div>
        </nav>
      </div>

      {/* ── SEARCH OVERLAY PANEL ─────────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[3000] bg-black/60 backdrop-blur-md flex flex-col items-center justify-start pt-24 px-6 select-none animate-fade-in">
          {/* Close button */}
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 border border-white/20 hover:border-white/50 text-white rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-105"
            aria-label="Close search"
          >
            ✕
          </button>

          {/* Search container */}
          <div className="w-full max-w-2xl flex flex-col gap-6 text-left">
            <h3 className="font-accent text-3xl font-bold text-[#9EAB75] text-center rotate-[-1.5deg]">Search Products</h3>
            <input
              type="text"
              placeholder="Type to search for strawberry, banana..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/25 rounded-full px-6 py-4 text-white text-lg placeholder-white/40 focus:outline-none focus:border-[#9EAB75] transition-colors"
              autoFocus
            />

            {/* Live Search Results */}
            {searchQuery.trim().length > 0 && (
              <div className="bg-white rounded-3xl p-5 shadow-xl max-h-[360px] overflow-y-auto flex flex-col gap-3.5">
                {filteredProducts.length === 0 ? (
                  <p className="text-charcoal/40 text-center py-6 font-bold uppercase text-xs tracking-wider">No matching products found.</p>
                ) : (
                  filteredProducts.map((p) => {
                    const priceStr = p.price ? `₹${p.price}` : "₹149";
                    const imageSrc = p.images && p.images.length > 0 ? p.images[0] : "/images/sustento-pouch-strawberry.jpg";
                    const archClass = p.archClass || "bg-[#FCE2EC]";

                    return (
                      <Link
                        key={p._id}
                        href={`/products/${p.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-4 p-2 rounded-2xl hover:bg-[#FAF9F5] transition-colors"
                      >
                        <div className={`relative w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shrink-0 ${archClass}`}>
                          <Image
                            src={imageSrc}
                            alt={p.title}
                            fill
                            sizes="48px"
                            className="object-contain p-0.5 mix-blend-multiply"
                            unoptimized={true}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-primary font-black text-xs text-dark uppercase block truncate">{p.title}</span>
                          <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wide">Category: {p.category.replace("-", " ")}</span>
                        </div>
                        <span className="font-primary font-black text-xs text-dark shrink-0">{priceStr}</span>
                      </Link>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
