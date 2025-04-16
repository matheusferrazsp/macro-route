import GoogleProvider from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/app/models/user";
import { AuthOptions } from "next-auth";
import { connectToDatabase } from "./mongodb";
import { DefaultSession, Session, JWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      name?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface JWT {
    email: string;
    name?: string;
    picture?: string | null;
  }
}

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
          console.log("Tentando conectar ao banco de dados...");
          await connectToDatabase();
          console.log("Banco de dados conectado com sucesso.");

          const user = await User.findOne({ email: credentials?.email });
          if (!user) {
            console.log("Usuário não encontrado.");
            return null;
          }

          console.log("Verificando senha...");
          const isValidPassword = await bcrypt.compare(
            credentials?.password ?? "",
            user.password as string
          );
          if (!isValidPassword) {
            console.log("Senha inválida.");
            return null;
          }

          console.log("Usuário autenticado com sucesso.");
          return { ...user.toObject(), id: user._id.toString() };
        } catch (error) {
          console.error("Erro ao autenticar:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      console.log("Tentando fazer login com o provedor:", account?.provider);

      if (account?.provider === "google" || account?.provider === "github") {
        try {
          console.log("Conectando ao banco para verificar/criar usuário...");
          await connectToDatabase();

          const existingUser = await User.findOne({ email: profile?.email });

          if (!existingUser) {
            await User.create({
              name: profile?.name,
              email: profile?.email,
            });
            console.log("Usuário criado com sucesso.");
          } else {
            console.log("Usuário já existe.");
          }

          return true;
        } catch (error) {
          console.error("Erro no signIn callback:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      console.log("JWT callback acionado", { token, user });

      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      console.log("Session callback acionado", { session, token });

      if (token) {
        session.user = {
          email: token.email,
          name: token.name,
          image: token.picture,
        } as {
          email: string;
          name?: string | null;
          image?: string | null;
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
