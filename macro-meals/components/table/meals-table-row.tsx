import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Trash2, UserCog } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { MealDetails } from "./meal-details";

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
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export function MealsTableRow({ meal, onEdit, onDelete }: MealsTableRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    toast.custom((t) => (
      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-4 rounded-md shadow-md max-w-sm w-full">
        <p className="text-sm mb-3">
          Tem certeza que deseja excluir <strong>{meal.name}</strong>?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => toast.dismiss(t)}>
            Cancelar
          </Button>
          <Button
            className="bg-rose-500"
            size="sm"
            onClick={async () => {
              try {
                setIsDeleting(true);
                toast.dismiss(t);
                await onDelete(meal._id);
                toast.success("Refeição excluída com sucesso!");
              } catch {
                toast.error("Erro ao excluir refeição.");
              } finally {
                setIsDeleting(false);
              }
            }}
          >
            Excluir
          </Button>
        </div>
      </div>
    ));
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
      <TableCell className="text-sm">{meal.name}</TableCell>
      <TableCell className="text-sm">
        {new Date(meal.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <Button
          className="text-xs"
          variant="outline"
          size="sm"
          onClick={onEdit}
        >
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
