import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File size exceeds the limit of 50MB on the server" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only image or video files are allowed." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isVideo = file.type.startsWith("video/");
    const folderName = isVideo ? "videos" : "images";
    
    // Save locally to public/uploads/images or public/uploads/videos
    const publicDir = path.join(process.cwd(), "public", "uploads", folderName);
    await fs.mkdir(publicDir, { recursive: true });
    
    const ext = path.extname(file.name) || (isVideo ? ".mp4" : ".jpg");
    const prefix = isVideo ? "video_" : "image_";
    const filename = `${prefix}${Date.now()}${ext}`;
    const filepath = path.join(publicDir, filename);
    
    await fs.writeFile(filepath, buffer);
    
    return NextResponse.json({
      url: `/uploads/${folderName}/${filename}`,
      public_id: filename,
    });

  } catch (error: any) {
    console.error("Upload API route failure:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload media" },
      { status: 500 }
    );
  }
}
