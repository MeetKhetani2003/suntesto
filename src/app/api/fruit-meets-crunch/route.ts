export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FruitMeetsCrunch from "@/models/FruitMeetsCrunch";

export async function GET() {
  try {
    await connectDB();
    let config = await FruitMeetsCrunch.findOne();
    if (!config) {
      config = await FruitMeetsCrunch.create({
        desktopImageUrl: "",
        mobileImageUrl: "",
        isEnabled: true,
      });
    }
    return NextResponse.json(config);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to load Fruit Meets Crunch settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    let config = await FruitMeetsCrunch.findOne();
    if (!config) {
      config = await FruitMeetsCrunch.create(body);
    } else {
      config = await FruitMeetsCrunch.findByIdAndUpdate(config._id, body, { new: true });
    }
    return NextResponse.json(config);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to save Fruit Meets Crunch settings" },
      { status: 500 }
    );
  }
}
