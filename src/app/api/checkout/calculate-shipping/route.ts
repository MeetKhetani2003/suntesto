import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { calculateShiprocketRate } from "@/lib/shiprocket";

export async function POST(req: Request) {
  try {
    const { pincode, items } = await req.json();

    if (!pincode || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Pincode and items are required." },
        { status: 400 }
      );
    }

    await connectDB();

    // Calculate total weight in kg
    let totalWeightKg = 0;
    for (const item of items) {
      if (item.id && item.id.match(/^[0-9a-fA-F]{24}$/)) {
        const prod = await Product.findById(item.id).lean() as any;
        if (prod) {
          const weightGrams = prod.weightGrams || 100;
          totalWeightKg += (weightGrams / 1000) * item.quantity;
        } else {
          totalWeightKg += 0.1 * item.quantity; // default 100g
        }
      } else {
        totalWeightKg += 0.1 * item.quantity;
      }
    }

    // Default minimum weight in kg is 0.1
    totalWeightKg = Math.max(0.1, parseFloat(totalWeightKg.toFixed(2)));

    // Calculate Shiprocket Rate for COD
    const rate = await calculateShiprocketRate({
      delivery_pincode: pincode,
      weight: totalWeightKg,
      cod: true,
    });

    // Multiply the shipping rate by 2 (e.g. 50 -> 100)
    const finalShippingCost = Math.round(rate * 2);

    return NextResponse.json({
      success: true,
      shippingCost: finalShippingCost,
    });
  } catch (error: any) {
    console.error("[Calculate Shipping] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to calculate shipping charge." },
      { status: 500 }
    );
  }
}
