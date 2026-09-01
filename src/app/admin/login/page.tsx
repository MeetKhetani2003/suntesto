"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        window.location.href = "/admin";
      }
    } catch (err: any) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.08)] border border-black/5 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <Image
            src="/images/sustento-logo-black.png"
            alt="Sustento Admin"
            width={160}
            height={44}
            className="h-10 w-auto object-contain"
          />
          <span className="bg-[#9EAB75] text-dark font-black text-xs uppercase px-3 py-1 rounded-full tracking-wider mt-1">
            Admin Portal
          </span>
        </div>

        <h2 className="font-primary font-black text-2xl uppercase tracking-tight text-charcoal text-center mb-1">
          Welcome Back
        </h2>
        <p className="font-primary text-xs font-semibold text-charcoal/60 text-center mb-8">
          Sign in to manage products, stock & coupons
        </p>

        {error && (
          <div className="w-full mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              required
              placeholder="admin@sustento.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal focus:ring-2 focus:ring-yellow/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal focus:ring-2 focus:ring-yellow/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#9EAB75] hover:bg-[#869360] text-dark font-black uppercase text-sm py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login to Admin Dashboard"}
          </button>
        </form>

        <div className="mt-8 text-center text-xs font-semibold text-charcoal/40">
          Sustento Superfoods • Clean Label Admin
        </div>
      </div>
    </div>
  );
}
