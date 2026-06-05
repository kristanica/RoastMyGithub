import { NextRequest, NextResponse } from "next/server";
import { GitHubService } from "@/services/github";
import { AIService } from "@/services/ai";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");
  const repo = searchParams.get("repo");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    let stream;
    let userData = null;

    if (repo) {
      const repoData = await GitHubService.getRepository(username, repo);
      const readme = await GitHubService.getReadme(username, repo);
      stream = await AIService.streamRepositoryRoast(repoData, readme);
    } else {
      userData = await GitHubService.getUserProfile(username);
      const repos = await GitHubService.getUserRepositories(username);
      stream = await AIService.streamProfileRoast(userData, repos);
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
