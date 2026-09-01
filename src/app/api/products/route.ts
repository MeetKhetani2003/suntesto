export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    await connectDB();
    const query = category ? { category } : {};
    const dbProducts = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json(dbProducts);
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch products from MongoDB" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.title || !body.price || body.costPrice === undefined || body.originalPrice === undefined) {
      return NextResponse.json(
        { error: "Title, cost price, original price, and selling price are required." },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const newProduct = await Product.create({
      ...body,
      slug,
      stockQuantity: Number(body.stockQuantity) || 0,
      costPrice: Number(body.costPrice),
      originalPrice: Number(body.originalPrice),
      price: Number(body.price),
      inStock: (Number(body.stockQuantity) || 0) > 0,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
