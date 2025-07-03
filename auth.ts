import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import db from "./db";
import { accounts } from "./db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      authorization: {
        params: {
          scope: "read:user user:email repo read:org",
        },
      },
    }),
  ],
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      if (user?.id) {
        const result = await db
          .select({
            accessToken: accounts.access_token,
          })
          .from(accounts)
          .where(eq(accounts.userId, user.id))
          .limit(1);

        session.accessToken = result[0]?.accessToken || "";
        session.user.id = user.id;
      }
      return session;
    },
  },
});
