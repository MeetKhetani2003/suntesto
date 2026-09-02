import { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

const BASE_URL = "https://sustentofood.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static Routes
  const staticRoutes = [
    "",
    "/about-us",
    "/collections/all",
    "/collections/freeze-dried",
    "/collections/chocolate-dipped",
    "/contact",
    "/faqs",
    "/track",
    "/terms-of-service",
    "/shipping-policy",
    "/refund-policy",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic Product Routes
  try {
    await connectDB();
    const products = await Product.find({}).select("slug updatedAt");
    const productRoutes = products.map((product) => ({
      url: `${BASE_URL}/products/${product.slug}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
    return staticRoutes;
  }
}
