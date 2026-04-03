import { NextResponse } from 'next/server'
import { readdir, readFile, stat, access } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

/**
 * Extract the port from a project's package.json dev script.
 * Falls back to 3000 (Next.js default) if no --port flag is found.
 */
async function getDevPort(projectDir: string): Promise<number> {
  try {
    const pkg = JSON.parse(await readFile(path.join(projectDir, 'package.json'), 'utf-8'))
    const devScript: string = pkg?.scripts?.dev || ''
    const match = devScript.match(/--port\s+(\d+)/)
    if (match) return parseInt(match[1], 10)
  } catch {
    // No package.json or invalid JSON
  }
  return 3000
}

async function isReachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(2000) })
    return res.ok
  } catch {
    return false
  }
}

export async function GET() {
  try {
    const repoRoot = path.resolve(process.cwd(), '..')
    const projectsDir = path.join(repoRoot, 'projects')

    const entries = await readdir(projectsDir)
    const wishes = []

    for (const entry of entries) {
      const inputsPath = path.join(projectsDir, entry, 'inputs.md')
      try {
        const inputsStat = await stat(inputsPath)
        const content = await readFile(inputsPath, 'utf-8')

        // Extract prompt (first line after "## Prompt")
        const promptMatch = content.match(/## Prompt\n([\s\S]*?)(\n##|$)/)
        const prompt = promptMatch ? promptMatch[1].trim().slice(0, 120) : ''

        const projectDir = path.join(projectsDir, entry)

        // Check for deploy URL:
        // 1. Try deploy-url.txt first (explicit)
        // 2. Fall back to checking .vercel/project.json for Vercel project name
        let deployUrl: string | null = null
        try {
          deployUrl = (await readFile(path.join(projectDir, 'deploy-url.txt'), 'utf-8')).trim()
        } catch {
          try {
            const vercelProject = JSON.parse(
              await readFile(path.join(projectDir, '.vercel', 'project.json'), 'utf-8')
            )
            if (vercelProject.projectName) {
              const candidateUrl = `https://${vercelProject.projectName}.vercel.app`
              const res = await fetch(candidateUrl, { method: 'HEAD', signal: AbortSignal.timeout(3000) }).catch(() => null)
              if (res && (res.ok || res.status === 307 || res.status === 308)) {
                deployUrl = candidateUrl
              }
            }
          } catch { /* no vercel config */ }
        }

        // Check for local URL: local-url.txt first, then auto-detect from package.json
        let localUrl: string | null = null
        try {
          localUrl = (await readFile(path.join(projectDir, 'local-url.txt'), 'utf-8')).trim()
        } catch {
          try {
            await access(path.join(projectDir, 'package.json'))
            const port = await getDevPort(projectDir)
            localUrl = `http://localhost:${port}`
          } catch { /* no package.json */ }
        }

        // Verify localhost is actually reachable
        if (localUrl && !(await isReachable(localUrl))) {
          localUrl = null
        }

        const status = deployUrl ? 'deployed' : localUrl ? 'preview' : 'building'

        wishes.push({
          slug: entry,
          prompt,
          createdAt: inputsStat.mtime.toISOString(),
          status,
          deployUrl,
          localUrl,
        })
      } catch {
        // No inputs.md — skip (e.g. admin folder)
      }
    }

    // Sort newest first
    wishes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ wishes })
  } catch {
    return NextResponse.json({ wishes: [] })
  }
}
