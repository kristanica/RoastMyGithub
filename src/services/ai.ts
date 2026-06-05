import OpenAI from "openai";
import { GitHubUser, GitHubRepository } from "@/types/github";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export class AIService {
  static async streamProfileRoast(user: GitHubUser, repos: GitHubRepository[]) {
    const prompt = `
      You are an elite senior developer writing an interactive editorial essay about a developer's GitHub profile.
      Your tone is sophisticated, analytical, and brutally honest. You value accuracy over exaggeration.
      
      Structure your response as a sequential narrative reveal. 
      Each "step" should be a single clear idea.
      
      Output ONLY a valid JSON object matching this schema:
      {
        "introduction": "A sharp, 1-sentence opening observation about the profile overall.",
        "steps": [
          {
            "title": "A short descriptive header for this observation",
            "content": "The roast line: concise, observational, analytical.",
            "insight": "A brief technical justification or evidence."
          }
        ],
        "verdict": "A short, memorable final judgment."
      }

      GitHub Data:
      - Username: ${user.login}
      - Bio: ${user.bio}
      - Public Repos: ${user.public_repos}
      - Followers: ${user.followers}
      - Languages: ${Array.from(new Set(repos.map(r => r.language).filter(Boolean))).join(', ')}
      - Repos Summary: ${repos.slice(0, 10).map(r => `${r.name} (${r.stargazers_count} stars)`).join(', ')}

      Write the story of this developer's technical life.
    `;

    return openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an analytical storyteller. Output ONLY valid JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      stream: true,
    });
  }

  static async streamRepositoryRoast(repo: GitHubRepository, readme: string | null) {
    const prompt = `
      Write an interactive essay roast for the repository "${repo.name}".
      Output ONLY valid JSON:
      {
        "introduction": "1-sentence hook",
        "steps": [{ "title": string, "content": string, "insight": string }],
        "verdict": "Final short judgment"
      }
      Data: ${repo.language}, ${repo.stargazers_count} stars. README: ${readme?.substring(0, 500)}
    `;

    return openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an analytical storyteller. Output ONLY valid JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      stream: true,
    });
  }
}
