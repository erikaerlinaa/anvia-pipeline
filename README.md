# ai-pipeline

AI pipelines built with TypeScript using [Anvia](https://www.npmjs.com/package/@anvia/core) (`@anvia/core`, `@anvia/openai`, `@anvia/studio`).

This repo contains three separate, independent tasks. Each one is its own entrypoint under `src/`, with its own pipeline and its own prompt/service logic — they don't depend on each other.

## Setup

```bash
pnpm install
cp .env.example .env
# then fill in OPENAI_API_KEY (and OPENAI_BASE_URL if you're using an OpenAI-compatible provider like OpenRouter)
```

## Tasks

### 01 — Article Refiner Pipeline (`src/01-article-refiner-pipeline.ts`)

A linear 3-step pipeline that improves a draft article through self-critique:

```
draft -> critique -> rewrite
```

1. **Draft** — writes a first-pass article for the given topic.
2. **Critique** — reviews the draft and points out its weaknesses.
3. **Rewrite** — rewrites the draft, addressing the critique, into the final article.

Logic lives in `src/service.ts`.

```bash
pnpm tsx src/01-article-refiner-pipeline.ts
```

### 02 — Idea Review Board (`src/02-idea-review-board.ts`)

A fan-out / fan-in pipeline that reviews a startup pitch from three different perspectives at once, then merges the verdicts into one decision:

```
                 -> CEO branch     ->
pitch -> fan-out -> Analyst branch -> fan-in (merge) -> final verdict
                 -> CTO branch     ->
```

- Runs the CEO, Analyst, and CTO review branches in parallel against the same pitch.
- Merges all three verdicts into a single final board decision.

Instructions and review logic live in `src/service-idea-review.ts`.

```bash
pnpm tsx src/02-idea-review-board.ts
```

### 03 — Ticket Triage Router (`src/03-ticket-triage-router.ts`)

A 2-step pipeline that extracts structured data from free-text support tickets, then routes them by priority:

```
ticket text -> schema extraction -> route by priority
```

1. **Schema** — extracts typed ticket fields (e.g. priority) from raw ticket text behind a schema gate.
2. **Route** — routes the extracted ticket to the right queue/action based on its priority, in plain TypeScript.

Logic lives in `src/service-ticket-triage.ts`.

```bash
pnpm tsx src/03-ticket-triage-router.ts
```

## Project structure

```
src/
  01-article-refiner-pipeline.ts   # Task 1 entrypoint
  02-idea-review-board.ts          # Task 2 entrypoint
  03-ticket-triage-router.ts       # Task 3 entrypoint
  service.ts                       # Task 1 logic (draft/critique/rewrite)
  service-idea-review.ts           # Task 2 logic (role instructions + review)
  service-ticket-triage.ts         # Task 3 logic (extraction + routing)
  models.ts                        # Shared model/client setup
```
