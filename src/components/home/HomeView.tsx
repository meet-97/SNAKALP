'use client'

import { ArrowRight, ArrowUpRight, Bookmark, Check, Plus, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import HeroProcess from '@/components/HeroProcess'
import ToolTicker from '@/components/ToolTicker'
import WorkflowModal from '@/components/WorkflowModal'
import { useAppState } from '@/context/AppContext'
import { useWorkspace } from '@/context/WorkspaceContext'
import { mockCreators } from '@/data/mockCreators'
import { MEDIA_TYPE_LABELS } from '@/data/options'
import { rankCreatorsForBrief } from '@/lib/filters'
import { formatMoney } from '@/lib/format'
import type { AITool, Creator, PortfolioItem } from '@/types'

export type Viewer = { name: string; role: 'brand' | 'creator' | 'admin' | null } | null

const TONES = {
  ink: 'bg-ink text-lime',
  vermilion: 'bg-vermilion text-ink',
  ultra: 'bg-ultra text-paper',
  lime: 'bg-lime text-ink',
} as const

function Stat({ label, value, tone, note }: { label: string; value: string | number; tone: keyof typeof TONES; note?: string }) {
  return (
    <div className={`anim-rise flex min-h-[170px] flex-col justify-between rounded-3xl p-6 ${TONES[tone]}`}>
      <p className="font-mono text-[11px] uppercase tracking-wider">{label}</p>
      <div>
        <p className="font-display text-7xl leading-none tracking-tight">{value}</p>
        {note && <p className="mt-2 font-mono text-[10px] uppercase tracking-wider opacity-70">{note}</p>}
      </div>
    </div>
  )
}

function SectionTitle({ index, title, action }: { index: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{index}</p>
        <h2 className="mt-2 font-display text-4xl leading-none tracking-tight sm:text-5xl">{title}</h2>
      </div>
      {action}
    </div>
  )
}

function Spotlight({ creator, score, onOpen }: { creator: Creator; score?: number; onOpen: (item: PortfolioItem, c: Creator) => void }) {
  const { isShortlisted, toggleShortlist } = useWorkspace()
  const cover = creator.featuredWork[0]
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-ink/10 bg-card transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_40px_60px_-34px_rgba(20,17,15,0.45)]">
      <button type="button" onClick={() => onOpen(cover, creator)} className="relative block h-56 w-full overflow-hidden bg-ink/5" aria-label={`Inspect work by ${creator.handle}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover.mediaUrl} alt={cover.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {score !== undefined && (
          <span className="absolute left-3 top-3 rounded-full bg-lime px-3 py-1 font-mono text-[11px] font-semibold">{score}% match</span>
        )}
      </button>
      <button
        type="button"
        onClick={() => toggleShortlist(creator.id, creator.handle)}
        aria-pressed={isShortlisted(creator.id)}
        aria-label={`Save ${creator.handle}`}
        className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full ${isShortlisted(creator.id) ? 'bg-lime' : 'bg-paper/90 hover:bg-ink hover:text-paper'}`}
      >
        <Bookmark className="h-4 w-4" aria-hidden />
      </button>
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate font-display text-3xl leading-none tracking-tight">{creator.handle}</h3>
          <span className="font-mono text-[11px] uppercase text-muted">{formatMoney(creator.hourlyRate)}/hr</span>
        </div>
        <p className="mt-2 line-clamp-1 text-sm text-muted">{creator.headline}</p>
        <Link href={`/creator/${creator.id}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold hover:text-vermilion">
          View profile <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </article>
  )
}

function ProofFeed({ onOpen }: { onOpen: (item: PortfolioItem, c: Creator) => void }) {
  const entries = useMemo(
    () => mockCreators.flatMap((creator) => creator.featuredWork.map((item) => ({ item, creator }))),
    []
  )
  const topTools = useMemo(() => {
    const counts = new Map<AITool, number>()
    entries.forEach(({ item }) => item.toolsUsed.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)))
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([tool]) => tool)
  }, [entries])
  const [tool, setTool] = useState<AITool | 'all'>('all')
  const shown = entries.filter(({ item }) => tool === 'all' || item.toolsUsed.includes(tool)).slice(0, 16)

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter the feed by tool">
        {(['all', ...topTools] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTool(t)}
            aria-pressed={tool === t}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${tool === t ? 'border-ink bg-ink text-paper' : 'border-ink/25 hover:border-ink'}`}
          >
            {t === 'all' ? 'Everything' : t}
          </button>
        ))}
      </div>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {shown.map(({ item, creator }) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpen(item, creator)}
            className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-3xl bg-ink/5 text-left"
            style={{ aspectRatio: item.aspectRatio.replace(':', ' / ') }}
            aria-label={`Inspect proof: ${item.title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.mediaUrl} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider">{MEDIA_TYPE_LABELS[item.mediaType]}</span>
            <span className="absolute bottom-3 left-3 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold group-hover:opacity-0">{creator.handle}</span>
            <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink via-ink/80 to-ink/10 p-4 text-paper opacity-0 transition duration-300 group-hover:opacity-100">
              <span className="font-display text-2xl leading-tight">{item.title}</span>
              <span className="mt-1 text-xs text-lime">{creator.handle}</span>
              <span className="mt-3 flex flex-wrap gap-1">
                {item.toolsUsed.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-full border border-paper/30 px-2 py-0.5 text-[10px]">{t}</span>
                ))}
              </span>
              <span className="mt-3 font-mono text-[10px] uppercase tracking-wider text-paper/80">
                {item.workflow.modelCheckpoint} / seed {item.workflow.seed}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

const STEPS = [
  { n: '01', t: 'Post a brief', d: 'Describe the content, style, format and usage rights. Or let AI turn a rough idea into a full brief.' },
  { n: '02', t: 'Match and shortlist', d: 'See creators ranked by how well their tools and skills fit. Compare them side by side.' },
  { n: '03', t: 'Invite and chat privately', d: 'Creators get an invitation. After they accept, you talk inside SNAKALP. Real names stay private.' },
  { n: '04', t: 'Review the proof', d: 'Every deliverable keeps its model, seed and settings, so revisions are simple and repeatable.' },
]

export default function HomeView({ viewer }: { viewer: Viewer }) {
  const { briefs } = useAppState()
  const { shortlist } = useWorkspace()
  const [selected, setSelected] = useState<{ item: PortfolioItem; creator: Creator } | null>(null)
  const [greeting, setGreeting] = useState('Welcome back')

  useEffect(() => {
    const hour = new Date().getHours()
    setGreeting(hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening')
  }, [])

  const open = (item: PortfolioItem, creator: Creator) => setSelected({ item, creator })
  const latest = briefs[0]
  const recommended = useMemo(() => {
    if (!latest) return mockCreators.slice(0, 3).map((creator) => ({ creator, score: undefined as number | undefined }))
    return rankCreatorsForBrief(mockCreators, latest)
      .slice(0, 3)
      .map((m) => ({ creator: mockCreators.find((c) => c.id === m.creatorId) as Creator, score: m.score as number | undefined }))
      .filter((entry) => Boolean(entry.creator))
  }, [latest])
  const saved = shortlist.map((id) => mockCreators.find((c) => c.id === id)).filter((c): c is Creator => Boolean(c))
  const firstName = viewer?.name.split(/\s+/)[0] ?? ''
  const isBrand = viewer?.role === 'brand' || viewer?.role === 'admin'

  return (
    <div>
      {!viewer && (
        <>
          <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pt-16">
            <div>
              <p className="anim-rise font-mono text-[11px] uppercase tracking-wider text-vermilion">&#9679; {mockCreators.length} verified creators</p>
              <h1 className="anim-rise mt-5 font-display text-[clamp(3.5rem,9vw,8.25rem)] leading-[0.92] tracking-[-0.035em]" style={{ animationDelay: '100ms' }}>
                Proof,<br /><em className="text-vermilion">not</em> promises.
              </h1>
              <p className="anim-rise mt-7 max-w-md text-lg leading-relaxed text-muted" style={{ animationDelay: '200ms' }}>
                Every piece comes with the model, the seed and the workflow behind it. Hire the process, not the lucky prompt.
              </p>
              <div className="anim-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: '300ms' }}>
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition hover:bg-vermilion">
                  Create free account <ArrowRight className="h-4 w-4 text-lime" aria-hidden />
                </Link>
                <Link href="/discover" className="inline-flex items-center rounded-full border border-ink/25 px-6 py-3.5 text-sm font-semibold transition hover:border-ink">
                  Browse creators
                </Link>
              </div>
            </div>
            <div className="anim-rise" style={{ animationDelay: '250ms' }}><HeroProcess /></div>
          </section>
          <ToolTicker />
        </>
      )}

      {viewer && (
        <section className="mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6 lg:px-8">
          <p className="anim-rise font-mono text-[11px] uppercase tracking-wider text-vermilion">&#9679; {isBrand ? 'Brand workspace' : 'Creator workspace'}</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h1 className="anim-rise font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] tracking-[-0.035em]" style={{ animationDelay: '80ms' }}>
              {greeting},<br /><em className="text-vermilion">{firstName || 'there'}.</em>
            </h1>
            <div className="anim-rise flex flex-wrap gap-3" style={{ animationDelay: '160ms' }}>
              {isBrand && (
                <Link href="/briefs/new" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition hover:bg-vermilion">
                  <Plus className="h-4 w-4 text-lime" aria-hidden /> Start a brief
                </Link>
              )}
              <Link href="/discover" className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-6 py-3.5 text-sm font-semibold transition hover:border-ink">
                Browse creators <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {isBrand ? (
              <>
                <Stat label="Briefs" value={briefs.length} tone="vermilion" note="Sample data" />
                <Stat label="Saved creators" value={shortlist.length} tone="ink" />
                <Stat label="Top match" value={recommended[0]?.score !== undefined ? `${recommended[0].score}%` : '-'} tone="ultra" note="For your latest brief" />
                <Stat label="Creators" value={mockCreators.length} tone="lime" note="Verified on SNAKALP" />
              </>
            ) : (
              <>
                <Stat label="Profile strength" value="72%" tone="vermilion" note="Sample data" />
                <Stat label="Invitations" value={0} tone="ink" note="Arrive with Phase 8" />
                <Stat label="Profile views" value={128} tone="ultra" note="Sample data" />
                <Stat label="Verified signals" value="2/3" tone="lime" note="Sample data" />
              </>
            )}
          </div>
        </section>
      )}

      {viewer && (
        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
          <div className="rounded-3xl border border-ink/10 bg-card p-6">
            <h2 className="font-display text-3xl tracking-tight">{isBrand ? 'Get set up' : 'Build your proof'}</h2>
            <ul className="mt-5 space-y-3">
              {(isBrand
                ? [
                    { done: saved.length >= 3, text: `Save 3 creators to your shortlist (${Math.min(saved.length, 3)}/3)`, href: '/discover' },
                    { done: false, text: 'Post a brief and see live matches', href: '/briefs/new' },
                    { done: false, text: 'Compare two creators side by side', href: '/discover' },
                  ]
                : [
                    { done: true, text: 'Choose your unique username', href: '' },
                    { done: false, text: 'Add 3 works with their full workflow', href: '' },
                    { done: false, text: 'Earn a verification badge', href: '' },
                  ]
              ).map((step) => (
                <li key={step.text} className="flex items-center gap-3">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${step.done ? 'border-ink bg-ink text-lime' : 'border-ink/25'}`}>
                    {step.done && <Check className="h-3.5 w-3.5" aria-hidden />}
                  </span>
                  {step.href ? (
                    <Link href={step.href} className="text-sm hover:text-vermilion">{step.text}</Link>
                  ) : (
                    <span className="text-sm">{step.text}</span>
                  )}
                </li>
              ))}
            </ul>
            {!isBrand && <p className="mt-5 font-mono text-[10px] uppercase tracking-wider text-muted">Portfolio upload arrives in the next phase</p>}
          </div>

          <div className="rounded-3xl bg-ink p-6 text-paper">
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-lime"><Sparkles className="h-4 w-4" aria-hidden /> Tip</p>
            <p className="mt-4 font-display text-3xl leading-tight tracking-tight">
              {isBrand ? 'Tell us the format, style and tools. We rank creators while you type.' : 'Creators who show seeds and settings get invited more often.'}
            </p>
            <Link href={isBrand ? '/briefs/new' : '/discover'} className="mt-6 inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-semibold text-ink">
              {isBrand ? 'Try the brief wizard' : 'See how others do it'} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      )}

      {viewer && isBrand && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <SectionTitle index="01 / Your shortlist" title={saved.length ? 'Saved for later.' : 'Nothing saved yet.'} action={<Link href="/discover" className="text-sm font-semibold hover:text-vermilion">Find more <ArrowRight className="inline h-4 w-4" aria-hidden /></Link>} />
          {saved.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-ink/25 p-10 text-center">
              <p className="font-display text-2xl">Tap the bookmark on any creator to save them here.</p>
              <Link href="/discover" className="mt-5 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper hover:bg-vermilion">Browse creators</Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {saved.map((c) => <Spotlight key={c.id} creator={c} onOpen={open} />)}
            </div>
          )}
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionTitle
          index={viewer ? '02 / Recommended' : '01 / Spotlight'}
          title={latest && isBrand ? 'Best fits for your latest brief.' : 'Makers to watch.'}
          action={<Link href="/discover" className="text-sm font-semibold hover:text-vermilion">See all creators <ArrowRight className="inline h-4 w-4" aria-hidden /></Link>}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map(({ creator, score }) => <Spotlight key={creator.id} creator={creator} score={isBrand ? score : undefined} onOpen={open} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionTitle index={viewer ? '03 / Proof feed' : '02 / Proof feed'} title="See how it was made." />
        <ProofFeed onOpen={open} />
      </section>

      {!viewer && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <SectionTitle index="03 / How it works" title="Four steps. No guesswork." />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.n} className="rounded-3xl border border-ink/10 bg-card p-6">
                <p className="font-display text-6xl leading-none text-vermilion">{step.n}</p>
                <h3 className="mt-5 font-display text-2xl">{step.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.d}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="mt-10 bg-vermilion px-4 py-14 text-ink sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6">
          <p className="font-display text-[clamp(2.75rem,8vw,6rem)] leading-none tracking-tight">Hire the process.</p>
          <p className="font-mono text-[11px] uppercase leading-relaxed tracking-wider">Real names stay private<br />until you hire</p>
        </div>
      </footer>

      <WorkflowModal item={selected ? selected.item : null} creator={selected ? selected.creator : null} onClose={() => setSelected(null)} />
    </div>
  )
}
