import mongoose, { Schema, Document } from "mongoose";

export interface IAboutVideo extends Document {
  heading: string;
  videoUrl: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const AboutVideoSchema = new Schema<IAboutVideo>(
  {
    heading: { type: String, default: "OUR JOURNEY IN MOTION" },
    videoUrl: { type: String, default: "/videos/about-story.mp4" },
    description: { type: String, default: "At Sustento, we believe in bringing you the purest form of nutrition. Watch our journey as we turn fresh, organic whole fruits into lightweight, crunchy snacks without losing any of their natural vitamins and flavors." },
  },
  { timestamps: true }
);

export default mongoose.models.AboutVideo ||
  mongoose.model<IAboutVideo>("AboutVideo", AboutVideoSchema);
