import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import SecretNutrition from "@/models/SecretNutrition";

// Public GET route to fetch settings
export async function GET() {
  try {
    await connectDB();
    const config = await SecretNutrition.findOne({});
    if (!config) {
      // Return default values if no document exists
      return NextResponse.json({
        sectionTitle: "THE SECRET TO PURE,\nREAL NUTRITION",
        sectionSubtitle: "The Tech Behind the Crunch",
        techTitle: "Vacuum Freeze-Drying",
        techDescription: "Our vacuum freeze-drying technology locks in flavor, color, and 95%+ of the raw fruit's natural vitamins. We freeze the fresh fruit at extreme cold temperatures (-31°C) and remove the moisture by sublimation.",
        equationLeft: "Freeze Drying",
        equationMiddle: "Fruit",
        equationRight: "Water",
        tempText: "-31°C",
      });
    }
    return NextResponse.json(config);
  } catch (error: any) {
    console.error("GET /api/secret-nutrition error:", error);
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

    let config = await SecretNutrition.findOne({});
    if (config) {
      // Update existing document
      config.sectionTitle = body.sectionTitle;
      config.sectionSubtitle = body.sectionSubtitle;
      config.techTitle = body.techTitle;
      config.techDescription = body.techDescription;
      config.equationLeft = body.equationLeft;
      config.equationMiddle = body.equationMiddle;
      config.equationRight = body.equationRight;
      config.tempText = body.tempText;
      await config.save();
    } else {
      // Create new document
      config = await SecretNutrition.create({
        sectionTitle: body.sectionTitle,
        sectionSubtitle: body.sectionSubtitle,
        techTitle: body.techTitle,
        techDescription: body.techDescription,
        equationLeft: body.equationLeft,
        equationMiddle: body.equationMiddle,
        equationRight: body.equationRight,
        tempText: body.tempText,
      });
    }

    return NextResponse.json(config);
  } catch (error: any) {
    console.error("POST /api/secret-nutrition error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save settings." },
      { status: 500 }
    );
  }
}
