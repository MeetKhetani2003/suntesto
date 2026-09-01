import mongoose, { Schema, Document } from "mongoose";

export interface IKidsParents extends Document {
  headerTitleLine1: string;
  headerTitleLine2: string;
  headerSubtitle: string;
  titleLine1: string;
  titleLine2: string;
  paraPrefix: string;
  paraHighlight: string;
  btnLabel: string;
  btnLink: string;
  imageUrl: string;
  imageAlt: string;
  createdAt: Date;
  updatedAt: Date;
}

const KidsParentsSchema = new Schema<IKidsParents>(
  {
    headerTitleLine1: { type: String, default: "CLEAN LABEL." },
    headerTitleLine2: { type: String, default: "FULL DISCLOSURE." },
    headerSubtitle: { type: String, default: "So clean, we proudly declare every ingredient." },
    titleLine1: { type: String, default: "KIDS LOVE" },
    titleLine2: { type: String, default: "AND PARENTS TRUST" },
    paraPrefix: { type: String, default: "Wholesome, delicious, and made with" },
    paraHighlight: { type: String, default: "care for families." },
    btnLabel: { type: String, default: "Explore Now" },
    btnLink: { type: String, default: "/collections/all" },
    imageUrl: { type: String, default: "/images/mother-child.jpg" },
    imageAlt: { type: String, default: "Kids love and parents trust Sustento" },
  },
  { timestamps: true }
);

if (mongoose.models.KidsParents) {
  delete mongoose.models.KidsParents;
}
export default mongoose.models.KidsParents ||
  mongoose.model<IKidsParents>("KidsParents", KidsParentsSchema);
