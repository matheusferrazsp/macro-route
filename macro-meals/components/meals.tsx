import { MealForm } from "./form";
import { TableMeals } from "./table/table-meals";

export function Meals() {
  return (
    <>
      <div className="flex flex-col gap-4 ">
        <h1 className="flex w-full justify-center text-2xl md:text-3xl font-bold tracking-tight p-8">
          Dashboard
        </h1>
        <div className="justify-center flex flex-col w-full p-8 gap-4 md:grid md:grid-cols-3 md:p-8 ">
          <MealForm />
          <TableMeals />
        </div>
      </div>
    </>
  );
}
