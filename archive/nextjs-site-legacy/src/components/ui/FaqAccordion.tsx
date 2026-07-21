'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface FaqItem {
  question: string
  answer: string
}

interface FaqAccordionProps {
  title?: string
  eyebrow?: string
  items: FaqItem[]
  className?: string
  variant?: 'light' | 'dark'
}

export function FaqAccordion({ title, eyebrow, items, className, variant = 'light' }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(null)

  const isDark = variant === 'dark'
  const containerCls = isDark
    ? 'divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] overflow-hidden bg-white/[0.03]'
    : 'divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden bg-white'
  const btnHoverCls = isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-50'
  const questionCls = isDark ? 'text-slate-200' : 'text-slate-900'
  const chevronCls  = isDark ? 'text-slate-500' : 'text-slate-400'
  const answerCls   = isDark ? 'text-slate-400' : 'text-slate-600'
  const titleCls    = isDark ? 'text-white'     : 'text-slate-900'
  const eyebrowCls  = 'text-xs font-semibold uppercase tracking-widest text-brand-500 mb-2'

  return (
    <div className={className}>
      {(eyebrow || title) && (
        <div className="mb-8">
          {eyebrow && <p className={eyebrowCls}>{eyebrow}</p>}
          {title && <h2 className={`text-2xl font-bold ${titleCls}`}>{title}</h2>}
        </div>
      )}

      <div className={containerCls}>
        {items.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={i}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className={`w-full flex items-center justify-between gap-4 px-6 py-5 text-left ${btnHoverCls} transition-colors`}
              >
                <span className={`text-sm font-semibold ${questionCls} leading-snug`}>
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 ${chevronCls} transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-5">
                  <p className={`text-sm ${answerCls} leading-relaxed`}>
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
