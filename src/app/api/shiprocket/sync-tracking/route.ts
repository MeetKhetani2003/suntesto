import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getShiprocketTracking } from "@/lib/shiprocket";

/**
 * POST /api/shiprocket/sync-tracking
 * Admin-triggered manual sync of tracking status from Shiprocket.
 * Body: { orderId: string }  (MongoDB _id of the order)
 */
export async function POST(req: Request) {
  try {
    await connectDB();
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.awbCode) {
      return NextResponse.json(
        { error: "No AWB code found. Shipment may not have been created yet." },
        { status: 400 }
      );
    }

    // Fetch latest tracking from Shiprocket
    const tracking = await getShiprocketTracking(order.awbCode);

    // Map Shiprocket status to our order status
    const statusMap: Record<string, string> = {
      "Delivered": "Delivered",
      "Out for Delivery": "Out For Delivery",
      "In Transit": "Shipped",
      "Picked Up": "Shipped",
      "Cancelled": "Cancelled",
    };

    let newOrderStatus: string = order.orderStatus;
    for (const [key, val] of Object.entries(statusMap)) {
      if (tracking.current_status.toLowerCase().includes(key.toLowerCase())) {
        newOrderStatus = val;
        break;
      }
    }

    await Order.findByIdAndUpdate(orderId, {
      shiprocketStatus: tracking.current_status,
      courierName: tracking.courier_name || order.courierName,
      orderStatus: newOrderStatus,
    });

    return NextResponse.json({
      success: true,
      currentStatus: tracking.current_status,
      courierName: tracking.courier_name,
      etd: tracking.etd,
      orderStatus: newOrderStatus,
    });
  } catch (error: any) {
    console.error("[Shiprocket] Sync tracking error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to sync tracking." },
      { status: 500 }
    );
  }
}
