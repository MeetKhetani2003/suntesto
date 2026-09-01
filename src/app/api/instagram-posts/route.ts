import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import InstagramPost from "@/models/InstagramPost";

const DEFAULT_INSTAGRAM_POSTS = [
  {
    imageSrc: "/images/jar-dummy.jpg",
    textOverlay: "Hooked on the colors of nutrition.",
    likes: 42,
    order: 0,
  },
  {
    imageSrc: "/images/review-placeholder.jpg",
    textOverlay: "WE WANT SMOOTHIES",
    likes: 88,
    order: 1,
  },
  {
    imageSrc: "/images/mother-child.jpg",
    textOverlay: "This is why we do what we do",
    likes: 124,
    order: 2,
  },
  {
    imageSrc: "/images/product-dummy.jpg",
    textOverlay: "NO MORE GOODBYES TO MANGO SHAKE",
    likes: 95,
    order: 3,
  },
  {
    imageSrc: "/images/pineapple-transition.jpg",
    textOverlay: "HEALTHY AND CONVENIENT",
    likes: 67,
    order: 4,
  },
  {
    imageSrc: "/images/real-people.jpg",
    textOverlay: "WE CARE ABOUT EVERY INGREDIENT",
    likes: 15,
    order: 5,
  },
  {
    imageSrc: "/images/mother-child.jpg",
    textOverlay: "100% REAL FRUIT SNACKS",
    likes: 210,
    order: 6,
  },
  {
    imageSrc: "/images/hamper.jpg",
    textOverlay: "PURE FRUIT CRUNCH IN EVERY BITE",
    likes: 109,
    order: 7,
  }
];

// Public GET route to fetch all Instagram posts (seeded if empty)
export async function GET() {
  try {
    await connectDB();
    let posts = await InstagramPost.find({}).sort({ order: 1 });
    
    if (!posts || posts.length === 0) {
      // Seed default Instagram posts if database is empty
      posts = await InstagramPost.insertMany(DEFAULT_INSTAGRAM_POSTS);
    }
    
    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("GET /api/instagram-posts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch Instagram posts." },
      { status: 500 }
    );
  }
}

// Protected POST route to save all Instagram posts in bulk
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

    if (!body.posts || !Array.isArray(body.posts) || body.posts.length === 0) {
      return NextResponse.json(
        { error: "At least one Instagram post is required." },
        { status: 400 }
      );
    }

    // Replace all posts in the database
    await InstagramPost.deleteMany({});
    const mapped = body.posts.map((p: any, idx: number) => ({
      imageSrc: p.imageSrc,
      textOverlay: p.textOverlay || "",
      likes: Number(p.likes) || 0,
      mediaType: p.mediaType || "image",
      order: idx,
    }));

    const saved = await InstagramPost.insertMany(mapped);
    return NextResponse.json(saved);
  } catch (error: any) {
    console.error("POST /api/instagram-posts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save Instagram posts." },
      { status: 500 }
    );
  }
}
