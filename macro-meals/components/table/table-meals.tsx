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
              onDelete={(id) => {
                setMeals((prevMeals) => prevMeals.filter((m) => m._id !== id));
              }}
            />
          ))}
        </TableBody>
      </Table>

      <div className="p-4 mt-auto">
        <Pagination
          pageIndex={pageIndex}
          totalCount={totalCount}
          perPage={perPage}
          onPageChange={(newPage) => setPageIndex(newPage)}
        />
      </div>
    </div>
  );
}
