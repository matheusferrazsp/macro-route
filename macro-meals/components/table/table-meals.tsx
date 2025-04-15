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

interface Meal {
  _id: string;
  name: string;
  description: string;
  calories: number;
  type: string;
  createdAt: string;
}

export function TableMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const perPage = 5;

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch(
          `/api/meals?page=${pageIndex + 1}&perPage=${perPage}`
        );
        const data = await res.json();

        setMeals(data.meals);
        setTotalCount(data.totalCount);
      } catch (error) {
        console.error("Erro ao buscar refeições:", error);
      }
    };

    fetchMeals();
  }, [pageIndex]);

  const onDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/meals/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        // Remove a refeição da lista após a exclusão
        setMeals(meals.filter((meal) => meal._id !== id));
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
    <div className="border rounded-xl overflow-x-hidden w-[98%] md:w-full h-full p-4 flex flex-col">
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
          {meals.map((meal) => (
            <MealsTableRow
              key={meal._id}
              meal={meal}
              onEdit={() => setSelectedMeal(meal)}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>

      <div className=" mt-auto">
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
            setMeals((prevMeals) =>
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
