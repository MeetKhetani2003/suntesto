import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

// GET: Fetch all approved testimonials for frontend, or all testimonials for admin panel
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    // If all=true, return all testimonials (both approved and pending) for admin management
    // Otherwise, filter by only approved ones for the public homepage
    const query = all ? {} : { isApproved: true };

    const testimonials = await Testimonial.find(query).sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json(testimonials);
  } catch (error: any) {
    console.error("GET /api/testimonials error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch testimonials." },
      { status: 500 }
    );
  }
}

// POST: Submit a new testimonial
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, title, videoUrl, sortOrder } = body;

    if (!name || !title || !videoUrl) {
      return NextResponse.json({ error: "Name, Title, and Video URL are required." }, { status: 400 });
    }

    // Check if requester is Admin to verify permissions
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const userEmail = session?.user?.email;
    const isAdmin = userRole === "admin" || (userEmail && userEmail === process.env.ADMIN_EMAIL);

    // Only allow setting approved/admin-created flags to true if requester is verified admin and explicitly requested it in the body payload
    const isApproved = isAdmin && body.isApproved === true;
    const isAdminCreated = isAdmin && body.isAdminCreated === true;

    const testimonial = await Testimonial.create({
      name,
      title,
      videoUrl,
      isApproved,
      isAdminCreated,
      sortOrder: Number(sortOrder) || 0,
    });

    return NextResponse.json(testimonial);
  } catch (error: any) {
    console.error("POST /api/testimonials error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save testimonial." },
      { status: 500 }
    );
  }
}
