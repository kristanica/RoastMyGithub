# TECH_STACK.md

# RoastMyGitHub Technology Stack

## Philosophy

Prioritize:

- Fast development
- Simple architecture
- Low operational cost
- Great developer experience

Avoid premature optimization.

Build the simplest thing that works.

---

# Frontend

## Framework

- Next.js 16 (App Router)
- React 19
- TypeScript

Reasons:

- Full-stack development
- Excellent deployment experience
- Server Components
- Large ecosystem

---

## Styling

- Tailwind CSS

Reasons:

- Fast UI development
- Consistent design system
- Easy responsive layouts

---

## Components

- shadcn/ui

Reasons:

- Modern appearance
- Accessible components
- Easy customization

---

## Icons

- Lucide React

---

## Animations

- Framer Motion

Use sparingly.

Animations should enhance the roast experience, not slow it down.

---

# Backend

## API Layer

Use Next.js Route Handlers.

Avoid creating a separate backend unless absolutely necessary.

---

# AI

## Provider

Gemini 2.5 Flash

Primary Use Cases:

- Profile roasting
- Repository roasting
- Recruiter reviews

Guidelines:

- Roast first
- Explain second
- Recommend third

Target Tone:

- 70% humor
- 30% constructive feedback

---

# GitHub Integration

## Data Source

GitHub REST API

Fetch:

- User profile
- Repositories
- Languages
- README content
- Contribution statistics

Only analyze public information for the MVP.

No authentication required.

---

# Validation

## Schema Validation

- Zod

Use for:

- API validation
- Form validation
- AI response validation

---

# Database

## MVP

No database required.

The application can operate entirely from:

- User input
- GitHub API data
- AI responses

Store nothing.

---

## Future

PostgreSQL

Use only when implementing:

- Roast history
- User accounts
- Saved reports
- Analytics

---

# Caching

## MVP

None.

Keep implementation simple.

---

## Future

Upstash Redis

Use for:

- GitHub API caching
- AI response caching
- Rate limiting

---

# Deployment

## Hosting

Vercel

Reasons:

- Fast deployment
- Excellent Next.js support
- Preview deployments

---

# Analytics

## Product Analytics

PostHog

Track:

- Roasts generated
- Most roasted repositories
- Share events

Never collect unnecessary user data.

---

# Error Monitoring

## Monitoring

Sentry

Track:

- API failures
- GitHub errors
- AI generation failures

---

# Environment Variables

Required:

```env
GEMINI_API_KEY=
GITHUB_TOKEN=
```

Optional:

```env
POSTHOG_KEY=
SENTRY_DSN=
DATABASE_URL=
REDIS_URL=
```

# Design System

Theme:

- Dark mode first
- Developer-focused
- GitHub-inspired

Characteristics:

- Clean
- Playful
- Modern
- Shareable

---

# Performance Targets

Homepage load:

- Under 2 seconds

Roast generation:s

- Under 10 second

API responses:

- Under 3 seconds when possible

---

# Non-Goals

Do NOT introduce:

- Microservices
- Kubernetes
- GraphQL
- Multiple databases
- Complex event systems
- Message brokers

RoastMyGitHub is a small AI product.

Keep the architecture small until growth demands otherwise.
