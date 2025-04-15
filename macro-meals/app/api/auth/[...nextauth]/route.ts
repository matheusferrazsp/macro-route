import NextAuth from "next-auth";
import User from "../../../models/user";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
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
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials?.email });
          if (!user) {
            throw new Error("Usuário não encontrado");
          }

          // Verificação da senha com bcrypt
          const isValidPassword = await bcrypt.compare(
            credentials?.password ?? "",
            user.password as string
          );
          if (!isValidPassword) {
            throw new Error("Senha inválida");
          }

          // Retorna o usuário com o _id
          return { ...user.toObject(), id: user._id.toString() };
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "github" || account?.provider === "google") {
        await connectToDatabase();
        const existingUser = await User.findOne({ email: profile?.email });
        if (!existingUser) {
          await User.create({
            name: profile?.name,
            email: profile?.email,
          });
        }
      }
      return true;
    },

    // Atualização do JWT com _id e outras informações
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Usando user.id (que é o _id convertido em string)
        token.email = user.email;
      }
      return token;
    },

    // Atualização da sessão com as informações do token
    async session({ session, token }) {
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
});

export { handler as GET, handler as POST };
