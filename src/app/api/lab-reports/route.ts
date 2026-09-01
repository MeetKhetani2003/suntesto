import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import LabReport from "@/models/LabReport";

// Public GET route to fetch all lab reports
export async function GET() {
  try {
    await connectDB();
    const reports = await LabReport.find({}).sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json(reports);
  } catch (error: any) {
    console.error("GET /api/lab-reports error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch lab reports." },
      { status: 500 }
    );
  }
}

// Protected POST route to add a new lab report (Admin only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const userEmail = session?.user?.email;
    const isAdmin = userRole === "admin" || (userEmail && userEmail === process.env.ADMIN_EMAIL);

    if (!session || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { title, imageUrl, sortOrder } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: "Title and Image URL are required." }, { status: 400 });
    }

    const newReport = await LabReport.create({
      title,
      imageUrl,
      sortOrder: Number(sortOrder) || 0,
    });

    return NextResponse.json(newReport);
  } catch (error: any) {
    console.error("POST /api/lab-reports error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save lab report." },
      { status: 500 }
    );
  }
}
