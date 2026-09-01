"use client";

import React, { useState, useEffect } from "react";
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [shiprocketLoading, setShiprocketLoading] = useState<Record<string, boolean>>({});
  const [syncLoading, setSyncLoading] = useState<Record<string, boolean>>({});

  // Fetch orders from API
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

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status fields
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
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(updated);
        }
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Create Shiprocket shipment manually
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

  // Manually sync tracking status from Shiprocket
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

  // Metrics Calculations
  const totalOrdersCount = orders.length;
  const netRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.pricing.total, 0);
  const pendingFulfillmentsCount = orders.filter(
    (o) => o.orderStatus === "Processing" || o.orderStatus === "Shipped"
  ).length;

  // Filters
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerInfo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerInfo.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerInfo.phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === "ALL" || order.orderStatus.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 text-left">
      
      {/* ── METRICS SECTION ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/40 block mb-1">Total Purchases</span>
            <span className="text-3xl font-black text-dark">{totalOrdersCount}</span>
          </div>
          <span className="text-3xl bg-[#9EAB75]/10 p-3.5 rounded-2xl">🛍️</span>
        </div>
        {/* Metric 2 */}
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/40 block mb-1">Net Sales Revenue</span>
            <span className="text-3xl font-black text-dark">₹{netRevenue}</span>
          </div>
          <span className="text-3xl bg-emerald-50 p-3.5 rounded-2xl">💵</span>
        </div>
        {/* Metric 3 */}
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/40 block mb-1">Pending Fulfillments</span>
            <span className="text-3xl font-black text-dark">{pendingFulfillmentsCount}</span>
          </div>
          <span className="text-3xl bg-amber-50 p-3.5 rounded-2xl">📦</span>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ───────────────────────────────── */}
      <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by Order #, Name, Email or Phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#FAF9F5] border border-black/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-dark w-full md:max-w-md"
        />

        {/* Quick status tabs */}
        <div className="flex flex-wrap gap-2">
          {["ALL", "PROCESSING", "SHIPPED", "OUT FOR DELIVERY", "DELIVERED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
                statusFilter === status
                  ? "bg-dark border-dark text-white"
                  : "bg-white border-black/10 hover:border-black/35 text-charcoal/70"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ── ORDERS LIST TABLE ──────────────────────────────────────── */}
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
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#FAF9F5]/30 transition-colors">
                    {/* ID */}
                    <td className="px-6 py-4 font-black text-dark text-[13px] tracking-wide">
                      {order.orderNumber}
                    </td>
                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-dark text-sm">{order.customerInfo.name}</span>
                        <span className="text-xs text-charcoal/50 font-medium">{order.customerInfo.phone}</span>
                      </div>
                    </td>
                    {/* Date */}
                    <td className="px-6 py-4 font-medium text-charcoal/60 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    {/* Price */}
                    <td className="px-6 py-4 font-bold text-dark">
                      ₹{order.pricing.total}
                    </td>
                    {/* Payment Status Dropdown */}
                    <td className="px-6 py-4">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => handleUpdateStatus(order._id, { paymentStatus: e.target.value as any })}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border focus:outline-none ${
                          order.paymentStatus === "Paid"
                            ? "bg-green-50 border-green-200 text-green-700"
                            : order.paymentStatus === "Pending"
                            ? "bg-amber-50 border-amber-200 text-amber-700"
                            : "bg-red-50 border-red-200 text-red-700"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </td>
                    {/* Fulfillment Status Dropdown */}
                    <td className="px-6 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order._id, { orderStatus: e.target.value as any })}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border focus:outline-none ${
                          order.orderStatus === "Delivered"
                            ? "bg-green-50 border-green-200 text-green-700"
                            : order.orderStatus === "Processing"
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : order.orderStatus === "Shipped"
                            ? "bg-purple-50 border-purple-200 text-purple-700"
                            : order.orderStatus === "Out For Delivery"
                            ? "bg-orange-50 border-orange-200 text-orange-700"
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
                    {/* View Button */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-1.5 bg-dark hover:bg-dark/90 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm cursor-pointer transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── DETAILS PANEL OVERLAY ──────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[3000] flex justify-end">
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setSelectedOrder(null)}
          />

          {/* Drawer container */}
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
              >
                ✕
              </button>
            </div>

            {/* Customer Details info block */}
            <div className="bg-[#FAF9F5] border border-black/5 rounded-2xl p-4.5 mb-6 text-sm flex flex-col gap-3">
              <span className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50 border-b border-black/5 pb-2">Shipping Information</span>
              <div className="grid grid-cols-1 gap-2.5">
                <div>
                  <span className="text-xs text-charcoal/40 font-bold uppercase block">Recipient</span>
                  <span className="font-bold text-dark">{selectedOrder.customerInfo.name}</span>
                </div>
                <div>
                  <span className="text-xs text-charcoal/40 font-bold uppercase block">Contact Details</span>
                  <span className="font-medium text-dark">{selectedOrder.customerInfo.phone} · {selectedOrder.customerInfo.email}</span>
                </div>
                <div>
                  <span className="text-xs text-charcoal/40 font-bold uppercase block">Shipping Address</span>
                  <span className="font-medium text-dark">
                    {selectedOrder.customerInfo.address}, {selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.state} - {selectedOrder.customerInfo.zip}
                  </span>
                </div>
              </div>
            </div>

            {/* Purchased items breakdown list */}
            <div className="flex flex-col gap-4 mb-6">
              <span className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50 border-b border-black/5 pb-2">Line Items</span>
              {selectedOrder.items.map((item) => (
                <div key={`${item.id}-${item.variant}`} className="flex items-center gap-3.5">
                  <div className="relative w-12 h-12 bg-gray-50 border border-black/5 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                    <Image src={item.imageSrc} alt={item.title} fill sizes="48px" className="object-contain p-0.5" unoptimized={true} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-primary font-black text-xs text-dark uppercase block truncate">{item.title}</span>
                    <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wide">
                      {item.variant === "single" ? "Single Pouch" : item.variant === "pack3" ? "Pack of 3" : "Pack of 5"} × {item.quantity}
                    </span>
                  </div>
                  <span className="font-primary font-black text-xs text-dark shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Order pricing breakdown calculations */}
            <div className="mt-auto border-t border-black/5 pt-5 text-sm flex flex-col gap-3">
              <div className="flex items-center justify-between text-charcoal/60">
                <span>Subtotal</span>
                <span className="font-semibold text-dark">₹{selectedOrder.pricing.subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-charcoal/60">
                <span>Shipping Fees</span>
                <span className="font-semibold text-dark">
                  {selectedOrder.pricing.shippingCost === 0 ? "FREE" : `₹${selectedOrder.pricing.shippingCost}`}
                </span>
              </div>
              {selectedOrder.pricing.discountAmount > 0 && (
                <div className="flex items-center justify-between text-green-600 font-bold">
                  <span>Coupon Applied ({selectedOrder.couponCode})</span>
                  <span>-₹{selectedOrder.pricing.discountAmount}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-black/5 pt-4 text-dark font-primary font-black text-base uppercase">
                <span>Grand Total</span>
                <span className="text-xl">₹{selectedOrder.pricing.total}</span>
              </div>

              {selectedOrder.paymentMethod === "COD" && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs flex flex-col gap-2.5 font-bold mt-2 text-left">
                  <div className="flex justify-between text-amber-900">
                    <span>Shipping Charges (Paid Online)</span>
                    <span>₹{selectedOrder.pricing.shippingCost}</span>
                  </div>
                  <div className="flex justify-between text-[#CC2828] text-sm font-black border-t border-amber-200/50 pt-2 uppercase">
                    <span>COD Collectable Amount</span>
                    <span>
                      ₹{selectedOrder.pricing.codAmountToCollect !== undefined 
                        ? selectedOrder.pricing.codAmountToCollect 
                        : (selectedOrder.pricing.total - selectedOrder.pricing.shippingCost)}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Payment Details metadata summary */}
              <div className="mt-2 bg-[#FAF9F5] border border-black/5 rounded-2xl p-3 text-xs text-charcoal/50 flex flex-col gap-2 font-medium">
                <div className="flex justify-between">
                  <span>Payment Gateway</span>
                  <span className="font-bold text-dark">{selectedOrder.paymentMethod}</span>
                </div>
                {selectedOrder.razorpayOrderId && (
                  <div className="flex justify-between">
                    <span>Razorpay Order ID</span>
                    <span className="font-mono text-dark">{selectedOrder.razorpayOrderId}</span>
                  </div>
                )}
                {selectedOrder.razorpayPaymentId && (
                  <div className="flex justify-between">
                    <span>Razorpay Payment ID</span>
                    <span className="font-mono text-dark">{selectedOrder.razorpayPaymentId}</span>
                  </div>
                )}
              </div>

              {/* ── Shiprocket Shipping Info ────────────────────────── */}
              <div className="mt-5 border-t border-black/5 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50">🚚 Shiprocket Shipment</span>
                  <div className="flex items-center gap-2">
                    {/* Create Shipment button — shown when no Shiprocket order yet */}
                    {!selectedOrder.shiprocketOrderId && (
                      <button
                        onClick={() => handleCreateShipment(selectedOrder._id)}
                        disabled={shiprocketLoading[selectedOrder._id]}
                        className="px-3 py-1.5 bg-[#9EAB75] hover:bg-[#f0cc44] text-dark font-bold text-[10px] uppercase tracking-wide rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                      >
                        {shiprocketLoading[selectedOrder._id] ? "Creating..." : "Create Shipment"}
                      </button>
                    )}
                    {/* Sync button — shown when AWB exists */}
                    {selectedOrder.awbCode && (
                      <button
                        onClick={() => handleSyncTracking(selectedOrder._id)}
                        disabled={syncLoading[selectedOrder._id]}
                        className="px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 font-bold text-[10px] uppercase tracking-wide rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                      >
                        {syncLoading[selectedOrder._id] ? "Syncing..." : "↻ Sync Status"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-[#FAF9F5] border border-black/5 rounded-2xl p-3 text-xs flex flex-col gap-2 font-medium">
                  {selectedOrder.shiprocketOrderId ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-charcoal/40">Shiprocket Order ID</span>
                        <span className="font-mono text-dark">{selectedOrder.shiprocketOrderId}</span>
                      </div>
                      {selectedOrder.awbCode && (
                        <div className="flex justify-between">
                          <span className="text-charcoal/40">AWB / Tracking No.</span>
                          <span className="font-black text-dark tracking-wider">{selectedOrder.awbCode}</span>
                        </div>
                      )}
                      {selectedOrder.courierName && (
                        <div className="flex justify-between">
                          <span className="text-charcoal/40">Courier Partner</span>
                          <span className="font-bold text-dark">{selectedOrder.courierName}</span>
                        </div>
                      )}
                      {selectedOrder.shiprocketStatus && (
                        <div className="flex justify-between">
                          <span className="text-charcoal/40">Shiprocket Status</span>
                          <span className="font-bold text-purple-700">{selectedOrder.shiprocketStatus}</span>
                        </div>
                      )}
                      {selectedOrder.trackingUrl && !selectedOrder.awbCode?.startsWith("MOCK") && (
                        <a
                          href={selectedOrder.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 block text-center w-full bg-dark text-white py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-dark/90 transition-colors"
                        >
                          Track on Courier Website →
                        </a>
                      )}
                    </>
                  ) : (
                    <p className="text-charcoal/40 text-center py-1">No shipment created yet. Click &ldquo;Create Shipment&rdquo; to dispatch.</p>
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
