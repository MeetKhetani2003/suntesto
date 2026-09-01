export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Hero from "@/models/Hero";

const DEFAULT_SLIDES = [
  {
    badgeText: "Snacks",
    titleLine1: "WORLD'S LIGHTEST",
    titleLine2: "WHOLE FRUIT",
    titleLine3: "FREEZE-DRIED",
    titleHighlight: "Snacks",
    backgroundImageUrl: "",
    backgroundVideoUrl: "https://player.vimeo.com/external/435674703.sd.mp4?s=7f3747190d5656157e108e4726615b3c5a6104f6&profile_id=139&oauth2_token_id=57447761",
    mobileBackgroundImageUrl: "",
    mobileBackgroundVideoUrl: "",
  }
];

// Public GET route to fetch Hero details (with fallback)
export async function GET() {
  try {
    await connectDB();
    const hero = await Hero.findOne({});
    if (!hero) {
      return NextResponse.json({
        slides: DEFAULT_SLIDES,
        autoPlayInterval: 5000,
      });
    }

    // Migration and empty state fallback:
    // If the database document doesn't have slides, or slides is empty, but has old schema fields:
    if (!hero.slides || hero.slides.length === 0) {
      const oldFields = hero.toObject();
      if (oldFields.badgeText || oldFields.titleLine1) {
        // Migrate old single slide format
        hero.slides = [
          {
            badgeText: oldFields.badgeText || "Snacks",
            titleLine1: oldFields.titleLine1 || "WORLD'S LIGHTEST",
            titleLine2: oldFields.titleLine2 || "WHOLE FRUIT",
            titleLine3: oldFields.titleLine3 || "FREEZE-DRIED",
            titleHighlight: oldFields.titleHighlight || "Snacks",
            backgroundImageUrl: oldFields.backgroundImageUrl || "",
            backgroundVideoUrl: oldFields.backgroundVideoUrl || "",
            mobileBackgroundImageUrl: oldFields.mobileBackgroundImageUrl || "",
            mobileBackgroundVideoUrl: oldFields.mobileBackgroundVideoUrl || "",
          }
        ];
        hero.autoPlayInterval = oldFields.autoPlayInterval || 5000;
        await hero.save();
      } else {
        // Fallback to default slides
        hero.slides = DEFAULT_SLIDES;
        hero.autoPlayInterval = 5000;
        await hero.save();
      }
    }

    return NextResponse.json(hero);
  } catch (error: any) {
    console.error("GET /api/hero error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch hero settings." },
      { status: 500 }
    );
  }
}

// Protected POST/PUT route to update Hero settings
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

    if (!body.slides || !Array.isArray(body.slides) || body.slides.length === 0) {
      return NextResponse.json(
        { error: "At least one slide configuration is required." },
        { status: 400 }
      );
    }

    let hero = await Hero.findOne({});
    if (hero) {
      // Update existing document
      hero.slides = body.slides;
      hero.autoPlayInterval = Number(body.autoPlayInterval) || 5000;
      await hero.save();
    } else {
      // Create new document
      hero = await Hero.create({
        slides: body.slides,
        autoPlayInterval: Number(body.autoPlayInterval) || 5000,
      });
    }

    return NextResponse.json(hero);
  } catch (error: any) {
    console.error("POST /api/hero error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save hero settings." },
      { status: 500 }
    );
  }
}
