"use server";

import db from "@/db";
import { redirects, accounts, users } from "@/db/schema";
import { eq } from "drizzle-orm";

async function getAccessToken(userId: string): Promise<string | null> {
  try {
    const result = await db
      .select({
        accessToken: accounts.access_token,
      })
      .from(accounts)
      .innerJoin(users, eq(accounts.userId, users.id))
      .where(eq(users.id, userId))
      .limit(1);

    return result[0]?.accessToken || null;
  } catch {
    return null;
  }
}

function extractRepoInfo(
  githubRepoId: string
): { owner: string; repo: string } | null {
  try {
    let repoFullName = githubRepoId;

    if (repoFullName.startsWith("https://github.com/")) {
      repoFullName = repoFullName.replace("https://github.com/", "");
    }

    repoFullName = repoFullName.replace(/\/$/, "");

    const parts = repoFullName.split("/");
    if (parts.length >= 2) {
      return {
        owner: parts[0],
        repo: parts[1],
      };
    }

    return null;
  } catch {
    return null;
  }
}

export async function fetchImageFromRepo(
  repoId: string,
  imagePath: string
): Promise<string | null> {
  try {
    // Get repository info from database
    const redirectData = await db
      .select()
      .from(redirects)
      .where(eq(redirects.id, repoId))
      .limit(1);

    if (redirectData.length === 0) {
      return null;
    }

    const redirect = redirectData[0];
    const accessToken = await getAccessToken(redirect.userId);

    if (!accessToken) {
      return null;
    }

    const repoInfo = extractRepoInfo(redirect.githubRepoId);
    if (!repoInfo) {
      return null;
    }

    // Clean the image path - remove leading slash if present
    const cleanImagePath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;

    // Fetch the file content from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents/${cleanImagePath}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "GitPeek/1.0",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const fileData = await response.json();

    // GitHub API returns file content as base64 encoded
    if (fileData.content && fileData.encoding === "base64") {
      // Return as data URL for direct embedding
      const mimeType = getMimeType(imagePath);
      return `data:${mimeType};base64,${fileData.content.replace(/\n/g, "")}`;
    }

    return null;
  } catch {
    return null;
  }
}

function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().split(".").pop();
  const mimeTypes: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    bmp: "image/bmp",
    ico: "image/x-icon",
    mp4: "video/mp4",
    webm: "video/webm",
    ogg: "video/ogg",
    mov: "video/quicktime",
  };
  return mimeTypes[ext || ""] || "application/octet-stream";
}
