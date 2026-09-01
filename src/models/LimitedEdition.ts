import mongoose, { Schema, Document } from "mongoose";

export interface ILimitedEdition extends Document {
  title: string;
  tagText: string;
  imageUrl: string;
  bgBottomColor: string;
  topAnnotationText: string;
  topAnnotationHighlight: string;
  midAnnotationText: string;
  botAnnotationText: string;
  createdAt: Date;
  updatedAt: Date;
}

const LimitedEditionSchema = new Schema<ILimitedEdition>(
  {
    title: { type: String, default: "LIMITED EDITION" },
    tagText: { type: String, default: "Special Fruit hamper" },
    imageUrl: { type: String, default: "/images/hamper.jpg" },
    bgBottomColor: { type: String, default: "#b4b953" },
    topAnnotationText: { type: String, default: "Build your own" },
    topAnnotationHighlight: { type: String, default: "Hamper" },
    midAnnotationText: { type: String, default: "4 SNACKS" },
    botAnnotationText: { type: String, default: "2 CHOC-DIPPED" },
  },
  { timestamps: true }
);

export default mongoose.models.LimitedEdition || mongoose.model<ILimitedEdition>("LimitedEdition", LimitedEditionSchema);
