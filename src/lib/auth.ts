import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
    }),
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@sustento.in" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password.");
        }

        const envEmail = process.env.ADMIN_EMAIL || "admin@sustento.in";
        const envPassword = process.env.ADMIN_PASSWORD || "admin123";

        // Check environment variable admin fallback first for easy zero-friction setup
        if (
          credentials.email.toLowerCase() === envEmail.toLowerCase() &&
          credentials.password === envPassword
        ) {
          return {
            id: "admin-env",
            name: "Sustento Admin",
            email: envEmail,
            role: "admin",
          };
        }

        // Otherwise check MongoDB User database if MONGODB_URI is provided
        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email.toLowerCase() });

          if (user && user.password) {
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (isValid) {
              return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role || "admin",
              };
            }
          }
        } catch (error) {
          console.error("Auth DB check error:", error);
        }

        throw new Error("Invalid admin email or password.");
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();
          const emailLower = user.email?.toLowerCase();
          const existingUser = await User.findOne({ email: emailLower });
          if (!existingUser) {
            // Auto-signup: create a customer user record in MongoDB
            await User.create({
              name: user.name,
              email: emailLower,
              image: user.image,
              role: "customer",
            });
          } else if (user.image && existingUser.image !== user.image) {
            // Optional: update avatar if it changed
            existingUser.image = user.image;
            await existingUser.save();
          }
        } catch (err) {
          console.error("Error saving user during google sign in:", err);
          return false; // prevent sign-in on DB error
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // Connect to DB and fetch the correct role and ID for the session token
      try {
        await connectDB();
        const emailLower = token.email?.toLowerCase();
        const dbUser = await User.findOne({ email: emailLower });
        if (dbUser) {
          token.role = dbUser.role || "customer";
          token.id = dbUser._id.toString();
        } else if (user) {
          token.role = (user as { role?: string }).role || "customer";
        }
      } catch (err) {
        console.error("JWT auth callback error:", err);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = (token.role as string) || "customer";
        (session.user as { id?: string }).id = (token.id as string);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "sustento-super-secret-key-2026",
};
