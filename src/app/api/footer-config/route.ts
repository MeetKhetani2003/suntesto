import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import FooterConfig from "@/models/FooterConfig";

const DEFAULT_CONFIG = {
  sloganLine1: "YOU'VE GOT THE",
  sloganLine2: "NATURE'S BEST WITH",
  sloganLine3: "SUSTENTO",
  middleGraphicUrl: "",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  linkedinUrl: "https://linkedin.com",
};

// Public GET route to fetch settings
export async function GET() {
  try {
    await connectDB();
    const config = await FooterConfig.findOne({});
    if (!config) {
      return NextResponse.json(DEFAULT_CONFIG);
    }
    return NextResponse.json(config);
  } catch (error) {
    console.error("GET /api/footer-config error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch footer config.";
    return NextResponse.json({ error: message }, { status: 500 });
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

    let config = await FooterConfig.findOne({});
    if (config) {
      config.sloganLine1 = body.sloganLine1;
      config.sloganLine2 = body.sloganLine2;
      config.sloganLine3 = body.sloganLine3;
      config.middleGraphicUrl = body.middleGraphicUrl;
      config.facebookUrl = body.facebookUrl;
      config.instagramUrl = body.instagramUrl;
      config.linkedinUrl = body.linkedinUrl;
      await config.save();
    } else {
      config = await FooterConfig.create({
        sloganLine1: body.sloganLine1,
        sloganLine2: body.sloganLine2,
        sloganLine3: body.sloganLine3,
        middleGraphicUrl: body.middleGraphicUrl,
        facebookUrl: body.facebookUrl,
        instagramUrl: body.instagramUrl,
        linkedinUrl: body.linkedinUrl,
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("POST /api/footer-config error:", error);
    const message = error instanceof Error ? error.message : "Failed to save footer config.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
