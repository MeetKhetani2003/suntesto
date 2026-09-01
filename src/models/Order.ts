import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice: number;
  imageSrc: string;
  variant: "single" | "pack3" | "pack5";
  quantity: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  items: IOrderItem[];
  pricing: {
    subtotal: number;
    shippingCost: number;
    discountAmount: number;
    total: number;
    codAmountToCollect?: number;
    shippingPaidOnline?: number;
  };
  couponCode?: string;
  userId?: string;
  paymentMethod: "COD" | "CARD" | "UPI" | "ONLINE";
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: "Processing" | "Shipped" | "Out For Delivery" | "Delivered" | "Cancelled";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  // ── Shiprocket Fields ──────────────────────────────────────
  shiprocketOrderId?: string;    // Shiprocket internal order ID
  shiprocketShipmentId?: string; // Shiprocket shipment ID
  awbCode?: string;              // Air Waybill tracking number
  courierName?: string;          // e.g. "Delhivery", "BlueDart"
  trackingUrl?: string;          // Direct tracking link
  shiprocketStatus?: string;     // Raw status string from Shiprocket
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  id: { type: String, required: true },
  slug: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  imageSrc: { type: String, required: true },
  variant: { type: String, required: true, enum: ["single", "pack3", "pack5"] },
  quantity: { type: Number, required: true, min: 1 },
});

const OrderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  items: [OrderItemSchema],
  pricing: {
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    discountAmount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    codAmountToCollect: { type: Number, default: 0 },
    shippingPaidOnline: { type: Number, default: 0 },
  },
  couponCode: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  paymentMethod: { type: String, required: true, enum: ["COD", "CARD", "UPI", "ONLINE"], default: "ONLINE" },
  paymentStatus: { type: String, required: true, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
  orderStatus: {
    type: String,
    required: true,
    enum: ["Processing", "Shipped", "Out For Delivery", "Delivered", "Cancelled"],
    default: "Processing",
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  // ── Shiprocket Fields ──────────────────────────────────────
  shiprocketOrderId: { type: String },
  shiprocketShipmentId: { type: String },
  awbCode: { type: String },
  courierName: { type: String },
  trackingUrl: { type: String },
  shiprocketStatus: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
