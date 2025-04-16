"use client";

import { Header } from "@/components/header/header";
import { Meals } from "@/components/dashboard/meals";

export default function Home() {
  return (
    <>
      <div>
        <Header />
      </div>
      <div className="flex flex-col gap-4">
        <Meals />
      </div>
    </>
  );
}
