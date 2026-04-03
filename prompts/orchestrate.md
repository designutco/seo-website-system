# Orchestrator Guide

This guide explains how to run the SEO Website System agent team using Claude's Agent tool. Each agent is a real subagent spawned as a separate subprocess — not role-playing in the same session.

## How to spawn an agent

Use the Agent tool with the contents of the agent's `.md` file as the prompt. Pass all required inputs inline.

```
Agent tool:
  prompt: [contents of agents/alpha.md] + [your project inputs]
```

The agent runs independently, completes its task, and returns its output to you. You then pass that output as input to the next agent.

## Agent execution order

Run agents in this sequence. Some can run in parallel (marked ∥).

```
Step 1:  Alpha  — System architecture (confirms languages with user)

Step 2:  Cyclops — Supabase schema       (needs: Alpha's output)
         ∥ Sora  — SEO plan              (needs: Alpha's output)

Step 3:  Nana   — Homepage + location copy (needs: Alpha + Sora's output + locations list)

Step 4:  Kagura — UI design direction     (needs: Alpha + Nana's output + existing site screenshots)
         ∥ Kimmy — Technical SEO + i18n + WhatsApp redirect (needs: Alpha + Sora + Nana's output)

── user confirms design ──

Step 5:  Layla  — Integration test → GitHub push → Vercel deploy
```

Steps 2 agents (Cyclops + Sora) can run in parallel after Alpha.
Step 4 agents (Kagura + Kimmy) can run in parallel after Nana.

## What to pass each agent

| Agent   | Required inputs |
|---------|----------------|
| Alpha   | Product name/slug, domain, target country, locations list, languages, special requirements |
| Cyclops | Alpha's architecture doc, locations list |
| Sora    | Alpha's architecture doc, product name, locations list, languages |
| Nana    | Alpha's doc, Sora's SEO plan, product description, brand tone, full locations list, supported locales |
| Kagura  | Alpha's doc, Nana's homepage copy, brand assets, existing site screenshots, product type, target audience, reference images (if any) |
| Kimmy   | Alpha's doc, Sora's plan, Nana's homepage copy, Nana's location copy, confirmed languages, domain, existing codebase state |
| Layla   | Completed website project, Supabase credentials, GitHub repo URL, Vercel project details |

## Collecting outputs

After each agent completes, save its output to the project folder:

```
projects/{project-name}/
  architecture.md          ← Alpha's output
  database.md              ← Cyclops's output
  seo-plan.md              ← Sora's output
  copy-homepage.md         ← Nana's output (homepage)
  copy-locations.md        ← Nana's output (location pages)
  design-direction.md      ← Kagura's output (UI design)
  technical-seo-i18n.md    ← Kimmy's output (SEO + i18n)
```

Layla does not produce a document — she runs integration tests, pushes to GitHub, and deploys to Vercel.

## Parallelism

When spawning parallel agents, send both Agent tool calls in a single message. Do not wait for one to finish before starting the other when inputs are independent.

## Applying outputs to the codebase

After all agents complete (before Layla), apply their outputs to the project codebase:
1. Cyclops's SQL → run in Supabase SQL editor
2. Kagura's design direction → follow when building frontend components and pages
3. Kimmy's metadata + schema → paste into Next.js page files
4. Kimmy's i18n files → write `i18n/routing.ts`, `i18n/request.ts`, `middleware.ts`, `messages/*.json`, `LanguageSwitcher.tsx`
5. Kimmy's WhatsApp redirect → write `app/[locale]/redirect-whatsapp-1/page.tsx` + `RedirectClient.tsx`
6. Nana's location copy → populate `lib/locationCopy.ts`

Then get user confirmation on the design before running Layla.
