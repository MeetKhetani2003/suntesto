import mongoose, { Schema, Document } from "mongoose";

export interface IFAQ extends Document {
  question: string;
  answer: string;
  productId?: mongoose.Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.FAQ || mongoose.model<IFAQ>("FAQ", FAQSchema);
