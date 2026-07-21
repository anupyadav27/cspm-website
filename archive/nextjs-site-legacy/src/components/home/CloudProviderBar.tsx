import Link from 'next/link'
import { CLOUD_PROVIDERS } from '@/lib/config'

// Inline SVG marks — accurate brand representations
const marks: Record<string, React.ReactNode> = {
  AWS: (
    <svg viewBox="0 0 80 48" fill="none" className="h-8 w-auto">
      {/* AWS wordmark + smile arrow */}
      <text x="6" y="28" fontSize="20" fontFamily="'Amazon Ember',Arial,sans-serif" fontWeight="700" fill="#FF9900" letterSpacing="-0.5">aws</text>
      <path d="M4 36 Q20 28 36 36" stroke="#FF9900" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M32 32 L36 36 L30 37" fill="#FF9900"/>
    </svg>
  ),
  Azure: (
    <svg viewBox="0 0 80 48" fill="none" className="h-8 w-auto">
      {/* Azure "A" geometric mark */}
      <path d="M12 36 L27 10 L38 28 L48 16 L62 36Z" fill="none" stroke="#0078D4" strokeWidth="0"/>
      <path d="M12 36 L27 10 L38 26 L28 36Z" fill="#0078D4"/>
      <path d="M34 36 L48 16 L62 36Z" fill="#50B0F0"/>
      <path d="M27 10 L42 10 L38 26Z" fill="#0078D4" opacity="0.6"/>
    </svg>
  ),
  GCP: (
    <svg viewBox="0 0 80 48" fill="none" className="h-8 w-auto">
      {/* Google Cloud coloured arc + wordmark */}
      <path d="M40 8 A16 16 0 0 1 56 24" stroke="#4285F4" strokeWidth="5" strokeLinecap="round"/>
      <path d="M56 24 A16 16 0 0 1 40 40" stroke="#EA4335" strokeWidth="5" strokeLinecap="round"/>
      <path d="M40 40 A16 16 0 0 1 24 24" stroke="#FBBC04" strokeWidth="5" strokeLinecap="round"/>
      <path d="M24 24 A16 16 0 0 1 40 8"  stroke="#34A853" strokeWidth="5" strokeLinecap="round"/>
      <circle cx="40" cy="24" r="7" fill="#4285F4"/>
      <circle cx="40" cy="24" r="4" fill="white" opacity="0.15"/>
    </svg>
  ),
  OCI: (
    <svg viewBox="0 0 80 48" fill="none" className="h-8 w-auto">
      {/* Oracle Cloud — two concentric ellipses (Oracle brand shape) */}
      <ellipse cx="40" cy="24" rx="26" ry="14" fill="none" stroke="#C74634" strokeWidth="3"/>
      <ellipse cx="40" cy="24" rx="13" ry="7"  fill="#C74634"/>
      <text x="28" y="29" fontSize="9" fontFamily="Arial,sans-serif" fontWeight="700" fill="white">OCI</text>
    </svg>
  ),
  AliCloud: (
    <svg viewBox="0 0 80 48" fill="none" className="h-8 w-auto">
      {/* Alibaba Cloud — characteristic "A" cloud swoosh */}
      <path d="M14 30 Q14 14 30 14 Q38 14 42 20" stroke="#FF6A00" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M42 20 Q46 14 54 14 Q70 14 70 30" stroke="#FF6A00" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M14 30 Q14 38 22 38 L62 38 Q70 38 70 30" stroke="#FF6A00" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <circle cx="42" cy="38" r="3.5" fill="#FF6A00"/>
    </svg>
  ),
  IBM: (
    <svg viewBox="0 0 80 48" fill="none" className="h-8 w-auto">
      {/* IBM — distinctive striped blue letters */}
      {/* I */}
      <rect x="6"  y="16" width="8"  height="3"  rx="0.5" fill="#1F70C1"/>
      <rect x="6"  y="22" width="8"  height="3"  rx="0.5" fill="#1F70C1"/>
      <rect x="6"  y="28" width="8"  height="3"  rx="0.5" fill="#1F70C1"/>
      {/* B */}
      <rect x="18" y="16" width="10" height="3"  rx="0.5" fill="#1F70C1"/>
      <rect x="18" y="22" width="9"  height="3"  rx="0.5" fill="#1F70C1"/>
      <rect x="18" y="28" width="10" height="3"  rx="0.5" fill="#1F70C1"/>
      <rect x="18" y="16" width="3"  height="15" rx="0.5" fill="#1F70C1" opacity="0"/>
      {/* M */}
      <rect x="32" y="16" width="3"  height="15" rx="0.5" fill="#1F70C1"/>
      <rect x="32" y="16" width="10" height="3"  rx="0.5" fill="#1F70C1"/>
      <rect x="39" y="16" width="3"  height="15" rx="0.5" fill="#1F70C1"/>
      <rect x="32" y="22" width="10" height="3"  rx="0.5" fill="#1F70C1"/>
      <rect x="32" y="28" width="10" height="3"  rx="0.5" fill="#1F70C1"/>
      {/* Cloud text */}
      <text x="6" y="45" fontSize="7" fontFamily="Arial,sans-serif" fontWeight="600" fill="#1F70C1" letterSpacing="1">Cloud</text>
    </svg>
  ),
  K8s: (
    <svg viewBox="0 0 80 48" fill="none" className="h-8 w-auto">
      {/* Kubernetes helm/wheel */}
      <circle cx="40" cy="22" r="14" fill="none" stroke="#326CE5" strokeWidth="2.5"/>
      <circle cx="40" cy="22" r="4"  fill="#326CE5"/>
      {/* 7 spokes */}
      {[0,51,102,153,205,257,308].map((deg, i) => {
        const r = deg * Math.PI / 180
        const x1 = 40 + 5  * Math.sin(r), y1 = 22 - 5  * Math.cos(r)
        const x2 = 40 + 12 * Math.sin(r), y2 = 22 - 12 * Math.cos(r)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#326CE5" strokeWidth="2.5" strokeLinecap="round"/>
      })}
      <text x="28" y="43" fontSize="8" fontFamily="Arial,sans-serif" fontWeight="700" fill="#326CE5" letterSpacing="0.5">K8s</text>
    </svg>
  ),
}

export function CloudProviderBar() {
  return (
    <section className="border-b border-navy-700/60 bg-navy-900 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-bold uppercase tracking-[0.12em] text-slate-400 mb-9">
          Scans every major cloud environment — connect all of them, or start with one
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10">
          {CLOUD_PROVIDERS.map(p => (
            <Link key={p.short} href={p.href}
              className="group flex flex-col items-center gap-2.5 opacity-60 hover:opacity-100 transition-all duration-200">
              <div className="w-16 h-10 flex items-center justify-center">
                {marks[p.short] ?? (
                  <span className="text-xs font-bold text-slate-300">{p.short}</span>
                )}
              </div>
              <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors font-semibold tracking-wide">
                {p.short}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
