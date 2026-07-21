import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <main className="pt-16 min-h-screen bg-navy-900 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-8xl font-bold text-navy-700 mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-3">This page doesn&apos;t exist.</h1>
        <p className="text-slate-400 mb-8">
          The URL might be wrong, or the page may have moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Button href="/" size="md">Go home</Button>
          <Button href="/docs" variant="secondary" size="md">Browse docs</Button>
        </div>
      </div>
    </main>
  )
}
