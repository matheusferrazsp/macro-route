"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Header } from "@/components/header/header";
import { Meals } from "@/components/dashboard/meals";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Carregando...</div>;
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
