"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface OrderItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice: number;
  imageSrc: string;
  variant: "single" | "pack3" | "pack5" | "combo";
  quantity: number;
}

interface UserOrder {
  _id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  awbCode?: string;
  courierName?: string;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  itemsCount: number;
  items: OrderItem[];
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "customer" | "guest";
  image?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  createdAt: string;
  updatedAt?: string;
  isRegistered: boolean;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate?: string | null;
  orders: UserOrder[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [guestUsers, setGuestUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"ALL_REGISTERED" | "WITH_ORDERS" | "NO_ORDERS" | "ADMINS" | "GUESTS">("ALL_REGISTERED");
  const [sortBy, setSortBy] = useState<"NEWEST" | "OLDEST" | "MOST_ORDERS" | "HIGHEST_SPENT" | "NAME">("NEWEST");

  // Selected user for "More Options" / Details & Order History Drawer
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setGuestUsers(data.guestUsers || []);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    if (userId.startsWith("guest_")) return;
    const newRole = currentRole === "admin" ? "customer" : "admin";
    if (!confirm(`Are you sure you want to change this user's role to '${newRole}'?`)) {
      return;
    }

    setUpdatingRole(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole as any } : u))
        );
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser((prev) => (prev ? { ...prev, role: newRole as any } : null));
        }
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update role");
      }
    } catch (e) {
      alert("Network error updating role");
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (userId.startsWith("guest_")) return;
    if (!confirm(`Are you sure you want to delete the user account for "${userName}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser(null);
        }
        alert("User deleted successfully.");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete user.");
      }
    } catch (e) {
      alert("Network error deleting user.");
    }
  };

  // Metrics computation
  const totalRegisteredCount = users.length;
  const customersWithOrdersCount = users.filter((u) => u.ordersCount > 0).length;
  const totalAdminsCount = users.filter((u) => u.role === "admin").length;
  const totalLifetimeRevenue = users.reduce((sum, u) => sum + u.totalSpent, 0) +
    guestUsers.reduce((sum, g) => sum + g.totalSpent, 0);

  // Determine active list based on filter
  const baseList = filterTab === "GUESTS" ? guestUsers : users;

  const filteredList = baseList.filter((user) => {
    // Search query matching
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      (user.phone && user.phone.toLowerCase().includes(q)) ||
      (user.city && user.city.toLowerCase().includes(q)) ||
      (user.state && user.state.toLowerCase().includes(q)) ||
      (user.zip && user.zip.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    // Filter tab matching
    if (filterTab === "WITH_ORDERS") return user.ordersCount > 0;
    if (filterTab === "NO_ORDERS") return user.ordersCount === 0;
    if (filterTab === "ADMINS") return user.role === "admin";

    return true;
  });

  // Sort list
  const sortedUsers = [...filteredList].sort((a, b) => {
    if (sortBy === "NEWEST") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "OLDEST") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === "MOST_ORDERS") {
      return b.ordersCount - a.ordersCount;
    }
    if (sortBy === "HIGHEST_SPENT") {
      return b.totalSpent - a.totalSpent;
    }
    if (sortBy === "NAME") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <div className="flex flex-col gap-6 text-left pb-16">

      {/* ── METRICS SUMMARY CARDS ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 block mb-1">
              Registered Users
            </span>
            <span className="text-3xl font-black text-dark">{totalRegisteredCount}</span>
            <span className="text-[11px] font-semibold text-charcoal/40 block mt-1">Verified Accounts</span>
          </div>
          <span className="text-3xl bg-[#9EAB75]/15 p-3.5 rounded-2xl">👥</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 block mb-1">
              Active Shoppers
            </span>
            <span className="text-3xl font-black text-dark">{customersWithOrdersCount}</span>
            <span className="text-[11px] font-semibold text-green-600 block mt-1">Placed ≥ 1 Order</span>
          </div>
          <span className="text-3xl bg-green-50 p-3.5 rounded-2xl">🛍️</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 block mb-1">
              Total Customer Spend
            </span>
            <span className="text-3xl font-black text-dark">₹{totalLifetimeRevenue.toLocaleString("en-IN")}</span>
            <span className="text-[11px] font-semibold text-charcoal/40 block mt-1">All Orders Revenue</span>
          </div>
          <span className="text-3xl bg-amber-50 p-3.5 rounded-2xl">💰</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 block mb-1">
              Guest Shoppers
            </span>
            <span className="text-3xl font-black text-dark">{guestUsers.length}</span>
            <span className="text-[11px] font-semibold text-charcoal/40 block mt-1">{totalAdminsCount} Admin Accounts</span>
          </div>
          <span className="text-3xl bg-purple-50 p-3.5 rounded-2xl">👤</span>
        </div>
      </div>

      {/* ── SEARCH, FILTER TABS & SORT BAR ─────────────────────────── */}
      <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, phone, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#FAF9F5] border border-black/10 rounded-full pl-10 pr-5 py-3 text-sm focus:outline-none focus:border-dark w-full"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-charcoal/40 uppercase tracking-wider shrink-0">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FAF9F5] border border-black/10 rounded-full px-4 py-2.5 text-xs font-bold text-dark focus:outline-none focus:border-dark cursor-pointer"
            >
              <option value="NEWEST">Newest Joined</option>
              <option value="OLDEST">Oldest Joined</option>
              <option value="MOST_ORDERS">Most Orders Placed</option>
              <option value="HIGHEST_SPENT">Highest Spend</option>
              <option value="NAME">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 border-t border-black/5 pt-4">
          {[
            { id: "ALL_REGISTERED", label: `All Users (${users.length})` },
            { id: "WITH_ORDERS", label: `With Orders (${customersWithOrdersCount})` },
            { id: "NO_ORDERS", label: `No Orders Yet (${users.length - customersWithOrdersCount})` },
            { id: "ADMINS", label: `Admins (${totalAdminsCount})` },
            { id: "GUESTS", label: `Guest Buyers (${guestUsers.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
                filterTab === tab.id
                  ? "bg-dark border-dark text-white"
                  : "bg-white border-black/10 hover:border-black/35 text-charcoal/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── USER LISTING TABLE ───────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-yellow border-t-transparent rounded-full animate-spin" />
            <p className="font-bold text-xs uppercase tracking-wider text-charcoal/60">Fetching Users Directory...</p>
          </div>
        ) : sortedUsers.length === 0 ? (
          <div className="p-16 text-center">
            <span className="text-4xl block mb-3">👥</span>
            <p className="font-bold text-sm uppercase tracking-wider text-charcoal/40">No users found matching filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-black/5">
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider">USER</th>
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider">EMAIL</th>
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider">PHONE</th>
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider">LOCATION</th>
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider">ROLE</th>
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider">ORDERS</th>
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider">TOTAL SPENT</th>
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {sortedUsers.map((user) => {
                  const initial = (user.name || user.email || "U")[0].toUpperCase();
                  const locationSummary = user.city && user.state
                    ? `${user.city}, ${user.state}`
                    : user.city || user.state || (user.zip ? `PIN ${user.zip}` : "—");

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-[#FAF9F5]/40 transition-colors cursor-pointer group"
                      onClick={() => setSelectedUser(user)}
                    >
                      {/* Name & Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#9EAB75]/20 text-[#546034] font-black text-sm flex items-center justify-center shrink-0 border border-[#9EAB75]/30">
                            {initial}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-dark text-sm truncate group-hover:text-[#9EAB75] transition-colors">
                              {user.name}
                            </span>
                            <span className="text-[11px] text-charcoal/40 font-medium">
                              Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <a
                            href={`mailto:${user.email}`}
                            className="text-xs font-semibold text-charcoal/80 hover:text-dark hover:underline truncate max-w-[200px]"
                            title={user.email}
                          >
                            {user.email}
                          </a>
                          <button
                            onClick={() => handleCopy(user.email, `email_${user._id}`)}
                            className="text-charcoal/30 hover:text-dark text-[11px] transition-colors p-1"
                            title="Copy Email"
                          >
                            {copiedField === `email_${user._id}` ? "✓" : "📋"}
                          </button>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4">
                        {user.phone ? (
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={`tel:${user.phone}`}
                              className="text-xs font-semibold text-dark hover:underline font-mono"
                            >
                              {user.phone}
                            </a>
                            <button
                              onClick={() => handleCopy(user.phone || "", `phone_${user._id}`)}
                              className="text-charcoal/30 hover:text-dark text-[11px] transition-colors p-1"
                              title="Copy Phone"
                            >
                              {copiedField === `phone_${user._id}` ? "✓" : "📋"}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-charcoal/30 italic">Not provided</span>
                        )}
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-charcoal/70 block truncate max-w-[150px]">
                          {locationSummary}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                            user.role === "admin"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : user.role === "guest"
                              ? "bg-gray-100 text-gray-700 border-gray-200"
                              : "bg-[#9EAB75]/15 text-[#4e5b29] border-[#9EAB75]/30"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Orders Count */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                            user.ordersCount > 0
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-gray-50 text-gray-400 border border-black/5"
                          }`}
                        >
                          <span>🛍️</span>
                          <span>{user.ordersCount} {user.ordersCount === 1 ? "Order" : "Orders"}</span>
                        </span>
                      </td>

                      {/* Total Spent */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-dark text-sm">
                          ₹{user.totalSpent.toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="px-3.5 py-1.5 bg-[#9EAB75] hover:bg-[#8b9961] text-dark font-black text-xs uppercase tracking-wider rounded-full shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Order History & Details</span>
                            <span>→</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── USER DETAILS & ORDER HISTORY SLIDE-OVER DRAWER ───────────── */}
      {selectedUser && (
        <div className="fixed inset-0 z-[3000] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setSelectedUser(null)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-[680px] h-full bg-white shadow-2xl flex flex-col z-10 overflow-hidden font-primary text-charcoal border-l border-black/5 animate-slide-in">

            {/* Header */}
            <div className="p-6 border-b border-black/5 bg-[#FAF9F5] flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#9EAB75] text-dark font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                  {(selectedUser.name || selectedUser.email || "U")[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-dark uppercase tracking-tight">
                      {selectedUser.name}
                    </h2>
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        selectedUser.role === "admin"
                          ? "bg-purple-100 text-purple-800 border-purple-200"
                          : selectedUser.role === "guest"
                          ? "bg-gray-100 text-gray-700 border-gray-200"
                          : "bg-green-100 text-green-800 border-green-200"
                      }`}
                    >
                      {selectedUser.role}
                    </span>
                  </div>
                  <span className="text-xs text-charcoal/50 font-medium">
                    {selectedUser.email}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="w-10 h-10 rounded-full bg-black/5 hover:bg-black hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

              {/* Quick Customer Metric Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#FAF9F5] border border-black/5 rounded-2xl p-3.5 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/40 block mb-1">
                    Total Orders
                  </span>
                  <span className="text-2xl font-black text-dark block">{selectedUser.ordersCount}</span>
                </div>
                <div className="bg-[#FAF9F5] border border-black/5 rounded-2xl p-3.5 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/40 block mb-1">
                    Total Spent
                  </span>
                  <span className="text-2xl font-black text-dark block">₹{selectedUser.totalSpent.toLocaleString("en-IN")}</span>
                </div>
                <div className="bg-[#FAF9F5] border border-black/5 rounded-2xl p-3.5 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/40 block mb-1">
                    Average Order
                  </span>
                  <span className="text-2xl font-black text-dark block">
                    ₹{selectedUser.ordersCount > 0 ? Math.round(selectedUser.totalSpent / selectedUser.ordersCount) : 0}
                  </span>
                </div>
              </div>

              {/* User Profile & Contact Info */}
              <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-xs flex flex-col gap-3">
                <h3 className="font-black text-xs uppercase tracking-wider text-charcoal/50 border-b border-black/5 pb-2">
                  Contact & Profile Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-charcoal/40 font-bold block mb-0.5">FULL NAME</span>
                    <span className="font-bold text-dark text-sm">{selectedUser.name}</span>
                  </div>
                  <div>
                    <span className="text-charcoal/40 font-bold block mb-0.5">EMAIL ADDRESS</span>
                    <div className="flex items-center gap-1.5">
                      <a href={`mailto:${selectedUser.email}`} className="font-bold text-dark hover:underline">
                        {selectedUser.email}
                      </a>
                      <button
                        onClick={() => handleCopy(selectedUser.email, "drawer_email")}
                        className="text-charcoal/40 hover:text-dark text-xs"
                      >
                        {copiedField === "drawer_email" ? "✓" : "📋"}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-charcoal/40 font-bold block mb-0.5">PHONE NUMBER</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-dark">
                        {selectedUser.phone || "Not provided"}
                      </span>
                      {selectedUser.phone && (
                        <button
                          onClick={() => handleCopy(selectedUser.phone || "", "drawer_phone")}
                          className="text-charcoal/40 hover:text-dark text-xs"
                        >
                          {copiedField === "drawer_phone" ? "✓" : "📋"}
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-charcoal/40 font-bold block mb-0.5">ACCOUNT CREATED</span>
                    <span className="font-bold text-dark">
                      {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                      }) : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="border-t border-black/5 pt-3 mt-1">
                  <span className="text-charcoal/40 font-bold text-xs block mb-1">SAVED DELIVERY ADDRESS</span>
                  {selectedUser.address || selectedUser.city || selectedUser.state || selectedUser.zip ? (
                    <div className="bg-[#FAF9F5] rounded-xl p-3 text-xs font-semibold text-charcoal/80 leading-relaxed border border-black/5">
                      <p>{selectedUser.address}</p>
                      <p>
                        {[selectedUser.city, selectedUser.state, selectedUser.zip ? `PIN: ${selectedUser.zip}` : ""].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  ) : (
                    <span className="text-xs text-charcoal/40 italic">No saved address yet</span>
                  )}
                </div>

                {/* Account Management Actions */}
                {selectedUser.isRegistered && (
                  <div className="border-t border-black/5 pt-3 mt-1 flex items-center justify-between">
                    <button
                      onClick={() => handleRoleToggle(selectedUser._id, selectedUser.role)}
                      disabled={updatingRole}
                      className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-charcoal font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      {updatingRole
                        ? "Updating..."
                        : selectedUser.role === "admin"
                        ? "Demote to Customer"
                        : "Promote to Admin"}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(selectedUser._id, selectedUser.name)}
                      className="px-3 py-1.5 text-red-500 hover:bg-red-50 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Delete User
                    </button>
                  </div>
                )}
              </div>

              {/* Order History Section */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-accent text-2xl font-bold text-dark rotate-[-2deg]">Order</span>
                    <h3 className="font-black text-sm uppercase tracking-wider text-dark">
                      History ({selectedUser.orders.length})
                    </h3>
                  </div>
                  {selectedUser.orders.length > 0 && (
                    <span className="text-xs font-bold text-charcoal/40">
                      Latest: {new Date(selectedUser.orders[0].createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>

                {selectedUser.orders.length === 0 ? (
                  <div className="bg-[#FAF9F5] border border-black/5 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
                    <span className="text-3xl mb-2">📦</span>
                    <p className="font-bold text-xs uppercase tracking-wider text-charcoal/40">
                      No orders placed yet by this customer.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3.5">
                    {selectedUser.orders.map((order) => {
                      const isCOD = order.paymentMethod === "COD";

                      return (
                        <div
                          key={order._id}
                          className="bg-white border border-black/5 rounded-2xl p-4 shadow-xs flex flex-col gap-3 transition-all hover:shadow-md"
                        >
                          {/* Order Card Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-black/5">
                            <div className="flex items-center gap-2.5">
                              <span className="font-black text-dark text-sm tracking-wide">
                                {order.orderNumber}
                              </span>
                              <span
                                className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                  order.orderStatus === "Delivered"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : order.orderStatus === "Cancelled"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : order.orderStatus === "Shipped"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                              >
                                {order.orderStatus}
                              </span>
                            </div>
                            <span className="font-black text-dark text-base">
                              ₹{order.total}
                            </span>
                          </div>

                          {/* Order Details Line */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-charcoal/60">
                            <div>
                              <span className="font-bold text-charcoal/40 block">DATE</span>
                              <span className="font-semibold text-dark">
                                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                  day: "2-digit", month: "short", year: "numeric"
                                })}
                              </span>
                            </div>
                            <div>
                              <span className="font-bold text-charcoal/40 block">PAYMENT</span>
                              <span className="font-semibold text-dark">
                                {order.paymentMethod} ({order.paymentStatus})
                              </span>
                            </div>
                            <div>
                              <span className="font-bold text-charcoal/40 block">SHIPPING</span>
                              <span className="font-semibold text-dark">
                                {order.shippingCost === 0 ? "FREE" : `₹${order.shippingCost}`}
                              </span>
                            </div>
                            <div>
                              <span className="font-bold text-charcoal/40 block">ITEMS</span>
                              <span className="font-semibold text-dark">
                                {order.itemsCount} {order.itemsCount === 1 ? "unit" : "units"}
                              </span>
                            </div>
                          </div>

                          {/* AWB info if available */}
                          {order.awbCode && (
                            <div className="bg-[#9EAB75]/10 border border-[#9EAB75]/20 rounded-xl px-3 py-2 text-xs flex items-center justify-between">
                              <span className="font-bold text-[#445025] flex items-center gap-1.5">
                                <span>🚚</span>
                                <span>{order.courierName || "Courier"}:</span>
                                <span className="font-mono">{order.awbCode}</span>
                              </span>
                              <button
                                onClick={() => handleCopy(order.awbCode || "", `awb_${order._id}`)}
                                className="text-[10px] font-bold text-[#445025] hover:underline"
                              >
                                {copiedField === `awb_${order._id}` ? "Copied!" : "Copy AWB"}
                              </button>
                            </div>
                          )}

                          {/* Items List Preview */}
                          <div className="flex flex-col gap-2 pt-2 border-t border-black/5">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-lg bg-[#FAF9F5] border border-black/5 overflow-hidden shrink-0 flex items-center justify-center">
                                  {item.imageSrc ? (
                                    <Image
                                      src={item.imageSrc}
                                      alt={item.title}
                                      fill
                                      sizes="40px"
                                      className="object-contain p-0.5 mix-blend-multiply"
                                      unoptimized={true}
                                    />
                                  ) : (
                                    <span className="text-xs">🍎</span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="font-bold text-xs text-dark block truncate">
                                    {item.title}
                                  </span>
                                  <span className="text-[10px] text-charcoal/40 font-semibold uppercase">
                                    {item.variant === "single" ? "Single Pouch" : item.variant === "pack3" ? "Pack of 3" : item.variant === "combo" ? "Custom Box" : "Pack of 5"} × {item.quantity}
                                  </span>
                                </div>
                                <span className="font-bold text-xs text-dark shrink-0">
                                  ₹{item.price * item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Quick Link to admin orders */}
                          <div className="pt-2 border-t border-black/5 flex justify-end">
                            <Link
                              href="/admin/orders"
                              className="text-[11px] font-black uppercase tracking-wider text-[#9EAB75] hover:text-[#7f8c53] flex items-center gap-1"
                            >
                              <span>Manage in Orders Panel</span>
                              <span>→</span>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-black/5 bg-[#FAF9F5] flex items-center justify-between">
              <span className="text-xs font-semibold text-charcoal/50">
                User ID: <code className="font-mono text-[10px] bg-black/5 px-2 py-1 rounded">{selectedUser._id}</code>
              </span>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2.5 bg-dark hover:bg-dark/95 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-xs cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

