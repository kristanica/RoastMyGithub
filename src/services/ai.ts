import OpenAI from "openai";
import { GitHubUser, GitHubRepository, RoastVibe } from "@/types/github";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const VIBE_PROMPTS: Record<RoastVibe, string> = {
  elitist: "You are an elite senior developer. Your tone is sophisticated, analytical, and brutally honest. You value architectural purity and elegant solutions. You are deeply disappointed by mediocrity.",
  brogrammer: "You are a total brogrammer. You love 'bleeding edge' tech, hate tests, and think everything should scale to a billion users. You use words like 'crushing it', 'beast mode', and 'shredding'.",
  chaos: "You are a chaos gremlin. You actively encourage messy code, hilarious hacks, and disregard for best practices. You find beauty in the most unhinged commit messages and spaghetti logic.",
  recruiter: "You are a passive-aggressive corporate recruiter. You speak in HR-approved buzzwords but your disappointment is palpable. You are looking for 'rockstars' but only see 'unskilled labor'."
};

export class AIService {
  static async streamProfileRoast(user: GitHubUser, repos: GitHubRepository[], vibe: RoastVibe = 'elitist') {
    const persona = VIBE_PROMPTS[vibe];
    const reposSummary = repos.slice(0, 10).map(r => r.name + " (" + r.stargazers_count + " stars)").join(', ');
    const languages = Array.from(new Set(repos.map(r => r.language).filter(Boolean))).join(', ');
    
    const prompt = `
      ${persona}
      Write an interactive editorial essay about this developer's GitHub profile.
      
      Structure your response as a sequential narrative reveal. 
      Each "step" should be a single clear idea.
      For each step, provide a "remedy" which is a genuine, helpful 1-sentence tip to fix or improve the issue mentioned.
      
      Output ONLY a valid JSON object matching this schema:
      {
        "introduction": "A sharp, 1-sentence opening observation about the profile overall.",
        "steps": [
          {
            "title": "A short descriptive header for this observation",
            "content": "The roast line: concise, observational, analytical.",
            "insight": "A brief technical justification or evidence.",
            "remedy": "A genuine 1-sentence tip to fix this issue."
          }
        ],
        "verdict": "A short, memorable final judgment."
      }

      GitHub Data:
      - Username: ${user.login}
      - Bio: ${user.bio}
      - Public Repos: ${user.public_repos}
      - Followers: ${user.followers}
      - Languages: ${languages}
      - Repos Summary: ${reposSummary}

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

  static async streamRepositoryRoast(repo: GitHubRepository, readme: string | null, vibe: RoastVibe = 'elitist') {
    const persona = VIBE_PROMPTS[vibe];
    const prompt = `
      ${persona}
      Write an interactive essay roast for the repository "${repo.name}".
      Provide a "remedy" for each step which is a genuine, helpful 1-sentence tip to fix the issue.

      Output ONLY valid JSON:
      {
        "introduction": "1-sentence hook",
        "steps": [
          { 
            "title": string, 
            "content": string, 
            "insight": string,
            "remedy": "A genuine 1-sentence tip to fix this issue."
          }
        ],
        "verdict": "Final short judgment"
      }
      Data: ${repo.language}, ${repo.stargazers_count} stars. README: ${readme ? readme.substring(0, 500) : "None"}
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
