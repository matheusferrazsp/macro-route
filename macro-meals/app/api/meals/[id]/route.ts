import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Meals from "@/app/models/meals";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const meal = await Meals.findById(context.params.id);
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
  context: { params: { id: string } }
) {
  try {
    const body = await req.json();
    await connectToDatabase();

    const updatedMeal = await Meals.findByIdAndUpdate(context.params.id, body, {
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
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const deletedMeal = await Meals.findByIdAndDelete(context.params.id);

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
