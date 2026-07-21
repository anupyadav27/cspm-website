'use client'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(true)

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains('light'))
  }, [])

  function toggle() {
    const html = document.documentElement
    const goLight = !html.classList.contains('light')
    html.classList.toggle('light', goLight)
    localStorage.setItem('onam-theme', goLight ? 'light' : 'dark')
    setIsLight(goLight)
  }

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-black/[0.05] transition-colors"
      aria-label="Toggle light/dark mode"
    >
      {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  )
}
