'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

export interface DemoHotspot {
  /** 0–100 percent from left */
  x: number
  /** 0–100 percent from top */
  y: number
  label: string
}

export interface DemoStep {
  title: string
  description: string
  frame: React.ReactNode
  hotspots?: DemoHotspot[]
}

interface InteractiveDemoProps {
  steps: DemoStep[]
  /** ms between auto-advance; 0 disables auto-play */
  autoPlayInterval?: number
  className?: string
}

export function InteractiveDemo({ steps, autoPlayInterval = 4000, className }: InteractiveDemoProps) {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(autoPlayInterval > 0)
  const [direction, setDirection] = useState(1)

  const goTo = useCallback((idx: number, dir = 1) => {
    setDirection(dir)
    setActive(idx)
  }, [])

  const next = useCallback(() => {
    goTo((active + 1) % steps.length, 1)
  }, [active, steps.length, goTo])

  const prev = useCallback(() => {
    goTo((active - 1 + steps.length) % steps.length, -1)
  }, [active, steps.length, goTo])

  useEffect(() => {
    if (!playing || autoPlayInterval <= 0) return
    const id = setInterval(next, autoPlayInterval)
    return () => clearInterval(id)
  }, [playing, autoPlayInterval, next])

  const step = steps[active]

  return (
    <div className={`flex flex-col gap-5 ${className ?? ''}`}>
      {/* Step tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => { goTo(i, i > active ? 1 : -1); setPlaying(false) }}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
              i === active
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            <span className="mr-1 opacity-60">{String(i + 1).padStart(2, '0')}</span>
            {s.title}
          </button>
        ))}
      </div>

      {/* Browser window */}
      <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white">
        {/* Chrome bar */}
        <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 border-b border-slate-200">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <div className="ml-2.5 flex-1 h-5 rounded-md bg-white border border-slate-200 flex items-center px-2.5">
            <span className="text-xs text-slate-400 font-mono">app.onam.cloud / dashboard</span>
          </div>
        </div>

        {/* Frame */}
        <div className="relative overflow-hidden" style={{ height: '340px' }}>
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              variants={{
                enter:  (d: number) => ({ opacity: 0, x: d * 30 }),
                center: { opacity: 1, x: 0 },
                exit:   (d: number) => ({ opacity: 0, x: -d * 30 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              {step.frame}
            </motion.div>
          </AnimatePresence>

          {/* Hotspots */}
          {step.hotspots?.map((h, i) => (
            <div
              key={i}
              className="absolute z-20 group"
              style={{ left: `${h.x}%`, top: `${h.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <span className="absolute inset-0 rounded-full bg-indigo-500/30 animate-ping" />
              <span className="relative w-4 h-4 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center cursor-pointer shadow-sm" />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block z-30 whitespace-nowrap bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-xl">
                {h.label}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-slate-100">
          <motion.div
            className="h-full bg-indigo-500"
            animate={{ width: `${((active + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Caption + controls */}
      <div className="flex items-center justify-between gap-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-slate-600"
          >
            {step.description}
          </motion.p>
        </AnimatePresence>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setPlaying(p => !p)}
            className="w-7 h-7 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
            title={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          <button
            onClick={() => { prev(); setPlaying(false) }}
            className="w-7 h-7 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { next(); setPlaying(false) }}
            className="w-7 h-7 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs text-slate-400 ml-0.5">{active + 1}/{steps.length}</span>
        </div>
      </div>
    </div>
  )
}
