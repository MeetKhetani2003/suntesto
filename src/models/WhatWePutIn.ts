import mongoose, { Schema, Document } from "mongoose";

export interface IIngredientGroup {
  letter: string;
  items: string[];
}

export interface IWhatWePutIn extends Document {
  smoothies: IIngredientGroup[];
  snacks: IIngredientGroup[];
  spreads: IIngredientGroup[];
  createdAt: Date;
  updatedAt: Date;
}

const IngredientGroupSchema = new Schema<IIngredientGroup>({
  letter: { type: String, required: true },
  items: { type: [String], default: [] },
});

const DEFAULT_SMOOTHIES: IIngredientGroup[] = [
  { letter: "A", items: ["Activated Cashew Butter", "Almond Milk", "Apple"] },
  { letter: "B", items: ["Banana", "Blue Spirulina"] },
  { letter: "C", items: ["Cherry", "Cocoa Powder"] },
  { letter: "D", items: ["Dates", "Dragon Fruit"] },
  { letter: "F", items: ["Fresh Ginger"] },
  { letter: "K", items: ["Kiwi"] },
  { letter: "L", items: ["Lemon Juice", "Lemongrass", "Lime Juice"] },
  { letter: "M", items: ["Mango", "Matcha Powder"] },
  { letter: "O", items: ["Orange"] },
  { letter: "P", items: ["Pineapple"] },
  { letter: "R", items: ["Raspberries"] },
  { letter: "S", items: ["Spinach Leaves", "Strawberries", "Sweet Potato"] },
  { letter: "T", items: ["Turmeric"] },
];

const DEFAULT_SNACKS: IIngredientGroup[] = [
  { letter: "A", items: ["Apple"] },
  { letter: "B", items: ["Blueberry"] },
  { letter: "G", items: ["Green Apple"] },
  { letter: "K", items: ["Kala Jamun"] },
  { letter: "M", items: ["Mango", "Mulberry"] },
  { letter: "P", items: ["Pear", "Pineapple"] },
  { letter: "S", items: ["Strawberry"] },
];

const DEFAULT_SPREADS: IIngredientGroup[] = [
  { letter: "A", items: ["Activated Almonds", "Activated Cashews", "Allulose"] },
  { letter: "B", items: ["Butterfly Pea Flower"] },
  { letter: "C", items: ["Cocoa Nibs", "Cocoa Powder", "Coconut"] },
  { letter: "F", items: ["Freeze-Dried Mangoes", "Freeze-Dried Pineapple", "Freeze-Dried Strawberries"] },
  { letter: "G", items: ["Grapeseed Oil"] },
  { letter: "J", items: ["Japanese Matcha Powder"] },
  { letter: "N", items: ["Natural Vanilla"] },
  { letter: "R", items: ["Roasted Hazelnuts"] },
  { letter: "S", items: ["Sprouted Peanuts", "Stevia", "Sunflower Lecithin"] },
  { letter: "V", items: ["Vanilla Extract"] },
];

const WhatWePutInSchema = new Schema<IWhatWePutIn>(
  {
    smoothies: { type: [IngredientGroupSchema], default: DEFAULT_SMOOTHIES },
    snacks: { type: [IngredientGroupSchema], default: DEFAULT_SNACKS },
    spreads: { type: [IngredientGroupSchema], default: DEFAULT_SPREADS },
  },
  { timestamps: true }
);

export default mongoose.models.WhatWePutIn ||
  mongoose.model<IWhatWePutIn>("WhatWePutIn", WhatWePutInSchema);
