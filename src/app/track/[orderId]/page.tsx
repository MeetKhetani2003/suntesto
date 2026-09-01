"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface TrackingData {
  orderNumber: string;
  orderStatus: string;
  shiprocketStatus?: string;
  awbCode?: string;
  courierName?: string;
  trackingUrl?: string;
  customerInfo: { name: string; city: string; state: string };
  createdAt: string;
}

const STATUS_STEPS = [
  { key: "Processing", label: "Order Placed", icon: "📦" },
  { key: "Shipped",    label: "Shipped",       icon: "🚚" },
  { key: "Out For Delivery", label: "Out For Delivery", icon: "🛵" },
  { key: "Delivered",  label: "Delivered",     icon: "✅" },
];

function getStepIndex(status: string): number {
  const s = status || "";
  if (s === "Delivered") return 3;
  if (s === "Out For Delivery") return 2;
  if (s === "Shipped") return 1;
  return 0;
}

export default function TrackingPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/admin/orders/${orderId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Order not found");
        return r.json();
      })
      .then((order) => {
        setData({
          orderNumber:     order.orderNumber,
          orderStatus:     order.orderStatus,
          shiprocketStatus: order.shiprocketStatus,
          awbCode:         order.awbCode,
          courierName:     order.courierName,
          trackingUrl:     order.trackingUrl,
          customerInfo:    order.customerInfo,
          createdAt:       order.createdAt,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [orderId]);

  const stepIndex = data ? getStepIndex(data.orderStatus) : 0;
  const isCancelled = data?.orderStatus === "Cancelled";

  return (
    <>
      <Header />
      <main className="w-full bg-[#fffff9] pt-32 pb-20 min-h-[75vh] select-none">
        <div className="max-w-[560px] w-full mx-auto px-6">

          {/* Page Title */}
          <div className="text-center mb-10">
            <h1 className="font-primary font-black text-[32px] sm:text-[42px] text-charcoal uppercase tracking-tight leading-none">
              TRACK<br />
              <span className="text-[#9EAB75]">ORDER.</span>
            </h1>
            <p className="font-accent text-base text-charcoal/50 mt-3 italic">
              Real-time updates for your Sustento shipment.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="bg-white rounded-[32px] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-black/5 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
              <p className="font-bold text-xs uppercase tracking-wider text-charcoal/50">Loading tracking info...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="bg-white rounded-[32px] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-black/5 flex flex-col items-center gap-4 text-center">
              <span className="text-4xl">😕</span>
              <h2 className="font-primary font-black text-lg uppercase text-charcoal">Order Not Found</h2>
              <p className="text-sm text-charcoal/50">We couldn&apos;t find tracking info for this order. Check your order confirmation email.</p>
              <Link href="/" className="mt-2 font-primary font-black text-sm uppercase tracking-wider border border-dark rounded-full px-8 py-3 hover:bg-dark hover:text-white transition-all duration-200">
                Back to Home
              </Link>
            </div>
          )}

          {/* Tracking Card */}
          {!loading && data && (
            <div className="bg-white rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-black/5 overflow-hidden">
              
              {/* Top header bar */}
              <div className="bg-[#9EAB75] px-8 py-5 flex items-center justify-between">
                <div>
                  <p className="font-primary font-black text-xs uppercase tracking-widest text-dark/60">Order Number</p>
                  <p className="font-primary font-black text-xl text-dark tracking-tight">{data.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-primary font-black text-xs uppercase tracking-widest text-dark/60">Status</p>
                  <span className={`font-primary font-black text-sm uppercase tracking-wider ${isCancelled ? "text-red-600" : "text-dark"}`}>
                    {data.orderStatus}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col gap-7">

                {/* Progress Tracker */}
                {!isCancelled && (
                  <div className="relative flex items-center justify-between">
                    {/* Background line */}
                    <div className="absolute left-0 right-0 top-5 h-[2px] bg-black/5 z-0" />
                    {/* Progress fill */}
                    <div
                      className="absolute left-0 top-5 h-[2px] bg-[#9EAB75] z-0 transition-all duration-700"
                      style={{ width: `${(stepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                    />
                    {STATUS_STEPS.map((step, i) => (
                      <div key={step.key} className="relative z-10 flex flex-col items-center gap-2 w-1/4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-500 ${
                          i <= stepIndex
                            ? "bg-[#9EAB75] border-[#9EAB75] shadow-[0_0_0_4px_rgba(255,218,88,0.2)]"
                            : "bg-white border-black/10"
                        }`}>
                          {step.icon}
                        </div>
                        <p className={`font-primary font-black text-[10px] uppercase tracking-wide text-center leading-tight ${i <= stepIndex ? "text-dark" : "text-charcoal/30"}`}>
                          {step.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Cancelled badge */}
                {isCancelled && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
                    <span className="text-2xl">❌</span>
                    <div>
                      <p className="font-primary font-black text-sm text-red-700 uppercase tracking-wide">Order Cancelled</p>
                      <p className="text-xs text-red-500 mt-0.5">This order has been cancelled. Contact support for assistance.</p>
                    </div>
                  </div>
                )}

                {/* Shiprocket status */}
                {data.shiprocketStatus && (
                  <div className="bg-[#FAF9F5] rounded-2xl px-5 py-4 border border-black/5">
                    <p className="font-primary font-black text-[11px] uppercase tracking-widest text-charcoal/40 mb-1">Courier Update</p>
                    <p className="font-primary font-black text-sm text-dark">{data.shiprocketStatus}</p>
                  </div>
                )}

                {/* AWB / Courier Info */}
                {(data.awbCode || data.courierName) && (
                  <div className="flex flex-col gap-3 border-t border-black/5 pt-5">
                    {data.courierName && (
                      <div className="flex items-center justify-between">
                        <span className="font-primary font-black text-xs uppercase tracking-widest text-charcoal/40">Courier Partner</span>
                        <span className="font-primary font-black text-sm text-dark">{data.courierName}</span>
                      </div>
                    )}
                    {data.awbCode && (
                      <div className="flex items-center justify-between">
                        <span className="font-primary font-black text-xs uppercase tracking-widest text-charcoal/40">AWB / Tracking No.</span>
                        <span className="font-primary font-black text-sm text-dark tracking-wider">{data.awbCode}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Customer info */}
                <div className="flex items-center justify-between border-t border-black/5 pt-5">
                  <span className="font-primary font-black text-xs uppercase tracking-widest text-charcoal/40">Delivering To</span>
                  <span className="font-primary font-black text-sm text-dark">
                    {data.customerInfo.name}, {data.customerInfo.city}
                  </span>
                </div>

                {/* Track on courier website */}
                {data.trackingUrl && !data.awbCode?.startsWith("MOCK") && (
                  <a
                    href={data.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center w-full bg-dark hover:bg-dark/90 text-white font-primary font-black text-[13px] uppercase tracking-wider py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5"
                  >
                    Track on Courier Website →
                  </a>
                )}

                {/* Continue shopping */}
                <Link
                  href="/collections/all"
                  className="block text-center w-full border border-charcoal/20 hover:border-dark text-charcoal hover:bg-dark hover:text-white font-primary font-black text-[13px] uppercase tracking-wider py-4 rounded-full transition-all duration-200"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
