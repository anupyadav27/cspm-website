'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  page_id: string
  title: string
  excerpt: string
  url: string
}

// CloudFront routes /api/* to API Gateway, so relative URL works in production.
// Set NEXT_PUBLIC_API_ENDPOINT for local dev pointing at a deployed API.
const API = process.env.NEXT_PUBLIC_API_ENDPOINT ?? ''

export function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router   = useRouter()

  useEffect(() => { inputRef.current?.focus() }, [])

  // Debounced search
  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res  = await fetch(`${API}/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.results ?? [])
        setSelected(0)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 220)
    return () => clearTimeout(timer)
  }, [query])

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape')    { onClose(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); return }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); return }
      if (e.key === 'Enter' && results[selected]) {
        router.push(results[selected].url)
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [results, selected, onClose, router])

  function navigate(url: string) {
    router.push(url)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
      style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: '#fff', border: '1px solid #E5E7EB' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid #F3F4F6' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search documentation…"
            className="flex-1 outline-none text-sm bg-transparent"
            style={{ color: '#111827' }}
          />
          {loading ? (
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          ) : (
            <kbd className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: '#F3F4F6', color: '#6B7280' }}>ESC</kbd>
          )}
        </div>

        {/* Results list */}
        {results.length > 0 && (
          <ul className="max-h-72 overflow-y-auto py-1.5">
            {results.map((r, i) => (
              <li key={r.page_id}>
                <button
                  className="w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors"
                  style={{ background: i === selected ? '#EEF2FF' : 'transparent' }}
                  onMouseEnter={() => setSelected(i)}
                  onClick={() => navigate(r.url)}
                >
                  <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke={i === selected ? '#6366F1' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10,9 9,9 8,9" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: i === selected ? '#4F46E5' : '#111827' }}>
                      {r.title}
                    </p>
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: '#6B7280' }}>{r.excerpt}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Empty state */}
        {query.length >= 2 && !loading && results.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm" style={{ color: '#6B7280' }}>No results for <strong>"{query}"</strong></p>
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Try a different keyword</p>
          </div>
        )}

        {/* Hint state */}
        {query.length < 2 && (
          <div className="px-4 py-5 text-center text-xs" style={{ color: '#9CA3AF' }}>
            Type at least 2 characters to search
          </div>
        )}

        {/* Footer shortcuts */}
        <div className="px-4 py-2 flex gap-4 text-xs" style={{ borderTop: '1px solid #F3F4F6', color: '#9CA3AF' }}>
          {[['↑↓', 'navigate'], ['↵', 'open'], ['ESC', 'close']].map(([key, label]) => (
            <span key={key}>
              <kbd className="px-1 py-0.5 rounded font-mono text-xs mr-1" style={{ background: '#F3F4F6', color: '#6B7280' }}>{key}</kbd>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
