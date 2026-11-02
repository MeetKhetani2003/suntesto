export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const userEmail = session?.user?.email;
    const isAdmin = userRole === "admin" || (userEmail && userEmail === process.env.ADMIN_EMAIL);

    if (!session || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    if (!id || id.startsWith("guest_")) {
      return NextResponse.json({ error: "Cannot modify guest accounts." }, { status: 400 });
    }

    await connectDB();

    const allowedUpdates: Record<string, any> = {};
    if (typeof body.role === "string" && ["admin", "customer"].includes(body.role)) {
      allowedUpdates.role = body.role;
    }
    if (typeof body.name === "string" && body.name.trim()) {
      allowedUpdates.name = body.name.trim();
    }
    if (typeof body.phone === "string") {
      allowedUpdates.phone = body.phone.trim();
    }
    if (typeof body.address === "string") {
      allowedUpdates.address = body.address.trim();
    }
    if (typeof body.city === "string") {
      allowedUpdates.city = body.city.trim();
    }
    if (typeof body.state === "string") {
      allowedUpdates.state = body.state.trim();
    }
    if (typeof body.zip === "string") {
      allowedUpdates.zip = body.zip.trim();
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("PATCH /api/admin/users/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const userEmail = session?.user?.email;
    const isAdmin = userRole === "admin" || (userEmail && userEmail === process.env.ADMIN_EMAIL);

    if (!session || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { id } = await params;
    if (!id || id.startsWith("guest_")) {
      return NextResponse.json({ error: "Cannot delete guest accounts." }, { status: 400 });
    }

    await connectDB();

    // Prevent deleting your own admin account
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (session?.user?.email && targetUser.email.toLowerCase() === session.user.email.toLowerCase()) {
      return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "User deleted successfully." });
  } catch (error: any) {
    console.error("DELETE /api/admin/users/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete user." },
      { status: 500 }
    );
  }
}

