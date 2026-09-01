import mongoose, { Schema, Document } from "mongoose";

export interface IAssortedBoxSection extends Document {
  title: string;
  tagline: string;
  buttonText: string;
  buttonLink: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssortedBoxSectionSchema = new Schema<IAssortedBoxSection>(
  {
    title: { type: String, default: "MAKE YOUR\nASSORTED BOX" },
    tagline: { type: String, default: "Try out our top 5\nfavorites" },
    buttonText: { type: String, default: "Shop Now" },
    buttonLink: { type: String, default: "/collections/all" },
    desktopImageUrl: { type: String, default: "" },
    mobileImageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

if (mongoose.models.AssortedBoxSection) {
  delete mongoose.models.AssortedBoxSection;
}

export default mongoose.models.AssortedBoxSection ||
  mongoose.model<IAssortedBoxSection>("AssortedBoxSection", AssortedBoxSectionSchema);
