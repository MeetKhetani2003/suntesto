import mongoose, { Schema, Document } from "mongoose";

export interface IFooterConfig extends Document {
  sloganLine1: string;
  sloganLine2: string;
  sloganLine3: string;
  middleGraphicUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const FooterConfigSchema = new Schema<IFooterConfig>(
  {
    sloganLine1: { type: String, default: "YOU'VE GOT THE" },
    sloganLine2: { type: String, default: "NATURE'S BEST WITH" },
    sloganLine3: { type: String, default: "SUSTENTO" },
    middleGraphicUrl: { type: String, default: "" },
    facebookUrl: { type: String, default: "https://facebook.com" },
    instagramUrl: { type: String, default: "https://instagram.com" },
    linkedinUrl: { type: String, default: "https://linkedin.com" },
  },
  { timestamps: true }
);

if (mongoose.models.FooterConfig) {
  delete mongoose.models.FooterConfig;
}
export default mongoose.models.FooterConfig || mongoose.model<IFooterConfig>("FooterConfig", FooterConfigSchema);
