import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import AboutHero from "@/models/AboutHero";

export const dynamic = 'force-dynamic';

// Public GET route to fetch About Us Hero config
export async function GET() {
  try {
    await connectDB();
    const config = await AboutHero.findOne({});
    if (!config) {
      // Return default values if no document exists
      return NextResponse.json({
        slides: [
          {
            imageUrl: "/images/sustento-pouch-pineapple.jpg",
            title: "PINEAPPLE \nWHOLE FRUIT",
            description: "Lightweight, Crunchy, \nSingle Ingredient",
            titleColor: "#353534",
          },
          {
            imageUrl: "/images/sustento-pouch-strawberry.jpg",
            title: "STRAWBERRY \nWHOLE FRUIT",
            description: "Lightweight, Crunchy, \nSingle Ingredient",
            titleColor: "#353534",
          },
        ]
      });
    }
    return NextResponse.json(config);
  } catch (error: any) {
    console.error("GET /api/about-hero error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch settings." },
      { status: 500 }
    );
  }
}

// Protected POST/PUT route to update settings
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const userEmail = session?.user?.email;
    const isAdmin = userRole === "admin" || (userEmail && userEmail === process.env.ADMIN_EMAIL);

    if (!session || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    let config = await AboutHero.findOne({});
    if (config) {
      // Update existing document
      config.slides = body.slides;
      await config.save();
    } else {
      // Create new document
      config = await AboutHero.create({
        slides: body.slides,
      });
    }

    return NextResponse.json(config);
  } catch (error: any) {
    console.error("POST /api/about-hero error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save settings." },
      { status: 500 }
    );
  }
}
