import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'src/content')

export function getAllSlugs(): string[][] {
  const slugs: string[][] = []

  function walk(dir: string, parts: string[]) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), [...parts, entry.name])
      } else if (entry.name.endsWith('.md')) {
        const slug = entry.name === 'index.md' ? parts : [...parts, entry.name.replace(/\.md$/, '')]
        slugs.push(slug)
      }
    }
  }

  walk(CONTENT_DIR, [])
  return slugs
}

export function getDoc(slug: string[]) {
  const filePath = path.join(CONTENT_DIR, ...slug) + '.md'
  const indexPath = path.join(CONTENT_DIR, ...slug, 'index.md')

  let raw: string
  try {
    raw = fs.readFileSync(filePath, 'utf8')
  } catch {
    try {
      raw = fs.readFileSync(indexPath, 'utf8')
    } catch {
      return null
    }
  }

  const { content, data } = matter(raw)
  return { content, meta: data as Record<string, string> }
}

export function getRootDoc() {
  try {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, 'README.md'), 'utf8')
    const { content, data } = matter(raw)
    return { content, meta: data as Record<string, string> }
  } catch {
    return null
  }
}
