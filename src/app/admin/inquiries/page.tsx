"use client";

import React, { useState, useEffect } from "react";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/contact");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to load contact messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        if (selectedMessage?._id === id) {
          setSelectedMessage(null);
        }
      } else {
        alert("Failed to delete inquiry.");
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      alert("Error deleting inquiry.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const term = searchQuery.toLowerCase();
    return (
      msg.name.toLowerCase().includes(term) ||
      msg.email.toLowerCase().includes(term) ||
      (msg.phone && msg.phone.includes(term)) ||
      msg.message.toLowerCase().includes(term)
    );
  });

  const totalMessages = messages.length;
  const unreadMessages = messages.filter(m => !m.isRead).length;

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* ── METRICS SECTION ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/40 block mb-1">Total Inquiries</span>
            <span className="text-3xl font-black text-dark">{totalMessages}</span>
          </div>
          <span className="text-3xl bg-[#9EAB75]/10 p-3.5 rounded-2xl">📨</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/40 block mb-1">Unread</span>
            <span className="text-3xl font-black text-dark">{unreadMessages}</span>
          </div>
          <span className="text-3xl bg-blue-50 p-3.5 rounded-2xl">🔔</span>
        </div>
      </div>

      {/* ── SEARCH BAR ─────────────────────────────────────────────── */}
      <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
        <input
          type="text"
          placeholder="Search by Name, Email, Phone, or Message..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#FAF9F5] border border-black/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-dark w-full md:max-w-lg transition-colors"
        />
      </div>

      {/* ── MESSAGES TABLE ─────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
            <p className="font-bold text-xs uppercase tracking-wider text-charcoal/60">Loading Inquiries...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-16 text-center">
            <span className="text-4xl block mb-3">📭</span>
            <p className="font-bold text-sm uppercase tracking-wider text-charcoal/40">No inquiries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-black/5">
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider">DATE</th>
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider">SENDER</th>
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider">MESSAGE PREVIEW</th>
                  <th className="px-6 py-4 font-black uppercase text-xs text-charcoal/50 tracking-wider text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredMessages.map((msg) => (
                  <tr key={msg._id} className="hover:bg-[#FAF9F5]/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-charcoal/60 text-xs whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-dark text-sm">{msg.name}</span>
                        <span className="text-[11px] text-charcoal/50 font-medium">{msg.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-charcoal/70 line-clamp-1 max-w-sm truncate">
                        {msg.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedMessage(msg)}
                          className="px-4 py-1.5 bg-dark hover:bg-dark/90 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => handleDelete(msg._id, e)}
                          disabled={deletingId === msg._id}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs uppercase tracking-wider rounded-lg border border-red-200 transition-colors disabled:opacity-50"
                        >
                          {deletingId === msg._id ? "..." : "🗑️"}
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

      {/* ── DETAILS DRAWER OVERLAY ─────────────────────────────────── */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[3000] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setSelectedMessage(null)}
          />

          {/* Drawer container */}
          <div className="relative w-full max-w-md bg-white h-full shadow-[0_0_40px_rgba(0,0,0,0.12)] flex flex-col p-6 overflow-y-auto animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-black/5 mb-6">
              <div>
                <span className="font-accent text-2xl font-bold text-dark block leading-none mb-1">Inquiry Details</span>
                <span className="font-primary font-bold uppercase text-[10px] text-charcoal/40 tracking-wider">
                  Received {new Date(selectedMessage.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="w-10 h-10 border border-black/5 hover:border-black/20 text-charcoal rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-105"
              >
                ✕
              </button>
            </div>

            {/* Sender Info Block */}
            <div className="bg-[#FAF9F5] border border-black/5 rounded-2xl p-5 mb-6 text-sm flex flex-col gap-3">
              <span className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50 border-b border-black/5 pb-2">Sender Information</span>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <span className="text-[10px] text-charcoal/40 font-bold uppercase tracking-wider block">Name</span>
                  <span className="font-bold text-dark text-base">{selectedMessage.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-charcoal/40 font-bold uppercase tracking-wider block">Email Address</span>
                  <a href={`mailto:${selectedMessage.email}`} className="font-bold text-blue-600 hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <span className="text-[10px] text-charcoal/40 font-bold uppercase tracking-wider block">Phone Number</span>
                    <a href={`tel:${selectedMessage.phone}`} className="font-bold text-blue-600 hover:underline">
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Message Block */}
            <div className="flex flex-col gap-2 flex-1">
              <span className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50 border-b border-black/5 pb-2">Message</span>
              <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm text-sm text-charcoal whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-5 border-t border-black/5 flex flex-col gap-3">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: Inquiry on Sustento`}
                className="w-full flex items-center justify-center gap-2 bg-dark hover:bg-dark/90 text-white font-black text-sm uppercase tracking-wider py-3.5 rounded-full shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>✉️</span> Reply via Email
              </a>
              <button
                onClick={() => handleDelete(selectedMessage._id)}
                disabled={deletingId === selectedMessage._id}
                className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 font-black text-xs uppercase tracking-wider py-3 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
              >
                <span>🗑️</span> {deletingId === selectedMessage._id ? "Deleting..." : "Delete Inquiry"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
