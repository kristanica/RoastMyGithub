import OpenAI from "openai";
import { GitHubUser, GitHubRepository, RoastVibe } from "@/types/github";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const VIBE_PROMPTS: Record<RoastVibe, string> = {
  elitist: "You are a condescending, elite senior developer. Your tone is dry, sarcastic, and deeply unimpressed. Use short, punchy sentences. Avoid flowery or 'deep' metaphors. Just tell them why their code is mid and their architectural choices are a joke. You value purity, but you mostly just value being right.",
  brogrammer: "You are a high-energy, annoying brogrammer. You think everything is 'mid' unless it's bleeding edge. You hate 'legacy' (anything older than 6 months) and think tests are for people who don't know how to code. Use slang like 'crushing it', 'L choice', 'skill issue', and 'bet'. Be loud, mean, and obsessed with scale.",
  chaos: "You are a chaos gremlin who finds beauty in technical debt. You actively mock 'best practices' and find people who write clean code boring. Your goal is to point out the most unhinged, spaghetti-filled parts of their profile and celebrate the mess with a side of mockery. Be witty but mean.",
  recruiter: "You are a soul-crushing corporate recruiter. You speak in HR buzzwords to mask your absolute lack of respect for the developer's skills. Your tone is 'professional' but every word is a thinly veiled insult. Tell them their profile is going straight to the 'don't call us' pile."
};

export class AIService {
  static async streamProfileRoast(user: GitHubUser, repos: GitHubRepository[], vibe: RoastVibe = 'elitist', commits: string[] = [], oldestCommits: string[] = []) {
    const persona = VIBE_PROMPTS[vibe];
    const reposSummary = repos.slice(0, 10).map(r => r.name + " (" + r.stargazers_count + " stars)").join(', ');
    const languages = Array.from(new Set(repos.map(r => r.language).filter(Boolean))).join(', ');
    const commitSummary = commits.length > 0 ? commits.join(' | ') : "No recent public commit messages found.";
    const oldestCommitSummary = oldestCommits.length > 0 ? oldestCommits.join(' | ') : "No historical public commit messages found.";
    
    const extraMetrics = vibe === 'recruiter' 
      ? `,"hireability_score": "A number from 0-100", "portfolio_audit": "A 1-sentence professional summary of their technical presence."`
      : "";

    const prompt = `
      ${persona}
      Roast this developer's GitHub profile. 
      IMPORTANT: Avoid overly flowery, 'deep', or editorial language. 
      Be direct, punchy, and actually mean. Use common developer slang and sarcasm.
      
      Structure your response as a sequential narrative reveal. 
      Each "step" should be a sharp, devastating observation.
      For each step, provide a "receipt" which is a specific piece of evidence from the GitHub data.
      
      Output ONLY valid JSON matching this schema:
      {
        "introduction": "A short, brutal 1-sentence hook that sets the tone.",
        "steps": [
          {
            "title": "A short punchy header",
            "content": "The roast line: mean, direct, no filler.",
            "insight": "A brief sarcastic technical justification.",
            "receipt": "The specific evidence from the data or commit history."
          }
        ],
        "dna_traits": [
          { "name": "Humorous stat name", "value": "Number from 0-100" },
          { "name": "Humorous stat name", "value": "Number from 0-100" },
          { "name": "Humorous stat name", "value": "Number from 0-100" }
        ],
        "wrapped": {
          "spirit_language": { "name": "Language", "reason": "1-sentence sarcastic reason" },
          "worst_habit": { "name": "Habit", "description": "1-sentence mean description" },
          "best_moment": { "name": "Best choice", "description": "1-sentence backhanded compliment" },
          "coding_persona": { "title": "A brutal title", "description": "1-sentence summary of their failure" },
          "regression": {
            "then": "Summary of their early ambitious/idealistic commits",
            "now": "Summary of their recent lazy/given-up commits",
            "verdict": "A 1-sentence roast about their technical downfall"
          }
        },
        "summary_remedy": "A concise 2-sentence reality check on how to not be terrible.",
        "grade": "S, A, B, C, D, or F",
        "verdict": "A final, crushing one-liner."
        ${extraMetrics}
      }

      GitHub Data:
      - Username: ${user.login}
      - Bio: ${user.bio}
      - Public Repos: ${user.public_repos}
      - Followers: ${user.followers}
      - Languages: ${languages}
      - Repos Summary: ${reposSummary}
      - Recent Commits: ${commitSummary}
      - First Public Commits: ${oldestCommitSummary}

      Write the story of this developer's technical life. Make it a real roast. 
      Analyze "The Regression" slide by comparing their first commits (when they were naive and ambitious) to their latest ones (where the despair is evident).
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

  static async streamRepositoryRoast(repo: GitHubRepository, readme: string | null, vibe: RoastVibe = 'elitist', commits: string[] = []) {
    const persona = VIBE_PROMPTS[vibe];
    const commitSummary = commits.length > 0 ? commits.join(' | ') : "No recent public commit messages found.";
    
    const prompt = `
      ${persona}
      Roast the repository "${repo.name}".
      No flowery language. No deep analysis. Just mean, sarcastic, and direct technical insults.
      
      Output ONLY valid JSON:
      {
        "introduction": "1-sentence brutal hook",
        "steps": [
          { 
            "title": string, 
            "content": "A direct technical roast.", 
            "insight": "Sarcastic technical justification.",
            "receipt": "Specific evidence from the README, commits, or metadata."
          }
        ],
        "dna_traits": [
          { "name": "Humorous stat name", "value": "0-100" },
          { "name": "Humorous stat name", "value": "0-100" },
          { "name": "Humorous stat name", "value": "0-100" }
        ],
        "summary_remedy": "A 2-sentence reality check on how to fix this mess.",
        "grade": "S, A, B, C, D, or F",
        "verdict": "Final crushing judgment"
      }
      Data: ${repo.language}, ${repo.stargazers_count} stars. README: ${readme ? readme.substring(0, 500) : "None"}.
      Recent Commits: ${commitSummary}
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

  static async streamBattleRoast(user1: { user: GitHubUser, repos: GitHubRepository[], commits: string[] }, user2: { user: GitHubUser, repos: GitHubRepository[], commits: string[] }, vibe: RoastVibe = 'elitist') {
    const persona = VIBE_PROMPTS[vibe];
    const u1Repos = user1.repos.slice(0, 5).map(r => r.name).join(', ');
    const u2Repos = user2.repos.slice(0, 5).map(r => r.name).join(', ');
    const u1Commits = user1.commits.length > 0 ? user1.commits.join(' | ') : "None found.";
    const u2Commits = user2.commits.length > 0 ? user2.commits.join(' | ') : "None found.";

    const prompt = `
      ${persona}
      You are hosting a technical battle between two developers: ${user1.user.login} vs ${user2.user.login}.
      Compare their technical lives, choices, profiles, and commit habits. Be analytical, comparative, and humorous.

      Output ONLY a valid JSON object matching this schema:
      {
        "introduction": "A cinematic setup for the battle.",
        "rounds": [
          {
            "title": "Round title (e.g., 'Documentation Wars', 'Commit Chaos')",
            "analysis": "Comparative analysis of both developers, citing their commits or repos as evidence.",
            "winner_of_round": "username of the winner of this specific round or 'Draw'"
          }
        ],
        "verdict": "A final brutal summary of the battle.",
        "overall_winner": "username of the ultimate winner"
      }

      Developer 01 (${user1.user.login}):
      - Bio: ${user1.user.bio}
      - Repos: ${u1Repos}
      - Commits: ${u1Commits}
      - Languages: ${Array.from(new Set(user1.repos.map(r => r.language).filter(Boolean))).join(', ')}

      Developer 02 (${user2.user.login}):
      - Bio: ${user2.user.bio}
      - Repos: ${u2Repos}
      - Commits: ${u2Commits}
      - Languages: ${Array.from(new Set(user2.repos.map(r => r.language).filter(Boolean))).join(', ')}

      Declare a technical champion. Make it mean.
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

  static async streamPanelRoast(user: GitHubUser, repos: GitHubRepository[], commits: string[] = []) {
    const reposSummary = repos.slice(0, 10).map(r => r.name).join(', ');
    const commitSummary = commits.length > 0 ? commits.join(' | ') : "No recent commits.";
    
    const prompt = `
      You are hosting a "Technical Hearing" where four distinct judges debate the user's GitHub profile. 
      The judges are:
      1. **elitist**: A condescending, brilliant senior dev. Dry, sarcastic, hates mediocrity.
      2. **brogrammer**: Obsessed with scale and hype. Thinks everything is "mid" or "L".
      3. **chaos**: A gremlin who loves technical debt and mockery.
      4. **recruiter**: A soul-crushing HR bot who speaks in buzzwords but delivers brutal professional insults.

      They must argue with each other about the user's code, commits, and repos. 
      IMPORTANT: No flowery language. Direct technical insults and sarcasm.
      The judges should directly address each other.
      
      Output ONLY valid JSON matching this schema:
      {
        "hearing_title": "A short dramatic title for the session",
        "dialogue": [
          { 
            "judge": "elitist | brogrammer | chaos | recruiter", 
            "text": "The sharp roast line or interaction with another judge.",
            "meta": "Optional technical alert like '[SCAN_INTERRUPTED]'"
          }
        ],
        "final_consensus": "A 1-sentence collective decision.",
        "overall_grade": "S, A, B, C, D, or F"
      }

      Data:
      - User: ${user.login} (${user.bio})
      - Repos: ${reposSummary}
      - Recent Commits: ${commitSummary}

      Start the hearing. Make it a chaotic but technical chat. Use lowercase judge names in the JSON.
    `;

    return openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a technical court transcriber. Output ONLY valid JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      stream: true,
    });
  }
}
