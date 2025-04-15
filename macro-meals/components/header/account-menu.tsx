"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function AccountMenu() {
  const { data: session } = useSession();

  const name = session?.user?.name || "Usuário";
  const email = session?.user?.email || "sem email";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1 md:gap-2 select-none text-sm md:text-sm"
        >
          Conta
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span>{name}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-rose-500 dark:text-rose-400">
          <LogOut className="mr-2 h-4 w-4" />
          <a href="/sign-in">Sair</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
