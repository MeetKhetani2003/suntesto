export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import BulkOrderRequest from "@/models/BulkOrderRequest";

// GET: Fetch all bulk orders (Admin only)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const userEmail = session?.user?.email;
    const isAdmin = userRole === "admin" || (userEmail && userEmail === process.env.ADMIN_EMAIL);

    if (!session || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    await connectDB();
    const orders = await BulkOrderRequest.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("GET /api/bulk-orders error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch bulk orders." },
      { status: 500 }
    );
  }
}

// POST: Create a new bulk order request (Public)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      name,
      contactNumber,
      email,
      companyName,
      shippingLocation,
      orderDetails,
      timeline,
      notes,
    } = body;

    if (
      !name ||
      !contactNumber ||
      !email ||
      !companyName ||
      !shippingLocation ||
      !orderDetails ||
      !timeline
    ) {
      return NextResponse.json({ error: "All required fields must be filled." }, { status: 400 });
    }

    const newRequest = await BulkOrderRequest.create({
      name,
      contactNumber,
      email,
      companyName,
      shippingLocation,
      orderDetails,
      timeline,
      notes,
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/bulk-orders error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit bulk order request." },
      { status: 500 }
    );
  }
}
