"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  _id: string;
  title: string;
  costPrice: number;
  originalPrice: number;
  price: number;
  stockQuantity: number;
  inStock: boolean;
  lowStockThreshold?: number;
}

interface Coupon {
  _id: string;
  code: string;
  isActive: boolean;
}

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
  };
  items: OrderItem[];
  pricing: {
    subtotal: number;
    shippingCost: number;
    discountAmount: number;
    total: number;
  };
  couponCode?: string;
  paymentMethod: "COD" | "CARD" | "UPI" | "ONLINE";
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
}

export default function AdminDashboardOverview() {
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, coupRes, ordRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/coupons"),
          fetch("/api/admin/orders"),
        ]);

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
        }

        if (coupRes.ok) {
          const coupData = await coupRes.json();
          setCoupons(coupData);
        }

        if (ordRes.ok) {
          const ordData = await ordRes.json();
          setOrders(ordData);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.stockQuantity > 0).length;
  const outOfStockCount = products.filter((p) => p.stockQuantity <= 0).length;
  const lowStockCount = products.filter(
    (p) => p.stockQuantity > 0 && p.stockQuantity <= (p.lowStockThreshold || 5)
  ).length;

  const totalInventoryUnits = products.reduce((acc, p) => acc + (p.stockQuantity || 0), 0);
  const totalCostValue = products.reduce(
    (acc, p) => acc + (p.costPrice || 0) * (p.stockQuantity || 0),
    0
  );
  const totalSalesValue = products.reduce(
    (acc, p) => acc + (p.price || 0) * (p.stockQuantity || 0),
    0
  );

  const activeCoupons = coupons.filter((c) => c.isActive).length;

  // Sales statistics
  const paidOrders = orders.filter((o) => o.paymentStatus === "Paid");
  const totalSalesRevenue = paidOrders.reduce((acc, o) => acc + o.pricing.total, 0);
  const totalOrdersCount = orders.length;
  const averageOrderValue = paidOrders.length > 0 ? Math.round(totalSalesRevenue / paidOrders.length) : 0;

  // Low stock products list
  const lowStockProducts = products.filter(
    (p) => p.stockQuantity <= (p.lowStockThreshold || 5)
  );

  // Recent 5 orders
  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-charcoal font-bold text-sm animate-pulse flex items-center gap-2">
          <span>🔄 Loading Dashboard Statistics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-charcoal to-dark text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <span className="bg-[#9EAB75] text-dark text-[11px] font-black uppercase px-3 py-1 rounded-full">
            Overview
          </span>
          <h2 className="font-primary font-black text-3xl md:text-4xl uppercase tracking-tight mt-3">
            Inventory & Store Control
          </h2>
          <p className="text-white/70 text-sm max-w-xl mt-1 font-medium">
            Manage your fruit snack catalog, cost structures, real-time inventory stock levels, and global discount codes.
          </p>
        </div>
        <div className="absolute right-[-40px] top-[-40px] text-white/5 font-black text-[180px] pointer-events-none">
          SUSTENTO
        </div>
      </div>

      {/* ── Key Metrics Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sales Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
              Total Sales Revenue
            </span>
            <span className="text-2xl">💵</span>
          </div>
          <div className="mt-4">
            <span className="font-primary font-black text-3xl text-dark">
              ₹{totalSalesRevenue.toLocaleString("en-IN")}
            </span>
            <span className="block text-xs font-semibold text-emerald-600 mt-1">
              From Paid Transactions
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
              Total Orders
            </span>
            <span className="text-2xl">🛍️</span>
          </div>
          <div className="mt-4">
            <span className="font-primary font-black text-3xl text-dark">
              {totalOrdersCount}
            </span>
            <span className="block text-xs font-semibold text-blue-600 mt-1">
              Placed Orders Volume
            </span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
              Average Order Value
            </span>
            <span className="text-2xl">📈</span>
          </div>
          <div className="mt-4">
            <span className="font-primary font-black text-3xl text-dark">
              ₹{averageOrderValue}
            </span>
            <span className="block text-xs font-semibold text-purple-600 mt-1">
              AOV per transaction
            </span>
          </div>
        </div>

        {/* Inventory Units */}
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
              Inventory Units
            </span>
            <span className="text-2xl">📦</span>
          </div>
          <div className="mt-4">
            <span className="font-primary font-black text-3xl text-dark">
              {totalInventoryUnits}
            </span>
            <span className="block text-xs font-semibold text-amber-600 mt-1">
              {inStockCount} items in stock
            </span>
          </div>
        </div>
      </div>

      {/* ── Split Layout: Financial Insights & Restock Alerts ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cost vs Selling stats (Private Brand info) */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5">
            <div>
              <h3 className="font-primary font-black text-lg uppercase text-charcoal">
                Internal Brand Valuation
              </h3>
              <p className="text-[11px] font-semibold text-charcoal/50 mt-0.5">
                Private information detailing production vs retail pricing
              </p>
            </div>
            <span className="bg-purple-50 text-purple-700 font-bold text-[10px] uppercase px-2.5 py-1 rounded-full border border-purple-200">
              Client Confidential
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-[#F7F7F5] p-4.5 rounded-2xl">
              <span className="text-[10px] font-bold text-charcoal/60 uppercase block leading-none mb-1">Production Cost</span>
              <span className="font-primary font-black text-xl text-charcoal">
                ₹{totalCostValue.toLocaleString("en-IN")}
              </span>
              <span className="text-[9px] font-semibold text-charcoal/40 block mt-1">
                Cost × Quantity
              </span>
            </div>

            <div className="bg-[#F7F7F5] p-4.5 rounded-2xl">
              <span className="text-[10px] font-bold text-charcoal/60 uppercase block leading-none mb-1">Retail Selling Value</span>
              <span className="font-primary font-black text-xl text-emerald-700">
                ₹{totalSalesValue.toLocaleString("en-IN")}
              </span>
              <span className="text-[9px] font-semibold text-charcoal/40 block mt-1">
                Selling Price × Quantity
              </span>
            </div>

            <div className="bg-[#F7F7F5] p-4.5 rounded-2xl">
              <span className="text-[10px] font-bold text-charcoal/60 uppercase block leading-none mb-1">Potential profit</span>
              <span className="font-primary font-black text-xl text-blue-700">
                ₹{(totalSalesValue - totalCostValue).toLocaleString("en-IN")}
              </span>
              <span className="text-[9px] font-semibold text-charcoal/40 block mt-1">
                Gross margin estimate
              </span>
            </div>
          </div>
        </div>

        {/* Restock Alerts Warning panel */}
        <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5">
            <div>
              <h3 className="font-primary font-black text-lg uppercase text-charcoal">
                Restock Warnings
              </h3>
              <p className="text-[11px] font-semibold text-charcoal/50 mt-0.5">
                Products that are running low or completely out of stock
              </p>
            </div>
            {lowStockProducts.length > 0 && (
              <span className="bg-red-50 text-red-600 font-bold text-[10px] uppercase px-2.5 py-1 rounded-full border border-red-200 animate-pulse">
                ACTION REQ.
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3.5 max-h-[140px] overflow-y-auto pr-1">
            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-xs font-semibold text-charcoal/40 uppercase">
                ✅ All products are well stocked!
              </div>
            ) : (
              lowStockProducts.map((prod) => (
                <div key={prod._id} className="flex items-center justify-between text-sm">
                  <span className="font-bold text-charcoal truncate pr-2">{prod.title}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      prod.stockQuantity === 0
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {prod.stockQuantity} Left
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Recent Orders Feed table ──────────────────────────────── */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5">
          <div>
            <h3 className="font-primary font-black text-xl uppercase text-charcoal">
              Recent Sales Activity
            </h3>
            <p className="text-xs font-semibold text-charcoal/60 mt-0.5">
              The last 5 customer orders placed on the storefront
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-dark hover:underline uppercase tracking-wider"
          >
            View All Orders →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-sm font-semibold text-charcoal/40 uppercase">
            No sales recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="text-charcoal/50 border-b border-black/5">
                  <th className="pb-3 font-black uppercase text-xs tracking-wider">ORDER #</th>
                  <th className="pb-3 font-black uppercase text-xs tracking-wider">CUSTOMER</th>
                  <th className="pb-3 font-black uppercase text-xs tracking-wider">TOTAL</th>
                  <th className="pb-3 font-black uppercase text-xs tracking-wider">PAYMENT</th>
                  <th className="pb-3 font-black uppercase text-xs tracking-wider">FULFILLMENT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#FAF9F5]/30">
                    <td className="py-3 font-black text-dark text-[13px]">{order.orderNumber}</td>
                    <td className="py-3 font-bold text-dark">{order.customerInfo.name}</td>
                    <td className="py-3 font-bold text-charcoal">₹{order.pricing.total}</td>
                    <td className="py-3">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        order.orderStatus === "Delivered"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Quick Action Shortcuts ─────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Link
          href="/admin/products/new"
          className="bg-[#9EAB75] hover:bg-[#869360] text-dark font-black uppercase text-xs px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <span>➕ Add New Product</span>
        </Link>
        <Link
          href="/admin/orders"
          className="bg-charcoal hover:bg-black text-white font-black uppercase text-xs px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <span>🛍️ Manage Orders & Shipments</span>
        </Link>
        <Link
          href="/admin/products"
          className="bg-white border border-black/10 hover:bg-gray-50 text-charcoal font-black uppercase text-xs px-6 py-3.5 rounded-xl transition-all flex items-center gap-2"
        >
          <span>📦 Manage Inventory & Pricing</span>
        </Link>
        <Link
          href="/admin/coupons"
          className="bg-white border border-black/10 hover:bg-gray-50 text-charcoal font-black uppercase text-xs px-6 py-3.5 rounded-xl transition-all flex items-center gap-2"
        >
          <span>🏷️ Manage Store Coupons</span>
        </Link>
      </div>
    </div>
  );
}
