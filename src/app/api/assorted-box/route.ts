export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import AssortedBoxSection from "@/models/AssortedBoxSection";

// Public GET route to fetch Assorted Box config
export async function GET() {
  try {
    await connectDB();
    const config = await AssortedBoxSection.findOne({});
    if (!config) {
      return NextResponse.json({
        title: "MAKE YOUR\nASSORTED BOX",
        tagline: "Try out our top 5\nfavorites",
        buttonText: "Shop Now",
        buttonLink: "/collections/all",
        desktopImageUrl: "",
        mobileImageUrl: "",
      });
    }
    return NextResponse.json(config);
  } catch (error: any) {
    console.error("GET /api/assorted-box error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch settings." },
      { status: 500 }
    );
  }
}

// Protected POST route to update settings
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

    let config = await AssortedBoxSection.findOne({});
    if (config) {
      config.title = body.title;
      config.tagline = body.tagline;
      config.buttonText = body.buttonText;
      config.buttonLink = body.buttonLink;
      config.desktopImageUrl = body.desktopImageUrl;
      config.mobileImageUrl = body.mobileImageUrl;
      await config.save();
    } else {
      config = await AssortedBoxSection.create({
        title: body.title,
        tagline: body.tagline,
        buttonText: body.buttonText,
        buttonLink: body.buttonLink,
        desktopImageUrl: body.desktopImageUrl,
        mobileImageUrl: body.mobileImageUrl,
      });
    }

    return NextResponse.json(config);
  } catch (error: any) {
    console.error("POST /api/assorted-box error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save settings." },
      { status: 500 }
    );
  }
}
