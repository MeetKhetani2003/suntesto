"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface OrderItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  variant: string;
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  pricing: {
    total: number;
  };
  createdAt: string;
  items: OrderItem[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Tab State
  const [activeTab, setActiveTab] = useState<"orders" | "details">("orders");

  // Profile Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saveError, setSaveError] = useState("");

  // Route protection
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/profile");
    }
  }, [status, router]);

  // Load profile and orders
  useEffect(() => {
    if (status === "authenticated") {
      // Fetch Profile
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((user) => {
          if (user) {
            setFormData({
              name: user.name || "",
              email: user.email || "",
              phone: user.phone || "",
              address: user.address || "",
              city: user.city || "",
              state: user.state || "",
              zip: user.zip || "",
            });
          }
          setLoadingProfile(false);
        })
        .catch((err) => {
          console.error("Error loading profile:", err);
          setLoadingProfile(false);
        });

      // Fetch Orders
      fetch("/api/user/orders")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setOrders(data);
          }
          setLoadingOrders(false);
        })
        .catch((err) => {
          console.error("Error loading orders:", err);
          setLoadingOrders(false);
        });
    }
  }, [status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveSuccess("");
    setSaveError("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSaveSuccess("Profile updated successfully!");
      } else {
        setSaveError(data.error || "Failed to update profile details.");
      }
    } catch (err) {
      setSaveError("Something went wrong. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  if (status === "loading" || status === "unauthenticated" || loadingProfile) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center font-primary text-charcoal">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow border-t-transparent rounded-full animate-spin" />
          <p className="font-bold uppercase tracking-wider text-xs">Loading profile dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="w-full bg-[#fffff9] pt-32 pb-20 min-h-[80vh] select-none text-left">
        <div className="max-w-[1000px] mx-auto px-6">
          
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-black/5 pb-8">
            <div className="flex items-center gap-4">
              {session?.user?.image ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-[#9EAB75] shrink-0 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={session.user.image} alt={session.user.name || "User Avatar"} className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#9EAB75] text-dark flex items-center justify-center font-primary font-black text-2xl uppercase border-4 border-white shadow-sm shrink-0">
                  {session?.user?.name ? session.user.name.charAt(0) : "U"}
                </div>
              )}
              <div>
                <h1 className="font-primary font-black text-2xl sm:text-3xl text-charcoal leading-none uppercase tracking-tight">
                  HEllo, {session?.user?.name?.split(" ")[0] || "User"}!
                </h1>
                <p className="text-sm font-medium text-charcoal/50 mt-1">{session?.user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-6 py-3 border border-red-200 text-red-600 hover:bg-red-50 font-primary font-black text-xs uppercase tracking-wider rounded-full shadow-sm cursor-pointer transition-all hover:scale-105 active:scale-95 text-center md:self-center self-start"
            >
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* ── LEFT TABS COLUMN ─────────────────────────────── */}
            <div className="md:col-span-3 flex flex-row md:flex-col gap-2 border-b md:border-b-0 md:border-r border-black/5 pb-4 md:pb-0 md:pr-4">
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex-1 md:flex-initial text-left px-5 py-3.5 rounded-2xl font-primary font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "orders" 
                    ? "bg-[#9EAB75] text-dark shadow-sm" 
                    : "text-charcoal/55 hover:bg-black/5"
                }`}
              >
                🛍️ My Orders
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`flex-1 md:flex-initial text-left px-5 py-3.5 rounded-2xl font-primary font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "details" 
                    ? "bg-[#9EAB75] text-dark shadow-sm" 
                    : "text-charcoal/55 hover:bg-black/5"
                }`}
              >
                ⚙️ Account details
              </button>
            </div>

            {/* ── RIGHT VIEW COLUMN ────────────────────────────── */}
            <div className="md:col-span-9">
              {/* Tab 1: Orders */}
              {activeTab === "orders" && (
                <div className="flex flex-col gap-6">
                  <h2 className="text-lg font-black uppercase text-dark tracking-tight">Order History</h2>
                  
                  {loadingOrders ? (
                    <div className="flex flex-col items-center py-12 gap-3">
                      <div className="w-8 h-8 border-3 border-yellow border-t-transparent rounded-full animate-spin" />
                      <p className="font-bold text-xs uppercase tracking-wider text-charcoal/40">Loading your orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="bg-white rounded-[32px] p-10 border border-black/5 text-center flex flex-col items-center gap-4">
                      <span className="text-4xl">🛍️</span>
                      <h3 className="font-primary font-black text-base uppercase text-charcoal">No orders placed yet</h3>
                      <p className="text-sm text-charcoal/50 max-w-[280px]">Check out our selection of premium snacks and place your first order!</p>
                      <Link href="/collections/all" className="mt-2 font-primary font-black text-xs uppercase tracking-wider bg-black text-white hover:bg-dark/90 rounded-full px-8 py-3.5 shadow-md hover:-rotate-1 transition-all duration-200">
                        Shop Now
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">
                      {orders.map((order) => (
                        <div key={order._id} className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          {/* Card Header Bar */}
                          <div className="bg-stone-50 border-b border-black/5 px-6 py-4.5 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                              <div>
                                <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest block">Order ID</span>
                                <span className="font-primary font-black text-sm text-dark">{order.orderNumber}</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest block">Placed On</span>
                                <span className="text-xs font-semibold text-charcoal/80">
                                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                    day: "numeric", month: "short", year: "numeric"
                                  })}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest block">Total Price</span>
                                <span className="font-primary font-black text-sm text-dark">₹{order.pricing.total}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                order.orderStatus === "Delivered" 
                                  ? "bg-green-100 text-green-700" 
                                  : order.orderStatus === "Cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow/20 text-yellow-800"
                              }`}>
                                {order.orderStatus}
                              </span>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1 flex flex-col gap-3">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <span className="font-primary font-black text-xs text-charcoal">{item.title}</span>
                                  <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wider bg-black/5 px-2 py-0.5 rounded">
                                    {item.variant === "single" ? "Single Pouch" : item.variant === "pack3" ? "Pack of 3" : "Pack of 5"} × {item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <Link
                                href={`/track/${order.orderNumber}`}
                                className="px-6 py-3.5 bg-[#9EAB75] hover:bg-[#FFC933] text-dark font-primary font-black text-xs uppercase tracking-wider rounded-full shadow-sm text-center block transition-all"
                              >
                                Track Order 🚚
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Profile Details */}
              {activeTab === "details" && (
                <div className="bg-white border border-black/5 rounded-3xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-lg font-black uppercase text-dark tracking-tight mb-6">Account Information</h2>
                  
                  <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5">
                    {/* Status Alert Messages */}
                    {saveSuccess && <div className="p-4 bg-green-50 border border-green-200 text-green-700 font-semibold rounded-2xl text-xs">{saveSuccess}</div>}
                    {saveError && <div className="p-4 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-2xl text-xs">{saveError}</div>}

                    {/* Name & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-[#FAF9F5] border border-black/10 rounded-full px-5 py-3 text-sm font-medium focus:outline-none focus:border-dark transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50">Email Address (Read-only)</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="w-full bg-[#FAF9F5]/50 border border-black/5 text-charcoal/40 rounded-full px-5 py-3 text-sm font-medium focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 9876543210"
                        maxLength={10}
                        className="w-full bg-[#FAF9F5] border border-black/10 rounded-full px-5 py-3 text-sm font-medium focus:outline-none focus:border-dark transition-colors"
                      />
                    </div>

                    <div className="my-2 border-t border-black/5 pt-2" />
                    <h3 className="font-primary font-black text-xs uppercase tracking-widest text-charcoal/40">Default Shipping Address</h3>

                    {/* Address Text Area */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50">Street Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Flat No, Wing, Building Name, Street Name"
                        rows={2}
                        className="w-full bg-[#FAF9F5] border border-black/10 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-dark transition-colors resize-none"
                      />
                    </div>

                    {/* City, State, Pincode */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="e.g. Mumbai"
                          className="w-full bg-[#FAF9F5] border border-black/10 rounded-full px-5 py-3 text-sm font-medium focus:outline-none focus:border-dark transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="e.g. Maharashtra"
                          className="w-full bg-[#FAF9F5] border border-black/10 rounded-full px-5 py-3 text-sm font-medium focus:outline-none focus:border-dark transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50">Pincode</label>
                        <input
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          placeholder="e.g. 400001"
                          maxLength={6}
                          className="w-full bg-[#FAF9F5] border border-black/10 rounded-full px-5 py-3 text-sm font-medium focus:outline-none focus:border-dark transition-colors"
                        />
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      disabled={saveLoading}
                      className="mt-4 w-full bg-black hover:bg-dark/95 text-white font-primary font-black text-[13px] uppercase tracking-wider py-4 rounded-full shadow-md hover:-rotate-1 transition-all duration-200 cursor-pointer text-center block disabled:opacity-50"
                    >
                      {saveLoading ? "Saving Changes..." : "Save Information"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
