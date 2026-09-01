import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  title: string;
  videoUrl: string;
  isApproved: boolean;
  isAdminCreated: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
    isAdminCreated: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

if (mongoose.models.Testimonial) {
  delete mongoose.models.Testimonial;
}

export default mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
