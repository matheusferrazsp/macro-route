import GoogleProvider from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/app/models/user";
import { AuthOptions } from "next-auth";
import { connectToDatabase } from "./mongodb";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          console.log("Conectando ao banco de dados...");
          await connectToDatabase();
          console.log("Banco de dados conectado com sucesso.");

          const user = await User.findOne({ email: credentials?.email });
          if (!user) {
            console.log("Usuário não encontrado.");
            throw new Error("Usuário não encontrado");
          }

          console.log("Verificando senha...");
          const isValidPassword = await bcrypt.compare(
            credentials?.password ?? "",
            user.password as string
          );
          if (!isValidPassword) {
            console.log("Senha inválida.");
            throw new Error("Senha inválida");
          }

          console.log("Usuário autenticado com sucesso.");
          return { ...user.toObject(), id: user._id.toString() };
        } catch (error) {
          console.log("Erro ao autenticar:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      console.log("Tentando fazer login com o provedor:", account?.provider);
      if (account?.provider === "google" || account?.provider === "github") {
        console.log("Conectando ao banco para verificar usuário...");
        await connectToDatabase();
        const existingUser = await User.findOne({ email: profile?.email });
        if (!existingUser) {
          console.log("Criando novo usuário...");
          await User.create({
            name: profile?.name,
            email: profile?.email,
          });
        }
      }
      console.log("Login bem-sucedido.");
      return true;
    },

    async jwt({ token, user }) {
      console.log("JWT callback acionado", { token, user });
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      console.log("Session callback acionado", { session, token });
      if (token) {
        session.user = {
          email: token.email,
          name: token.name,
          image: token.picture,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
