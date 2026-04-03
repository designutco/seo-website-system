import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ deployUrl: null, localUrl: null })
  }

  const repoRoot = path.resolve(process.cwd(), '..')
  const projectDir = path.join(repoRoot, 'projects', slug)

  // Check for Vercel deploy URL (written by Layla after deployment)
  let deployUrl: string | null = null
  try {
    deployUrl = (await readFile(path.join(projectDir, 'deploy-url.txt'), 'utf-8')).trim()
  } catch {
    // Not deployed yet
  }

  // Check for localhost URL (written by dev server or agent during build)
  let localUrl: string | null = null
  try {
    localUrl = (await readFile(path.join(projectDir, 'local-url.txt'), 'utf-8')).trim()
    // Verify localhost is actually reachable
    const res = await fetch(localUrl, { method: 'HEAD', signal: AbortSignal.timeout(2000) }).catch(() => null)
    if (!res || !res.ok) {
      localUrl = null // Server not running, ignore stale file
    }
  } catch {
    // No local URL file
  }

  return NextResponse.json({ deployUrl, localUrl })
}
