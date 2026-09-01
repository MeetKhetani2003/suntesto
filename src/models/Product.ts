import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  slug: string;
  subtitle?: string;
  category: string;
  weight?: string;         // Display string e.g. "30G"
  weightGrams?: number;    // Actual weight in grams for Shiprocket (e.g. 100)
  dimensions?: {           // Box dimensions in cm for Shiprocket
    length: number;
    breadth: number;
    height: number;
  };
  costPrice: number; // Internal brand/client cost (HIDDEN from frontend)
  originalPrice: number; // MRP strikethrough price on frontend
  price: number; // Actual selling price
  stockQuantity: number; // Quantity in stock
  inStock: boolean; // Auto or manual status flag
  lowStockThreshold: number;
  description?: string;
  images: string[]; // Cloudinary URLs
  badge?: string;
  archClass?: string;
  bgClass?: string;
  rating?: number;
  reviewsCount?: number;
  ingredientsList?: { label: string; percentage: string }[];
  ingredientsImage?: string;
  nutritionServingSize?: string;
  nutritionList?: { name: string; value: string; rda: string }[];
  isBestSeller?: boolean;
  isTrending?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    subtitle: { type: String, trim: true },
    category: { type: String, required: true, default: "FREEZE-DRIED FRUIT SNACK" },
    weight: { type: String, default: "30G" },
    weightGrams: { type: Number, default: 100 },   // Default 100g per pouch
    dimensions: {
      length:  { type: Number, default: 15 },      // Default 15cm
      breadth: { type: Number, default: 10 },      // Default 10cm
      height:  { type: Number, default: 5  },      // Default 5cm
    },
    
    // ── 3 PRICING TIERS ──────────────────────────────────────────
    costPrice: { type: Number, required: true, min: 0 }, // Internal Client Cost (e.g. ₹60)
    originalPrice: { type: Number, required: true, min: 0 }, // Frontend MRP Strikethrough (e.g. ₹180)
    price: { type: Number, required: true, min: 0 }, // Frontend Selling Price (e.g. ₹149)
    
    // ── STOCK MANAGEMENT ─────────────────────────────────────────
    stockQuantity: { type: Number, required: true, default: 0, min: 0 },
    inStock: { type: Boolean, default: true },
    lowStockThreshold: { type: Number, default: 5 },

    description: { type: String },
    images: { type: [String], default: [] },
    badge: { type: String, default: "Fresh Pack" },
    archClass: { type: String, default: "bg-[#FCE2EC]" },
    bgClass: { type: String, default: "bg-[#FCE2EC]/40" },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 12 },
    ingredientsList: {
      type: [
        {
          label: { type: String, required: true },
          percentage: { type: String, required: true }
        }
      ],
      default: []
    },
    ingredientsImage: { type: String, default: "" },
    nutritionServingSize: { type: String, default: "Per Serving (30G)" },
    nutritionList: {
      type: [
        {
          name: { type: String, required: true },
          value: { type: String, required: true },
          rda: { type: String, required: true }
        }
      ],
      default: [
        { name: "Energy", value: "112 Kcal", rda: "5%" },
        { name: "Proteins", value: "0.8g", rda: "1.5%" },
        { name: "Carbohydrates", value: "26g", rda: "8%" },
        { name: "Added Sugars", value: "0g", rda: "0%" },
        { name: "Fats", value: "0.1g", rda: "0.1%" }
      ]
    },
    isBestSeller: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Pre-save middleware to auto-update inStock flag based on stockQuantity
ProductSchema.pre("save", function () {
  this.inStock = this.stockQuantity > 0;
});

if (mongoose.models.Product) {
  delete mongoose.models.Product;
}
export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
