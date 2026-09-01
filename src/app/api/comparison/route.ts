import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import ComparisonSection from "@/models/ComparisonSection";
import Product from "@/models/Product"; // ensure Product model is registered in Mongoose

const DEFAULT_COMPARISON = (
  productId: string,
  productTitle: string = "SUSTENTO BITES",
  productImage: string = "/images/sustento-pouch-strawberry.jpg"
) => ({
  productId,
  title: `WHY ${productTitle.toUpperCase()} ?`,
  description: "Our freeze-drying technology preserves the real fruit flavor, color, and nutrients while creating a snack that's wholesome, fun, and ready for everyday snacking.",
  columns: [
    {
      imageUrl: "/images/comparison-jams.png",
      title: "JAMS & CANDIES",
      bullets: ["Added Sugar +", "Added Colour +", "Preservatives"],
      verdict: "NOT HEALTHY",
      verdictType: "red",
    },
    {
      imageUrl: "/images/comparison-spreads.png",
      title: "DEHYDRATED FRUIT",
      bullets: ["Added Sugar +", "Palm Oil +", "Emulsifiers +", "Artificial Flavours"],
      verdict: "NOT HEALTHY",
      verdictType: "red",
    },
    {
      imageUrl: "/images/comparison-butters.png",
      title: "SUN-DRIED SNACKS",
      bullets: ["Preservatives +", "Bland Taste +", "Added Sugar +", "Emulsifiers"],
      verdict: "HEALTHIER ALTERNATIVE",
      verdictType: "yellow",
    },
    {
      imageUrl: productImage,
      title: productTitle.toUpperCase(),
      bullets: ["100% Real fruit", "No added sugar", "Crisp & crunch texture"],
      verdict: "TRULY HEALTHY",
      verdictType: "green",
    },
  ]
});

// GET: Fetch comparison section config for a product
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "productId parameter is required." }, { status: 400 });
    }

    let config = await ComparisonSection.findOne({ productId });
    if (!config) {
      const product = await Product.findById(productId);
      const productTitle = product ? product.title : "SUSTENTO BITES";
      const productImage = product && product.images && product.images.length > 0
        ? product.images[0]
        : "/images/sustento-pouch-strawberry.jpg";
      // Auto-create/seed the default template in the database
      config = await ComparisonSection.create(DEFAULT_COMPARISON(productId, productTitle, productImage));
    }
    return NextResponse.json(config);
  } catch (error: any) {
    console.error("GET /api/comparison error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch comparison section." },
      { status: 500 }
    );
  }
}

// POST: Save/Update comparison section config for a product (Admin only)
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
    const { productId, title, description, columns } = body;

    if (!productId) {
      return NextResponse.json({ error: "productId is required." }, { status: 400 });
    }

    if (!columns || !Array.isArray(columns) || columns.length !== 4) {
      return NextResponse.json({ error: "Exactly 4 columns are required." }, { status: 400 });
    }

    let config = await ComparisonSection.findOne({ productId });
    if (config) {
      config.title = title;
      config.description = description;
      config.columns = columns;
      await config.save();
    } else {
      config = await ComparisonSection.create({
        productId,
        title,
        description,
        columns,
      });
    }

    return NextResponse.json(config);
  } catch (error: any) {
    console.error("POST /api/comparison error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save comparison section." },
      { status: 500 }
    );
  }
}
