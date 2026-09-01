export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import WhatWePutIn from "@/models/WhatWePutIn";

const DEFAULT_SMOOTHIES = [
  { letter: "A", items: ["Activated Cashew Butter", "Almond Milk", "Apple"] },
  { letter: "B", items: ["Banana", "Blue Spirulina"] },
  { letter: "C", items: ["Cherry", "Cocoa Powder"] },
  { letter: "D", items: ["Dates", "Dragon Fruit"] },
  { letter: "F", items: ["Fresh Ginger"] },
  { letter: "K", items: ["Kiwi"] },
  { letter: "L", items: ["Lemon Juice", "Lemongrass", "Lime Juice"] },
  { letter: "M", items: ["Mango", "Matcha Powder"] },
  { letter: "O", items: ["Orange"] },
  { letter: "P", items: ["Pineapple"] },
  { letter: "R", items: ["Raspberries"] },
  { letter: "S", items: ["Spinach Leaves", "Strawberries", "Sweet Potato"] },
  { letter: "T", items: ["Turmeric"] },
];

const DEFAULT_SNACKS = [
  { letter: "A", items: ["Apple"] },
  { letter: "B", items: ["Blueberry"] },
  { letter: "G", items: ["Green Apple"] },
  { letter: "K", items: ["Kala Jamun"] },
  { letter: "M", items: ["Mango", "Mulberry"] },
  { letter: "P", items: ["Pear", "Pineapple"] },
  { letter: "S", items: ["Strawberry"] },
];

const DEFAULT_SPREADS = [
  { letter: "A", items: ["Activated Almonds", "Activated Cashews", "Allulose"] },
  { letter: "B", items: ["Butterfly Pea Flower"] },
  { letter: "C", items: ["Cocoa Nibs", "Cocoa Powder", "Coconut"] },
  { letter: "F", items: ["Freeze-Dried Mangoes", "Freeze-Dried Pineapple", "Freeze-Dried Strawberries"] },
  { letter: "G", items: ["Grapeseed Oil"] },
  { letter: "J", items: ["Japanese Matcha Powder"] },
  { letter: "N", items: ["Natural Vanilla"] },
  { letter: "R", items: ["Roasted Hazelnuts"] },
  { letter: "S", items: ["Sprouted Peanuts", "Stevia", "Sunflower Lecithin"] },
  { letter: "V", items: ["Vanilla Extract"] },
];

// Public GET route to fetch settings
export async function GET() {
  try {
    await connectDB();
    const config = await WhatWePutIn.findOne({});
    if (!config) {
      // Return default values if no document exists
      return NextResponse.json({
        smoothies: DEFAULT_SMOOTHIES,
        snacks: DEFAULT_SNACKS,
        spreads: DEFAULT_SPREADS,
      });
    }
    return NextResponse.json(config);
  } catch (error) {
    console.error("GET /api/what-we-put-in error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch ingredients glossary.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// Protected POST route to update settings
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as { role?: string })?.role;
    const userEmail = session?.user?.email;
    const isAdmin = userRole === "admin" || (userEmail && userEmail === process.env.ADMIN_EMAIL);

    if (!session || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    let config = await WhatWePutIn.findOne({});
    if (config) {
      // Update existing document
      config.smoothies = body.smoothies;
      config.snacks = body.snacks;
      config.spreads = body.spreads;
      await config.save();
    } else {
      // Create new document
      config = await WhatWePutIn.create({
        smoothies: body.smoothies,
        snacks: body.snacks,
        spreads: body.spreads,
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("POST /api/what-we-put-in error:", error);
    const message = error instanceof Error ? error.message : "Failed to save ingredients glossary.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
