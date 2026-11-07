import type { CSSProperties } from 'react'

const CENTER = 50
const RADIUS = 36

const CREATORS = [
  { initials: 'AK', score: 94, angle: -100, z: 70, from: 'from-sky-300', to: 'to-indigo-500' },
  { initials: 'ML', score: 88, angle: -28, z: 40, from: 'from-indigo-300', to: 'to-violet-500' },
  { initials: 'SR', score: 81, angle: 48, z: 60, from: 'from-cyan-300', to: 'to-blue-500' },
  { initials: 'JB', score: 76, angle: 128, z: 30, from: 'from-blue-300', to: 'to-indigo-600' },
  { initials: 'PN', score: 69, angle: 204, z: 50, from: 'from-sky-300', to: 'to-cyan-500' },
].map((c) => {
  const rad = (c.angle * Math.PI) / 180
  return {
    ...c,
    x: CENTER + RADIUS * Math.cos(rad),
    y: CENTER + RADIUS * Math.sin(rad),
  }
})

const CHIPS = [
  { label: '9:16', x: 20, y: 40, delay: 0 },
  { label: 'Commercial use', x: 60, y: 62, delay: 1 },
  { label: '$800 budget', x: 62, y: 33, delay: 2 },
]

// "Match constellation" for brands: one brief pulling the best-fit creators toward it
export default function BrandScene() {
  return (
    <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
      <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#a5b4fc" strokeWidth="0.4" strokeDasharray="1.5 2" />
        <circle cx={CENTER} cy={CENTER} r={22} fill="none" stroke="#c7d2fe" strokeWidth="0.4" strokeDasharray="1.5 2" />
        {CREATORS.map((c) => (
          <line
            key={c.initials}
            x1={c.x}
            y1={c.y}
            x2={CENTER}
            y2={CENTER}
            className="anim-dash"
            stroke="#4f46e5"
            strokeOpacity={0.25 + (c.score - 60) / 60}
            strokeWidth={c.score > 90 ? 1.6 : 1}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {/* The brief in the middle */}
      <div
        className="absolute"
        style={{
          left: `${CENTER}%`,
          top: `${CENTER}%`,
          width: '26%',
          height: '26%',
          transform: 'translate(-50%, -50%) translateZ(80px)',
          transformStyle: 'preserve-3d',
        }}
      >
        <span className="anim-pulse-ring absolute inset-0 rounded-full border-2 border-indigo-400/50" />
        <span className="anim-pulse-ring absolute inset-0 rounded-full border-2 border-sky-400/40 [animation-delay:1.4s]" />
        <div className="relative flex h-full w-full flex-col items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-sky-500 text-center text-white shadow-[0_24px_40px_-18px_rgba(49,46,129,0.7)]">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-100">Your brief</p>
          <p className="mt-0.5 text-[13px] font-semibold leading-tight">Product reel</p>
        </div>
      </div>

      {/* Brief details floating around it */}
      {CHIPS.map((chip) => (
        <div
          key={chip.label}
          className="absolute"
          style={{ left: `${chip.x}%`, top: `${chip.y}%`, transform: 'translateZ(100px)', transformStyle: 'preserve-3d' }}
        >
          <span
            className="anim-float inline-block rounded-full border border-indigo-200 bg-white px-2.5 py-1 text-[11px] font-medium text-indigo-700 shadow-sm"
            style={{ animationDelay: `${chip.delay}s` } as CSSProperties}
          >
            {chip.label}
          </span>
        </div>
      ))}

      {/* Creators ranked by match */}
      {CREATORS.map((c, i) => (
        <div
          key={c.initials}
          className="absolute"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            transform: `translate(-50%, -50%) translateZ(${c.z}px)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="anim-float flex flex-col items-center" style={{ animationDelay: `${i * 0.7}s` } as CSSProperties}>
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${c.from} ${c.to} text-sm font-semibold text-white shadow-[0_18px_30px_-16px_rgba(49,46,129,0.6)] ring-4 ring-white`}
            >
              {c.initials}
            </div>
            <span className="-mt-2 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-indigo-700 shadow ring-1 ring-indigo-100">
              {c.score}% match
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
