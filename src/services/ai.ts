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
    
    const extraMetrics = vibe === 'recruiter' 
      ? `,"hireability_score": "A number from 0-100", "portfolio_audit": "A 1-sentence professional summary of their technical presence."`
      : "";

    const prompt = `
      ${persona}
      Write an interactive editorial essay about this developer's GitHub profile.
      
      Structure your response as a sequential narrative reveal. 
      Each "step" should be a single clear idea.
      For each step, provide a "receipt" which is a specific piece of evidence from the GitHub data (e.g., a specific repo name, follower count, or language stat).
      
      Output ONLY a valid JSON object matching this schema:
      {
        "introduction": "A sharp, 1-sentence opening observation about the profile overall.",
        "steps": [
          {
            "title": "A short descriptive header for this observation",
            "content": "The roast line: concise, observational, analytical.",
            "insight": "A brief technical justification or evidence.",
            "receipt": "The specific evidence from the data."
          }
        ],
        "summary_remedy": "A concise 2-3 sentence technical summary on how the developer can redeem their entire profile.",
        "verdict": "A short, memorable final judgment."
        ${extraMetrics}
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
      
      Output ONLY valid JSON:
      {
        "introduction": "1-sentence hook",
        "steps": [
          { 
            "title": string, 
            "content": string, 
            "insight": string,
            "receipt": "Specific evidence from the README or repository metadata."
          }
        ],
        "summary_remedy": "A 2-sentence summary on how to fix this specific repository.",
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

  static async streamBattleRoast(user1: { user: GitHubUser, repos: GitHubRepository[] }, user2: { user: GitHubUser, repos: GitHubRepository[] }, vibe: RoastVibe = 'elitist') {
    const persona = VIBE_PROMPTS[vibe];
    const u1Repos = user1.repos.slice(0, 5).map(r => r.name).join(', ');
    const u2Repos = user2.repos.slice(0, 5).map(r => r.name).join(', ');

    const prompt = `
      ${persona}
      You are hosting a technical battle between two developers: ${user1.user.login} vs ${user2.user.login}.
      Compare their technical lives, choices, and profiles. Be analytical, comparative, and humorous.

      Output ONLY a valid JSON object matching this schema:
      {
        "introduction": "A cinematic setup for the battle.",
        "rounds": [
          {
            "title": "Round title (e.g., 'Documentation Wars', 'Architectural Chaos')",
            "analysis": "Comparative analysis of both developers.",
            "winner_of_round": "username of the winner of this specific round or 'Draw'"
          }
        ],
        "verdict": "A final brutal summary of the battle.",
        "overall_winner": "username of the ultimate winner"
      }

      Developer 01 (${user1.user.login}):
      - Bio: ${user1.user.bio}
      - Repos: ${u1Repos}
      - Languages: ${Array.from(new Set(user1.repos.map(r => r.language).filter(Boolean))).join(', ')}

      Developer 02 (${user2.user.login}):
      - Bio: ${user2.user.bio}
      - Repos: ${u2Repos}
      - Languages: ${Array.from(new Set(user2.repos.map(r => r.language).filter(Boolean))).join(', ')}

      Declare a technical champion.
    `;

    return openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an analytical combat commentator. Output ONLY valid JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      stream: true,
    });
  }
}
