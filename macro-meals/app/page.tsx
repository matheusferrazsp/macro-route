import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Header } from "@/components/header/header";
import { Meals } from "@/components/dashboard/meals";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Carregando...</p>;

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
