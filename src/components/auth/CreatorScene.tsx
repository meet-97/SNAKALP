import type { CSSProperties, ReactNode } from 'react'

type NodeProps = {
  x: number
  y: number
  w: number
  h: number
  z: number
  delay: number
  tilt: number
  ports?: ('left' | 'right')[]
  children: ReactNode
}

function Node({ x, y, w, h, z, delay, tilt, ports = [], children }: NodeProps) {
  const floatStyle = { animationDelay: `${delay}s`, '--tilt': `${tilt}deg` } as CSSProperties

  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}%`,
        height: `${h}%`,
        transform: `translateZ(${z}px)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="anim-float relative h-full rounded-2xl border border-stone-900/10 bg-white p-3 shadow-[0_24px_40px_-24px_rgba(120,53,15,0.45)]"
        style={floatStyle}
      >
        {children}
        {ports.includes('left') && (
          <span className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-orange-500 ring-4 ring-[#f6f1e9]" />
        )}
        {ports.includes('right') && (
          <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-orange-500 ring-4 ring-[#f6f1e9]" />
        )}
      </div>
    </div>
  )
}

function Label({ children }: { children: ReactNode }) {
  return <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">{children}</p>
}

function Value({ children }: { children: ReactNode }) {
  return <p className="mt-1 font-mono text-[12px] leading-snug text-stone-800">{children}</p>
}

const WIRES = [
  'M28 15 C 32 15, 32 31, 36 31',
  'M28 49 C 32 49, 32 31, 36 31',
  'M28 83 C 34 83, 31 31, 36 31',
  'M64 31 C 68 31, 68 50, 72 50',
  'M64 67 C 68 67, 68 50, 72 50',
]

// "Node Studio" for creators: a workflow graph that ends in a verified result
export default function CreatorScene() {
  return (
    <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {WIRES.map((d) => (
          <g key={d} fill="none" vectorEffect="non-scaling-stroke">
            <path d={d} stroke="#fdba74" strokeWidth="3" strokeOpacity="0.35" vectorEffect="non-scaling-stroke" />
            <path
              d={d}
              className="anim-dash"
              stroke="#ea580c"
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
      </svg>

      <Node x={0} y={6} w={28} h={18} z={30} delay={0} tilt={-1.5} ports={['right']}>
        <Label>Checkpoint</Label>
        <Value>flux1-dev</Value>
        <p className="font-mono text-[11px] text-stone-400">.safetensors</p>
      </Node>

      <Node x={0} y={40} w={28} h={18} z={55} delay={0.8} tilt={1} ports={['right']}>
        <Label>Prompt</Label>
        <Value>neon koi, studio light</Value>
      </Node>

      <Node x={0} y={74} w={28} h={18} z={20} delay={1.6} tilt={-1} ports={['right']}>
        <Label>LoRA</Label>
        <Value>ink-style-v2</Value>
        <p className="font-mono text-[11px] text-stone-400">weight 0.8</p>
      </Node>

      <Node x={36} y={22} w={28} h={18} z={70} delay={0.4} tilt={1.2} ports={['left', 'right']}>
        <Label>Sampler</Label>
        <Value>euler, 28 steps</Value>
        <p className="font-mono text-[11px] text-stone-400">cfg 6.5</p>
      </Node>

      <Node x={36} y={58} w={28} h={18} z={40} delay={1.2} tilt={-1.2} ports={['right']}>
        <div className="flex items-center justify-between">
          <Label>Seed</Label>
          <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[9px] font-semibold text-orange-700">
            locked
          </span>
        </div>
        <Value>482913</Value>
      </Node>

      <Node x={72} y={28} w={28} h={44} z={90} delay={0.2} tilt={0.8} ports={['left']}>
        <Label>Output · 9:16</Label>
        <div className="mt-2 h-[52%] rounded-xl bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500" />
        <p className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
            <path d="M10 1.5l2.2 1.6 2.7-.1.8 2.6 2.2 1.6-.9 2.6.9 2.6-2.2 1.6-.8 2.6-2.7-.1L10 18.5l-2.2-1.6-2.7.1-.8-2.6-2.2-1.6.9-2.6-.9-2.6 2.2-1.6.8-2.6 2.7.1L10 1.5zm-1 11.2l4.6-4.6-1-1L9 10.7 7.4 9.1l-1 1L9 12.7z" />
          </svg>
          Workflow verified
        </p>
      </Node>
    </div>
  )
}
