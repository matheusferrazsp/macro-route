import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Meals from "@/app/models/meals";

// Tipagem oficial
type Params = {
  params: {
    id: string;
  };
};

export async function GET(req: NextRequest, { params }: Params) {
  await connectToDatabase();

  const meal = await Meals.findById(params.id);
  if (!meal) {
    return NextResponse.json(
      { error: "Refeição não encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(meal);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const body = await req.json();
  await connectToDatabase();

  const updatedMeal = await Meals.findByIdAndUpdate(params.id, body, {
    new: true,
  });

  if (!updatedMeal) {
    return NextResponse.json(
      { error: "Refeição não encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(updatedMeal);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  await connectToDatabase();

  const deletedMeal = await Meals.findByIdAndDelete(params.id);

  if (!deletedMeal) {
    return NextResponse.json(
      { error: "Refeição não encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Refeição deletada com sucesso" });
}
