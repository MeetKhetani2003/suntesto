import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { sendLowStockEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { 
      customerInfo, 
      items, 
      pricing, 
      couponCode, 
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature 
    } = body;

    if (!customerInfo || !items || !pricing) {
      return NextResponse.json({ error: "Missing required checkout fields." }, { status: 400 });
    }

    // Verify signature if Razorpay order ID is provided (prepaid online or hybrid COD shipping)
    if (razorpayOrderId) {
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      const isMockOrder = razorpayOrderId?.startsWith("order_mock_");

      if (!isMockOrder && (!keyId || !keySecret || keyId.startsWith("rzp_test_placeholder"))) {
        return NextResponse.json({ error: "Razorpay credentials are not configured on server." }, { status: 500 });
      }

      if (!isMockOrder) {
        const hmac = crypto.createHmac("sha256", keySecret!);
        hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature !== razorpaySignature) {
          return NextResponse.json({ error: "Payment verification failed. Invalid signature." }, { status: 400 });
        }
      }
    }

    // Fetch session if logged in
    const session = await getServerSession(authOptions);
    let userId = undefined;
    if (session?.user?.email) {
      const dbUser = await User.findOne({ email: session.user.email.toLowerCase() });
      if (dbUser) {
        userId = dbUser._id.toString();
      }
    }

    // Generate unique random order number e.g. SU-582931
    const orderNumber = `SU-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = await Order.create({
      orderNumber,
      customerInfo,
      items,
      pricing: {
        ...pricing,
        codAmountToCollect: paymentMethod === "COD" ? Math.max(0, pricing.total - pricing.shippingCost) : 0,
        shippingPaidOnline: paymentMethod === "COD" ? pricing.shippingCost : 0,
      },
      couponCode,
      userId,
      paymentMethod: paymentMethod || "ONLINE",
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      orderStatus: "Processing",
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    // Deduct stock levels for purchased items
    for (const item of items) {
      if (item.id && item.id.match(/^[0-9a-fA-F]{24}$/)) {
        const prod = await Product.findById(item.id);
        if (prod) {
          const oldStock = prod.stockQuantity;
          prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
          await prod.save();

          // Trigger low stock alert if it drops to 10 or below (and wasn't already)
          if (oldStock > 10 && prod.stockQuantity <= 10) {
            // Run asynchronously so it doesn't block the checkout response
            sendLowStockEmail(prod.title || item.title, prod.stockQuantity).catch(console.error);
          }
        }
      }
    }

    // ── Trigger Shiprocket shipment creation asynchronously ──────
    // Fire-and-forget: don't await so customer gets instant response.
    // If this fails, admin can manually trigger from the orders panel.
    // Resolution order: NEXTAUTH_URL → NEXT_PUBLIC_SITE_URL → localhost
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";
    fetch(`${baseUrl}/api/shiprocket/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: newOrder._id.toString() }),
    }).catch((err) => {
      console.error("[Shiprocket] Auto-create failed (non-fatal):", err.message);
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error("Order placement API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to place order." },
      { status: 500 }
    );
  }
}
