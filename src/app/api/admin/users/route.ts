export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const userEmail = session?.user?.email;
    const isAdmin = userRole === "admin" || (userEmail && userEmail === process.env.ADMIN_EMAIL);

    if (!session || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    await connectDB();

    // Fetch all registered users excluding passwords
    const users = await User.find({}).sort({ createdAt: -1 }).select("-password").lean();

    // Fetch all orders
    const allOrders = await Order.find({}).sort({ createdAt: -1 }).lean();

    // Map each registered user with their order history and computed metrics
    const registeredEmails = new Set<string>();

    const usersWithOrders = users.map((u: any) => {
      const emailLower = (u.email || "").trim().toLowerCase();
      if (emailLower) {
        registeredEmails.add(emailLower);
      }

      const userOrders = allOrders.filter((o: any) => {
        const orderUserId = o.userId ? o.userId.toString() : "";
        const orderEmail = (o.customerInfo?.email || "").trim().toLowerCase();
        return (orderUserId && orderUserId === u._id.toString()) || (orderEmail && orderEmail === emailLower);
      });

      const totalSpent = userOrders.reduce((sum: number, o: any) => {
        if (o.orderStatus === "Cancelled") return sum;
        return sum + (Number(o.pricing?.total) || 0);
      }, 0);

      const latestOrder = userOrders[0];

      return {
        _id: u._id.toString(),
        name: u.name || latestOrder?.customerInfo?.name || "Anonymous",
        email: u.email,
        phone: u.phone || latestOrder?.customerInfo?.phone || "",
        role: u.role || "customer",
        image: u.image || "",
        address: u.address || latestOrder?.customerInfo?.address || "",
        city: u.city || latestOrder?.customerInfo?.city || "",
        state: u.state || latestOrder?.customerInfo?.state || "",
        zip: u.zip || latestOrder?.customerInfo?.zip || "",
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        isRegistered: true,
        ordersCount: userOrders.length,
        totalSpent,
        lastOrderDate: latestOrder?.createdAt || null,
        orders: userOrders.map((o: any) => ({
          _id: o._id.toString(),
          orderNumber: o.orderNumber,
          createdAt: o.createdAt,
          total: o.pricing?.total || 0,
          subtotal: o.pricing?.subtotal || 0,
          shippingCost: o.pricing?.shippingCost || 0,
          discountAmount: o.pricing?.discountAmount || 0,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          orderStatus: o.orderStatus,
          awbCode: o.awbCode || "",
          courierName: o.courierName || "",
          customerInfo: o.customerInfo,
          itemsCount: (o.items || []).reduce((acc: number, it: any) => acc + (it.quantity || 1), 0),
          items: o.items || [],
        })),
      };
    });

    // Also collect guest orders that do not belong to a registered account
    const guestOrdersMap = new Map<string, any[]>();
    for (const o of allOrders) {
      const emailLower = (o.customerInfo?.email || "").trim().toLowerCase();
      if (emailLower && !registeredEmails.has(emailLower)) {
        if (!guestOrdersMap.has(emailLower)) {
          guestOrdersMap.set(emailLower, []);
        }
        guestOrdersMap.get(emailLower)!.push(o);
      }
    }

    const guestUsers = Array.from(guestOrdersMap.entries()).map(([guestEmail, orders]) => {
      const latestOrder = orders[0];
      const totalSpent = orders.reduce((sum: number, o: any) => {
        if (o.orderStatus === "Cancelled") return sum;
        return sum + (Number(o.pricing?.total) || 0);
      }, 0);

      return {
        _id: `guest_${guestEmail}`,
        name: latestOrder?.customerInfo?.name || "Guest Customer",
        email: guestEmail,
        phone: latestOrder?.customerInfo?.phone || "",
        role: "guest" as const,
        image: "",
        address: latestOrder?.customerInfo?.address || "",
        city: latestOrder?.customerInfo?.city || "",
        state: latestOrder?.customerInfo?.state || "",
        zip: latestOrder?.customerInfo?.zip || "",
        createdAt: latestOrder?.createdAt,
        updatedAt: latestOrder?.createdAt,
        isRegistered: false,
        ordersCount: orders.length,
        totalSpent,
        lastOrderDate: latestOrder?.createdAt || null,
        orders: orders.map((o: any) => ({
          _id: o._id.toString(),
          orderNumber: o.orderNumber,
          createdAt: o.createdAt,
          total: o.pricing?.total || 0,
          subtotal: o.pricing?.subtotal || 0,
          shippingCost: o.pricing?.shippingCost || 0,
          discountAmount: o.pricing?.discountAmount || 0,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          orderStatus: o.orderStatus,
          awbCode: o.awbCode || "",
          courierName: o.courierName || "",
          customerInfo: o.customerInfo,
          itemsCount: (o.items || []).reduce((acc: number, it: any) => acc + (it.quantity || 1), 0),
          items: o.items || [],
        })),
      };
    });

    return NextResponse.json({
      success: true,
      users: usersWithOrders,
      guestUsers,
      totalRegistered: usersWithOrders.length,
      totalGuests: guestUsers.length,
    });
  } catch (error: any) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch users." },
      { status: 500 }
    );
  }
}

