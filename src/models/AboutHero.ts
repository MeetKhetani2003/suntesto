import mongoose, { Schema, Document } from "mongoose";

export interface IAboutHeroSlide {
  imageUrl: string;
  title: string;
  description: string;
  titleColor: string;
}

export interface IAboutHero extends Document {
  slides: IAboutHeroSlide[];
  createdAt: Date;
  updatedAt: Date;
}

const AboutHeroSlideSchema = new Schema<IAboutHeroSlide>({
  imageUrl: { type: String, default: "/images/sustento-pouch-pineapple.jpg" },
  title: { type: String, default: "PINEAPPLE \nWHOLE FRUIT" },
  description: { type: String, default: "Lightweight, Crunchy, \nSingle Ingredient" },
  titleColor: { type: String, default: "#353534" },
});

const DEFAULT_SLIDES: IAboutHeroSlide[] = [
  {
    imageUrl: "/images/sustento-pouch-pineapple.jpg",
    title: "PINEAPPLE \nWHOLE FRUIT",
    description: "Lightweight, Crunchy, \nSingle Ingredient",
    titleColor: "#353534",
  },
  {
    imageUrl: "/images/sustento-pouch-strawberry.jpg",
    title: "STRAWBERRY \nWHOLE FRUIT",
    description: "Lightweight, Crunchy, \nSingle Ingredient",
    titleColor: "#353534",
  },
];

const AboutHeroSchema = new Schema<IAboutHero>(
  {
    slides: { type: [AboutHeroSlideSchema], default: DEFAULT_SLIDES },
  },
  { timestamps: true }
);

export default mongoose.models.AboutHero ||
  mongoose.model<IAboutHero>("AboutHero", AboutHeroSchema);
