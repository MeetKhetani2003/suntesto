import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import LimitedEdition from "@/models/LimitedEdition";

// Public GET route to fetch Limited Edition config
export async function GET() {
  try {
    await connectDB();
    const config = await LimitedEdition.findOne({});
    if (!config) {
      // Return default values if no document exists
      return NextResponse.json({
        title: "LIMITED EDITION",
        tagText: "Special Fruit hamper",
        imageUrl: "/images/hamper.jpg",
        bgBottomColor: "#b4b953",
        topAnnotationText: "Build your own",
        topAnnotationHighlight: "Hamper",
        midAnnotationText: "4 SNACKS",
        botAnnotationText: "2 CHOC-DIPPED",
      });
    }
    return NextResponse.json(config);
  } catch (error: any) {
    console.error("GET /api/limited-edition error:", error);
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

    let config = await LimitedEdition.findOne({});
    if (config) {
      // Update existing document
      config.title = body.title;
      config.tagText = body.tagText;
      config.imageUrl = body.imageUrl;
      config.bgBottomColor = body.bgBottomColor;
      config.topAnnotationText = body.topAnnotationText;
      config.topAnnotationHighlight = body.topAnnotationHighlight;
      config.midAnnotationText = body.midAnnotationText;
      config.botAnnotationText = body.botAnnotationText;
      await config.save();
    } else {
      // Create new document
      config = await LimitedEdition.create({
        title: body.title,
        tagText: body.tagText,
        imageUrl: body.imageUrl,
        bgBottomColor: body.bgBottomColor,
        topAnnotationText: body.topAnnotationText,
        topAnnotationHighlight: body.topAnnotationHighlight,
        midAnnotationText: body.midAnnotationText,
        botAnnotationText: body.botAnnotationText,
      });
    }

    return NextResponse.json(config);
  } catch (error: any) {
    console.error("POST /api/limited-edition error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save settings." },
      { status: 500 }
    );
  }
}
