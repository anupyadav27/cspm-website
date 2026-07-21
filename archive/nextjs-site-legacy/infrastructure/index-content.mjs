#!/usr/bin/env node
/**
 * Docs search indexer — parses every markdown file under src/content/docs/
 * and writes a searchable record to DynamoDB.
 *
 * Run after `sam deploy` with the correct environment:
 *   SEARCH_TABLE=cspm-docs-search AWS_REGION=ap-south-1 node infrastructure/index-content.mjs
 */
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'
import { fileURLToPath } from 'url'
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT      = join(__dirname, '..')
const DOCS_DIR  = join(ROOT, 'src', 'content', 'docs')
const TABLE     = process.env.SEARCH_TABLE ?? 'cspm-docs-search'
const REGION    = process.env.AWS_REGION   ?? 'ap-south-1'

const db = new DynamoDBClient({ region: REGION })

// ── Text helpers ─────────────────────────────────────────────────────────────

function stripMarkdown(text) {
  return text
    .replace(/^---[\s\S]*?---/m, '')               // frontmatter
    .replace(/```[\s\S]*?```/g, ' ')               // fenced code blocks
    .replace(/`[^`]+`/g, ' ')                      // inline code
    .replace(/<[^>]+>/g, ' ')                      // HTML tags
    .replace(/!\[.*?\]\(.*?\)/g, ' ')              // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')       // links → text only
    .replace(/^#{1,6}\s+/gm, '')                   // headings
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1') // bold/italic
    .replace(/^\s*[-*+>]\s+/gm, '')               // list items / blockquotes
    .replace(/^\s*\|.*\|.*$/gm, '')               // table rows
    .replace(/\n{2,}/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .toLowerCase()
}

function extractTitle(raw) {
  const m = raw.match(/^#\s+(.+)$/m)
  return m ? m[1].replace(/<[^>]+>/g, '').trim() : 'Untitled'
}

function extractExcerpt(raw, maxLen = 220) {
  const clean = stripMarkdown(raw).replace(/\s+/g, ' ')
  const first = clean.split(/\.\s+/).find(s => s.length > 40) ?? clean
  const text  = first.slice(0, maxLen).trim()
  return text.length === maxLen ? text + '…' : text
}

// ── File walker ──────────────────────────────────────────────────────────────

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (entry.endsWith('.md'))   out.push(full)
  }
  return out
}

function slugFromPath(filePath) {
  return relative(DOCS_DIR, filePath).replace(/\.md$/, '').replace(/\\/g, '/')
}

function urlFromSlug(slug) {
  if (slug === 'index' || slug === 'README') return '/docs/'
  return `/docs/${slug}/`
}

// ── Main ─────────────────────────────────────────────────────────────────────

const files = walk(DOCS_DIR)
console.log(`Indexing ${files.length} docs pages into DynamoDB table "${TABLE}"…\n`)

let indexed = 0
let failed  = 0

for (const file of files) {
  const raw     = readFileSync(file, 'utf8')
  const slug    = slugFromPath(file)
  const title   = extractTitle(raw)
  const excerpt = extractExcerpt(raw)
  const content = stripMarkdown(raw)
  const url     = urlFromSlug(slug)

  try {
    await db.send(new PutItemCommand({
      TableName: TABLE,
      Item: {
        page_id:    { S: slug },
        title:      { S: title },
        excerpt:    { S: excerpt },
        content:    { S: content },
        url:        { S: url },
        updated_at: { S: new Date().toISOString() },
      },
    }))
    console.log(`  ✓  ${slug}`)
    indexed++
  } catch (err) {
    console.error(`  ✗  ${slug} — ${err.message}`)
    failed++
  }
}

console.log(`\nDone: ${indexed} indexed, ${failed} failed.`)
if (failed > 0) process.exit(1)
