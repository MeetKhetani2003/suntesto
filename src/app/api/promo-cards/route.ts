export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import PromoCard from "@/models/PromoCard";

const DEFAULT_PROMO_CARDS = [
  {
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    badgeText: "KID-APPROVED",
    title: "",
    subtitle: "",
    description: "",
    order: 0,
  },
  {
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    badgeText: "",
    title: "JUST",
    subtitle: "",
    description: "",
    order: 1,
  },
  {
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    badgeText: "",
    title: "WHAT IS FREEZE-DRYING?",
    subtitle: "(The Tech)",
    description: "FREEZE DRYING = FRUIT - WATER",
    order: 2,
  },
  {
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    badgeText: "just 100% real fruit",
    title: "",
    subtitle: "",
    description: "",
    order: 3,
  }
];

// Public GET route to fetch all promotion cards (seeded if empty)
export async function GET() {
  try {
    await connectDB();
    let cards = await PromoCard.find({}).sort({ order: 1 });
    
    if (!cards || cards.length === 0) {
      // Seed default promotional cards if database is empty
      cards = await PromoCard.insertMany(DEFAULT_PROMO_CARDS);
    }
    
    return NextResponse.json(cards);
  } catch (error: any) {
    console.error("GET /api/promo-cards error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch promo cards." },
      { status: 500 }
    );
  }
}

// Protected POST route to save all cards in bulk
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

    if (!body.cards || !Array.isArray(body.cards) || body.cards.length === 0) {
      return NextResponse.json(
        { error: "At least one card configuration is required." },
        { status: 400 }
      );
    }

    // Replace all promo cards
    await PromoCard.deleteMany({});
    const mapped = body.cards.map((c: any, idx: number) => ({
      videoUrl: c.videoUrl,
      badgeText: c.badgeText || "",
      title: c.title || "",
      subtitle: c.subtitle || "",
      description: c.description || "",
      order: idx,
    }));

    const saved = await PromoCard.insertMany(mapped);
    return NextResponse.json(saved);
  } catch (error: any) {
    console.error("POST /api/promo-cards error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save promo cards." },
      { status: 500 }
    );
  }
}
