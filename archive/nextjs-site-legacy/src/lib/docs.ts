import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'

const DOCS_DIR = path.join(process.cwd(), 'src/content/docs')

export interface DocHeading {
  id: string
  text: string
  level: number
}

export interface Doc {
  slug: string[]
  title: string
  description?: string
  content: string
  headings: DocHeading[]
}

export function getAllDocSlugs(): string[][] {
  return collectSlugs(DOCS_DIR, [])
}

function collectSlugs(dir: string, prefix: string[]): string[][] {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const slugs: string[][] = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      slugs.push(...collectSlugs(path.join(dir, entry.name), [...prefix, entry.name]))
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      const base = entry.name.replace(/\.(md|mdx)$/, '')
      slugs.push(base === 'index' || base === 'README' ? prefix : [...prefix, base])
    }
  }

  return slugs
}

export async function getDoc(slugParts: string[]): Promise<Doc | null> {
  const candidates = [
    path.join(DOCS_DIR, ...slugParts) + '.md',
    path.join(DOCS_DIR, ...slugParts, 'index.md'),
    path.join(DOCS_DIR, 'README.md'),
  ]

  const filePath = candidates.find(p => fs.existsSync(p))
  if (!filePath) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content)

  // Strip the first <h1> from rendered HTML — the page template renders doc.title as H1 already
  const html = String(processed).replace(/^<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '')

  // Extract headings for table of contents
  const headings: DocHeading[] = []
  const headingRe = /<h([23])\s[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/h\1>/g
  let m
  while ((m = headingRe.exec(html)) !== null) {
    headings.push({
      level: parseInt(m[1]),
      id: m[2],
      text: decodeHtmlEntities(m[3].replace(/<[^>]+>/g, '')).trim(),
    })
  }

  const title = (data.title as string | undefined) || extractH1(content)

  return { slug: slugParts, title, description: data.description, content: html, headings }
}

function extractH1(markdown: string): string {
  const m = markdown.match(/^#\s+(.+)$/m)
  return m ? m[1] : 'Documentation'
}

// Decode the HTML entities that the markdown renderer emits for special chars
// (& → &#x26;, < → &#x3C;, > → &#x3E;, " → &#x22;, ' → &#x27;, etc.)
// so the right-rail TOC and other plain-text consumers see readable headings.
function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
}
