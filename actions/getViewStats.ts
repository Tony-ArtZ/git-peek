"use server";

import db from "@/db";
import { viewCounts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getRepoViewCount(repoId: string): Promise<number> {
  try {
    const result = await db
      .select({
        count: viewCounts.count,
      })
      .from(viewCounts)
      .where(eq(viewCounts.redirectId, repoId))
      .limit(1);

    return result[0]?.count || 0;
  } catch (error) {
    console.error("Error fetching view count:", error);
    return 0;
  }
}

export async function getRepoViewStats(repoId: string) {
  try {
    const result = await db
      .select({
        count: viewCounts.count,
        lastViewed: viewCounts.lastViewed,
      })
      .from(viewCounts)
      .where(eq(viewCounts.redirectId, repoId))
      .limit(1);

    return result[0] || { count: 0, lastViewed: null };
  } catch (error) {
    console.error("Error fetching view stats:", error);
    return { count: 0, lastViewed: null };
  }
}
