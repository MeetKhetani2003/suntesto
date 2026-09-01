import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const { total } = await req.json();

    if (total === undefined || total <= 0) {
      return NextResponse.json({ error: "Valid total amount is required." }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.startsWith("rzp_test_placeholder")) {
      console.warn("Using Razorpay Sandbox Mock Mode (keys are placeholders or missing).");
      
      // Fallback: return mock Razorpay order info for development
      return NextResponse.json({
        id: `order_mock_${Math.floor(100000 + Math.random() * 900000)}`,
        amount: Math.round(total * 100),
        currency: "INR",
        mock: true,
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(total * 100), // Amount in paise (1 INR = 100 Paise)
      currency: "INR",
      receipt: `rcpt_${Math.floor(100000 + Math.random() * 900000)}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("GET /api/checkout/razorpay-order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Razorpay order." },
      { status: 500 }
    );
  }
}
