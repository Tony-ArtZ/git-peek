"use server";

import db from "@/db";
import { redirects } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function incrementRepoView(repoId: string): Promise<boolean> {
  try {
    // Verify the repository exists
    const repo = await db
      .select()
      .from(redirects)
      .where(eq(redirects.id, repoId))
      .limit(1);

    if (repo.length === 0) {
      return false;
    }

    // In a real implementation, you might want to add a views table
    // For now, we'll just track that the view happened
    console.log(`Repository ${repoId} viewed at ${new Date().toISOString()}`);

    return true;
  } catch (error) {
    console.error("Error tracking repository view:", error);
    return false;
  }
}
