"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Header } from "@/components/header/header";
import { Meals } from "@/components/dashboard/meals";

export default function Home() {
  const { data: session, status } = useSession();

  // Mostra um carregando enquanto a sessão não está totalmente verificada
  if (status === "loading") return <p>Carregando...</p>;

  // Se o usuário não estiver logado, redireciona para o login
  if (!session) {
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
