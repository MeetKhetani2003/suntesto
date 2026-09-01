import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    await connectDB();

    // Find the database user record to get their id
    const dbUser = await User.findOne({ email: session.user.email.toLowerCase() });
    if (!dbUser) {
      return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    }

    const userId = dbUser._id.toString();

    // Query orders matching user ID or matching email address
    const orders = await Order.find({
      $or: [
        { userId: userId },
        { "customerInfo.email": session.user.email.toLowerCase() }
      ]
    }).sort({ createdAt: -1 }).lean();

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("GET /api/user/orders error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user orders." },
      { status: 500 }
    );
  }
}
