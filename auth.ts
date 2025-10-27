import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db/postgres";

interface User {
  id: string;
  email: string;
  password_hash: string;
  email_verified: Date | null;
}

async function getUser(email: string): Promise<User | null> {
  try {
    const users = await query<User>(
      "SELECT id, email, password_hash, email_verified FROM users WHERE email = $1",
      [email]
    );
    return users[0] || null;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log("❌ Invalid credentials format");
          return null;
        }

        const { email, password } = parsedCredentials.data;
        console.log("🔍 Attempting login for:", email);

        const user = await getUser(email);

        if (!user) {
          console.log("❌ User not found:", email);
          return null;
        }

        console.log("✅ User found:", user.email);

        const passwordsMatch = await bcrypt.compare(
          password,
          user.password_hash
        );

        if (!passwordsMatch) {
          console.log("❌ Invalid password for user:", email);
          return null;
        }

        console.log("✅ Password verified for:", email);

        // Return user object (will be passed to JWT callback)
        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development", // Enable debug logs
});
