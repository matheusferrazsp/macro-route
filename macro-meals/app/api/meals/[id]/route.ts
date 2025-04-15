import { connectToDatabase } from "@/lib/mongodb";
import Meals from "@/app/models/meals";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
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
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const body = await req.json();

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
  } catch (error: unknown) {
    console.error("Erro ao atualizar refeição:", error);
    return NextResponse.json(
      {
        error: "Erro ao atualizar refeição",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const deletedMeal = await Meals.findByIdAndDelete(params.id);

    if (!deletedMeal) {
      return NextResponse.json(
        { error: "Refeição não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Refeição deletada com sucesso" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao tentar excluir a refeição",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
