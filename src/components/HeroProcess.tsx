const WIRES = [
  'M150 90 C230 90 220 235 290 235',
  'M150 235 L290 235',
  'M150 380 C230 380 220 235 290 235',
]

// The signature visual: a workflow (prompt, seed, sampler) flowing into a verified result
export default function HeroProcess() {
  return (
    <div className="relative mx-auto h-[470px] w-full max-w-[470px]" aria-hidden>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 470 470">
        {WIRES.map((d) => (
          <path key={d} d={d} className="anim-dash" fill="none" stroke="#14110f" strokeWidth="1.5" />
        ))}
      </svg>

      <div className="anim-float absolute left-0 top-[50px] w-[150px] rounded-2xl border border-ink bg-card p-3.5">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Prompt</p>
        <p className="mt-1.5 text-sm">neon koi, studio light</p>
      </div>
      <div
        className="anim-float absolute left-0 top-[195px] w-[150px] rounded-2xl bg-ink p-3.5 text-lime"
        style={{ animationDelay: '1s' }}
      >
        <p className="font-mono text-[10px] uppercase tracking-wider">Seed locked</p>
        <p className="mt-1.5 font-display text-3xl">482913</p>
      </div>
      <div
        className="anim-float absolute left-0 top-[340px] w-[150px] rounded-2xl border border-ink bg-card p-3.5"
        style={{ animationDelay: '2s' }}
      >
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Sampler</p>
        <p className="mt-1.5 text-sm">euler / 28 steps</p>
      </div>

      <div className="absolute right-0 top-10 h-[390px] w-[200px] rounded-[26px] bg-[linear-gradient(160deg,#ffd0bd,#e8431a_70%,#7a1f0a)] shadow-[0_40px_60px_-30px_rgba(122,31,10,0.6)]">
        <div className="absolute inset-0 rounded-[26px] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.14)_0_1px,transparent_1px_16px)]" />
      </div>
      <div className="anim-spin-slow absolute -right-1.5 top-1.5 flex h-[104px] w-[104px] items-center justify-center rounded-full bg-lime text-center font-mono text-[10px] uppercase leading-tight tracking-wider">
        Verified
        <br />
        workflow
      </div>
    </div>
  )
}
