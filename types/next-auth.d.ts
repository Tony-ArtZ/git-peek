import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    expires: string;
    user: {
      id: string;
      address: string;
    } & DefaultSession["user"];
  }
}
