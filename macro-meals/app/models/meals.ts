import { Document, model, models, Schema } from "mongoose";

interface IMeal extends Document {
  _id: string;
  name: string;
  description?: string;
  calories?: number;
  createdAt: Date;
  time?: string;
  type: "café" | "almoço" | "lanche" | "jantar";
  userEmail: string;
}

const MealSchema = new Schema({
  _id: { type: String },
  name: { type: String, required: true },
  description: { type: String },
  calories: { type: Number, required: true },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  time: { type: String },
  userEmail: { type: String, required: true }, // <- novo campo
});

const Meals = models.Meals || model<IMeal>("Meals", MealSchema);

export default Meals;
