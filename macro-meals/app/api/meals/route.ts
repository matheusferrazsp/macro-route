import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Meals from "@/app/models/meals";

export interface Meal {
  _id: string;
  name: string;
  description?: string;
  calories: number;
  type: string;
  createdAt: string;
  time?: string;
}

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const perPage = Math.max(1, parseInt(searchParams.get("perPage") || "10"));

  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const filter = {
    createdAt: {
      $gte: sevenDaysAgo,
      $lte: now,
    },
  };

  try {
    const meals = await Meals.find(filter)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const totalCount = await Meals.countDocuments(filter);

    return NextResponse.json({ meals, totalCount });
  } catch (error) {
    console.error("Erro ao buscar refeições:", error);
    return NextResponse.json(
      { message: "Erro ao buscar refeições" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: Meal = await req.json();

    const { name, description, calories, type, createdAt, time } = body;

    const parsedDate = createdAt ? new Date(createdAt) : new Date();

    await connectToDatabase();

    const newMeal = await Meals.create({
      name,
      description,
      calories,
      type,
      createdAt: parsedDate,
      time,
    });

    return NextResponse.json(newMeal, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erro ao salvar refeição:", error);

      return NextResponse.json(
        {
          message: "Erro ao criar refeição",
          error: error.message,
          stack: error.stack,
        },
        { status: 500 }
      );
    } else {
      console.error("Erro ao salvar refeição:", error);

      return NextResponse.json(
        {
          message: "Erro ao criar refeição",
          error: "Erro desconhecido",
        },
        { status: 500 }
      );
    }
  }
}
