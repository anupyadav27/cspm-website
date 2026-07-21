import { clsx } from 'clsx'

type Color = 'red' | 'amber' | 'yellow' | 'green' | 'blue' | 'purple' | 'slate'

const colors: Record<Color, string> = {
  red:    'bg-red-500/15 text-red-400 border-red-500/30',
  amber:  'bg-amber-500/15 text-amber-400 border-amber-500/30',
  yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  green:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  blue:   'bg-brand-500/15 text-brand-400 border-brand-500/30',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  slate:  'bg-slate-500/15 text-slate-400 border-slate-500/30',
}

const severityMap: Record<string, Color> = {
  CRITICAL: 'red',
  HIGH:     'amber',
  MEDIUM:   'yellow',
  LOW:      'slate',
  PASS:     'green',
  FAIL:     'red',
  INFO:     'blue',
}

interface BadgeProps {
  label: string
  color?: Color
  severity?: string
  dot?: boolean
  className?: string
}

export function Badge({ label, color, severity, dot, className }: BadgeProps) {
  const resolved = color ?? (severity ? (severityMap[severity] ?? 'slate') : 'slate')

  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide rounded border',
      colors[resolved],
      className,
    )}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', {
        'bg-red-400':     resolved === 'red',
        'bg-amber-400':   resolved === 'amber',
        'bg-yellow-400':  resolved === 'yellow',
        'bg-emerald-400': resolved === 'green',
        'bg-brand-400':   resolved === 'blue',
        'bg-purple-400':  resolved === 'purple',
        'bg-slate-400':   resolved === 'slate',
      })} />}
      {label}
    </span>
  )
}
