"use client";

import React, { useEffect, useState, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, callbackUrl, router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-12 h-12 border-4 border-yellow border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-xs uppercase tracking-wider text-charcoal/50">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[440px] mx-auto px-6 py-12">
      {/* ── Outer Card Glassmorphic ────────────────────────────── */}
      <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-black/5 flex flex-col text-center items-center">
        {/* Decorative Badge */}
        <div className="relative inline-flex items-center gap-1 bg-[#9EAB75]/10 border border-[#9EAB75]/30 rounded-2xl px-4.5 py-1.5 rotate-[-2deg] mb-6 text-xs font-black uppercase tracking-widest text-[#6b3117] select-none">
          ✨ Welcome to Sustento
        </div>

        {/* Title */}
        <h1 className="font-primary font-black text-[32px] md:text-[38px] text-charcoal leading-none uppercase tracking-tight mb-2">
          JOIN THE <br />
          <span className="relative inline-block">
            FAMILY
            <span className="absolute left-0 bottom-[-4px] w-full h-[5px] bg-[#9EAB75] rounded-full" />
          </span>
        </h1>
        <p className="text-sm font-medium text-charcoal/50 leading-relaxed mb-8 max-w-[300px]">
          Sign in or create an account with a single click using Google.
        </p>

        {/* Google OAuth CTA Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-[#FAF9F5] hover:bg-[#FAF9F5]/90 border border-black/10 hover:border-black/20 text-charcoal font-primary font-black text-sm uppercase tracking-wider py-4 px-6 rounded-full shadow-sm flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        {/* Brand Guarantee */}
        <div className="mt-8 pt-6 border-t border-black/5 w-full flex flex-col gap-1 items-center">
          <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest leading-none">🌱 100% Secure & Fast Authentication</p>
          <p className="text-[9px] font-bold text-charcoal/30 uppercase tracking-widest max-w-[280px] mt-1 leading-normal">
            By signing up, you agree to our <Link href="/terms-of-service" className="underline hover:text-charcoal/60">Terms</Link> and <Link href="/terms-of-service" className="underline hover:text-charcoal/60">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="w-full bg-[#fffff9] pt-32 pb-20 min-h-[70vh] flex items-center justify-center select-none">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <div className="w-12 h-12 border-4 border-yellow border-t-transparent rounded-full animate-spin" />
            <p className="font-bold text-xs uppercase tracking-wider text-charcoal/50">Loading page...</p>
          </div>
        }>
          <LoginContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
