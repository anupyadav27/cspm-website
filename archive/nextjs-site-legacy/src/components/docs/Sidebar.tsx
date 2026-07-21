'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { NAV } from '@/lib/nav'
import { SearchModal } from './SearchModal'

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // ⌘K / Ctrl+K opens search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function isActive(slug: string) {
    const href = slug === '' ? '/docs' : `/docs/${slug}`
    return pathname === href || pathname === `${href}/`
  }

  const sidebarContent = (
    <aside className="w-56 shrink-0 flex flex-col h-full bg-white" style={{
      borderRight: '1px solid #E5E7EB',
    }}>
      {/* Search — logo lives in the global Navbar above */}
      <div className="px-4 py-3 flex-shrink-0 bg-white" style={{ borderBottom: '1px solid #F3F4F6' }}>
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-colors text-left"
          style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <span className="text-xs flex-1" style={{ color: '#9CA3AF' }}>Search docs…</span>
          <span className="text-xs px-1 py-0.5 rounded font-mono" style={{ background: '#E5E7EB', color: '#6B7280', fontSize: '10px' }}>⌘K</span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {NAV.map((group) => (
          <div key={group.title}>
            <p className="px-2 mb-1 text-xs font-semibold uppercase" style={{ color: '#9CA3AF', letterSpacing: '0.07em', fontSize: '10px' }}>
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.slug)
                return (
                  <li key={item.slug}>
                    <a
                      href={item.slug === '' ? '/docs' : `/docs/${item.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center px-2 py-1.5 rounded-md text-xs transition-all duration-100"
                      style={active ? {
                        background: '#EEF2FF',
                        color: '#4F46E5',
                        fontWeight: 500,
                        borderLeft: '2px solid #6366F1',
                        paddingLeft: '6px',
                      } : {
                        color: '#4B5563',
                        borderLeft: '2px solid transparent',
                      }}
                    >
                      {item.title}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: '1px solid #F3F4F6' }}>
        <a href="/" className="flex items-center gap-1.5 text-xs transition-colors" style={{ color: '#9CA3AF' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to website
        </a>
      </div>
    </aside>
  )

  return (
    <>
      <button
        className="lg:hidden fixed top-20 left-4 z-50 p-2 rounded-lg shadow-md"
        style={{ background: '#fff', border: '1px solid #E5E7EB', color: '#374151' }}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
        </svg>
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setMobileOpen(false)} />
      )}
      <div className={`lg:hidden fixed left-0 top-0 bottom-0 z-40 flex flex-col transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>
      <div className="hidden lg:flex flex-col sticky top-20 h-[calc(100vh-5rem)]">
        {sidebarContent}
      </div>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  )
}
