import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Importando as opções de autenticação

// Aqui usamos o NextAuth diretamente com o arquivo de opções
const handler = NextAuth(authOptions);

// Expondo as rotas GET e POST para o Next.js
export { handler as GET, handler as POST };
