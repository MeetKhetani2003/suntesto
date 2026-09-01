import mongoose, { Schema, Document } from "mongoose";

export interface IComparisonColumn {
  imageUrl: string;
  title: string;
  bullets: string[];
  verdict: string;
  verdictType: "red" | "yellow" | "green";
}

export interface IComparisonSection extends Document {
  productId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  columns: IComparisonColumn[];
  createdAt: Date;
  updatedAt: Date;
}

const ComparisonColumnSchema = new Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  bullets: { type: [String], default: [] },
  verdict: { type: String, required: true },
  verdictType: { type: String, enum: ["red", "yellow", "green"], default: "red" },
});

const ComparisonSectionSchema = new Schema<IComparisonSection>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, unique: true },
    title: { type: String, default: "WHY FRUIT BITES ?" },
    description: {
      type: String,
      default:
        "Our freeze-drying technology preserves the real fruit flavor, color, and nutrients while creating a snack that's wholesome, fun, and ready for everyday snacking.",
    },
    columns: { type: [ComparisonColumnSchema], default: [] },
  },
  { timestamps: true }
);

if (mongoose.models.ComparisonSection) {
  delete mongoose.models.ComparisonSection;
}
export default mongoose.models.ComparisonSection ||
  mongoose.model<IComparisonSection>("ComparisonSection", ComparisonSectionSchema);
