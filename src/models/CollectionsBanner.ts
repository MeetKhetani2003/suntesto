import mongoose, { Schema, Document } from "mongoose";

export interface ICollectionsBanner extends Document {
  desktopImageUrl: string;
  mobileImageUrl: string;
  bannerLink: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionsBannerSchema = new Schema<ICollectionsBanner>(
  {
    desktopImageUrl: { type: String, default: "" },
    mobileImageUrl: { type: String, default: "" },
    bannerLink: { type: String, default: "" },
    isEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.CollectionsBanner ||
  mongoose.model<ICollectionsBanner>("CollectionsBanner", CollectionsBannerSchema);
