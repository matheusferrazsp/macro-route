import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Meals from "@/app/models/meals";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    // Encontrando a refeição com o ID
    const meal = await Meals.findById(params.id);
    if (!meal) {
      return NextResponse.json(
        { error: "Refeição não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(meal);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar refeição", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    await connectToDatabase();

    // Atualizando a refeição com o ID
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
  } catch (error) {
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

    // Deletando a refeição com o ID
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
      { error: "Erro ao deletar refeição", details: (error as Error).message },
      { status: 500 }
    );
  }
}
