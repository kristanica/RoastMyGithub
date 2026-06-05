# AGENTS.md

# RoastMyGitHub

RoastMyGitHub is an AI-powered web application that analyzes GitHub profiles and repositories, then generates entertaining but constructive feedback.

The product exists to help developers improve their GitHub presence through humor, insights, and actionable recommendations.

---

# Mission

Help developers answer:

> "What does my GitHub profile actually look like to other developers and recruiters?"

The platform should feel like a brutally honest senior developer reviewing a portfolio, while remaining helpful and respectful.

---

# Product Principles

## Roast the Code, Not the Person

Roasts should target:

- Repository quality
- Documentation
- Project structure
- Commit history
- Naming conventions
- Portfolio presentation
- Development habits

Never target:

- Personal characteristics
- Identity
- Demographics
- Appearance
- Background

---

## Humor Must Be Useful

Every joke should reveal an actual insight.

Bad:

"This project is terrible."

Good:

"This README has the confidence of a production-ready SaaS and the amount of documentation of a school assignment submitted five minutes before the deadline."

Then explain:

- What's missing
- Why it matters
- How to improve it

---

## Entertainment First, Value Second

Users visit because they want to get roasted.

Users stay because the feedback is surprisingly useful.

The ideal response should be:

- Funny
- Memorable
- Technically accurate
- Actionable

---

# Core Features

## GitHub Profile Roast

Analyze:

- Bio
- Profile picture presence
- Pinned repositories
- Repository quality
- Contribution activity
- README quality
- Technology diversity

Generate:

- Roast Score
- Portfolio Grade
- AI Roast
- Strengths
- Weaknesses
- Recommendations

---

## Repository Roast

Analyze:

- README
- File structure
- Tech stack
- Project organization
- Commit quality
- Documentation
- Project completeness

Generate:

- Overall Score
- AI Roast
- Technical Review
- Improvement Suggestions

---

## Recruiter Mode

Analyze a profile from the perspective of a recruiter.

Generate:

- Hireability Score
- Portfolio Strength
- Red Flags
- Positive Signals
- Suggested Improvements

The goal is realistic portfolio feedback, not fake recruiting decisions.

---

## Shareable Results

Every roast should be designed to be:

- Screenshot-worthy
- Social-media friendly
- Memorable
- Funny enough to share

Virality is a product feature.

---

# AI Guidelines

## Tone

Target:

70% humor

30% mentorship

The AI should sound like:

- A senior developer
- A code reviewer
- A tech lead with personality

Avoid sounding:

- Mean
- Hostile
- Corporate
- Generic

---

## Roast Categories

Possible observations:

### Documentation

- Missing README
- Weak README
- No screenshots
- No setup guide

### Project Quality

- Incomplete projects
- Tutorial projects
- Clone projects
- Abandoned repositories

### Git Habits

- Poor commit messages
- Massive commits
- Inconsistent activity

### Portfolio Presentation

- Weak pinned repositories
- Lack of project variety
- Missing descriptions
- Empty profile

### Engineering

- Overengineering
- Underengineering
- Poor naming
- Weak structure

---

# Technical Guidelines

## Architecture

Prioritize:

- Simplicity
- Readability
- Maintainability

Avoid:

- Premature optimization
- Complex abstractions
- Unnecessary microservices
- Overengineering

---

## Performance

Target:

- Fast profile analysis
- Fast AI response generation
- Minimal waiting time

Users should feel the product is instant.

---

## Frontend

The UI should feel:

- Modern
- Developer-focused
- Playful
- Polished

Think:

GitHub + Duolingo + Reddit

Not:

Corporate dashboard software.

---

## Backend

Prefer:

- Small services
- Clear APIs
- Proper validation
- Error handling
- Caching when beneficial

Never sacrifice simplicity for theoretical scalability.

---

# Design Principles

Every screen should answer:

1. What is being roasted?
2. Why is it funny?
3. What can the user improve?
4. What makes this worth sharing?

---

# Agent Instructions

Before implementing:

- Understand the existing architecture.
- Follow current patterns.
- Prefer minimal changes.
- Reuse components whenever possible.

When implementing:

- Keep solutions simple.
- Write readable code.
- Avoid unnecessary dependencies.
- Preserve existing functionality.

After implementing:

- Explain what changed.
- Explain why it changed.
- List affected files.
- Mention possible risks.
- Suggest future improvements if relevant.

---

# Success Metric

A successful RoastMyGitHub response makes a developer:

1. Laugh.
2. Learn something.
3. Improve their GitHub profile.
4. Share the result with friends.

If a feature does not contribute to one of these goals, reconsider whether it belongs in the product.
