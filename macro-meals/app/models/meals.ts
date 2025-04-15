import mongoose, { Document, Model, Schema } from "mongoose";

interface IMeal extends Document {
  name: string;
  description?: string;
  calories?: number;
  createdAt: Date;
  time?: string;
  type: "café" | "almoço" | "lanche" | "jantar";
}

const MealSchema: Schema<IMeal> = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  calories: { type: Number },
  createdAt: { type: Date, required: true },
  time: { type: String },
  type: {
    type: String,
    enum: ["café", "almoço", "lanche", "jantar"],
    required: true,
  },
});

const Meals: Model<IMeal> =
  mongoose.models.Meal || mongoose.model<IMeal>("Meal", MealSchema);

export default Meals;
