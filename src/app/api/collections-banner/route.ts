export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import CollectionsBanner from "@/models/CollectionsBanner";

const DEFAULT_CONFIG = {
  desktopImageUrl: "",
  mobileImageUrl: "",
  bannerLink: "",
  isEnabled: false,
};

// Public GET route to fetch collections banner settings
export async function GET() {
  try {
    await connectDB();
    const config = await CollectionsBanner.findOne({});
    if (!config) {
      return NextResponse.json(DEFAULT_CONFIG);
    }
    return NextResponse.json(config);
  } catch (error) {
    console.error("GET /api/collections-banner error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch settings.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// Protected POST route to update collections banner settings
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

    let config = await CollectionsBanner.findOne({});
    if (config) {
      // Update existing document
      config.desktopImageUrl = body.desktopImageUrl ?? "";
      config.mobileImageUrl = body.mobileImageUrl ?? "";
      config.bannerLink = body.bannerLink ?? "";
      config.isEnabled = body.isEnabled ?? false;
      await config.save();
    } else {
      // Create new document
      config = await CollectionsBanner.create({
        desktopImageUrl: body.desktopImageUrl ?? "",
        mobileImageUrl: body.mobileImageUrl ?? "",
        bannerLink: body.bannerLink ?? "",
        isEnabled: body.isEnabled ?? false,
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("POST /api/collections-banner error:", error);
    const message = error instanceof Error ? error.message : "Failed to save settings.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
