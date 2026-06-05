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

  static async getRecentCommits(username: string): Promise<string[]> {
    try {
      const response = await fetch(`${GITHUB_API_URL}/users/${username}/events/public`, {
        headers: {
          "Accept": "application/vnd.github.v3+json",
          ...this.getAuthHeader(),
        },
      });

      if (!response.ok) return [];
      const events = await response.json();
      
      const commitMessages: string[] = [];
      for (const event of events) {
        if (event.type === "PushEvent" && event.payload.commits) {
          for (const commit of event.payload.commits) {
            if (commit.message && !commit.message.startsWith("Merge ")) {
              commitMessages.push(commit.message);
            }
          }
        }
        if (commitMessages.length >= 15) break;
      }
      
      return commitMessages.slice(0, 10);
    } catch (error) {
      console.error("Error fetching commits:", error);
      return [];
    }
  }

  static async getRepositoryCommits(owner: string, repo: string): Promise<string[]> {
    try {
      const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/commits?per_page=10`, {
        headers: {
          "Accept": "application/vnd.github.v3+json",
          ...this.getAuthHeader(),
        },
      });

      if (!response.ok) return [];
      const commits = await response.json();
      
      return commits
        .map((c: any) => c.commit.message)
        .filter((m: string) => !m.startsWith("Merge "));
    } catch (error) {
      console.error("Error fetching repo commits:", error);
      return [];
    }
  }
}
