// Architecture diagram: 7 clouds connected to Onam scanner — draw.io style
export function MultiCloudDiagram() {
  const clouds = [
    { name: 'AWS',      color: '#F59E0B', angle: -90  },
    { name: 'Azure',    color: '#3B82F6', angle: -51  },
    { name: 'GCP',      color: '#10B981', angle: -12  },
    { name: 'OCI',      color: '#EF4444', angle: 27   },
    { name: 'AliCloud', color: '#F97316', angle: 66   },
    { name: 'IBM',      color: '#6366F1', angle: 105  },
    { name: 'K8s',      color: '#22D3EE', angle: 144  },
  ]

  const cx = 200
  const cy = 175
  const r  = 130

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-navy-600 bg-navy-900 p-4">
      <div className="text-xs text-slate-400 uppercase tracking-widest mb-3 text-center">
        Platform architecture — agentless, read-only
      </div>
      <svg viewBox="0 0 400 350" className="w-full max-h-[320px]">
        {clouds.map((cloud) => {
          const rad = (cloud.angle * Math.PI) / 180
          const nx  = cx + r * Math.cos(rad)
          const ny  = cy + r * Math.sin(rad)

          // Control points for curved lines
          const midX = (cx + nx) / 2
          const midY = (cy + ny) / 2

          return (
            <g key={cloud.name}>
              {/* Connection line */}
              <line
                x1={cx} y1={cy}
                x2={nx} y2={ny}
                stroke={cloud.color}
                strokeWidth="1"
                strokeDasharray="4 3"
                opacity="0.35"
              />

              {/* Animated dot travelling along the line */}
              <circle r="2.5" fill={cloud.color} opacity="0.8">
                <animateMotion
                  dur={`${2.5 + (cloud.angle / 90)}s`}
                  repeatCount="indefinite"
                  path={`M${cx},${cy} L${nx},${ny}`}
                />
              </circle>

              {/* Cloud node */}
              <rect
                x={nx - 30} y={ny - 13}
                width="60" height="26"
                rx="6"
                fill="#0D1530"
                stroke={cloud.color}
                strokeWidth="1.2"
                opacity="0.9"
              />
              <text
                x={nx} y={ny + 4}
                textAnchor="middle"
                fontSize="10"
                fontFamily="Inter, system-ui, sans-serif"
                fontWeight="600"
                fill={cloud.color}
              >
                {cloud.name}
              </text>
            </g>
          )
        })}

        {/* Central Onam scanner */}
        <circle cx={cx} cy={cy} r="42" fill="#0D1530" stroke="#6366F1" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r="34" fill="none"   stroke="#22D3EE" strokeWidth="1" strokeDasharray="5 3" opacity="0.5">
          <animateTransform attributeName="transform" type="rotate"
            from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="12s" repeatCount="indefinite" />
        </circle>
        <circle cx={cx} cy={cy} r="6" fill="#6366F1" />
        <text x={cx} y={cy + 20} textAnchor="middle" fontSize="8"
          fontFamily="Inter, system-ui, sans-serif" fill="#94A3B8" fontWeight="500">
          onam scanner
        </text>

        {/* Labels below scanner */}
        <text x={cx} y={cy + 60} textAnchor="middle" fontSize="7.5"
          fontFamily="Inter, system-ui, sans-serif" fill="#64748B">
          10,000+ rules · read-only · agentless
        </text>
      </svg>
    </div>
  )
}
