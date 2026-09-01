import mongoose, { Schema, Document } from "mongoose";

export interface IHeroSlide {
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  titleHighlight: string;
  backgroundImageUrl?: string;
  backgroundVideoUrl?: string;
  mobileBackgroundImageUrl?: string;
  mobileBackgroundVideoUrl?: string;
}

export interface IHero extends Document {
  slides: IHeroSlide[];
  autoPlayInterval: number; // in milliseconds (e.g. 5000)
  createdAt: Date;
  updatedAt: Date;
}

const SlideSchema = new Schema<IHeroSlide>({
  badgeText: { type: String, default: "Snacks" },
  titleLine1: { type: String, default: "WORLD'S LIGHTEST" },
  titleLine2: { type: String, default: "WHOLE FRUIT" },
  titleLine3: { type: String, default: "FREEZE-DRIED" },
  titleHighlight: { type: String, default: "Snacks" },
  backgroundImageUrl: { type: String, default: "" },
  backgroundVideoUrl: { type: String, default: "" },
  mobileBackgroundImageUrl: { type: String, default: "" },
  mobileBackgroundVideoUrl: { type: String, default: "" },
});

const HeroSchema = new Schema<IHero>(
  {
    slides: { type: [SlideSchema], default: [] },
    autoPlayInterval: { type: Number, default: 5000 },
  },
  { timestamps: true }
);

if (mongoose.models.Hero) {
  delete mongoose.models.Hero;
}
export default mongoose.models.Hero || mongoose.model<IHero>("Hero", HeroSchema);
