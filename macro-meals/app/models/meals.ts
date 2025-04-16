import { Document, model, models, Schema } from "mongoose";

interface IMeal extends Document {
  name: string;
  description?: string;
  calories?: number;
  createdAt: Date;
  time?: string;
  type: "café" | "almoço" | "lanche" | "jantar";
}

const MealSchema = new Schema<IMeal>({
  name: { type: String, required: true },
  description: { type: String },
  calories: { type: Number, required: true },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  time: { type: String },
});

const Meals = models.Meals || model<IMeal>("Meals", MealSchema);

export default Meals;
