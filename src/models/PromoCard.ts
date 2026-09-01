import mongoose, { Schema, Document } from "mongoose";

export interface IPromoCard extends Document {
  videoUrl: string;
  badgeText?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PromoCardSchema = new Schema<IPromoCard>(
  {
    videoUrl: { type: String, required: true },
    badgeText: { type: String, default: "" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.PromoCard || mongoose.model<IPromoCard>("PromoCard", PromoCardSchema);
