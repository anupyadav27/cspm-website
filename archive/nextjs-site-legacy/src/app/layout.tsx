import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: { default: 'Onam — Unified Cloud Security', template: '%s | Onam' },
  description: 'Onam gives your security team a complete picture of every cloud risk — misconfigurations, identity exposure, attack paths, threats, and compliance — across AWS, Azure, GCP, OCI, AliCloud, IBM Cloud, and Kubernetes. 10,000+ rules, 16+ engines, 100% agentless.',
  metadataBase: new URL('https://d1fp5dwui44wle.cloudfront.net'),
  openGraph: {
    type: 'website',
    siteName: 'Onam Security',
    title: 'Onam — Unified Cloud Security Platform',
    description: '10,000+ security rules · 16+ engines · 7 clouds · 13 compliance frameworks. Find your first critical finding in under 8 minutes.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Onam Security — Cloud Security Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Onam — Unified Cloud Security',
    description: '10,000+ security rules across 16+ engines. Find misconfigurations, identity risks, and attack paths across all 7 clouds in under 8 minutes.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${plusJakartaSans.variable}`}>
      <body className={`antialiased ${inter.className}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
