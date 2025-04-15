"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Header } from "@/components/header/header";
import { Meals } from "@/components/dashboard/meals";

export default function Home() {
  const { data: session, status } = useSession();

  console.log("Session Status:", status);
  console.log("Session Data:", session);

  if (status === "loading") return <p>Carregando...</p>;

  if (!session) {
    console.log("User not logged in, redirecting to /sign-in");
    redirect("/sign-in");
  }

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
