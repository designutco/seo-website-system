import { NextRequest, NextResponse } from 'next/server'
import { readFile, access } from 'fs/promises'
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

/**
 * Check if a localhost URL is actually reachable.
 */
async function isReachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(2000) })
    return res.ok
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ deployUrl: null, localUrl: null })
  }

  const repoRoot = path.resolve(process.cwd(), '..')
  const projectDir = path.join(repoRoot, 'projects', slug)

  // Check for Vercel deploy URL:
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

  // Check for localhost URL:
  // 1. Try local-url.txt first (explicit override)
  // 2. Fall back to auto-detecting port from package.json dev script
  // 3. If package.json port isn't reachable, scan common dev ports
  let localUrl: string | null = null
  try {
    localUrl = (await readFile(path.join(projectDir, 'local-url.txt'), 'utf-8')).trim()
  } catch {
    // No explicit local-url.txt — auto-detect from package.json
    try {
      await access(path.join(projectDir, 'package.json'))
      const port = await getDevPort(projectDir)
      localUrl = `http://localhost:${port}`
    } catch {
      // No package.json either
    }
  }

  // Verify localhost is actually reachable
  if (localUrl && !(await isReachable(localUrl))) {
    localUrl = null
  }

  return NextResponse.json({ deployUrl, localUrl })
}
