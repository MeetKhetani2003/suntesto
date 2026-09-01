import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import AboutVideo from "@/models/AboutVideo";

// Public GET route to fetch About Us Video section config
export async function GET() {
  try {
    await connectDB();
    const config = await AboutVideo.findOne({});
    if (!config) {
      return NextResponse.json({
        heading: "OUR JOURNEY IN MOTION",
        videoUrl: "/videos/about-story.mp4",
        description: "At Sustento, we believe in bringing you the purest form of nutrition. Watch our journey as we turn fresh, organic whole fruits into lightweight, crunchy snacks without losing any of their natural vitamins and flavors.",
      });
    }
    return NextResponse.json(config);
  } catch (error: any) {
    console.error("GET /api/about-video error:", error);
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

    let config = await AboutVideo.findOne({});
    if (config) {
      config.heading = body.heading;
      config.videoUrl = body.videoUrl;
      config.description = body.description;
      await config.save();
    } else {
      config = await AboutVideo.create({
        heading: body.heading,
        videoUrl: body.videoUrl,
        description: body.description,
      });
    }

    return NextResponse.json(config);
  } catch (error: any) {
    console.error("POST /api/about-video error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save settings." },
      { status: 500 }
    );
  }
}
