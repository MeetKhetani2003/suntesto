import mongoose, { Schema, Document } from "mongoose";

export interface ILabReport extends Document {
  title: string;
  imageUrl: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const LabReportSchema = new Schema<ILabReport>(
  {
    title: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

if (mongoose.models.LabReport) {
  delete mongoose.models.LabReport;
}

export default mongoose.models.LabReport ||
  mongoose.model<ILabReport>("LabReport", LabReportSchema);
