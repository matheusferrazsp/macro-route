import { connectToDatabase } from "@/lib/mongodb";
import Meals from "@/app/models/meals"; // Ajuste o caminho relativo para corresponder à estrutura do projeto
import { NextResponse } from "next/server";

// GET /api/meals/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  const { name, description, calories, type, createdAt } = await req.json();

  const updatedMeal = await Meals.findByIdAndUpdate(
    params.id,
    { name, description, calories, type, createdAt },
    { new: true } // Retorna o documento atualizado
  );

  if (!updatedMeal) {
    return NextResponse.json(
      { error: "Refeição não encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(updatedMeal);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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
