/**
 * Feedback Lambda — stores and aggregates page helpfulness votes.
 * POST /api/feedback  { page_id, helpful: bool, comment?: string }
 * GET  /api/feedback?page_id=<id>  → { helpful, not_helpful, total }
 */
import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb'
import { randomUUID } from 'crypto'

const db = new DynamoDBClient({})
const TABLE_NAME = process.env.TABLE_NAME

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
}

export async function handler(event) {
  const method = event.requestContext?.http?.method ?? 'GET'

  if (method === 'GET') {
    const page_id = event.queryStringParameters?.page_id
    if (!page_id) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'page_id required' }) }
    }

    const result = await db.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'page_id = :pid',
      ExpressionAttributeValues: { ':pid': { S: page_id } },
      ProjectionExpression: 'helpful',
    }))

    const items = result.Items ?? []
    const helpful = items.filter(i => i.helpful?.BOOL === true).length
    const not_helpful = items.length - helpful

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ helpful, not_helpful, total: items.length }),
    }
  }

  if (method === 'POST') {
    const body = JSON.parse(event.body ?? '{}')
    const { page_id, helpful, comment = '' } = body

    if (!page_id || typeof helpful !== 'boolean') {
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({ error: 'page_id and helpful (boolean) are required' }),
      }
    }

    await db.send(new PutItemCommand({
      TableName: TABLE_NAME,
      Item: {
        page_id:    { S: page_id },
        id:         { S: randomUUID() },
        helpful:    { BOOL: helpful },
        comment:    { S: comment.slice(0, 1000) },
        created_at: { S: new Date().toISOString() },
      },
    }))

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ ok: true }),
    }
  }

  return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) }
}
