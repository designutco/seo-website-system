# Utopia Genie Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build "Utopia Genie" — a dark-themed internal launcher page where non-technical users type a website idea, attach brand files, and submit to create a project folder ready for the agent pipeline.

**Architecture:** Single-page Next.js app at `projects/genie/`. Client component handles the form (textarea + file upload + slug input). Server API route at `/api/create-project` receives the submission and writes `inputs.md` + brand assets to `projects/{slug}/`. No auth, no database.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript 5

---

## File Map

```
projects/genie/
  app/
    page.tsx              ← Server page, renders GenieForm
    layout.tsx            ← Root layout (dark theme, Inter + Sora fonts)
    globals.css           ← Dark gradient theme, CSS variables
    api/
      create-project/
        route.ts          ← POST handler: creates project folder, writes inputs.md, saves files
  components/
    GenieForm.tsx         ← Client component: textarea + slug input + file upload + submit + success state
    FileUpload.tsx        ← Client component: drag-and-drop zone + file chips with previews
  package.json
  tsconfig.json
  next.config.ts
  postcss.config.mjs
```

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create: `projects/genie/package.json`
- Create: `projects/genie/tsconfig.json`
- Create: `projects/genie/next.config.ts`
- Create: `projects/genie/postcss.config.mjs`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "utopia-genie",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "16.2.1",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

Note: Port 3001 to avoid conflict with other projects on 3000.

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts", "**/*.mts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create next.config.ts**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 4: Create postcss.config.mjs**

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 5: Install dependencies**

Run: `cd projects/genie && npm install`
Expected: `node_modules/` created, no errors

- [ ] **Step 6: Commit**

```bash
git add projects/genie/package.json projects/genie/tsconfig.json projects/genie/next.config.ts projects/genie/postcss.config.mjs projects/genie/package-lock.json
git commit -m "feat(genie): scaffold Next.js project"
```

---

### Task 2: Dark theme layout and styles

**Files:**
- Create: `projects/genie/app/globals.css`
- Create: `projects/genie/app/layout.tsx`

- [ ] **Step 1: Create globals.css**

```css
@import "tailwindcss";

:root {
  --bg-start: #0f0c29;
  --bg-mid: #302b63;
  --bg-end: #24243e;
  --accent: #7c3aed;
  --accent-light: #a855f7;
  --text-primary: #ffffff;
  --text-secondary: #c9a0ff;
  --text-muted: #8b7bac;
  --input-bg: rgba(255, 255, 255, 0.08);
  --input-border: rgba(255, 255, 255, 0.12);
  --input-border-focus: rgba(168, 85, 247, 0.5);
  --font-inter: 'Inter', sans-serif;
  --font-sora: 'Sora', sans-serif;
}

body {
  background: linear-gradient(135deg, var(--bg-start), var(--bg-mid), var(--bg-end));
  color: var(--text-primary);
  font-family: var(--font-inter);
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}
```

- [ ] **Step 2: Create layout.tsx**

```tsx
import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', weight: ['600', '700'] })

export const metadata: Metadata = {
  title: 'Utopia Genie',
  description: 'What website do you want to create today?',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-screen flex items-center justify-center p-4">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add projects/genie/app/globals.css projects/genie/app/layout.tsx
git commit -m "feat(genie): add dark theme layout and styles"
```

---

### Task 3: FileUpload component

**Files:**
- Create: `projects/genie/components/FileUpload.tsx`

- [ ] **Step 1: Create FileUpload.tsx**

```tsx
'use client'

import { useRef, useState, useCallback } from 'react'

interface FileUploadProps {
  files: File[]
  onFilesChange: (files: File[]) => void
}

const ACCEPTED_TYPES = [
  'image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'application/pdf',
]

export default function FileUpload({ files, onFilesChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return
    const valid = Array.from(newFiles).filter(f => ACCEPTED_TYPES.includes(f.type))
    onFilesChange([...files, ...valid])
  }, [files, onFilesChange])

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
        style={{
          border: `1.5px dashed ${dragOver ? 'var(--accent-light)' : 'var(--input-border)'}`,
          borderRadius: 10,
          padding: '12px 16px',
          cursor: 'pointer',
          background: dragOver ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
          transition: 'border-color 0.2s, background 0.2s',
          fontSize: 13,
          color: 'var(--text-muted)',
        }}
      >
        📎 Drop files or click to upload (images, PDF)
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.svg,.webp,.pdf"
          onChange={(e) => addFiles(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>

      {files.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(124, 58, 237, 0.15)',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                borderRadius: 8,
                padding: '5px 10px',
                fontSize: 12,
                color: 'var(--accent-light)',
              }}
            >
              {file.type.startsWith('image/') && (
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  style={{ width: 18, height: 18, borderRadius: 3, objectFit: 'cover' }}
                />
              )}
              <span>{file.name}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 12,
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add projects/genie/components/FileUpload.tsx
git commit -m "feat(genie): add FileUpload component with drag-and-drop"
```

---

### Task 4: GenieForm component

**Files:**
- Create: `projects/genie/components/GenieForm.tsx`

- [ ] **Step 1: Create GenieForm.tsx**

```tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import FileUpload from './FileUpload'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function GenieForm() {
  const [prompt, setPrompt] = useState('')
  const [slug, setSlug] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [state, setState] = useState<FormState>('idle')
  const [projectPath, setProjectPath] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [prompt])

  const formatSlug = (value: string) => {
    return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  const handleSubmit = async () => {
    if (!prompt.trim() || !slug.trim()) return
    setState('submitting')
    setErrorMsg('')

    const formData = new FormData()
    formData.append('prompt', prompt)
    formData.append('slug', formatSlug(slug))
    files.forEach((file) => formData.append('files', file))

    try {
      const res = await fetch('/api/create-project', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        setState('success')
        setProjectPath(data.projectPath)
      } else {
        setState('error')
        setErrorMsg(data.error || 'Something went wrong')
      }
    } catch {
      setState('error')
      setErrorMsg('Failed to connect to server')
    }
  }

  const reset = () => {
    setPrompt('')
    setSlug('')
    setFiles([])
    setState('idle')
    setProjectPath('')
    setErrorMsg('')
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: 12,
    padding: 16,
    color: 'var(--text-primary)',
    fontSize: 15,
    lineHeight: 1.6,
    outline: 'none',
    resize: 'none' as const,
    fontFamily: 'var(--font-inter)',
  }

  return (
    <div style={{ width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <textarea
        ref={textareaRef}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="I want to create a website for renting wheelchairs in Malaysia. The brand is WheelCare, domain wheelcare.my. Target cities: KL, PJ, Shah Alam..."
        rows={4}
        style={{ ...inputStyle, minHeight: 120 }}
        disabled={state === 'submitting' || state === 'success'}
      />

      <input
        type="text"
        value={slug}
        onChange={(e) => setSlug(formatSlug(e.target.value))}
        placeholder="Project name (slug), e.g. wheelchair-malaysia"
        style={{ ...inputStyle, borderRadius: 10, padding: '10px 16px', fontSize: 14 }}
        disabled={state === 'submitting' || state === 'success'}
      />

      <FileUpload files={files} onFilesChange={setFiles} />

      {state === 'success' ? (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          <div style={{ color: '#4ade80', fontSize: 15, fontWeight: 600 }}>
            Wish granted! Project created at <code style={{ background: 'rgba(74, 222, 128, 0.1)', padding: '2px 8px', borderRadius: 6 }}>{projectPath}</code>
          </div>
          <button
            onClick={reset}
            style={{
              background: 'transparent',
              border: '1px solid var(--input-border)',
              borderRadius: 10,
              padding: '10px 24px',
              color: 'var(--text-muted)',
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'var(--font-inter)',
            }}
          >
            Make another wish
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || !slug.trim() || state === 'submitting'}
            style={{
              background: (!prompt.trim() || !slug.trim())
                ? 'rgba(124, 58, 237, 0.3)'
                : 'linear-gradient(135deg, var(--accent), var(--accent-light))',
              border: 'none',
              borderRadius: 10,
              padding: '12px 32px',
              color: 'white',
              fontSize: 15,
              fontWeight: 600,
              cursor: (!prompt.trim() || !slug.trim()) ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-sora)',
              opacity: state === 'submitting' ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {state === 'submitting' ? 'Creating...' : '✨ Make a Wish'}
          </button>
          {state === 'error' && (
            <div style={{ color: '#f87171', fontSize: 13, textAlign: 'center' }}>{errorMsg}</div>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add projects/genie/components/GenieForm.tsx
git commit -m "feat(genie): add GenieForm component with textarea, slug input, file upload, submit"
```

---

### Task 5: Main page

**Files:**
- Create: `projects/genie/app/page.tsx`

- [ ] **Step 1: Create page.tsx**

```tsx
import GenieForm from '@/components/GenieForm'

export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      width: '100%',
      maxWidth: 600,
    }}>
      <div style={{ fontSize: 48, marginBottom: 4 }}>🧞</div>
      <h1 style={{
        fontFamily: 'var(--font-sora)',
        fontSize: 28,
        fontWeight: 700,
        color: 'var(--text-secondary)',
        letterSpacing: '-0.5px',
        margin: 0,
      }}>
        Utopia Genie
      </h1>
      <p style={{
        color: 'var(--text-muted)',
        fontSize: 14,
        marginBottom: 16,
      }}>
        What website do you want to create today?
      </p>
      <GenieForm />
    </main>
  )
}
```

- [ ] **Step 2: Verify the page renders**

Run: `cd projects/genie && npm run dev`
Open: `http://localhost:3001`
Expected: Dark page with genie emoji, title, textarea, slug input, file upload zone, and disabled "Make a Wish" button.

- [ ] **Step 3: Commit**

```bash
git add projects/genie/app/page.tsx
git commit -m "feat(genie): add main page with header and GenieForm"
```

---

### Task 6: API route to create project folder

**Files:**
- Create: `projects/genie/app/api/create-project/route.ts`

- [ ] **Step 1: Create route.ts**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const prompt = formData.get('prompt') as string
    const slug = formData.get('slug') as string
    const files = formData.getAll('files') as File[]

    if (!prompt || !slug) {
      return NextResponse.json({ success: false, error: 'Prompt and slug are required' }, { status: 400 })
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ success: false, error: 'Slug must be lowercase letters, numbers, and hyphens only' }, { status: 400 })
    }

    // Resolve project path relative to the repo root (genie lives at projects/genie/)
    const repoRoot = path.resolve(process.cwd(), '..', '..')
    const projectDir = path.join(repoRoot, 'projects', slug)
    const brandAssetsDir = path.join(projectDir, 'brand_assets')

    // Create directories
    await mkdir(brandAssetsDir, { recursive: true })

    // Build inputs.md content
    const timestamp = new Date().toISOString()
    const fileNames = files.filter(f => f.size > 0).map(f => f.name)
    const assetsSection = fileNames.length > 0
      ? fileNames.map(name => `- ${name}`).join('\n')
      : '- (none attached)'

    const inputsMd = `# ${slug} — Project Inputs

**Created:** ${timestamp}
**Slug:** ${slug}

## Prompt
${prompt}

## Brand Assets
${assetsSection}
`

    // Write inputs.md
    await writeFile(path.join(projectDir, 'inputs.md'), inputsMd, 'utf-8')

    // Save uploaded files to brand_assets/
    for (const file of files) {
      if (file.size === 0) continue
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(path.join(brandAssetsDir, file.name), buffer)
    }

    return NextResponse.json({
      success: true,
      projectPath: `projects/${slug}/`,
      filesCount: fileNames.length,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
```

- [ ] **Step 2: Test the full flow end-to-end**

Run: `cd projects/genie && npm run dev`
Open: `http://localhost:3001`

1. Type a prompt: "I want to create a website for selling helmets in Malaysia"
2. Type a slug: "helmet-malaysia"
3. Attach an image file
4. Click "Make a Wish"

Expected:
- Success message: "Wish granted! Project created at `projects/helmet-malaysia/`"
- Verify folder exists: `ls projects/helmet-malaysia/`
- Verify inputs.md: `cat projects/helmet-malaysia/inputs.md`
- Verify brand_assets: `ls projects/helmet-malaysia/brand_assets/`

- [ ] **Step 3: Commit**

```bash
git add projects/genie/app/api/create-project/route.ts
git commit -m "feat(genie): add API route to create project folder with inputs.md and brand assets"
```

---

### Task 7: Final verification and cleanup

- [ ] **Step 1: Test the reset flow**

After a successful submission, click "Make another wish". Verify the form resets — textarea empty, slug empty, no files, button back to "Make a Wish".

- [ ] **Step 2: Test error handling**

1. Try submitting with empty prompt — button should be disabled
2. Try submitting with empty slug — button should be disabled
3. Submit with a slug that already exists as a project — should still work (mkdir recursive)

- [ ] **Step 3: Clean up test project**

Delete the test project folder created during testing:
```bash
rm -rf projects/helmet-malaysia
```

- [ ] **Step 4: Final commit**

```bash
git add -A projects/genie/
git commit -m "feat(genie): Utopia Genie launcher — complete v1"
```
