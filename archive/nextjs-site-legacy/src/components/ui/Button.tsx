'use client'
import Link from 'next/link'
import { clsx } from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  href?: string
  external?: boolean
}

const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap'

const variants: Record<Variant, string> = {
  primary:   'bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand hover:shadow-lg active:scale-[0.98]',
  secondary: 'bg-navy-700 hover:bg-navy-600 text-slate-200 border border-navy-600 hover:border-navy-500',
  ghost:     'text-slate-300 hover:text-white hover:bg-navy-700',
  outline:   'border border-brand-500 text-brand-400 hover:bg-brand-500/10',
}

const sizes: Record<Size, string> = {
  sm:  'px-3 py-1.5 text-sm',
  md:  'px-5 py-2.5 text-sm',
  lg:  'px-7 py-3.5 text-base',
}

export function Button({
  variant = 'primary',
  size    = 'md',
  href,
  external,
  className,
  children,
  ...props
}: ButtonProps) {
  const cls = clsx(base, variants[variant], sizes[size], className)

  if (href) {
    return external
      ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>
      : <Link href={href} className={cls}>{children}</Link>
  }

  return <button className={cls} {...props}>{children}</button>
}
