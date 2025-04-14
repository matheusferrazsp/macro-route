import mongoose, { Document, Model, Schema } from "mongoose";

// Interface da refeição com tipo string para hora
interface IMeal extends Document {
  name: string;
  description?: string;
  calories?: number;
  createdAt: Date;
  type: "café" | "almoço" | "lanche" | "jantar";
}

// Definição do schema para a refeição
const MealSchema: Schema<IMeal> = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    calories: { type: Number },
    createdAt: { type: Date, default: Date.now, required: true },
    type: {
      type: String,
      enum: ["café", "almoço", "lanche", "jantar"],
      required: true,
    },
  },
  { timestamps: true } // Garante a criação de createdAt e updatedAt
);

// Exportação do modelo
const Meals: Model<IMeal> =
  mongoose.models.Meal || mongoose.model<IMeal>("Meal", MealSchema);

export default Meals;
