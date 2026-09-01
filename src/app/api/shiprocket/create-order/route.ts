import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import {
  createShiprocketOrder,
  ShiprocketOrderPayload,
} from "@/lib/shiprocket";

/**
 * POST /api/shiprocket/create-order
 * Creates a Shiprocket shipment for an existing order.
 * Called automatically by place-order after payment confirmation,
 * or manually by admin from the orders panel.
 * Body: { orderId: string }  (MongoDB _id of the order)
 */
export async function POST(req: Request) {
  try {
    await connectDB();
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    // Fetch the order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Skip if shipment already created
    if (order.shiprocketOrderId) {
      return NextResponse.json({
        message: "Shipment already created",
        awbCode: order.awbCode,
        courierName: order.courierName,
      });
    }

    // Single-pass: fetch product data once and compute both order items + weight/dims
    const orderItems = [];
    let totalWeightKg = 0;
    let maxLength = 15, maxBreadth = 10, maxHeight = 5;

    for (const item of order.items as any[]) {
      let weightGrams = 100;
      let length = 15, breadth = 10, height = 5;

      if (item.id && item.id.match(/^[0-9a-fA-F]{24}$/)) {
        const prod = await Product.findById(item.id).lean() as any;
        if (prod) {
          weightGrams = prod.weightGrams || 100;
          length   = prod.dimensions?.length  || 15;
          breadth  = prod.dimensions?.breadth || 10;
          height   = prod.dimensions?.height  || 5;
        }
      }

      totalWeightKg += (weightGrams / 1000) * item.quantity;
      maxLength  = Math.max(maxLength,  length);
      maxBreadth = Math.max(maxBreadth, breadth);
      maxHeight  = Math.max(maxHeight,  height);

      orderItems.push({
        name:          item.title,
        sku:           item.slug || item.id,
        units:         item.quantity,
        selling_price: item.price,
      });
    }

    // Format order date for Shiprocket ("YYYY-MM-DD HH:mm")
    const orderDate = new Date(order.createdAt);
    const pad = (n: number) => String(n).padStart(2, "0");
    const formattedDate = `${orderDate.getFullYear()}-${pad(orderDate.getMonth() + 1)}-${pad(orderDate.getDate())} ${pad(orderDate.getHours())}:${pad(orderDate.getMinutes())}`;

    const payload: ShiprocketOrderPayload = {
      order_id: order.orderNumber,
      order_date: formattedDate,
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "Test Warehouse",
      billing_customer_name: order.customerInfo.name,
      billing_address: order.customerInfo.address,
      billing_city: order.customerInfo.city,
      billing_pincode: order.customerInfo.zip,
      billing_state: order.customerInfo.state,
      billing_country: "India",
      billing_email: order.customerInfo.email,
      billing_phone: order.customerInfo.phone,
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",
      sub_total: order.paymentMethod === "COD"
        ? (order.pricing.codAmountToCollect !== undefined ? order.pricing.codAmountToCollect : Math.max(0, order.pricing.total - order.pricing.shippingCost))
        : order.pricing.total,
      length: maxLength,
      breadth: maxBreadth,
      height: maxHeight,
      weight: Math.max(0.1, parseFloat(totalWeightKg.toFixed(2))),
    };

    // Call Shiprocket API (or mock if not configured)
    const result = await createShiprocketOrder(payload);

    // Save Shiprocket details back to the order
    await Order.findByIdAndUpdate(orderId, {
      shiprocketOrderId: result.shiprocket_order_id,
      shiprocketShipmentId: result.shipment_id,
      awbCode: result.awb_code,
      courierName: result.courier_name,
      trackingUrl: result.tracking_url,
      orderStatus: "Shipped",
      shiprocketStatus: "Shipment Created",
    });

    return NextResponse.json({
      success: true,
      shiprocketOrderId: result.shiprocket_order_id,
      awbCode: result.awb_code,
      courierName: result.courier_name,
      trackingUrl: result.tracking_url,
    });
  } catch (error: any) {
    console.error("[Shiprocket] Create order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Shiprocket shipment." },
      { status: 500 }
    );
  }
}
