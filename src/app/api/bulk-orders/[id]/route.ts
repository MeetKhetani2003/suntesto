import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import BulkOrderRequest from "@/models/BulkOrderRequest";

// PATCH: Update bulk order status (Admin only)
export async function PATCH(
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
    const { status } = body;

    if (!status || !["Pending", "Contacted", "Completed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    const updated = await BulkOrderRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Bulk order request not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PATCH /api/bulk-orders/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update status." },
      { status: 500 }
    );
  }
}

// DELETE: Delete bulk order request (Admin only)
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
    const deleted = await BulkOrderRequest.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Bulk order request not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Bulk order request deleted successfully." });
  } catch (error: any) {
    console.error("DELETE /api/bulk-orders/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete bulk order request." },
      { status: 500 }
    );
  }
}
