"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MealsTableRow } from "./meals-table-row";
import { Pagination } from "@/components/ui/pagination";
import { EditMealModal } from "./edit-meal-modal";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface Meal {
  _id: string;
  name: string;
  description: string;
  calories: number;
  type: string;
  createdAt: string;
}

export interface TableMealsProps {
  meals: Meal[];
  onDelete: (id: string) => Promise<void>;
}

export function TableMeals({ meals }: TableMealsProps) {
  const [mealsState, setMealsState] = useState<Meal[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const perPage = 5;

  useEffect(() => {
    setMealsState(meals);
  }, [meals]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/meals?page=${pageIndex + 1}&perPage=${perPage}&search=${search}`
        );
        const data = await res.json();

        setMealsState(data.meals);
        setTotalCount(data.totalCount);
      } catch (error) {
        console.error("Erro ao buscar refeições:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, [pageIndex, search]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/meals/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMealsState(mealsState.filter((meal) => meal._id !== id));
        toast.success("Refeição excluída com sucesso!");
      } else {
        toast.error(data.error || "Erro ao excluir refeição.");
      }
    } catch (error) {
      toast.error("Erro ao excluir refeição.");
      console.error(error);
    }
  };

  return (
    <div className="border rounded-xl overflow-x-hidden w-[98%] md:w-full h-full p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Buscar refeição por nome, descrição, tipo ou calorias..."
          value={search}
          onChange={(e) => {
            setPageIndex(0);
            setSearch(e.target.value);
          }}
          className=""
        />
        {isLoading && (
          <Loader2 className="animate-spin text-muted-foreground h-5 w-5" />
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Editar</TableHead>
              <TableHead>Excluir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">
            {mealsState.map((meal) => (
              <MealsTableRow
                key={meal._id}
                meal={meal}
                onEdit={() => setSelectedMeal(meal)}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      )}

      <div className="mt-auto">
        <Pagination
          pageIndex={pageIndex}
          totalCount={totalCount}
          perPage={perPage}
          onPageChange={(newPage) => setPageIndex(newPage)}
        />
      </div>

      {selectedMeal && (
        <EditMealModal
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
          onUpdate={(updatedMeal) => {
            setMealsState((prevMeals) =>
              prevMeals.map((m) =>
                m._id === updatedMeal._id ? updatedMeal : m
              )
            );
            setSelectedMeal(null);
          }}
        />
      )}
    </div>
  );
}
