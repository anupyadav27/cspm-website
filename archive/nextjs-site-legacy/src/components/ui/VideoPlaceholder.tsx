'use client'
import { Play } from 'lucide-react'

interface VideoPlaceholderProps {
  title?: string
  duration?: string
  /** Call this when the play button is clicked — swap in a real embed URL */
  onClick?: () => void
  className?: string
}

export function VideoPlaceholder({ title = 'Product demo', duration = '3 min', onClick, className }: VideoPlaceholderProps) {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border border-navy-600 bg-navy-800 cursor-pointer ${className ?? ''}`}
    >
      {/* Thumbnail gradient — mimics a dark product screenshot */}
      <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700">
        {/* Faint dashboard grid lines as decoration */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(#6366F1 1px, transparent 1px), linear-gradient(90deg, #6366F1 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        {/* Mini dashboard widgets to give context */}
        <div className="relative z-10 w-3/4 space-y-2 pointer-events-none">
          <div className="h-2 bg-navy-600 rounded-full w-1/2" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-8 bg-navy-700 rounded-lg border border-red-500/30" />
            <div className="h-8 bg-navy-700 rounded-lg border border-amber-500/30" />
            <div className="h-8 bg-navy-700 rounded-lg border border-emerald-500/30" />
          </div>
          <div className="h-2 bg-navy-600 rounded-full w-3/4" />
          <div className="h-2 bg-navy-600 rounded-full w-5/6" />
        </div>
      </div>

      {/* Play overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-900/60 group-hover:bg-navy-900/40 transition-colors">
        <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center shadow-glow-brand group-hover:scale-110 transition-transform">
          <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
        </div>
        {title && (
          <div className="mt-3 text-sm font-medium text-white">{title}</div>
        )}
        {duration && (
          <div className="text-xs text-slate-400 mt-1">{duration}</div>
        )}
      </div>
    </div>
  )
}
