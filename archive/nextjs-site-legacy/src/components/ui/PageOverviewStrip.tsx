'use client'

import { useEffect, useState } from 'react'

export interface OverviewItem {
  label: string
  anchor: string
}

interface PageOverviewStripProps {
  items: OverviewItem[]
  className?: string
  variant?: 'light' | 'dark'
}

export function PageOverviewStrip({ items, className, variant = 'light' }: PageOverviewStripProps) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const sections = items.map(i => document.getElementById(i.anchor)).filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length) setActive((visible[0].target as HTMLElement).id)
      },
      { rootMargin: '-20% 0px -60% 0px' }
    )
    sections.forEach(s => observer.observe(s!))
    return () => observer.disconnect()
  }, [items])

  const scrollTo = (anchor: string) => {
    const el = document.getElementById(anchor)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const isDark = variant === 'dark'
  const wrapperCls = isDark
    ? 'flex items-center gap-1 overflow-x-auto scrollbar-hide flex-wrap'
    : 'rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 flex items-center gap-1 overflow-x-auto scrollbar-hide flex-wrap'
  const labelCls = isDark
    ? 'text-xs font-semibold uppercase tracking-widest text-slate-400 mr-2 flex-shrink-0'
    : 'text-xs font-semibold uppercase tracking-widest text-slate-400 mr-2 flex-shrink-0'
  const inactivePillCls = isDark
    ? 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
    : 'text-slate-500 hover:text-slate-900 hover:bg-white'

  return (
    <div className={className ?? ''}>
      <div className={wrapperCls}>
        <span className={labelCls}>On this page</span>
        {items.map((item, i) => (
          <span key={item.anchor} className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => scrollTo(item.anchor)}
              className={`text-xs font-medium px-3 py-1 rounded-full transition-all ${
                active === item.anchor
                  ? 'bg-brand-500 text-white'
                  : inactivePillCls
              }`}
            >
              {item.label}
            </button>
            {i < items.length - 1 && (
              <span className={`${isDark ? 'text-slate-600' : 'text-slate-300'} text-xs select-none`}>·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
