import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { Sidebar } from '@/components/docs/Sidebar'

export const metadata: Metadata = {
  title: { template: '%s — Onam Docs', default: 'Onam Documentation' },
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-white">

        {/* Same navbar + theme + footer as the marketing site */}
        <Navbar />

        {/* Body: docs sidebar (no inline logo — Navbar already shows it) + page content */}
        <div className="flex flex-1 overflow-hidden mt-20">
          <Sidebar />
          <main className="flex-1 overflow-y-auto min-w-0 bg-white">
            {children}
          </main>
        </div>

        <Footer />
      </div>
    </ThemeProvider>
  )
}
