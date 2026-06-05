import { NextRequest, NextResponse } from "next/server";
import { GitHubService } from "@/services/github";
import { AIService } from "@/services/ai";
import { RoastVibe } from "@/types/github";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");
  const repo = searchParams.get("repo");
  const vibe = (searchParams.get("vibe") as RoastVibe) || "elitist";
  const type = searchParams.get("type");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    let stream;
    let userData = null;

    if (type === "panel") {
      userData = await GitHubService.getUserProfile(username);
      const [repos, commits] = await Promise.all([
        GitHubService.getUserRepositories(username),
        GitHubService.getRecentCommits(username)
      ]);
      stream = await AIService.streamPanelRoast(userData, repos, commits);
    } else if (repo) {
      const [repoData, readme, commits] = await Promise.all([
        GitHubService.getRepository(username, repo),
        GitHubService.getReadme(username, repo),
        GitHubService.getRepositoryCommits(username, repo)
      ]);
      stream = await AIService.streamRepositoryRoast(repoData, readme, vibe, commits);
    } else {
      userData = await GitHubService.getUserProfile(username);
      const [repos, commits, oldestCommits] = await Promise.all([
        GitHubService.getUserRepositories(username),
        GitHubService.getRecentCommits(username),
        GitHubService.getOldestCommits(username)
      ]);
      stream = await AIService.streamProfileRoast(userData, repos, vibe, commits, oldestCommits);
    }

    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        // First, send the user data if available
        if (userData) {
          controller.enqueue(encoder.encode(`USER_DATA:${JSON.stringify(userData)}\n`));
        }

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Roast API Error Details:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
