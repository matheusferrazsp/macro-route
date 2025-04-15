"use client";

import { useEffect, useState } from "react";
import { MealForm } from "./form";
import { TableMeals } from "../table/table-meals";
import { CaloriesChartCard } from "./week-calories-card";

export interface Meal {
  _id: string;
  name: string;
  description: string;
  calories: number;
  type: string;
  createdAt: string;
  time?: string;
}

export function Meals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMeals = async () => {
    setLoading(true);
    const res = await fetch("/api/meals");
    const data = await res.json();
    setMeals(data.meals);
    setLoading(false);
  };

  const handleDeleteMeal = async (id: string) => {
    try {
      const res = await fetch(`/api/meals/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMeals((prevMeals) => prevMeals.filter((meal) => meal._id !== id));
      } else {
        console.error("Erro ao excluir refeição");
      }
    } catch (error) {
      console.error("Erro ao excluir refeição:", error);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <div className="flex flex-col">
      <h1 className="flex w-full justify-center text-2xl md:text-3xl font-bold tracking-tight p-8">
        Macro.Meals
      </h1>
      <p className="flex pl-8 pr-8 text-center justify-center text-md md:text-xl tracking-tight ">
        Registre suas refeições e acompanhe suas calorias diárias
      </p>

      {loading ? (
        <div className="flex justify-center p-8 text-lg">
          Carregando refeições...
        </div>
      ) : (
        <div className=" justify-center flex flex-col w-full p-8 gap-4 md:grid md:grid-cols-3 md:p-8">
          <MealForm onMealCreated={fetchMeals} />
          <TableMeals meals={meals} onDelete={handleDeleteMeal} />
          <CaloriesChartCard meals={meals} dailyGoal={2000} />
        </div>
      )}
    </div>
  );
}
