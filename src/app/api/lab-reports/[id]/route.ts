import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import LabReport from "@/models/LabReport";

// Protected PUT route to update a lab report (Admin only)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const updated = await LabReport.findByIdAndUpdate(
      id,
      { title, imageUrl, sortOrder: Number(sortOrder) || 0 },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Lab report not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT /api/lab-reports/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update lab report." },
      { status: 500 }
    );
  }
}

// Protected DELETE route to remove a lab report (Admin only)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const userEmail = session?.user?.email;
    const isAdmin = userRole === "admin" || (userEmail && userEmail === process.env.ADMIN_EMAIL);

    if (!session || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    await connectDB();
    const deleted = await LabReport.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Lab report not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Lab report deleted." });
  } catch (error: any) {
    console.error("DELETE /api/lab-reports/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete lab report." },
      { status: 500 }
    );
  }
}
