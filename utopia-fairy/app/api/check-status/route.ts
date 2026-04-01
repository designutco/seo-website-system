import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ url: null })
  }

  // Layla writes the deploy URL to projects/{slug}/deploy-url.txt after deployment
  const repoRoot = path.resolve(process.cwd(), '..')
  const urlFile = path.join(repoRoot, 'projects', slug, 'deploy-url.txt')

  try {
    const url = (await readFile(urlFile, 'utf-8')).trim()
    return NextResponse.json({ url })
  } catch {
    // File doesn't exist yet — website not deployed
    return NextResponse.json({ url: null })
  }
}
