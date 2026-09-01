export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

const DEFAULT_CATEGORIES = [
  { name: "Fruit Snacks", slug: "fruit-snacks", description: "100% natural, crisp nutrition crunch" },
  { name: "Assorted Packs", slug: "assorted-packs", description: "Best seller variety snack hampers" },
  { name: "Beverages", slug: "beverages", description: "Pure, clean refreshments and smoothies" },
];

export async function GET() {
  try {
    await connectDB();
    let categories = await Category.find({}).sort({ name: 1 });

    if (categories.length === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
      categories = await Category.find({}).sort({ name: 1 });
    }

    return NextResponse.json(categories);
  } catch (err: any) {
    console.error("GET /api/categories error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    if (!session || userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { name, description } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const newCategory = new Category({
      name: name.trim(),
      slug,
      description: description || "",
    });

    await newCategory.save();
    return NextResponse.json(newCategory);
  } catch (err: any) {
    console.error("POST /api/categories error:", err);
    if (err.code === 11000) {
      return NextResponse.json({ error: "Category name already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || "Failed to create category" }, { status: 500 });
  }
}
