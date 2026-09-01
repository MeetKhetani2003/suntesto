export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product"; // ensure Product model is registered in Mongoose

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const approvedOnly = searchParams.get("approvedOnly") === "true";

    const query: any = {};
    if (productId) {
      query.productId = productId;
    }
    if (approvedOnly) {
      query.isApproved = true;
    }

    const reviews = await Review.find(query)
      .populate("productId", "title slug images")
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { productId, name, email, rating, comment } = body;

    if (!productId || !name || !email || !rating || !comment) {
      return NextResponse.json(
        { error: "All fields are required to submit a review." },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5 stars." },
        { status: 400 }
      );
    }

    const newReview = await Review.create({
      productId,
      name,
      email,
      rating: Number(rating),
      comment,
      isApproved: false, // Default is pending approval
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit review." },
      { status: 500 }
    );
  }
}
