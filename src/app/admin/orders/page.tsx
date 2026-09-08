"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface OrderItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice: number;
  imageSrc: string;
  variant: "single" | "pack3" | "pack5";
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  items: OrderItem[];
  pricing: {
    subtotal: number;
    shippingCost: number;
    discountAmount: number;
    total: number;
    codAmountToCollect?: number;
    shippingPaidOnline?: number;
  };
  couponCode?: string;
  paymentMethod: "COD" | "CARD" | "UPI" | "ONLINE";
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: "Processing" | "Shipped" | "Out For Delivery" | "Delivered" | "Cancelled";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  shiprocketOrderId?: string;
  shiprocketShipmentId?: string;
  awbCode?: string;
  courierName?: string;
  trackingUrl?: string;
  shiprocketStatus?: string;
  createdAt: string;
}

// ── SVG Barcode using JsBarcode ──────────────────────────────────────────
function BarcodeSvg({ value, height = 60 }: { value: string; height?: number }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !value) return;
    const render = async () => {
      try {
        const JsBarcode = (await import("jsbarcode")).default;
        JsBarcode(svgRef.current, value, {
          format: "CODE128",
          width: 2,
          height,
          displayValue: false,
          margin: 4,
          background: "#ffffff",
          lineColor: "#000000",
        });
      } catch (e) {
        console.error("Barcode render failed:", e);
      }
    };
    render();
  }, [value, height]);

  return <svg ref={svgRef} className="w-full" />;
}

// ── Premium Label Component (used for both preview & PDF capture) ─────────
function ShippingLabelContent({ order }: { order: Order }) {
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
  const orderTime = new Date(order.createdAt).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });
  const isCOD = order.paymentMethod === "COD";
  const codAmount = order.pricing.codAmountToCollect ?? Math.max(0, order.pricing.total - order.pricing.shippingCost);
  const variantLabel = (v: string) =>
    v === "single" ? "Single" : v === "pack3" ? "Pack of 3" : "Pack of 5";

  return (
    <div
      id="shipping-label-content"
      style={{
        width: "794px",           // A4 width at 96dpi
        fontFamily: "'Arial', sans-serif",
        background: "#ffffff",
        color: "#111111",
        padding: "32px",
        boxSizing: "border-box",
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "stretch", borderBottom: "3px solid #111", paddingBottom: "20px", marginBottom: "20px", gap: "0" }}>
        {/* Brand block */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px", color: "#111", lineHeight: 1 }}>SUSTENTO</div>
          <div style={{ fontSize: "10px", color: "#666", fontWeight: 600, marginTop: "3px", letterSpacing: "1px", textTransform: "uppercase" }}>Premium Healthy Snacks</div>
          <div style={{ fontSize: "9px", color: "#888", marginTop: "6px", lineHeight: 1.5 }}>
            sustento.in · hello@sustento.in
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "1px", background: "#e5e5e5", margin: "0 24px" }} />

        {/* Order meta */}
        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "center", gap: "4px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#888", letterSpacing: "1px", textTransform: "uppercase" }}>Order Number</div>
          <div style={{ fontSize: "22px", fontWeight: 900, color: "#111", letterSpacing: "0px" }}>{order.orderNumber}</div>
          <div style={{ fontSize: "10px", color: "#888", fontWeight: 600 }}>{orderDate} · {orderTime}</div>
        </div>
      </div>

      {/* ── MAIN TWO-COLUMN LAYOUT ──────────────────────────────────── */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>

        {/* LEFT — Ship To + Barcode */}
        <div style={{ flex: "0 0 320px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Ship To box */}
          <div style={{ border: "2px solid #111", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ background: "#111", color: "#fff", padding: "7px 14px", fontSize: "10px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase" }}>
              SHIP TO
            </div>
            <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "5px" }}>
              <div style={{ fontSize: "16px", fontWeight: 900, color: "#111", lineHeight: 1.2 }}>{order.customerInfo.name}</div>
              <div style={{ fontSize: "12px", color: "#333", fontWeight: 600, lineHeight: 1.5 }}>
                {order.customerInfo.address}
              </div>
              <div style={{ fontSize: "12px", color: "#333", fontWeight: 600 }}>
                {order.customerInfo.city}, {order.customerInfo.state}
              </div>
              <div style={{ fontSize: "15px", fontWeight: 900, color: "#111", letterSpacing: "1px", marginTop: "2px" }}>
                PIN: {order.customerInfo.zip}
              </div>
              <div style={{ fontSize: "12px", color: "#555", fontWeight: 600, marginTop: "3px" }}>
                📞 {order.customerInfo.phone}
              </div>
              <div style={{ fontSize: "11px", color: "#777", fontWeight: 500 }}>
                ✉ {order.customerInfo.email}
              </div>
            </div>
          </div>

          {/* AWB Barcode box */}
          {order.awbCode && (
            <div style={{ border: "2px solid #111", borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ background: "#111", color: "#fff", padding: "7px 14px", fontSize: "10px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase" }}>
                TRACKING / AWB
              </div>
              <div style={{ padding: "14px", textAlign: "center" }}>
                <BarcodeSvg value={order.awbCode} height={65} />
                <div style={{ fontSize: "14px", fontWeight: 900, letterSpacing: "3px", color: "#111", marginTop: "6px" }}>
                  {order.awbCode}
                </div>
                {order.courierName && (
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#777", marginTop: "3px", textTransform: "uppercase", letterSpacing: "1px" }}>
                    via {order.courierName}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Shiprocket IDs */}
          {order.shiprocketOrderId && (
            <div style={{ border: "1px solid #e5e5e5", borderRadius: "8px", padding: "12px", fontSize: "9px", color: "#888", display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Shiprocket Order</span>
                <span style={{ fontFamily: "monospace", color: "#555" }}>{order.shiprocketOrderId}</span>
              </div>
              {order.shiprocketShipmentId && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Shipment ID</span>
                  <span style={{ fontFamily: "monospace", color: "#555" }}>{order.shiprocketShipmentId}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — Order Details */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Items */}
          <div style={{ border: "1px solid #e5e5e5", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ background: "#f8f8f6", padding: "9px 14px", fontSize: "10px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "#555", borderBottom: "1px solid #e5e5e5" }}>
              ORDER ITEMS
            </div>
            <div style={{ padding: "0" }}>
              {/* Table header */}
              <div style={{ display: "flex", padding: "7px 14px", background: "#fafaf8", borderBottom: "1px solid #eee", fontSize: "9px", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                <span style={{ flex: 3 }}>Product</span>
                <span style={{ flex: 1, textAlign: "center" }}>Qty</span>
                <span style={{ flex: 1, textAlign: "right" }}>Price</span>
                <span style={{ flex: 1, textAlign: "right" }}>Total</span>
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 14px",
                  borderBottom: idx < order.items.length - 1 ? "1px solid #f0f0f0" : "none",
                  fontSize: "11px",
                }}>
                  <div style={{ flex: 3 }}>
                    <div style={{ fontWeight: 700, color: "#111", fontSize: "12px" }}>{item.title}</div>
                    <div style={{ color: "#888", fontSize: "10px", marginTop: "2px" }}>{variantLabel(item.variant)}</div>
                  </div>
                  <div style={{ flex: 1, textAlign: "center", fontWeight: 700, color: "#555" }}>×{item.quantity}</div>
                  <div style={{ flex: 1, textAlign: "right", color: "#555" }}>₹{item.price}</div>
                  <div style={{ flex: 1, textAlign: "right", fontWeight: 700, color: "#111" }}>₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div style={{ border: "1px solid #e5e5e5", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ background: "#f8f8f6", padding: "9px 14px", fontSize: "10px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "#555", borderBottom: "1px solid #e5e5e5" }}>
              PRICING BREAKDOWN
            </div>
            <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "7px", fontSize: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#555" }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600 }}>₹{order.pricing.subtotal}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#555" }}>
                <span>Shipping</span>
                <span style={{ fontWeight: 600 }}>{order.pricing.shippingCost === 0 ? "FREE" : `₹${order.pricing.shippingCost}`}</span>
              </div>
              {order.pricing.discountAmount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a" }}>
                  <span>Coupon ({order.couponCode})</span>
                  <span style={{ fontWeight: 700 }}>−₹{order.pricing.discountAmount}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #111", paddingTop: "8px", marginTop: "4px" }}>
                <span style={{ fontWeight: 900, fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>GRAND TOTAL</span>
                <span style={{ fontWeight: 900, fontSize: "18px" }}>₹{order.pricing.total}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div style={{ border: "1px solid #e5e5e5", borderRadius: "8px", padding: "12px 14px", fontSize: "11px", display: "flex", flexDirection: "column", gap: "5px" }}>
            <div style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "#888", marginBottom: "3px" }}>Payment</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#555" }}>Method</span>
              <span style={{ fontWeight: 700, color: "#111" }}>{order.paymentMethod}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#555" }}>Status</span>
              <span style={{
                fontWeight: 700,
                color: order.paymentStatus === "Paid" ? "#16a34a" : order.paymentStatus === "Failed" ? "#dc2626" : "#d97706",
              }}>{order.paymentStatus}</span>
            </div>
            {order.razorpayPaymentId && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#555" }}>Razorpay ID</span>
                <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#666" }}>{order.razorpayPaymentId}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── COD BANNER ────────────────────────────────────────────── */}
      {isCOD && (
        <div style={{
          background: "#dc2626",
          color: "#ffffff",
          borderRadius: "8px",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>💰</span>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", opacity: 0.85 }}>Cash on Delivery</div>
              <div style={{ fontSize: "10px", opacity: 0.75, marginTop: "2px" }}>
                Shipping of ₹{order.pricing.shippingCost} already paid online
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", opacity: 0.85 }}>Collect from Customer</div>
            <div style={{ fontSize: "26px", fontWeight: 900, lineHeight: 1, marginTop: "2px" }}>₹{codAmount}</div>
          </div>
        </div>
      )}

      {/* ── ORDER STATUS & SHIPROCKET STATUS ──────────────────────── */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <div style={{ flex: 1, border: "1px solid #e5e5e5", borderRadius: "8px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px" }}>
          <span style={{ fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "10px" }}>Order Status</span>
          <span style={{ fontWeight: 900, color: "#111" }}>{order.orderStatus}</span>
        </div>
        {order.shiprocketStatus && (
          <div style={{ flex: 1, border: "1px solid #e5e5e5", borderRadius: "8px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px" }}>
            <span style={{ fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "10px" }}>Courier Status</span>
            <span style={{ fontWeight: 900, color: "#7c3aed" }}>{order.shiprocketStatus}</span>
          </div>
        )}
        {order.trackingUrl && (
          <div style={{ flex: 1, border: "1px solid #e5e5e5", borderRadius: "8px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px" }}>
            <span style={{ fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "10px" }}>Track Link</span>
            <span style={{ fontWeight: 700, color: "#2563eb", fontSize: "10px" }}>shiprocket.co/tracking</span>
          </div>
        )}
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid #e5e5e5", paddingTop: "14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: "9px", color: "#aaa" }}>
          Generated by Sustento Admin · {new Date().toLocaleString("en-IN")}
        </div>
        <div style={{ fontSize: "9px", color: "#aaa", fontWeight: 600 }}>
          {order.items.length} item{order.items.length !== 1 ? "s" : ""} · Wt: {order.items.reduce((s, i) => s + i.quantity, 0)} units
        </div>
        <div style={{ fontSize: "9px", color: "#aaa" }}>sustento.in</div>
      </div>
    </div>
  );
}

// ── Label Modal ────────────────────────────────────────────────────────────
function BarcodeLabelModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const labelRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [printing, setPrinting] = useState(false);

  const handleDownloadPDF = async () => {
    if (!labelRef.current) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(labelRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: labelRef.current.scrollWidth,
        height: labelRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Sustento-Label-${order.orderNumber}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Please try Print instead.");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    if (!labelRef.current) return;
    setPrinting(true);
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) { setPrinting(false); return; }

    // Clone the label node
    const clone = labelRef.current.cloneNode(true) as HTMLElement;
    clone.style.transform = "none";
    clone.style.width = "794px";

    printWindow.document.write(`<!DOCTYPE html><html><head><title>Shipping Label – ${order.orderNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #fff; }
        @page { margin: 8mm; size: A4 landscape; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style></head><body>${clone.outerHTML}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      setPrinting(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#f8f8f6] rounded-3xl shadow-2xl w-full max-w-[900px] flex flex-col overflow-hidden max-h-[95vh]">

        {/* Modal top bar */}
        <div className="flex items-center justify-between px-7 py-5 bg-white border-b border-black/5 shrink-0">
          <div>
            <h3 className="font-primary font-black text-lg uppercase tracking-wide text-dark">🏷️ Shipping Label</h3>
            <p className="text-xs font-medium text-charcoal/50 mt-0.5">Order {order.orderNumber} · Full details label</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Download PDF button */}
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-60 text-white font-primary font-black text-xs uppercase tracking-wider rounded-full shadow-md cursor-pointer transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed"
            >
              {downloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
            {/* Print button */}
            <button
              onClick={handlePrint}
              disabled={printing}
              className="flex items-center gap-2 px-5 py-2.5 bg-dark hover:bg-dark/90 disabled:opacity-60 text-white font-primary font-black text-xs uppercase tracking-wider rounded-full cursor-pointer transition-all hover:-translate-y-0.5"
            >
              {printing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-6 0v4H9v-4h6z" />
                  </svg>
                  Print
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 border border-black/10 hover:border-black/30 text-charcoal/60 hover:text-dark rounded-full flex items-center justify-center cursor-pointer transition-all text-sm ml-1"
            >✕</button>
          </div>
        </div>

        {/* Scrollable label preview */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="bg-white rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] border border-black/5 overflow-hidden">
            {/* Scale the 794px label to fit inside modal */}
            <div
              style={{
                transformOrigin: "top left",
                transform: "scale(0.85)",
                width: "794px",
                marginBottom: `calc((794px * 0.85 - 794px) * 0.5)`,
              }}
              ref={labelRef}
            >
              <ShippingLabelContent order={order} />
            </div>
          </div>
          <p className="text-center text-[10px] text-charcoal/40 font-medium mt-4 uppercase tracking-wider">
            Preview — actual PDF is full resolution (A4 landscape)
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Orders Page ─────────────────────────────────────────────────
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [shiprocketLoading, setShiprocketLoading] = useState<Record<string, boolean>>({});
  const [syncLoading, setSyncLoading] = useState<Record<string, boolean>>({});
  const [labelOrder, setLabelOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to load admin orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdateStatus = async (orderId: string, updates: Partial<Order>) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
        if (selectedOrder?._id === orderId) setSelectedOrder(updated);
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleCreateShipment = async (orderId: string) => {
    setShiprocketLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch("/api/shiprocket/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ Shipment Created!\nAWB: ${data.awbCode || "Pending"}\nCourier: ${data.courierName || "Assigning..."}`);
        fetchOrders();
        setSelectedOrder(null);
      } else {
        alert(`❌ Failed: ${data.error}`);
      }
    } catch (err) {
      alert("Network error while creating shipment.");
    } finally {
      setShiprocketLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleSyncTracking = async (orderId: string) => {
    setSyncLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch("/api/shiprocket/sync-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ Synced!\nStatus: ${data.currentStatus}\nOrder Updated: ${data.orderStatus}`);
        fetchOrders();
        setSelectedOrder(null);
      } else {
        alert(`❌ Sync failed: ${data.error}`);
      }
    } catch (err) {
      alert("Network error while syncing tracking.");
    } finally {
      setSyncLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const totalOrdersCount = orders.length;
  const netRevenue = orders.filter((o) => o.paymentStatus === "Paid").reduce((sum, o) => sum + o.pricing.total, 0);
  const pendingFulfillmentsCount = orders.filter((o) => o.orderStatus === "Processing" || o.orderStatus === "Shipped").length;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerInfo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerInfo.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerInfo.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "ALL" || order.orderStatus.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 text-left">

      {/* ── METRICS ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/40 block mb-1">Total Purchases</span>
            <span className="text-3xl font-black text-dark">{totalOrdersCount}</span>
          </div>
          <span className="text-3xl bg-[#9EAB75]/10 p-3.5 rounded-2xl">🛍️</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/40 block mb-1">Net Sales Revenue</span>
            <span className="text-3xl font-black text-dark">₹{netRevenue}</span>
          </div>
          <span className="text-3xl bg-emerald-50 p-3.5 rounded-2xl">💵</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/40 block mb-1">Pending Fulfillments</span>
            <span className="text-3xl font-black text-dark">{pendingFulfillmentsCount}</span>
          </div>
          <span className="text-3xl bg-amber-50 p-3.5 rounded-2xl">📦</span>
        </div>
      </div>

      {/* ── SEARCH & FILTER ─────────────────────────────────────────── */}
      <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search by Order #, Name, Email or Phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#FAF9F5] border border-black/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-dark w-full md:max-w-md"
        />
        <div className="flex flex-wrap gap-2">
          {["ALL", "PROCESSING", "SHIPPED", "OUT FOR DELIVERY", "DELIVERED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
                statusFilter === status ? "bg-dark border-dark text-white" : "bg-white border-black/10 hover:border-black/35 text-charcoal/70"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ── ORDERS TABLE ────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-yellow border-t-transparent rounded-full animate-spin" />
            <p className="font-bold text-xs uppercase tracking-wider text-charcoal/60">Fetching Orders List...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center">
            <span className="text-4xl block mb-3">📭</span>
            <p className="font-bold text-sm uppercase tracking-wider text-charcoal/40">No orders found matching filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-black/5">
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider">ORDER #</th>
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider">CUSTOMER</th>
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider">DATE</th>
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider">TOTAL</th>
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider">PAYMENT</th>
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider">STATUS</th>
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider">AWB</th>
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#FAF9F5]/30 transition-colors">
                    <td className="px-6 py-4 font-black text-dark text-[13px] tracking-wide">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-dark text-sm">{order.customerInfo.name}</span>
                        <span className="text-xs text-charcoal/50 font-medium">{order.customerInfo.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-charcoal/60 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-6 py-4 font-bold text-dark">₹{order.pricing.total}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => handleUpdateStatus(order._id, { paymentStatus: e.target.value as any })}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border focus:outline-none ${
                          order.paymentStatus === "Paid" ? "bg-green-50 border-green-200 text-green-700"
                          : order.paymentStatus === "Pending" ? "bg-amber-50 border-amber-200 text-amber-700"
                          : "bg-red-50 border-red-200 text-red-700"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order._id, { orderStatus: e.target.value as any })}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border focus:outline-none ${
                          order.orderStatus === "Delivered" ? "bg-green-50 border-green-200 text-green-700"
                          : order.orderStatus === "Processing" ? "bg-blue-50 border-blue-200 text-blue-700"
                          : order.orderStatus === "Shipped" ? "bg-purple-50 border-purple-200 text-purple-700"
                          : order.orderStatus === "Out For Delivery" ? "bg-orange-50 border-orange-200 text-orange-700"
                          : "bg-red-50 border-red-200 text-red-700"
                        }`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out For Delivery">Out For Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {order.awbCode ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono font-bold text-[11px] text-dark tracking-wider">{order.awbCode}</span>
                          {order.courierName && <span className="text-[9px] font-bold text-charcoal/40 uppercase">{order.courierName}</span>}
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-charcoal/30 uppercase tracking-wider">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.awbCode && (
                          <button
                            onClick={() => setLabelOrder(order)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] uppercase tracking-wider rounded-lg cursor-pointer transition-colors border border-blue-200"
                          >
                            🏷️ Label
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-4 py-1.5 bg-dark hover:bg-dark/90 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm cursor-pointer transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── BARCODE LABEL MODAL ─────────────────────────────────────── */}
      {labelOrder && (
        <BarcodeLabelModal order={labelOrder} onClose={() => setLabelOrder(null)} />
      )}

      {/* ── DETAILS DRAWER ──────────────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[3000] flex justify-end">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-[0_0_40px_rgba(0,0,0,0.12)] flex flex-col p-6 overflow-y-auto animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-black/5 mb-6">
              <div>
                <span className="font-accent text-2xl font-bold text-dark block leading-none mb-1">Details</span>
                <span className="font-primary font-black uppercase text-xs text-charcoal/40 tracking-wider">Order {selectedOrder.orderNumber}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 border border-black/5 hover:border-black/20 text-charcoal rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-105"
              >✕</button>
            </div>

            {/* Customer info */}
            <div className="bg-[#FAF9F5] border border-black/5 rounded-2xl p-4 mb-6 text-sm flex flex-col gap-3">
              <span className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50 border-b border-black/5 pb-2">Shipping Information</span>
              <div className="grid grid-cols-1 gap-2.5">
                <div>
                  <span className="text-xs text-charcoal/40 font-bold uppercase block">Recipient</span>
                  <span className="font-bold text-dark">{selectedOrder.customerInfo.name}</span>
                </div>
                <div>
                  <span className="text-xs text-charcoal/40 font-bold uppercase block">Contact</span>
                  <span className="font-medium text-dark">{selectedOrder.customerInfo.phone} · {selectedOrder.customerInfo.email}</span>
                </div>
                <div>
                  <span className="text-xs text-charcoal/40 font-bold uppercase block">Address</span>
                  <span className="font-medium text-dark">
                    {selectedOrder.customerInfo.address}, {selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.state} - {selectedOrder.customerInfo.zip}
                  </span>
                </div>
              </div>
            </div>

            {/* Line items */}
            <div className="flex flex-col gap-4 mb-6">
              <span className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50 border-b border-black/5 pb-2">Line Items</span>
              {selectedOrder.items.map((item) => (
                <div key={`${item.id}-${item.variant}`} className="flex items-center gap-3.5">
                  <div className="relative w-12 h-12 bg-gray-50 border border-black/5 rounded-lg overflow-hidden shrink-0">
                    <Image src={item.imageSrc} alt={item.title} fill sizes="48px" className="object-contain p-0.5" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-primary font-black text-xs text-dark uppercase block truncate">{item.title}</span>
                    <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wide">
                      {item.variant === "single" ? "Single" : item.variant === "pack3" ? "Pack of 3" : "Pack of 5"} × {item.quantity}
                    </span>
                  </div>
                  <span className="font-primary font-black text-xs text-dark shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="mt-auto border-t border-black/5 pt-5 text-sm flex flex-col gap-3">
              <div className="flex items-center justify-between text-charcoal/60"><span>Subtotal</span><span className="font-semibold text-dark">₹{selectedOrder.pricing.subtotal}</span></div>
              <div className="flex items-center justify-between text-charcoal/60"><span>Shipping</span><span className="font-semibold text-dark">{selectedOrder.pricing.shippingCost === 0 ? "FREE" : `₹${selectedOrder.pricing.shippingCost}`}</span></div>
              {selectedOrder.pricing.discountAmount > 0 && (
                <div className="flex items-center justify-between text-green-600 font-bold">
                  <span>Coupon ({selectedOrder.couponCode})</span>
                  <span>-₹{selectedOrder.pricing.discountAmount}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-black/5 pt-4 text-dark font-primary font-black text-base uppercase">
                <span>Grand Total</span>
                <span className="text-xl">₹{selectedOrder.pricing.total}</span>
              </div>

              {selectedOrder.paymentMethod === "COD" && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs flex flex-col gap-2.5 font-bold mt-2">
                  <div className="flex justify-between text-amber-900"><span>Shipping (Paid Online)</span><span>₹{selectedOrder.pricing.shippingCost}</span></div>
                  <div className="flex justify-between text-[#CC2828] text-sm font-black border-t border-amber-200/50 pt-2 uppercase">
                    <span>COD Collectable</span>
                    <span>₹{selectedOrder.pricing.codAmountToCollect ?? (selectedOrder.pricing.total - selectedOrder.pricing.shippingCost)}</span>
                  </div>
                </div>
              )}

              {/* Payment meta */}
              <div className="mt-2 bg-[#FAF9F5] border border-black/5 rounded-2xl p-3 text-xs text-charcoal/50 flex flex-col gap-2 font-medium">
                <div className="flex justify-between"><span>Payment Method</span><span className="font-bold text-dark">{selectedOrder.paymentMethod}</span></div>
                {selectedOrder.razorpayOrderId && <div className="flex justify-between"><span>Razorpay Order</span><span className="font-mono text-dark">{selectedOrder.razorpayOrderId}</span></div>}
                {selectedOrder.razorpayPaymentId && <div className="flex justify-between"><span>Razorpay Payment</span><span className="font-mono text-dark">{selectedOrder.razorpayPaymentId}</span></div>}
              </div>

              {/* Shiprocket section */}
              <div className="mt-5 border-t border-black/5 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50">🚚 Shiprocket</span>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {selectedOrder.awbCode && (
                      <button
                        onClick={() => setLabelOrder(selectedOrder)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-[10px] uppercase tracking-wide rounded-lg cursor-pointer transition-colors"
                      >
                        🏷️ Print / PDF Label
                      </button>
                    )}
                    {!selectedOrder.shiprocketOrderId && (
                      <button
                        onClick={() => handleCreateShipment(selectedOrder._id)}
                        disabled={shiprocketLoading[selectedOrder._id]}
                        className="px-3 py-1.5 bg-[#9EAB75] hover:bg-[#f0cc44] text-dark font-bold text-[10px] uppercase tracking-wide rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                      >
                        {shiprocketLoading[selectedOrder._id] ? "Creating..." : "Create Shipment"}
                      </button>
                    )}
                    {selectedOrder.awbCode && (
                      <button
                        onClick={() => handleSyncTracking(selectedOrder._id)}
                        disabled={syncLoading[selectedOrder._id]}
                        className="px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 font-bold text-[10px] uppercase tracking-wide rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                      >
                        {syncLoading[selectedOrder._id] ? "Syncing..." : "↻ Sync"}
                      </button>
                    )}
                  </div>
                </div>
                <div className="bg-[#FAF9F5] border border-black/5 rounded-2xl p-3 text-xs flex flex-col gap-2 font-medium">
                  {selectedOrder.shiprocketOrderId ? (
                    <>
                      <div className="flex justify-between"><span className="text-charcoal/40">Shiprocket Order ID</span><span className="font-mono text-dark">{selectedOrder.shiprocketOrderId}</span></div>
                      {selectedOrder.awbCode && <div className="flex justify-between items-center"><span className="text-charcoal/40">AWB No.</span><span className="font-black text-dark tracking-widest text-sm">{selectedOrder.awbCode}</span></div>}
                      {selectedOrder.courierName && <div className="flex justify-between"><span className="text-charcoal/40">Courier</span><span className="font-bold text-dark">{selectedOrder.courierName}</span></div>}
                      {selectedOrder.shiprocketStatus && <div className="flex justify-between"><span className="text-charcoal/40">Status</span><span className="font-bold text-purple-700">{selectedOrder.shiprocketStatus}</span></div>}
                      {selectedOrder.trackingUrl && !selectedOrder.awbCode?.startsWith("MOCK") && (
                        <a href={selectedOrder.trackingUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block text-center w-full bg-dark text-white py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-dark/90 transition-colors">
                          Track on Courier Website →
                        </a>
                      )}
                    </>
                  ) : (
                    <p className="text-charcoal/40 text-center py-1">No shipment yet. Click &ldquo;Create Shipment&rdquo; to dispatch.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
