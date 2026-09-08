import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";

/**
 * POST /api/contact
 * Saves a contact form submission to MongoDB.
 */
export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, phone, message } = await req.json();

    // Basic validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    await ContactMessage.create({ name: name.trim(), email: email.trim().toLowerCase(), phone: phone?.trim() || "", message: message.trim() });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("[Contact] POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save message." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contact  (admin use — fetch all messages)
 */
export async function GET() {
  try {
    await connectDB();
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
