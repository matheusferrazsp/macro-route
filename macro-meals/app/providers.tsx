"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { useSession } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider session={session}>
        <Toaster />
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}
