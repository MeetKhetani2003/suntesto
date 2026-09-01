"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import AdminAuthProvider from "@/components/admin/SessionProvider";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (status === "unauthenticated" && !isLoginPage) {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      const role = (session?.user as any)?.role;
      if (role === "admin" && isLoginPage) {
        router.push("/admin");
      } else if (role !== "admin" && !isLoginPage) {
        router.push("/admin/login");
      }
    }
  }, [status, session, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center font-primary text-charcoal">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
          <p className="font-bold uppercase tracking-wider text-xs">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || (session?.user as any)?.role !== "admin") {
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Orders", href: "/admin/orders", icon: "🛍️" },
    { label: "All Products", href: "/admin/products", icon: "📦" },
    { label: "Categories", href: "/admin/categories", icon: "📁" },
    { label: "Coupons", href: "/admin/coupons", icon: "🏷️" },
    { label: "Hero Settings", href: "/admin/hero", icon: "✨" },
    { label: "Collection Banner", href: "/admin/collections", icon: "🖼️" },
    { label: "Fruit & Crunch Banner", href: "/admin/fruit-crunch", icon: "🍎" },
    { label: "Promo Video Cards", href: "/admin/promo-cards", icon: "🎥" },
    { label: "Limited Edition", href: "/admin/limited-edition", icon: "🎁" },
    { label: "Lifestyle Banner", href: "/admin/lifestyle-banner", icon: "🎨" },
    { label: "Assorted Box Section", href: "/admin/assorted-box", icon: "📦" },
    { label: "Lab Reports", href: "/admin/lab-reports", icon: "🔬" },
    { label: "Testimonials", href: "/admin/testimonials", icon: "💬" },
    { label: "Instagram Feed", href: "/admin/instagram", icon: "📸" },
    { label: "Product Reviews", href: "/admin/reviews", icon: "⭐" },
    { label: "FAQ Manager", href: "/admin/faqs", icon: "❓" },
    { label: "Tech Details", href: "/admin/secret-nutrition", icon: "🔬" },
    { label: "What We Put In", href: "/admin/what-we-put-in", icon: "🍏" },
    { label: "Kids & Parents", href: "/admin/kids-parents", icon: "👪" },
    { label: "About Us Hero", href: "/admin/about-hero", icon: "📖" },
    { label: "About Video Section", href: "/admin/about-video", icon: "🎥" },
    { label: "Comparison Sheets", href: "/admin/comparison", icon: "⚖️" },
    { label: "Bulk Orders", href: "/admin/bulk-orders", icon: "🏢" },
    { label: "Footer Settings", href: "/admin/footer-config", icon: "👣" }
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F5] font-primary flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-charcoal text-white shrink-0 flex flex-col justify-between p-6">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 pb-8 border-b border-white/10">
            <Image
              src="/images/sustento-logo-white.png"
              alt="Sustento Admin"
              width={130}
              height={36}
              className="h-8 w-auto object-contain"
            />
            <span className="bg-[#9EAB75] text-dark text-[10px] font-black uppercase px-2 py-0.5 rounded">
              ADMIN
            </span>
          </div>

          {/* Nav Links */}
          <nav className="mt-6 flex flex-col gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    active
                      ? "bg-[#9EAB75] text-dark shadow-md"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs font-semibold text-white/70 hover:text-[#9EAB75] transition-colors"
          >
            <span>View Live Website</span>
            <span>↗</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full text-left flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 py-2 transition-colors"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-black/5 px-6 md:px-8 flex items-center justify-between">
          <h1 className="font-black text-lg md:text-xl uppercase tracking-tight text-charcoal">
            SUSTENTO ADMIN DASHBOARD
          </h1>
          <div className="flex items-center gap-3 text-xs font-semibold text-charcoal/70">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected to MongoDB</span>
          </div>
        </header>

        {/* Page Body */}
        <main className="p-6 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}
