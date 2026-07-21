import { clsx } from 'clsx'

interface SectionHeaderProps {
  question: string
  headline: string
  sub?: string
  align?: 'left' | 'center'
  theme?: 'dark' | 'light'
  className?: string
}

export function SectionHeader({ question, headline, sub, align = 'center', theme = 'dark', className }: SectionHeaderProps) {
  const headlineColor = theme === 'light' ? 'text-slate-900' : 'text-white'
  const subColor      = theme === 'light' ? 'text-slate-600' : 'text-slate-300'
  const subAlign      = align === 'center' ? 'mx-auto' : ''

  return (
    <div className={clsx(align === 'center' ? 'text-center' : 'text-left', className)}>
      <p className={clsx('text-xs font-semibold uppercase tracking-widest mb-3', theme === 'light' ? 'text-brand-600' : 'text-brand-400')}>
        {question}
      </p>
      <h2 className={clsx('text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight font-display heading-tight', headlineColor)}>
        {headline}
      </h2>
      {sub && (
        <p className={clsx('mt-4 text-base sm:text-lg max-w-2xl leading-relaxed', subColor, subAlign)}>
          {sub}
        </p>
      )}
    </div>
  )
}
