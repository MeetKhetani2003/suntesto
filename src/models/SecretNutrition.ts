import mongoose, { Schema, Document } from "mongoose";

export interface ISecretNutrition extends Document {
  sectionTitle: string;
  sectionSubtitle: string;
  techTitle: string;
  techDescription: string;
  equationLeft: string;
  equationMiddle: string;
  equationRight: string;
  tempText: string;
  createdAt: Date;
  updatedAt: Date;
}

const SecretNutritionSchema = new Schema<ISecretNutrition>(
  {
    sectionTitle: { type: String, default: "THE SECRET TO PURE,\nREAL NUTRITION" },
    sectionSubtitle: { type: String, default: "The Tech Behind the Crunch" },
    techTitle: { type: String, default: "Vacuum Freeze-Drying" },
    techDescription: {
      type: String,
      default:
        "Our vacuum freeze-drying technology locks in flavor, color, and 95%+ of the raw fruit's natural vitamins. We freeze the fresh fruit at extreme cold temperatures (-31°C) and remove the moisture by sublimation.",
    },
    equationLeft: { type: String, default: "Freeze Drying" },
    equationMiddle: { type: String, default: "Fruit" },
    equationRight: { type: String, default: "Water" },
    tempText: { type: String, default: "-31°C" },
  },
  { timestamps: true }
);

export default mongoose.models.SecretNutrition ||
  mongoose.model<ISecretNutrition>("SecretNutrition", SecretNutritionSchema);
