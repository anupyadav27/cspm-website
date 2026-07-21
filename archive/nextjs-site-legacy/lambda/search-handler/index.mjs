/**
 * Search Lambda — keyword search over the DynamoDB docs search index.
 * GET /api/search?q=<query>
 * Returns up to 10 results ranked by term frequency.
 */
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'

const db = new DynamoDBClient({})
const TABLE_NAME = process.env.TABLE_NAME

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
}

export async function handler(event) {
  const q = (event.queryStringParameters?.q ?? '').trim().toLowerCase()

  if (q.length < 2) {
    return {
      statusCode: 400,
      headers: CORS,
      body: JSON.stringify({ error: 'q must be at least 2 characters' }),
    }
  }

  const terms = q.split(/\s+/).filter(t => t.length >= 2).slice(0, 5)

  // Build a filter that requires ALL terms to appear in the content field
  const filterParts = terms.map((_, i) => `contains(#content, :t${i})`)
  const ExpressionAttributeValues = {}
  terms.forEach((term, i) => {
    ExpressionAttributeValues[`:t${i}`] = { S: term }
  })

  const result = await db.send(new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: filterParts.join(' AND '),
    ExpressionAttributeNames: { '#content': 'content' },
    ExpressionAttributeValues,
    ProjectionExpression: 'page_id, title, excerpt, #content, url',
  }))

  const results = (result.Items ?? [])
    .map(item => {
      const text = item.content?.S ?? ''
      // Score = total occurrences of all query terms in content
      const score = terms.reduce((acc, t) => acc + (text.split(t).length - 1), 0)
      return {
        page_id: item.page_id.S,
        title: item.title.S,
        excerpt: item.excerpt.S,
        url: item.url.S,
        score,
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(({ score, ...r }) => r)

  return {
    statusCode: 200,
    headers: CORS,
    body: JSON.stringify({ results, total: results.length }),
  }
}
