"use client";

import { Search, Trash2, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { MealDetails } from "./meal-details";
import { useState } from "react";

interface Meal {
  _id: string;
  name: string;
  description: string;
  calories: number;
  type: string;
  createdAt: string;
}

interface MealsTableRowProps {
  meal: Meal;
  onDelete: (id: string) => void; // Função para ser chamada após exclusão
}

export function MealsTableRow({ meal, onDelete }: MealsTableRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const formattedDate = new Date(meal.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleDelete = async () => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir a refeição "${meal.name}"?`
      )
    ) {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/meals/${meal._id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          onDelete(meal._id); // Chama a função de callback para atualizar o estado no pai
          alert("Refeição excluída com sucesso!");
        } else {
          const data = await res.json();
          alert(data.error || "Erro ao excluir refeição");
        }
      } catch {
        alert("Erro ao excluir refeição");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <TableRow>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Search className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <MealDetails
            id={meal._id}
            name={meal.name}
            descrition={meal.description}
            calories={meal.calories}
            type={meal.type}
            createdAt={new Date(meal.createdAt)}
          />
        </Dialog>
      </TableCell>
      <TableCell className="text-xs font-medium">{meal.name}</TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell>
        <Button className="text-xs" variant="outline" size="sm">
          <UserCog className="mr-1 h-3 w-3" />
          Editar
        </Button>
      </TableCell>
      <TableCell>
        <Button
          className="text-xs"
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="mr-1 h-3 w-3" />
          {isDeleting ? "Excluindo..." : "Excluir"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
