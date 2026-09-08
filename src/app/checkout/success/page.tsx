"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface OrderData {
  _id: string;
  orderNumber: string;
  orderStatus: string;
  paymentMethod: string;
  pricing: {
    total: number;
    shippingCost: number;
    codAmountToCollect?: number;
    shippingPaidOnline?: number;
  };
  awbCode?: string;
  courierName?: string;
  trackingUrl?: string;
  shiprocketStatus?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  // orderId from URL is actually the order number e.g. "SU-774077"
  const orderId = searchParams.get("orderId") || "";
  const { clearCart } = useCart();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loadingTracking, setLoadingTracking] = useState(false);
  const [copied, setCopied] = useState(false);

  // Use orderId (order number) as display until API responds
  const displayOrderNumber = orderData?.orderNumber || orderId || "SU-XXXXXX";

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // Poll for Shiprocket AWB (gives it a few seconds to process asynchronously)
  useEffect(() => {
    if (!orderId) return;
    setLoadingTracking(true);

    const poll = async (attempts: number) => {
      try {
        const res = await fetch(`/api/admin/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrderData(data);
          // If AWB not yet assigned and we have attempts left, retry
          if (!data.awbCode && attempts > 0) {
            setTimeout(() => poll(attempts - 1), 3000);
          } else {
            setLoadingTracking(false);
          }
        } else {
          setLoadingTracking(false);
        }
      } catch {
        setLoadingTracking(false);
      }
    };

    // Start polling after 2 seconds (give Shiprocket time)
    setTimeout(() => poll(4), 2000);
  }, [orderId]);

  const handleCopyAwb = () => {
    if (!orderData?.awbCode) return;
    navigator.clipboard.writeText(orderData.awbCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-[0_12px_48px_rgba(0,0,0,0.03)] border border-black/5 flex flex-col items-center text-center">

      {/* Success icon */}
      <div className="w-20 h-20 bg-[#4BB543]/10 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-[#4BB543]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <span className="font-accent text-3xl font-bold text-dark rotate-[-2deg] mb-1.5 block">Woohoo!</span>
      <h2 className="font-primary font-black text-2xl uppercase tracking-tight text-dark mb-4 leading-none">Order Placed</h2>

      <p className="text-sm font-medium text-charcoal/60 leading-relaxed mb-6">
        Thank you for shopping with <strong>Sustento</strong>! Your order is confirmed and is being packed for dispatch.
      </p>

      {/* Order info */}
      <div className="w-full bg-[#FAF9F5] border border-black/5 rounded-2xl p-4 mb-5 flex flex-col gap-3 text-left">
        <div className="flex items-center justify-between text-xs font-bold text-charcoal/50 uppercase tracking-wider">
          <span>Order Number</span>
          <span className="font-black text-dark text-sm tracking-wide">{displayOrderNumber}</span>
        </div>

        {orderData && orderData.paymentMethod === "COD" && (
          <>
            <div className="flex items-center justify-between text-xs font-bold text-charcoal/50 uppercase tracking-wider border-t border-black/5 pt-3">
              <span>Shipping Fee</span>
              <span className="font-black text-green-600 text-sm tracking-wide">PAID ONLINE (₹{orderData.pricing.shippingCost})</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-[#CC2828] uppercase tracking-wider border-t border-black/5 pt-3">
              <span>Cash on Delivery</span>
              <span className="font-black text-[#CC2828] text-sm tracking-wide">
                ₹{orderData.pricing.codAmountToCollect !== undefined 
                  ? orderData.pricing.codAmountToCollect 
                  : (orderData.pricing.total - orderData.pricing.shippingCost)}
              </span>
            </div>
          </>
        )}

        <div className="flex items-center justify-between text-xs font-bold text-charcoal/50 uppercase tracking-wider border-t border-black/5 pt-3">
          <span>Status</span>
          <span className="font-black text-green-600 text-sm tracking-wide uppercase">
            {orderData?.orderStatus || "Processing"}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs font-bold text-charcoal/50 uppercase tracking-wider border-t border-black/5 pt-3">
          <span>Estimated Delivery</span>
          <span className="font-black text-green-600 text-sm tracking-wide">3 - 5 BUSINESS DAYS</span>
        </div>
      </div>

      {/* Shiprocket still processing badge */}
      {loadingTracking && !orderData?.awbCode && (
        <div className="w-full flex items-center gap-3 bg-yellow-50 border border-yellow-100 rounded-2xl px-5 py-3 mb-5">
          <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin shrink-0" />
          <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide">Assigning courier partner...</p>
        </div>
      )}

      {/* Shipping / AWB info — shown once AWB is available */}
      {orderData?.awbCode && (
        <div className="w-full mb-5">
          {/* "On its way" banner */}
          <div className="bg-gradient-to-r from-[#9EAB75] to-[#b8c98a] rounded-t-2xl px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">🚚</span>
            <div className="text-left">
              <p className="font-primary font-black text-sm uppercase tracking-wider text-dark">Your package is on its way!</p>
              {orderData.courierName && (
                <p className="text-xs font-semibold text-dark/70 mt-0.5">Dispatched via {orderData.courierName}</p>
              )}
            </div>
          </div>
          {/* AWB detail row */}
          <div className="bg-[#FAF9F5] border border-t-0 border-black/5 rounded-b-2xl px-5 py-4 flex flex-col gap-3 text-left">
            {orderData.courierName && (
              <div className="flex items-center justify-between text-xs font-bold text-charcoal/50 uppercase tracking-wider">
                <span>Courier Partner</span>
                <span className="font-black text-dark text-sm">{orderData.courierName}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs font-bold text-charcoal/50 uppercase tracking-wider border-t border-black/5 pt-3">
              <div>
                <span className="block mb-0.5">AWB / Tracking No.</span>
                <span className="font-black text-dark text-base tracking-widest">{orderData.awbCode}</span>
              </div>
              <button
                onClick={handleCopyAwb}
                className="ml-3 shrink-0 px-3 py-1.5 bg-white border border-black/10 hover:border-black/30 rounded-lg font-black text-[10px] uppercase tracking-wider text-charcoal/70 hover:text-dark transition-all cursor-pointer"
              >
                {copied ? "✓ Copied!" : "Copy AWB"}
              </button>
            </div>
            {orderData.shiprocketStatus && (
              <div className="flex items-center justify-between text-xs font-bold text-charcoal/50 uppercase tracking-wider border-t border-black/5 pt-3">
                <span>Courier Status</span>
                <span className="font-black text-[#5a6b3b] text-xs">{orderData.shiprocketStatus}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Track Order button */}
      {orderId && (
        <Link
          href={`/track/${orderId}`}
          className="w-full mb-3 bg-[#9EAB75] hover:bg-[#f0cc44] text-dark font-primary font-black text-[13px] uppercase tracking-wider py-4 rounded-full shadow-sm hover:-translate-y-0.5 transition-all duration-200 block text-center"
        >
          Track My Order
        </Link>
      )}

      <Link
        href="/collections/all"
        className="w-full bg-dark hover:bg-dark/95 text-white font-primary font-black text-[13px] uppercase tracking-wider py-4 rounded-full shadow-md hover:-rotate-1 transition-all duration-200 cursor-pointer block text-center"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default function OrderSuccessPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Header />
      <main className="w-full bg-warm-white pt-32 pb-20 select-none flex items-center justify-center min-h-[75vh]">
        <div className="max-w-[480px] w-full mx-auto px-6">
          <Suspense fallback={
            <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-[0_12px_48px_rgba(0,0,0,0.03)] border border-black/5 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 border-4 border-yellow border-t-transparent rounded-full animate-spin mb-4" />
              <p className="font-bold text-xs uppercase tracking-wider">Verifying Order Status...</p>
            </div>
          }>
            <SuccessContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
