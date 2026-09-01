import mongoose, { Schema, Document } from "mongoose";

export interface IFruitMeetsCrunch extends Document {
  desktopImageUrl: string;
  mobileImageUrl: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FruitMeetsCrunchSchema = new Schema<IFruitMeetsCrunch>(
  {
    desktopImageUrl: { type: String, default: "" },
    mobileImageUrl: { type: String, default: "" },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.FruitMeetsCrunch ||
  mongoose.model<IFruitMeetsCrunch>("FruitMeetsCrunch", FruitMeetsCrunchSchema);
