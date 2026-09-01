"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface IBulkOrderRequest {
  _id: string;
  name: string;
  contactNumber: string;
  email: string;
  companyName: string;
  shippingLocation: string;
  orderDetails: string;
  timeline: string;
  notes?: string;
  status: "Pending" | "Contacted" | "Completed";
  createdAt: string;
}

export default function AdminBulkOrdersPage() {
  const [requests, setRequests] = useState<IBulkOrderRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/bulk-orders");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      } else {
        setError("Failed to fetch bulk orders list.");
      }
    } catch (err) {
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bulk-orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: newStatus as any } : r))
        );
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      alert("Error updating status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bulk order request?")) return;

    try {
      const res = await fetch(`/api/bulk-orders/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r._id !== id));
      } else {
        alert("Failed to delete request.");
      }
    } catch (err) {
      alert("Error deleting request.");
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-xs uppercase tracking-wider text-charcoal/60">
          Loading bulk order requests...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 select-none font-primary text-left">
      <div>
        <Link
          href="/admin"
          className="text-xs font-bold text-charcoal/60 hover:text-charcoal flex items-center gap-1 mb-1"
        >
          ← Back to Dashboard
        </Link>
        <h2 className="font-primary font-black text-2xl md:text-3xl uppercase tracking-tight text-charcoal">
          Bulk & Corporate Order Requests
        </h2>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold">
          ⚠️ {error}
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:max-w-md relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Name, Company, or Email..."
            className="w-full pl-4 pr-10 py-3 rounded-xl border border-black/10 text-xs font-semibold focus:outline-none focus:border-charcoal bg-[#FAF9F6]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Contacted">Contacted</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-charcoal/40 text-sm font-semibold italic">
            No bulk order requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-black/5 text-left">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-charcoal/60">
                    Company & Client
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-charcoal/60">
                    Contact Details
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-charcoal/60">
                    Order Details
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-charcoal/60">
                    Location & Timeline
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-charcoal/60 text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-charcoal/60 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs font-semibold text-charcoal">
                {filteredRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-[#FAF9F6]/40 transition-colors">
                    {/* Company Name & Client */}
                    <td className="px-6 py-5 space-y-1">
                      <span className="font-bold text-sm block">{req.companyName}</span>
                      <span className="text-charcoal/60 block">Client: {req.name}</span>
                      <span className="text-[10px] text-charcoal/40 block">
                        Received: {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Contact details */}
                    <td className="px-6 py-5 space-y-1">
                      <span className="block">{req.email}</span>
                      <span className="text-charcoal/60 block">{req.contactNumber}</span>
                    </td>

                    {/* Order Details & Notes */}
                    <td className="px-6 py-5 max-w-[300px]">
                      <div className="whitespace-pre-line leading-relaxed mb-2 font-medium bg-[#FAF9F6] p-3 rounded-xl border border-black/5">
                        {req.orderDetails}
                      </div>
                      {req.notes && (
                        <div className="text-[11px] text-stone-500 italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                          <strong>Note:</strong> {req.notes}
                        </div>
                      )}
                    </td>

                    {/* Location & Timeline */}
                    <td className="px-6 py-5 space-y-2 max-w-[240px] leading-relaxed">
                      <div>
                        <span className="text-[10px] text-charcoal/50 uppercase font-black block">
                          Delivery Location
                        </span>
                        <span>{req.shippingLocation}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-charcoal/50 uppercase font-black block">
                          Timeline
                        </span>
                        <span className="text-amber-700">{req.timeline}</span>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-6 py-5 text-center">
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider focus:outline-none border border-black/5 cursor-pointer ${
                          req.status === "Completed"
                            ? "bg-green-50 text-green-700"
                            : req.status === "Contacted"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <option value="Pending">🔴 Pending</option>
                        <option value="Contacted">🔵 Contacted</option>
                        <option value="Completed">🟢 Completed</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => handleDelete(req._id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold uppercase text-[9px] tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
