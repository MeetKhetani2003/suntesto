import mongoose, { Schema, Document } from "mongoose";

export interface IBulkOrderRequest extends Document {
  name: string;
  contactNumber: string;
  email: string;
  companyName: string;
  shippingLocation: string;
  orderDetails: string;
  timeline: string;
  notes?: string;
  status: "Pending" | "Contacted" | "Completed";
  createdAt: Date;
  updatedAt: Date;
}

const BulkOrderRequestSchema = new Schema<IBulkOrderRequest>(
  {
    name: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    shippingLocation: { type: String, required: true, trim: true },
    orderDetails: { type: String, required: true, trim: true },
    timeline: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Pending", "Contacted", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.BulkOrderRequest ||
  mongoose.model<IBulkOrderRequest>("BulkOrderRequest", BulkOrderRequestSchema);
