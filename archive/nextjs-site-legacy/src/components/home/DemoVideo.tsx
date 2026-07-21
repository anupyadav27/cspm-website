'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'

const videos = [
  {
    id: 'scan',
    label: 'Security Scan',
    src: '/video/demo.mp4',
    headline: 'Watch a full cloud scan',
    sub: 'AWS account → 12,481 resources → 847 findings in 10 seconds',
    duration: '10 sec',
    stat: '847 findings',
    path: 'app.onam.security/findings',
  },
  {
    id: 'onboarding',
    label: 'Connect AWS',
    src: '/video/demo-onboarding.mp4',
    headline: 'Connect your first cloud account',
    sub: 'Read-only IAM role — validated and scanning in under 3 minutes',
    duration: '9 sec',
    stat: 'Setup in 3 min',
    path: 'app.onam.security/accounts',
  },
  {
    id: 'attack-path',
    label: 'Attack Path',
    src: '/video/demo-attack-path.mp4',
    headline: 'Watch an attack path build',
    sub: 'EC2 → IMDSv1 → IAM PassRole → S3 crown jewel — 4 hops to breach',
    duration: '8 sec',
    stat: 'MITRE T1552.005',
    path: 'app.onam.security/attack-path',
  },
]

function VideoPlayer({ video }: { video: typeof videos[0] }) {
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Reset when video changes
    setPlaying(false)
    setStarted(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [video.src])

  function toggle() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
      setStarted(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  function onEnded() {
    setPlaying(false)
    setStarted(false)
    if (videoRef.current) videoRef.current.currentTime = 0
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{ boxShadow: '0 0 60px rgba(99,102,241,.2)' }}
      onClick={toggle}
    >
      <div className="absolute -inset-px rounded-2xl border border-brand-500/30 pointer-events-none z-10" />

      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-navy-900 border-b border-navy-700">
        <div className="w-2 h-2 rounded-full bg-csm-red" />
        <div className="w-2 h-2 rounded-full bg-csm-amber" />
        <div className="w-2 h-2 rounded-full bg-csm-green" />
        <div className="ml-3 flex-1 max-w-sm bg-navy-800 rounded text-xs text-slate-400 px-3 py-0.5 border border-navy-700">
          {video.path}
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-xs font-bold" style={{ color: '#22d3ee' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-csm-green animate-pulse" />
          {video.stat}
        </span>
      </div>

      <video
        ref={videoRef}
        src={video.src}
        className="w-full block"
        preload="metadata"
        playsInline
        onEnded={onEnded}
      />

      {/* Play overlay */}
      {!playing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-950/55 backdrop-blur-[2px] z-20">
          <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center shadow-xl shadow-brand-500/40 transition-transform group-hover:scale-110">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
          {!started && (
            <p className="mt-4 text-slate-400 text-xs font-medium">{video.headline}</p>
          )}
        </div>
      )}

      {playing && (
        <div className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-navy-900/80 backdrop-blur flex items-center justify-center border border-navy-700">
            <Pause className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      )}
    </div>
  )
}

export function DemoVideo() {
  const [active, setActive] = useState(0)
  const video = videos[active]

  return (
    <section className="py-20 bg-gradient-to-b from-slate-950 to-navy-950 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          question="Product demo videos"
          headline="Watch the platform in action."
          sub="Short clips — dummy data only, zero real customer information visible."
          className="mb-10"
        />

        {/* Video switcher tabs */}
        <div className="flex gap-2 justify-center mb-8">
          {videos.map((v, i) => (
            <button
              key={v.id}
              onClick={() => setActive(i)}
              className={[
                'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border',
                i === active
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-navy-800 text-slate-400 border-navy-700 hover:text-slate-200',
              ].join(' ')}
            >
              {v.label}
            </button>
          ))}
        </div>

        <VideoPlayer key={video.src} video={video} />

        {/* Meta row */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            <div className="text-white font-bold text-base">{video.headline}</div>
            <div className="text-slate-400 text-sm mt-0.5">{video.sub}</div>
          </div>
          <div className="flex gap-3">
            <div className="bg-navy-900 border border-navy-700 rounded-xl px-5 py-3 text-center">
              <div className="text-lg font-extrabold text-white">{video.duration}</div>
              <div className="text-xs text-slate-400">clip length</div>
            </div>
            <div className="bg-navy-900 border border-navy-700 rounded-xl px-5 py-3 text-center">
              <div className="text-lg font-extrabold text-white">100%</div>
              <div className="text-xs text-slate-400">dummy data</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
