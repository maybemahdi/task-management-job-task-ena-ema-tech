import { connectDB } from "@/lib/connectDB";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        if (!email || !password) {
          return null;
        }
        const db = await connectDB();
        const userCollection = db.collection("users");
        const currentUser = await userCollection.findOne({
          email,
        });
        if (!currentUser) {
          return null;
        }
        if (password !== currentUser.password) {
          console.error("Incorrect password");
          return null; // Return null if password doesn't match
        }
        return currentUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // This callback is triggered when a user is authenticated
      if (user) {
        token.id = user._id; // Add user ID to token
        token.role = user.role || "user"; // Add role to token (default to 'user')
        token.provider = account.provider; // Add provider info
        token.username = user.username; // Add username
      }
      return token;
    },
    async session({ session, token }) {
      // Add extra properties to session object from token
      session.user.id = token.id;
      session.user.role = token.role; // Add role to session
      session.user.username = token.username; // Add username to session
      session.user.provider = token.provider; // Add provider to session

      return session;
    },
    async signIn({ user }) {
      return user;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
