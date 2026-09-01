import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function GET() {
  try {
    await connectDB();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return NextResponse.json(coupons);
  } catch (error: any) {
    // Return empty list if DB connection fails
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.code || body.discountValue === undefined) {
      return NextResponse.json(
        { error: "Coupon code and discount value are required." },
        { status: 400 }
      );
    }

    const code = body.code.toUpperCase().trim();

    const existing = await Coupon.findOne({ code });
    if (existing) {
      return NextResponse.json(
        { error: `Coupon code '${code}' already exists.` },
        { status: 400 }
      );
    }

    const coupon = await Coupon.create({
      code,
      description: body.description || "",
      discountType: body.discountType || "percentage",
      discountValue: Number(body.discountValue),
      minOrderValue: Number(body.minOrderValue) || 0,
      maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : undefined,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create coupon" }, { status: 500 });
  }
}
