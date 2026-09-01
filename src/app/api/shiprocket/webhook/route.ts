import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

/**
 * POST /api/shiprocket/webhook?token=YOUR_SECRET
 * 
 * Shiprocket sends POST requests here when order status changes.
 * Configure this URL in Shiprocket Dashboard → Settings → API → Webhooks
 * 
 * URL to register: https://yourdomain.com/api/shiprocket/webhook?token=sustento_webhook_secret_2026
 * 
 * Shiprocket status → Sustento orderStatus mapping:
 *   PICKED UP         → Shipped
 *   IN TRANSIT        → Shipped
 *   OUT FOR DELIVERY  → Out For Delivery
 *   DELIVERED         → Delivered
 *   RTO               → Processing (Return to Origin)
 *   CANCELLED         → Cancelled
 */

// Map Shiprocket statuses to our order statuses
function mapShiprocketStatus(status: string): string {
  const s = (status || "").toUpperCase();
  if (s.includes("DELIVERED") && !s.includes("OUT")) return "Delivered";
  if (s.includes("OUT FOR DELIVERY")) return "Out For Delivery";
  if (s.includes("PICKED") || s.includes("IN TRANSIT") || s.includes("SHIPPED")) return "Shipped";
  if (s.includes("CANCELLED") || s.includes("RTO")) return "Cancelled";
  return "Processing";
}

export async function POST(req: Request) {
  try {
    // Validate webhook token for basic security
    const url = new URL(req.url);
    const receivedToken = url.searchParams.get("token");
    const expectedToken = process.env.SHIPROCKET_WEBHOOK_TOKEN;

    if (expectedToken && receivedToken !== expectedToken) {
      console.warn("[Shiprocket Webhook] Invalid token received");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("[Shiprocket Webhook] Received:", JSON.stringify(body, null, 2));

    // Shiprocket sends different payload shapes; handle both v1 and v2
    const awbCode: string =
      body.awb ||
      body.awb_code ||
      body.data?.awb_code ||
      "";

    const shiprocketStatus: string =
      body.current_status ||
      body.status ||
      body.data?.current_status ||
      "";

    const shiprocketOrderId: string =
      String(body.order_id || body.data?.order_id || "");

    if (!awbCode && !shiprocketOrderId) {
      console.warn("[Shiprocket Webhook] No AWB or order_id in payload, skipping.");
      return NextResponse.json({ received: true });
    }

    await connectDB();

    // Find the order by AWB code or Shiprocket order ID
    const order = await Order.findOne(
      awbCode
        ? { awbCode }
        : { shiprocketOrderId }
    );

    if (!order) {
      console.warn("[Shiprocket Webhook] No matching order found for AWB:", awbCode);
      return NextResponse.json({ received: true });
    }

    const newOrderStatus = mapShiprocketStatus(shiprocketStatus);

    await Order.findByIdAndUpdate(order._id, {
      shiprocketStatus,
      orderStatus: newOrderStatus,
    });

    console.log(
      `[Shiprocket Webhook] Updated order ${order.orderNumber}: ${shiprocketStatus} → ${newOrderStatus}`
    );

    return NextResponse.json({ received: true, updated: order.orderNumber });
  } catch (error: any) {
    console.error("[Shiprocket Webhook] Error:", error);
    // Always return 200 to Shiprocket so it doesn't keep retrying
    return NextResponse.json({ received: true });
  }
}

// Shiprocket also sends GET pings to verify webhook URL
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (token === process.env.SHIPROCKET_WEBHOOK_TOKEN) {
    return NextResponse.json({ status: "ok", service: "sustento-shiprocket-webhook" });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
