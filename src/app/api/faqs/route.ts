import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import Product from "@/models/Product"; // ensure Product model is registered in Mongoose

export const dynamic = 'force-dynamic';

const DEFAULT_GLOBAL_FAQS = [
  {
    question: "What is Sustento all about?",
    answer: "Sustento is a clean-label food brand dedicated to making real food smarter. We offer whole fruit snacks made purely from natural, minimally processed ingredients with absolutely zero chemical additives, preservatives, or added sugars.",
    productId: null,
    order: 0,
  },
  {
    question: "What makes Sustento different?",
    answer: "Unlike traditional brands, we declare every single ingredient on the front of our packs. We use advanced freeze-drying technology to retain 100% natural nutrients, colours, and flavours, eliminating any need for synthetic flow agents, thickeners, or artificial chemicals.",
    productId: null,
    order: 1,
  },
  {
    question: "Are your products really 100% natural?",
    answer: "Yes, 100%. The only ingredients you will ever find in our products are whole fruits and superfoods. We screen for and exclude emulsifiers, preservatives, colouring agents, fat replacers, and artificial sweeteners.",
    productId: null,
    order: 2,
  },
  {
    question: "Who are your products made for?",
    answer: "Sustento is made for everyone: busy professionals looking for healthy snacks, fitness enthusiasts needing clean energy, and parents looking for nutrient-dense, clean-label foods they can trust for their kids.",
    productId: null,
    order: 3,
  },
  {
    question: "Who founded Sustento?",
    answer: "Sustento was founded by a passionate team of food innovators, including Raj Kotadiya and Rushit Kotadiya, who wanted to solve the compromise between eating healthy and enjoying delicious food.",
    productId: null,
    order: 4,
  },
  {
    question: "What does \"Sustento\" mean?",
    answer: "Sustento stands for 'Sustenance' – our promise to preserve the raw, organic integrity of nature's best ingredients using smart, clean technology so you get pure nutrition in every bite.",
    productId: null,
    order: 5,
  }
];

// GET: Fetch FAQs
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    let query: any = {};
    if (productId && productId !== "all") {
      // Fetch product-specific OR global FAQs for a product page
      query = {
        $or: [
          { productId: productId },
          { productId: null }
        ]
      };
    } else if (productId === "all") {
      // Fetch all FAQs in the database (for admin overview)
      query = {};
    } else {
      // Fetch only global FAQs (e.g. for general FAQ page)
      query = { productId: null };
    }

    let faqs = await FAQ.find(query).populate("productId", "title slug").sort({ order: 1 });

    if ((!faqs || faqs.length === 0) && (!productId || productId === "all")) {
      // Seed default global FAQs if empty and fetching all/global
      faqs = await FAQ.insertMany(DEFAULT_GLOBAL_FAQS);
    }

    return NextResponse.json(faqs);
  } catch (error: any) {
    console.error("GET /api/faqs error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch FAQs." },
      { status: 500 }
    );
  }
}

// POST: Protected admin bulk save
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

    if (!body.faqs || !Array.isArray(body.faqs) || body.faqs.length === 0) {
      return NextResponse.json(
        { error: "At least one FAQ is required." },
        { status: 400 }
      );
    }

    // Replace all FAQs
    await FAQ.deleteMany({});
    const mapped = body.faqs.map((f: any, idx: number) => ({
      question: f.question,
      answer: f.answer,
      productId: f.productId || null,
      order: idx,
    }));

    const saved = await FAQ.insertMany(mapped);
    return NextResponse.json(saved);
  } catch (error: any) {
    console.error("POST /api/faqs error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save FAQs." },
      { status: 500 }
    );
  }
}
