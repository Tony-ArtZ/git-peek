"use server";

import { auth } from "@/auth";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description: string | null;
  html_url: string;
  updated_at: string;
}

export async function getUserRepos(): Promise<GitHubRepo[]> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("User not authenticated");
    }

    const accessToken = session.accessToken;
    if (!accessToken) {
      throw new Error("No access token available");
    }

    const response = await fetch(
      "https://api.github.com/user/repos?per_page=1000&type=all&sort=updated",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();
    return repos;
  } catch (error) {
    console.error("Error fetching repositories:", error);
    throw new Error("Failed to fetch repositories");
  }
}
