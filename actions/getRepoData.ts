"use server";

import db from "@/db";
import { redirects, accounts, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface GitHubFile {
  name: string;
  path: string;
  type: "file" | "dir";
  download_url?: string;
  size?: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  private: boolean;
  default_branch: string;
}

export interface RepoData {
  repo: GitHubRepo;
  files: GitHubFile[];
  readme?: string;
  license?: string;
}

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

async function fetchFromGitHub(url: string, accessToken: string) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "GitPeek/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} - ${response.statusText}`
    );
  }

  return response.json();
}

export async function getRepoData(repoId: string): Promise<RepoData | null> {
  try {
    const redirectData = await db
      .select()
      .from(redirects)
      .where(eq(redirects.id, repoId))
      .limit(1);

    if (redirectData.length === 0) {
      throw new Error("Repository not found");
    }

    const redirect = redirectData[0];
    const accessToken = await getAccessToken(redirect.userId);

    if (!accessToken) {
      throw new Error("Access token not found for repository owner");
    }

    const repoInfo = extractRepoInfo(redirect.githubRepoId);
    if (!repoInfo) {
      throw new Error("Invalid repository format");
    }

    try {
      const userResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "GitPeek/1.0",
        },
      });

      if (!userResponse.ok) {
        throw new Error("Invalid access token");
      }
    } catch (error) {
      throw error;
    }

    const repo: GitHubRepo = await fetchFromGitHub(
      `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`,
      accessToken
    );

    const files: GitHubFile[] = await fetchFromGitHub(
      `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents`,
      accessToken
    );

    let readme: string | undefined;
    const readmeFile = files.find(
      (file) =>
        file.type === "file" &&
        file.name.toLowerCase().match(/^readme\.(md|txt|rst)$/i)
    );

    if (readmeFile && readmeFile.download_url) {
      try {
        const readmeResponse = await fetch(readmeFile.download_url);
        if (readmeResponse.ok) {
          readme = await readmeResponse.text();
        }
      } catch {
        // Silently fail if README can't be fetched
      }
    }

    // Try to fetch LICENSE
    let license: string | undefined;
    const licenseFile = files.find(
      (file) =>
        file.type === "file" &&
        file.name.toLowerCase().match(/^(license|licence)(\.md|\.txt)?$/i)
    );

    if (licenseFile && licenseFile.download_url) {
      try {
        const licenseResponse = await fetch(licenseFile.download_url);
        if (licenseResponse.ok) {
          license = await licenseResponse.text();
        }
      } catch {
        // Silently fail if LICENSE can't be fetched
      }
    }

    return {
      repo,
      files,
      readme,
      license,
    };
  } catch {
    return null;
  }
}

export async function getFileContent(
  repoId: string,
  filePath: string
): Promise<string | null> {
  try {
    const redirectData = await db
      .select()
      .from(redirects)
      .where(eq(redirects.id, repoId))
      .limit(1);

    if (redirectData.length === 0) {
      throw new Error("Repository not found");
    }

    const redirect = redirectData[0];
    const accessToken = await getAccessToken(redirect.userId);

    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const repoInfo = extractRepoInfo(redirect.githubRepoId);
    if (!repoInfo) {
      throw new Error("Invalid repository format");
    }

    const fileData = await fetchFromGitHub(
      `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents/${filePath}`,
      accessToken
    );

    if (fileData.content) {
      return atob(fileData.content);
    }

    return null;
  } catch {
    return null;
  }
}

export async function getDirectoryContents(
  repoId: string,
  dirPath: string = ""
): Promise<GitHubFile[] | null> {
  try {
    const redirectData = await db
      .select()
      .from(redirects)
      .where(eq(redirects.id, repoId))
      .limit(1);

    if (redirectData.length === 0) {
      throw new Error("Repository not found");
    }

    const redirect = redirectData[0];
    const accessToken = await getAccessToken(redirect.userId);

    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const repoInfo = extractRepoInfo(redirect.githubRepoId);
    if (!repoInfo) {
      throw new Error("Invalid repository format");
    }

    const contents: GitHubFile[] = await fetchFromGitHub(
      `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents/${dirPath}`,
      accessToken
    );

    return contents;
  } catch {
    return null;
  }
}
