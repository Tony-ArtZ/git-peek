"use server";

import { auth } from "@/auth";
import db from "@/db";
import { redirects, viewCounts } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getUserRepos } from "@/actions/getRepo";

// Update the interface to include more repo details
interface PublishedRepo {
  id: string;
  githubRepoId: string;
  createdAt: Date | null;
  repoName?: string;
  repoUrl?: string;
  description?: string;
  isPrivate?: boolean;
  viewCount?: number;
  lastViewed?: Date | null;
}

export async function getUserPublishedRepos(): Promise<PublishedRepo[]> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    // Get published repos from database with view counts
    const publishedRepos = await db
      .select({
        id: redirects.id,
        githubRepoId: redirects.githubRepoId,
        createdAt: redirects.createdAt,
        viewCount: viewCounts.count,
        lastViewed: viewCounts.lastViewed,
      })
      .from(redirects)
      .leftJoin(viewCounts, eq(redirects.id, viewCounts.redirectId))
      .where(eq(redirects.userId, session.user.id))
      .orderBy(redirects.createdAt);

    // Get GitHub repo details
    const allGitHubRepos = await getUserRepos();

    // Merge the data
    const enrichedRepos = publishedRepos.map((repo) => {
      const githubRepo = allGitHubRepos.find(
        (ghRepo) => ghRepo.id.toString() === repo.githubRepoId
      );

      return {
        ...repo,
        repoName: githubRepo?.name,
        repoUrl: githubRepo?.html_url,
        description: githubRepo?.description || undefined,
        isPrivate: githubRepo?.private,
        viewCount: repo.viewCount || 0,
        lastViewed: repo.lastViewed,
      };
    });

    return enrichedRepos;
  } catch (error) {
    console.error("Error fetching published repositories:", error);
    throw new Error("Failed to fetch published repositories");
  }
}

export async function deletePublishedRepo(
  repoId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const existingRepo = await db
      .select()
      .from(redirects)
      .where(
        and(eq(redirects.id, repoId), eq(redirects.userId, session.user.id))
      )
      .limit(1);

    if (existingRepo.length === 0) {
      return {
        success: false,
        message:
          "Repository not found or you don't have permission to delete it",
      };
    }

    await db
      .delete(redirects)
      .where(
        and(eq(redirects.id, repoId), eq(redirects.userId, session.user.id))
      );

    revalidatePath("/publish");
    revalidatePath("/dashboard");
    revalidatePath("/");

    return {
      success: true,
      message: "Repository successfully unpublished",
    };
  } catch (error) {
    console.error("Error deleting published repository:", error);
    return {
      success: false,
      message: "Failed to delete repository",
    };
  }
}

export async function getUserTotalViews(): Promise<number> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return 0;
    }

    const result = await db
      .select({
        totalViews: sql<number>`COALESCE(SUM(${viewCounts.count}), 0)`,
      })
      .from(redirects)
      .leftJoin(viewCounts, eq(redirects.id, viewCounts.redirectId))
      .where(eq(redirects.userId, session.user.id));

    return result[0]?.totalViews || 0;
  } catch (error) {
    console.error("Error fetching total views:", error);
    return 0;
  }
}
