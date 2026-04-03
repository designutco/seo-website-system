import { NextResponse } from 'next/server'
import { readdir, readFile, stat } from 'fs/promises'
import path from 'path'

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

        // Check for deploy-url.txt and local-url.txt
        let deployUrl: string | null = null
        let localUrl: string | null = null
        try {
          deployUrl = (await readFile(path.join(projectsDir, entry, 'deploy-url.txt'), 'utf-8')).trim()
        } catch { /* not deployed */ }
        try {
          localUrl = (await readFile(path.join(projectsDir, entry, 'local-url.txt'), 'utf-8')).trim()
        } catch { /* no local */ }

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
