import mongoose, { Schema, Document } from "mongoose";

export interface ILifestyleBanner extends Document {
  title: string;
  tagline: string;
  buttonText: string;
  buttonLink: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const LifestyleBannerSchema = new Schema<ILifestyleBanner>(
  {
    title: { type: String, default: "REAL FRUIT.\nUNREAL SNACK." },
    tagline: { type: String, default: "Just one ingredient. That's it." },
    buttonText: { type: String, default: "Explore All Products" },
    buttonLink: { type: String, default: "/collections/all" },
    desktopImageUrl: { type: String, default: "" },
    mobileImageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

if (mongoose.models.LifestyleBanner) {
  delete mongoose.models.LifestyleBanner;
}

export default mongoose.models.LifestyleBanner ||
  mongoose.model<ILifestyleBanner>("LifestyleBanner", LifestyleBannerSchema);
