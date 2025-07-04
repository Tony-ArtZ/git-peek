"use server";

import db from "@/db";
import { viewCounts } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function updateViewCount(redirectId: string) {
  try {
    await db
      .insert(viewCounts)
      .values({
        redirectId,
        count: 1,
        lastViewed: new Date(),
      })
      .onConflictDoUpdate({
        target: viewCounts.redirectId,
        set: {
          count: sql`${viewCounts.count} + 1`,
          lastViewed: new Date(),
        },
      });
  } catch (error) {
    console.error("Error updating view count:", error);
    throw new Error("Failed to update view count");
  }
}
