'use client'

import { useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_ENDPOINT ?? ''

export function DocsFeedback({ pageId }: { pageId: string }) {
  const [voted, setVoted]           = useState<boolean | null>(null)
  const [showComment, setShowComment] = useState(false)
  const [comment, setComment]       = useState('')
  const [submitted, setSubmitted]   = useState(false)
  const [busy, setBusy]             = useState(false)

  async function submit(helpful: boolean, text: string) {
    setBusy(true)
    try {
      await fetch(`${API}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page_id: pageId, helpful, comment: text }),
      })
    } catch {
      // fire-and-forget — don't block the UI on failure
    }
    setBusy(false)
    setSubmitted(true)
    setShowComment(false)
  }

  async function vote(helpful: boolean) {
    setVoted(helpful)
    if (helpful) {
      await submit(true, '')
    } else {
      setShowComment(true)
    }
  }

  if (submitted) {
    return (
      <div className="mt-12 pt-5 flex items-center gap-2 text-sm" style={{ borderTop: '1px solid #F3F4F6', color: '#6B7280' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        Thanks for your feedback — it helps us improve the docs.
      </div>
    )
  }

  return (
    <div className="mt-12 pt-5" style={{ borderTop: '1px solid #F3F4F6' }}>
      {!voted ? (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm" style={{ color: '#6B7280' }}>Was this page helpful?</span>
          <button
            disabled={busy}
            onClick={() => vote(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{ border: '1px solid #D1FAE5', background: '#F0FDF4', color: '#16A34A' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            Yes
          </button>
          <button
            disabled={busy}
            onClick={() => vote(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{ border: '1px solid #FEE2E2', background: '#FFF5F5', color: '#DC2626' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
              <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
            </svg>
            No
          </button>
        </div>
      ) : showComment ? (
        <div className="max-w-md">
          <p className="text-sm font-medium mb-2" style={{ color: '#374151' }}>What could be improved?</p>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            placeholder="Tell us what was missing, unclear, or incorrect…"
            className="w-full rounded-lg px-3 py-2 text-sm resize-none outline-none"
            style={{ border: '1px solid #E5E7EB', color: '#374151', lineHeight: 1.5 }}
          />
          <div className="mt-2 flex gap-2">
            <button
              disabled={busy}
              onClick={() => submit(false, comment)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{ background: '#6366F1', color: '#fff' }}
            >
              {busy ? 'Sending…' : 'Send feedback'}
            </button>
            <button
              onClick={() => setSubmitted(true)}
              className="px-3 py-1.5 rounded-lg text-sm transition-colors"
              style={{ color: '#9CA3AF' }}
            >
              Skip
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
