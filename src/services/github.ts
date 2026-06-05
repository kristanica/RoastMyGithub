import { GitHubUser, GitHubRepository } from "@/types/github";

const GITHUB_API_URL = "https://api.github.com";

export class GitHubService {
  private static getAuthHeader(): Record<string, string> {
    const token = process.env.GITHUB_TOKEN;
    const hasValidToken = token && !token.includes("your_github_token_here");
    return hasValidToken ? { Authorization: `Bearer ${token}` } : {};
  }

  private static async fetchGitHub<T>(path: string): Promise<T> {
    const response = await fetch(`${GITHUB_API_URL}${path}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...this.getAuthHeader(),
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("GitHub user or repository not found");
      }
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return response.json();
  }

  static async getUserProfile(username: string): Promise<GitHubUser> {
    return this.fetchGitHub<GitHubUser>(`/users/${username}`);
  }

  static async getUserRepositories(username: string): Promise<GitHubRepository[]> {
    return this.fetchGitHub<GitHubRepository[]>(`/users/${username}/repos?sort=updated&per_page=100`);
  }

  static async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    return this.fetchGitHub<GitHubRepository>(`/repos/${owner}/${repo}`);
  }

  static async getReadme(owner: string, repo: string): Promise<string | null> {
    try {
      const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/readme`, {
        headers: {
          Accept: "application/vnd.github.v3.raw",
          ...this.getAuthHeader(),
        },
      });

      if (!response.ok) return null;
      return response.text();
    } catch (error) {
      console.error("Error fetching README:", error);
      return null;
    }
  }
}
