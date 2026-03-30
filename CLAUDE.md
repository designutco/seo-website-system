# SEO Website System

# Project Overview

This project builds SEO-driven product websites using reusable architecture.

Primary example:
cpapmachine.my

Goals:

- Highlight products and services clearly
- Use strong SEO copywriting
- Generate dynamic location pages
- Store phone numbers in Supabase
- Allow multiple websites to share the same database
- Enable scalable generation of new SEO websites

The system should scale to:

- 100+ websites
- hundreds of location pages
- shared database infrastructure

## Directory Structure
- `agents/` — AI agent definitions and configurations
- `templates/` — Content and page templates
- `prompts/` — Prompt files for AI workflows
- `brand_assets/` — Brand assets (logos, colors, fonts, guidelines)
- `projects/` — Individual project files and outputs

## Conventions
- Keep prompts modular and reusable
- Store brand guidelines in `brand_assets/` before starting a project
- Each project gets its own subfolder under `projects/`


# Technology Stack

Frontend:
Next.js (App Router)

Styling:
Tailwind CSS

Database:
Supabase

Deployment:
Vercel


# Agent Team

Alpha — System Architect  
Designs the technical architecture.

Cyclops — Database Engineer  
Designs Supabase schema and database logic.

Sora — SEO Strategist  
Plans keyword structure, page hierarchy, and internal linking.

Nana — SEO Copywriter  
Writes website copy, product pages, and marketing content.

Fanny — Location Page Generator  
Generates location-based SEO pages.

Kimmy — Technical SEO Specialist
Handles metadata, schema markup, alt text, and SEO optimization.

Joy — Internationalisation (i18n) Specialist
Adds multilingual support, language switcher UI, and translated content. During architecture planning, Joy must ask which languages the website should support before proceeding.

Layla — Full Stack Developer
Builds centralized internal systems: (1) Phone Number Manager — CRUD admin for managing multiple phone numbers per website/product/location, with random rotation on WhatsApp button clicks; (2) Blog CMS — login-protected writing interface for blog writers, centralized across all websites. Both systems connect to the shared Supabase instance.


# Agent Workflow

Agents are real subagents spawned via the Claude Agent tool — each runs as a separate subprocess with its own context. They are NOT role-play personas in the same session.

## How to invoke an agent
Use the Agent tool. Pass the contents of the agent's `.md` file as the prompt, plus the required project inputs.

See `prompts/orchestrate.md` for the full invocation guide.
See `prompts/new-website.md` for the step-by-step new project workflow.

## Execution order

1. Alpha — design system architecture
   → Joy joins here: confirms target languages before architecture is finalised
2. Cyclops + Sora — run in parallel (both need Alpha's output)
3. Nana — generate website copy (needs Sora's SEO plan)
4. Fanny + Kimmy — run in parallel (both need Nana's copy)
5. Joy — implement i18n (if multilingual; needs Alpha + Nana + confirmed languages)


# SEO Rules

Every page must include:

- clear H1 heading structure
- keyword placement in headings
- meta title
- meta description
- image alt text
- schema markup when relevant
- internal links

Avoid duplicate content.

Location pages must have unique copy.


# Dynamic Location Pages

Location pages follow this structure:

/product/location

Example:

/cpap-machine/kuala-lumpur
/cpap-machine/petaling-jaya
/cpap-machine/shah-alam

Each page must include:

- unique introduction
- location-specific keywords
- FAQs
- call-to-action
- dynamic phone number from database


# Supabase Database Logic

Phone numbers are stored in Supabase.

Multiple phone numbers can exist per website+product+location combination. One is selected at random each time a user clicks a WhatsApp button.

Phone numbers must be mapped to:

- website
- product
- location

Example query logic (fetch all active numbers, pick one at random in code):

select phone_number
from phone_numbers
where website = 'oxihome.my'
and product_slug = 'oxygen-machine'
and location_slug = 'kuala-lumpur'
and is_active = true

Blog posts are also stored in Supabase, scoped by website, and managed through the centralized Blog CMS (built by Layla).


# Frontend Website Rules

## Always Do First
Invoke the `frontend-design` skill before writing any frontend code.

## Reference Images

If a reference image is provided:

- match layout exactly
- match spacing
- match typography
- match colors

Do not add or improve design.

If no reference image is provided:
design from scratch with high craft.

## Local Server

Always run the site on localhost.

Start the dev server:

node serve.mjs

Server runs at:

http://localhost:3000

Never screenshot file:/// URLs.

## Screenshot Workflow

Use Puppeteer to capture screenshots:

node screenshot.mjs http://localhost:3000

Screenshots are saved in:

temporary screenshots/

After screenshotting:

- compare with reference
- fix spacing differences
- fix typography differences
- fix color mismatches

Perform at least **two comparison rounds**.


# Output Defaults

Unless otherwise specified:

- Single index.html file
- Inline styles
- Tailwind CSS via CDN
- Placeholder images via https://placehold.co
- Mobile-first responsive


# Brand Assets

Always check the `brand_assets/` folder before designing.

If assets exist:

- use provided logos
- use provided color palettes
- use provided images

Do not replace real assets with placeholders.


# Anti-Generic Design Guardrails

## Colors
Never use default Tailwind blue or indigo.

Always choose custom brand colors.

## Shadows
Avoid flat shadows like shadow-md.

Use layered shadows with color tint.

## Typography

Do not use the same font for headings and body text.

Use:

display/serif font for headings  
clean sans font for body

Large headings should use tight tracking.

Body text should use generous line height.

## Gradients

Layer multiple gradients and depth effects.

## Animations

Animate only:

- transform
- opacity

Never use transition-all.

## Interactive States

Clickable elements must have:

- hover state
- focus state
- active state

## Images

Add gradient overlay to improve readability.

## Spacing

Use consistent spacing tokens.

## Depth

Design surfaces with layering:

base → elevated → floating