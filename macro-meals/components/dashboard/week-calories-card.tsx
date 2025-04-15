"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Meal {
  calories: number;
  createdAt: string;
}

interface CaloriesChartProps {
  meals: Meal[];
  dailyGoal: number;
}

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function CaloriesChartCard({ meals }: CaloriesChartProps) {
  const data = daysOfWeek.map((day, index) => {
    const total = meals
      .filter((meal) => {
        const date = new Date(meal.createdAt);
        const localDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        );
        return localDate.getDay() === index;
      })
      .reduce((sum, meal) => sum + meal.calories, 0);

    return {
      name: day,
      calories: total,
    };
  });

  return (
    <Card className="w-full bg-transparent">
      <CardHeader>
        <CardTitle className="text-md font-semibold">
          Consumo semanal de calorias
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-auto h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f1f22",
                border: "1px solid #2a2a2d",
                color: "#fff",
              }}
              formatter={(value: number) => `${value} kcal`}
            />
            <Bar dataKey="calories" fill="#e71e4f" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
