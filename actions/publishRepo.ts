"use server";

import { auth } from "@/auth";
import db from "@/db";
import { redirects } from "@/db/schema";

export async function publishRepo(repoid: string) {
  try {
    const session = await auth();
    console.log(session);
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not authenticated");
    }

    const result = await db
      .insert(redirects)
      .values({
        githubRepoId: repoid,
        userId: session.user.id,
      })
      .returning();

    if (result.length === 0) {
      throw new Error("Failed to create redirect");
    }

    return result[0];
  } catch (error) {
    console.error("Error publishing repo:", error);
    throw new Error("Failed to publish repository");
  }
}
