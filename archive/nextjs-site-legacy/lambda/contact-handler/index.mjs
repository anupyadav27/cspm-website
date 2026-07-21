/**
 * Lambda handler — receives contact and demo-request form submissions.
 * Saves to DynamoDB and sends email via SES.
 *
 * Environment variables:
 *   TABLE_NAME      — DynamoDB table name
 *   FROM_EMAIL      — SES verified sender address (default: sales@lgtech.in)
 *   NOTIFY_EMAIL    — internal address to receive notifications (default: anup.yadav@lgtech.in)
 */
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { SESClient, SendEmailCommand }    from '@aws-sdk/client-ses'
import { randomUUID } from 'crypto'

const db  = new DynamoDBClient({})
const ses = new SESClient({})

export async function handler(event) {
  const body = JSON.parse(event.body ?? '{}')

  const {
    type = 'contact',
    name, email, company, message, note, concern,
    clouds = [],
  } = body

  if (!email || !name) {
    return { statusCode: 400, body: JSON.stringify({ error: 'name and email are required' }) }
  }

  const id = randomUUID()
  const ts = new Date().toISOString()

  // Persist to DynamoDB
  await db.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: {
      id:       { S: id },
      type:     { S: type },
      email:    { S: email },
      name:     { S: name },
      company:  { S: company ?? '' },
      message:  { S: message ?? note ?? '' },
      concern:  { S: concern ?? '' },
      clouds:   { S: clouds.join(', ') },
      created:  { S: ts },
    },
  }))

  // Send notification email
  const subject = type === 'demo_request'
    ? `[Onam] New demo request — ${name} @ ${company}`
    : `[Onam] New contact — ${name} @ ${company}`

  const textBody = [
    `Type:    ${type}`,
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Company: ${company}`,
    `Clouds:  ${clouds.join(', ')}`,
    `Concern: ${concern}`,
    `Message: ${message ?? note}`,
    `Time:    ${ts}`,
  ].join('\n')

  const fromEmail   = process.env.FROM_EMAIL    || 'sales@lgtech.in'
  const notifyEmail = process.env.NOTIFY_EMAIL  || 'anup.yadav@lgtech.in'

  await ses.send(new SendEmailCommand({
    Source: fromEmail,
    Destination: { ToAddresses: [notifyEmail] },
    Message: {
      Subject: { Data: subject },
      Body:    { Text: { Data: textBody } },
    },
  }))

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ok: true, id }),
  }
}
