import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import KidsParents from "@/models/KidsParents";

export const dynamic = 'force-dynamic';

const DEFAULT_CONFIG = {
  headerTitleLine1: "CLEAN LABEL.",
  headerTitleLine2: "FULL DISCLOSURE.",
  headerSubtitle: "So clean, we proudly declare every ingredient.",
  titleLine1: "KIDS LOVE",
  titleLine2: "AND PARENTS TRUST",
  paraPrefix: "Wholesome, delicious, and made with",
  paraHighlight: "care for families.",
  btnLabel: "Explore Now",
  btnLink: "/collections/all",
  imageUrl: "/images/mother-child.jpg",
  imageAlt: "Kids love and parents trust Sustento",
};

// Public GET route to fetch settings
export async function GET() {
  try {
    await connectDB();
    const config = await KidsParents.findOne({});
    if (!config) {
      return NextResponse.json(DEFAULT_CONFIG);
    }
    
    // Auto-heal old schemas on GET if database has old fields
    const obj = config.toObject();
    let needsSave = false;
    
    if (!obj.headerTitleLine1) {
      const oldTitle = (config as any).headerTitle || "CLEAN LABEL. FULL DISCLOSURE.";
      const index = oldTitle.indexOf(".");
      if (index !== -1) {
        config.headerTitleLine1 = oldTitle.substring(0, index + 1).trim();
        config.headerTitleLine2 = oldTitle.substring(index + 1).trim();
      } else {
        config.headerTitleLine1 = oldTitle;
        config.headerTitleLine2 = "";
      }
      needsSave = true;
    }
    
    if (needsSave) {
      await config.save();
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("GET /api/kids-parents error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch settings.";
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

    let config = await KidsParents.findOne({});
    if (config) {
      // Update existing document
      config.headerTitleLine1 = body.headerTitleLine1;
      config.headerTitleLine2 = body.headerTitleLine2;
      config.headerSubtitle = body.headerSubtitle;
      config.titleLine1 = body.titleLine1;
      config.titleLine2 = body.titleLine2;
      config.paraPrefix = body.paraPrefix;
      config.paraHighlight = body.paraHighlight;
      config.btnLabel = body.btnLabel;
      config.btnLink = body.btnLink;
      config.imageUrl = body.imageUrl;
      config.imageAlt = body.imageAlt;
      await config.save();
    } else {
      // Create new document
      config = await KidsParents.create({
        headerTitleLine1: body.headerTitleLine1,
        headerTitleLine2: body.headerTitleLine2,
        headerSubtitle: body.headerSubtitle,
        titleLine1: body.titleLine1,
        titleLine2: body.titleLine2,
        paraPrefix: body.paraPrefix,
        paraHighlight: body.paraHighlight,
        btnLabel: body.btnLabel,
        btnLink: body.btnLink,
        imageUrl: body.imageUrl,
        imageAlt: body.imageAlt,
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("POST /api/kids-parents error:", error);
    const message = error instanceof Error ? error.message : "Failed to save settings.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
