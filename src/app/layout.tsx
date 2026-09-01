import type { Metadata } from "next";
import { Montserrat, Kalam } from "next/font/google";
import "./globals.css";

/* ── Google Fonts — Verified from live everaw.in source CSS ──
   --font-primary:  Montserrat  (body + headings, weights 500/700/800/900)
   --font-accent:   Kalam       (script/handwriting accent, cursive)
   
   Note: "Montserrat Italic Black" (weight 900 italic) is loaded as a
   custom local font on the actual site from their CDN. We cover this
   with font-weight: 900 + font-style: italic on Montserrat directly.
   ─────────────────────────────────────────────────────────── */

const montserrat = Montserrat({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const kalam = Kalam({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Sustento | 100% Real Fruit Snacks - No Added Sugar",
  description:
    "Sustento kid-first clean label nutrition brand. We craft India's first freeze-dried whole fruit snacks with zero added sugar or preservatives. Real freeze-dried fruits for guilt-free nutrition. Kid-approved, parent trusted.",
  keywords: [
    "Sustento",
    "Sustento Fruit Snacks",
    "clean label nutrition",
    "freeze dried snacks",
    "no added sugar",
  ],
  openGraph: {
    type: "website",
    siteName: "Sustento",
    title: "Sustento | 100% Real Fruit Snacks - No Added Sugar",
    description:
      "India's first clean-label freeze-dried whole fruit snacks and chocolate-dipped fruit snacks.",
  },
};

import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/layout/CartDrawer";
import AuthProvider from "@/components/providers/AuthProvider";
import ScrollReveal from "@/components/common/ScrollReveal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${kalam.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <ScrollReveal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
