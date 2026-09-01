import mongoose, { Schema, Document } from "mongoose";

export interface IInstagramPost extends Document {
  imageSrc: string;
  textOverlay?: string;
  likes: number;
  order: number;
  mediaType?: "image" | "video";
  createdAt: Date;
  updatedAt: Date;
}

const InstagramPostSchema = new Schema<IInstagramPost>(
  {
    imageSrc: { type: String, required: true },
    textOverlay: { type: String, default: "" },
    likes: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    mediaType: { type: String, enum: ["image", "video"], default: "image" },
  },
  { timestamps: true }
);

export default mongoose.models.InstagramPost || mongoose.model<IInstagramPost>("InstagramPost", InstagramPostSchema);
