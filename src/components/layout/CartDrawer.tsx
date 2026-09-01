"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeItem,
    cartTotal,
  } = useCart();

  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scroll when cart is open
  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  if (!mounted || !cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex justify-end">
      {/* Glassmorphic Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer Panel Container */}
      <div className="relative w-full max-w-[440px] h-full bg-[#fdfdfb] shadow-[[-8px_0_32px_rgba(0,0,0,0.06)]] flex flex-col z-10 transition-transform duration-300 ease-out animate-slide-in font-primary text-charcoal border-l border-black/5">
        
        {/* ── HEADER BLOCK ───────────────────────────────────────── */}
        <div className="p-6 border-b border-black/5 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <span className="font-accent text-3xl font-bold text-dark rotate-[-2deg]">Your</span>
            <h2 className="text-xl font-black uppercase tracking-tight text-dark">Crunch Bag</h2>
            <span className="bg-[#9EAB75] text-dark font-black text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider ml-1">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="w-10 h-10 rounded-full bg-charcoal/5 hover:bg-charcoal hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── CART ITEMS SCROLLABLE LIST ─────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scroll-hide">
          {cart.length === 0 ? (
            /* Empty Cart Flow */
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-24 h-24 bg-yellow/10 rounded-full flex items-center justify-center mb-6 relative">
                <svg className="w-10 h-10 text-[#ebb904] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="font-primary font-black text-lg text-dark uppercase tracking-tight mb-2">Your bag is empty!</h3>
              <p className="font-accent text-[15px] text-body mb-8 max-w-[280px]">
                Add some crispy freeze-dried nutrition packets to satisfy your cravings.
              </p>
              <button
                onClick={() => setCartOpen(false)}
                className="px-8 py-3.5 bg-dark hover:bg-dark/95 text-charcoal font-black text-[13px] uppercase tracking-wider rounded-full shadow-md border border-black/5 hover:-rotate-1 transition-all duration-200 cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            /* Cart Items */
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.variant}`}
                  className="flex gap-4 p-3.5 bg-white rounded-2xl border border-black/5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] items-center"
                >
                  {/* Item Image */}
                  <div className={`relative w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-black/5 ${item.archClass || 'bg-warm-white'}`}>
                    <Image
                      src={item.imageSrc}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-contain p-1 drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)] mix-blend-multiply"
                      unoptimized={true}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <h4 className="font-primary font-black text-[13px] sm:text-[14px] text-dark uppercase tracking-tight truncate">
                      {item.title}
                    </h4>
                    <span className="inline-block text-[10px] font-black uppercase tracking-wider text-[#ebb904] bg-[#ebb904]/10 rounded-full px-2.5 py-0.5 w-max">
                      {item.variant === "single" ? "Single Pouch" : item.variant === "pack3" ? "Pack of 3" : "Pack of 5"}
                    </span>

                    {/* Price & Quantity adjust block */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-2 border border-black/10 rounded-full px-2.5 py-1 bg-warm-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center font-black text-charcoal/60 hover:text-dark text-xs cursor-pointer active:scale-90"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-primary font-black text-[12px] text-dark">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center font-black text-charcoal/60 hover:text-dark text-xs cursor-pointer active:scale-90"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-primary font-black text-[14px] text-dark block">
                          ₹{item.price * item.quantity}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] font-bold text-charcoal/40 block">
                            ₹{item.price} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delete Trigger */}
                  <button
                    onClick={() => removeItem(item.id, item.variant)}
                    className="w-8 h-8 rounded-full hover:bg-red-50 text-charcoal/40 hover:text-red-500 flex items-center justify-center transition-colors duration-200 cursor-pointer self-start ml-1"
                    aria-label="Remove item"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── STICKY BOTTOM CHECKOUT SUMMARY ─────────────────────── */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-black/5 shadow-[0_-8px_24px_rgba(0,0,0,0.03)] sticky bottom-0 z-20">
            <div className="flex items-center justify-between mb-4">
              <span className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50">Estimated Total</span>
              <span className="font-primary font-black text-2xl text-dark">₹{cartTotal}</span>
            </div>

            <p className="text-[11px] font-bold text-charcoal/40 leading-normal text-left mb-6 uppercase tracking-wider">
              🎁 Free shipping on order values above ₹499! GST calculated at checkout.
            </p>

            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="w-full bg-[#9EAB75] hover:bg-[#FFC933] text-dark font-primary font-black text-[13px] uppercase tracking-wider py-4 rounded-full shadow-md border border-black/5 hover:-rotate-1 transition-all duration-200 active:scale-[0.98] cursor-pointer text-center block"
            >
              Checkout Now
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
