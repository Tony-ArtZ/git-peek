"use server";

import db from "@/db";
import { redirects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateViewCount } from "./updateView";

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

    // Update the view count
    await updateViewCount(repoId);

    return true;
  } catch (error) {
    console.error("Error tracking repository view:", error);
    return false;
  }
}
