export type RoastVibe = 'elitist' | 'brogrammer' | 'chaos' | 'recruiter';

export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  blog: string | null;
  location: string | null;
  twitter_username: string | null;
}

export interface GitHubRepository {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  pushed_at: string;
  size: number;
  topics: string[];
}

export interface RoastResult {
  score: number;
  grade: string;
  roast: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface RepositoryRoastResult extends RoastResult {
  technical_review: string;
}
