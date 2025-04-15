"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

//react icons
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Beef, TriangleAlert } from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      router.push("/");
      toast.success("Login realizado com sucesso!");
    } else if (res?.status === 401) {
      setError("Email ou senha inválidos");
      setPending(false);
    } else {
      setError("Erro ao fazer login. Tente novamente mais tarde.");
    }
  };

  const handleProvider = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: "github" | "google"
  ) => {
    event.preventDefault();
    signIn(value, { callbackUrl: "/" });
    toast.loading("Redirecionando para o login...");
  };

  return (
    <div className="h-full w-full grid grid-cols-2 antialiased items-center">
      <div className="md:h-full border-b md:border-r md:border-b-0 border-foreground/5 md:bg-muted p-10 text-muted-foreground flex flex-col md:justify-between">
        {/* Topo */}
        <div className="flex items-center gap-3 text-lg font-medium text-foreground">
          <Beef className="h-5 w-5" />
          <span className="font-semibold">Macro.Meals</span>
        </div>

        {/* Footer no desktop */}
        <footer className="hidden md:block text-sm">
          Painel do usuário Macro.Meals &copy; Matheus Ferraz -{" "}
          {new Date().getFullYear()}
        </footer>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <Card className="md-h-auto w-[80%] sm:w-[420px] p-4 sm:p-8 ">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Macro Meals</CardTitle>
            <CardDescription className="text-sm text-center text-accent-foreground">
              Login
            </CardDescription>
          </CardHeader>

          {!!error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
              <TriangleAlert />
              <p>{error}</p>
            </div>
          )}
          <CardContent className="px-2 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                disabled={pending}
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                disabled={pending}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                className="w-full cursor-pointer"
                size="lg"
                disabled={pending}
              >
                Entrar
              </Button>
            </form>
            <Separator />
            <div className="flex my-2 justify-evenly mx-auto items-center">
              <Button
                disabled={false}
                onClick={(e) => handleProvider(e, "google")}
                variant="outline"
                size="lg"
                className="bg-slate-300 hover:bg-slate-400 hover:scale-110"
              >
                <FcGoogle className="size-8 left-2.5 top-2.5" />
              </Button>
              <Button
                disabled={false}
                onClick={(e) => handleProvider(e, "github")}
                variant="outline"
                size="lg"
                className="bg-slate-300 hover:bg-slate-400 hover:scale-110"
              >
                <FaGithub className="size-8 left-2.5 top-2.5" />
              </Button>
            </div>
            <p className="text-center text-sm mt-2 text-muted-foreground">
              Não tem uma conta?
              <Link
                className="text-sky-700 ml-1 hover:underline cursor-pointer"
                href="sign-up"
              >
                Crie uma conta
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
