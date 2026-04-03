# Utopia Genie — Design Spec

## Overview
Utopia Genie is an internal launcher page for the SEO Website System. Non-technical team members (exec, interns, officemates) type what website they want, attach brand images, and submit. The system saves everything to a project folder, ready for the agent pipeline to run in Claude Code.

## Users
- Internal team only — no login required
- Non-technical users with no coding background
- Anyone with access to the local URL

## UX Summary
Single page, single screen, no navigation. Dark theme, centered layout. One free-form text area + file attachments + "Make a Wish" submit button.

---

## Tech Stack
- **Next.js** (App Router) — matching the admin panel pattern
- **Tailwind CSS 4** — matching existing projects
- **TypeScript**
- **No database** — saves directly to filesystem
- **No auth** — open to anyone with the URL

## Location
```
projects/genie/
  app/
  components/
  public/
  package.json
  ...
```

---

## Page Design

### Theme
- Dark background: deep gradient (`#0f0c29` → `#302b63` → `#24243e`)
- Accent color: purple/violet (`#7c3aed` → `#a855f7`)
- Text: white/light purple tones
- Centered layout, vertically and horizontally

### Components

**Header:**
- Genie emoji (🧞) + "Utopia Genie" title
- Subtitle: "What website do you want to create today?"

**Text area:**
- Large, auto-expanding textarea
- Dark translucent background (`rgba(255,255,255,0.08)`)
- Subtle border (`rgba(255,255,255,0.12)`)
- Rounded corners (12px)
- Placeholder text with example prompt:
  > "I want to create a website for renting wheelchairs in Malaysia. The brand is WheelCare, domain wheelcare.my. Target cities: KL, PJ, Shah Alam..."

**File upload:**
- Below the text area
- Drag-and-drop zone + click to browse
- Dashed border, subtle styling
- Accepted file types: `.png`, `.jpg`, `.jpeg`, `.svg`, `.webp`, `.pdf`
- Uploaded files shown as chips with filename + remove (✕) button
- Thumbnail preview for images

**Submit button:**
- "✨ Make a Wish" label
- Purple gradient background (`#7c3aed` → `#a855f7`)
- Rounded (10px), bold text
- Hover: slight brightness increase
- Disabled state while submitting

**Success state:**
- After submit, button area transforms to success message
- Shows: "Wish granted! Project created at `projects/{slug}/`"
- Option to "Make another wish" (reset form)

---

## Submit Behavior

### 1. Slug input
- A small text field appears below the textarea labelled "Project name (slug)"
- Placeholder: `e.g. wheelchair-malaysia`
- User types the slug manually — keeps it simple and predictable
- Auto-formats to lowercase, replaces spaces with hyphens
- Required field — form cannot submit without it

### 2. API route: `POST /api/create-project`

**Request body:**
```json
{
  "prompt": "I want to create a website for...",
  "slug": "wheelchair-malaysia",
  "files": [/* uploaded file data */]
}
```

**Actions:**
1. Create directory: `../../projects/{slug}/`
2. Write `inputs.md` with the prompt text + metadata (timestamp, slug)
3. Create `brand_assets/` subdirectory inside the project folder
4. Save uploaded files to `projects/{slug}/brand_assets/`

**Response:**
```json
{
  "success": true,
  "projectPath": "projects/wheelchair-malaysia/",
  "filesCount": 3
}
```

### 3. inputs.md format
```markdown
# {Slug} — Project Inputs

**Created:** {timestamp}
**Slug:** {slug}

## Prompt
{full prompt text}

## Brand Assets
- logo.png
- product-photo.jpg
- ...
```

---

## File Structure
```
projects/genie/
  app/
    page.tsx              ← Main page (centered form)
    layout.tsx            ← Root layout (dark theme, fonts)
    globals.css           ← Dark theme styles
    api/
      create-project/
        route.ts          ← POST endpoint to create project folder
  components/
    GenieForm.tsx         ← Client component: textarea + file upload + submit
    FileUpload.tsx        ← Drag-and-drop file upload with preview chips
  public/
  package.json
  tsconfig.json
  next.config.ts
  postcss.config.mjs
  tailwind.config.ts
```

---

## What This Does NOT Do
- Does not run the agent pipeline (manual step in Claude Code)
- Does not require login or authentication
- Does not store data in Supabase
- Does not have multiple pages or routing
- Does not parse the prompt into structured fields (that's the orchestrator's job)

---

## Future Improvements (not in v1)
- Auto-trigger agent pipeline on submit
- Live progress indicator as agents complete
- History of previous wishes/projects
- Prompt templates for common website types
