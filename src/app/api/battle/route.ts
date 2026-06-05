import { NextRequest, NextResponse } from "next/server";
import { GitHubService } from "@/services/github";
import { AIService } from "@/services/ai";
import { RoastVibe } from "@/types/github";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const u1 = searchParams.get("u1");
  const u2 = searchParams.get("u2");
  const vibe = (searchParams.get("vibe") as RoastVibe) || "elitist";

  if (!u1 || !u2) {
    return NextResponse.json({ error: "Two usernames are required for a battle" }, { status: 400 });
  }

  try {
    const [user1, repos1, user2, repos2] = await Promise.all([
      GitHubService.getUserProfile(u1),
      GitHubService.getUserRepositories(u1),
      GitHubService.getUserProfile(u2),
      GitHubService.getUserRepositories(u2),
    ]);

    const stream = await AIService.streamBattleRoast(
      { user: user1, repos: repos1 },
      { user: user2, repos: repos2 },
      vibe
    );

    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder.encode(`USERS_DATA:${JSON.stringify({ user1, user2 })}\n`));

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
    console.error("Battle API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to start battle" }, { status: 500 });
  }
}
