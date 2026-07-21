'use client'

import { useEffect, useState } from 'react'
import type { DocHeading } from '@/lib/docs'

export function TableOfContents({ headings }: { headings: DocHeading[] }) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (!headings.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    )
    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  if (!headings.length) return null

  return (
    <aside className="hidden xl:block w-48 shrink-0">
      <div className="sticky top-24">
        <p className="text-xs font-semibold uppercase mb-3" style={{ color: '#9CA3AF', letterSpacing: '0.08em', fontSize: '10px' }}>
          On this page
        </p>

        <div className="relative">
          {/* rail */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />

          <ul className="pl-3 space-y-1">
            {headings.map((h) => {
              const active = activeId === h.id
              return (
                <li key={h.id} style={{ paddingLeft: h.level === 3 ? '0.5rem' : '0' }}>
                  <a
                    href={`#${h.id}`}
                    className="block text-xs py-0.5 leading-snug transition-colors duration-100"
                    style={{ color: active ? '#4F46E5' : '#6B7280', fontWeight: active ? 500 : 400 }}
                  >
                    {h.text}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* sliding active pill on rail */}
          {activeId && (
            <div
              className="absolute left-0 w-0.5 rounded-full transition-all duration-300"
              style={{
                background: '#6366F1',
                top: `${(headings.findIndex(h => h.id === activeId) / Math.max(headings.length - 1, 1)) * 100}%`,
                height: '16px',
                transform: 'translateY(-50%)',
              }}
            />
          )}
        </div>
      </div>
    </aside>
  )
}
