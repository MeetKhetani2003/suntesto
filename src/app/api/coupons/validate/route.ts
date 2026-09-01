import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function POST(req: Request) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required." }, { status: 400 });
    }

    const cleanCode = code.toUpperCase().trim();

    // Default hardcoded code check fallback (e.g. SUSTENTO10 or FIRST10)
    if (cleanCode === "SUSTENTO10" || cleanCode === "FIRST10") {
      const discount = Math.round((cartTotal || 500) * 0.1);
      return NextResponse.json({
        valid: true,
        code: cleanCode,
        discountType: "percentage",
        discountValue: 10,
        discountAmount: discount,
        message: "10% discount applied successfully!",
      });
    }

    try {
      await connectDB();
      const coupon = await Coupon.findOne({ code: cleanCode, isActive: true });

      if (!coupon) {
        return NextResponse.json({ error: "Invalid or expired coupon code." }, { status: 404 });
      }

      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        return NextResponse.json({ error: "This coupon code has expired." }, { status: 400 });
      }

      if (cartTotal && cartTotal < coupon.minOrderValue) {
        return NextResponse.json(
          { error: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon.` },
          { status: 400 }
        );
      }

      let discountAmount = 0;
      if (coupon.discountType === "percentage") {
        discountAmount = Math.round((cartTotal * coupon.discountValue) / 100);
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else {
        discountAmount = coupon.discountValue;
      }

      return NextResponse.json({
        valid: true,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        message: `Coupon '${coupon.code}' applied successfully! Saved ₹${discountAmount}.`,
      });
    } catch (e) {
      return NextResponse.json({ error: "Invalid coupon code." }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to validate coupon." }, { status: 500 });
  }
}
