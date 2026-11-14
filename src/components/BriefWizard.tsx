'use client'

import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useAppState } from '@/context/AppContext'
import { mockCreators } from '@/data/mockCreators'
import {
  ALL_ASPECT_RATIOS,
  ALL_MEDIA_TYPES,
  ALL_SKILLS,
  ALL_STYLE_TAGS,
  ALL_TERRITORIES,
  ALL_TOOLS,
  ALL_USAGE_CHANNELS,
  MEDIA_TYPE_LABELS,
} from '@/data/options'
import { rankCreatorsForBrief } from '@/lib/filters'
import { formatMoney } from '@/lib/format'
import type { BriefBuilderResponse, BriefDraft, Creator } from '@/types'

const STEPS = ['Basics', 'Look and format', 'Budget and rights', 'Review'] as const

const ASPECT_HINTS: Record<string, string> = {
  '9:16': 'Reels, Shorts, TikTok',
  '16:9': 'YouTube, websites, TV',
  '1:1': 'Feed posts',
  '4:5': 'Instagram portrait',
  '21:9': 'Cinematic banners',
}

const field =
  'w-full rounded-2xl border border-ink/20 bg-card px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-ink focus:ring-4 focus:ring-lime/60'

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

function Chips<T extends string>({
  options,
  selected,
  onToggle,
  render,
}: {
  options: readonly T[]
  selected: readonly T[]
  onToggle: (value: T) => void
  render?: (value: T) => string
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const on = selected.includes(option)
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            aria-pressed={on}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              on ? 'border-ink bg-ink text-paper' : 'border-ink/25 hover:border-ink'
            }`}
          >
            {render ? render(option) : option}
          </button>
        )
      })}
    </div>
  )
}

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-3">
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{children}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  )
}

function validate(step: number, d: BriefDraft): string | null {
  if (step === 0) {
    if (d.brandName.trim().length < 2) return 'Please enter your company or brand name.'
    if (d.title.trim().length < 3) return 'Give your brief a short title.'
    if (d.description.trim().length < 20) return 'Describe the project in at least 20 characters.'
  }
  if (step === 2) {
    if (d.budgetMin <= 0) return 'Enter a minimum budget above zero.'
    if (d.budgetMin > d.budgetMax) return 'The minimum budget cannot be higher than the maximum.'
    if (d.deadlineDays < 1) return 'The deadline must be at least 1 day.'
    if (d.commercialUse.required && d.commercialUse.channels.length === 0) return 'Choose where the content will be used.'
  }
  return null
}

export default function BriefWizard({ defaultBrandName }: { defaultBrandName: string }) {
  const router = useRouter()
  const { addBrief } = useAppState()
  const [step, setStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [idea, setIdea] = useState('')
  const [aiState, setAiState] = useState<{ loading: boolean; note: string | null }>({ loading: false, note: null })
  const [draft, setDraft] = useState<BriefDraft>({
    brandName: defaultBrandName,
    title: '',
    description: '',
    deliverableType: 'video',
    styleTags: [],
    aspectRatio: '9:16',
    requiredTools: [],
    requiredSkills: [],
    budgetMin: 500,
    budgetMax: 1500,
    deadlineDays: 14,
    commercialUse: { required: true, channels: ['Social Media'], durationMonths: 12, territory: 'India', exclusive: false },
  })

  const update = (patch: Partial<BriefDraft>) => setDraft((current) => ({ ...current, ...patch }))
  const updateRights = (patch: Partial<BriefDraft['commercialUse']>) =>
    setDraft((current) => ({ ...current, commercialUse: { ...current.commercialUse, ...patch } }))

  const matches = useMemo(
    () =>
      rankCreatorsForBrief(mockCreators, draft)
        .slice(0, 4)
        .map((match) => ({ match, creator: mockCreators.find((c) => c.id === match.creatorId) as Creator }))
        .filter((entry) => Boolean(entry.creator)),
    [draft]
  )
  const rates = matches.slice(0, 3).map((entry) => entry.creator.hourlyRate)

  async function generate() {
    if (idea.trim().length < 5) {
      setAiState({ loading: false, note: 'Write a few words about your idea first.' })
      return
    }
    setAiState({ loading: true, note: null })
    try {
      const response = await fetch('/api/brief-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      })
      if (response.status === 401) {
        setAiState({ loading: false, note: 'Please sign in to use the AI brief builder.' })
        return
      }
      if (!response.ok) throw new Error('Request failed')
      const data = (await response.json()) as BriefBuilderResponse
      setDraft((current) => ({ ...data.draft, brandName: current.brandName || data.draft.brandName }))
      setAiState({
        loading: false,
        note: data.source === 'ai' ? 'Filled in by AI. Edit anything you like.' : 'Filled in by smart templates. Edit anything you like.',
      })
    } catch {
      setAiState({ loading: false, note: 'The builder could not finish. You can still fill the form by hand.' })
    }
  }

  function next() {
    const problem = validate(step, draft)
    setError(problem)
    if (!problem) setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  function submit() {
    for (const s of [0, 2]) {
      const problem = validate(s, draft)
      if (problem) {
        setStep(s)
        setError(problem)
        return
      }
    }
    addBrief(draft)
    toast.success('Brief posted. Matching creators are ready on your Briefs page.')
    router.push('/briefs')
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to home
        </Link>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-muted">
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </p>
        <div className="mb-8 mt-3 flex gap-2" aria-hidden>
          {STEPS.map((name, index) => (
            <span key={name} className={`h-1.5 flex-1 rounded-full transition-colors ${index <= step ? 'bg-vermilion' : 'bg-ink/10'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {step === 0 && (
              <>
                <h1 className="font-display text-5xl leading-none tracking-tight sm:text-6xl">
                  What do you need <em className="text-vermilion">made</em>?
                </h1>
                <div className="rounded-3xl bg-lime p-5">
                  <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider"><Sparkles className="h-4 w-4" aria-hidden /> Start from a rough idea</p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      placeholder="30 second reel for a sneaker launch, futuristic"
                      aria-label="Describe your idea"
                      className="flex-1 rounded-full border border-ink bg-card px-5 py-3 text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={generate}
                      disabled={aiState.loading}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper disabled:opacity-60"
                    >
                      {aiState.loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Generate brief
                    </button>
                  </div>
                  {aiState.note && <p className="mt-3 text-sm" role="status">{aiState.note}</p>}
                </div>
                <label className="block">
                  <Label>Brand or company</Label>
                  <input className={field} value={draft.brandName} onChange={(e) => update({ brandName: e.target.value })} placeholder="Acme Studios" />
                </label>
                <label className="block">
                  <Label>Brief title</Label>
                  <input className={field} value={draft.title} onChange={(e) => update({ title: e.target.value })} placeholder="Sneaker launch reel" />
                </label>
                <label className="block">
                  <Label hint="What is it for, who is it for, and what should people feel?">Description</Label>
                  <textarea className={`${field} min-h-32`} value={draft.description} onChange={(e) => update({ description: e.target.value })} placeholder="A 30 second futuristic reel introducing our new running shoe..." />
                </label>
              </>
            )}

            {step === 1 && (
              <>
                <h1 className="font-display text-5xl leading-none tracking-tight sm:text-6xl">
                  What should it <em className="text-vermilion">look</em> like?
                </h1>
                <div>
                  <Label>Content type</Label>
                  <Chips options={ALL_MEDIA_TYPES} selected={[draft.deliverableType]} onToggle={(v) => update({ deliverableType: v })} render={(v) => MEDIA_TYPE_LABELS[v]} />
                </div>
                <div>
                  <Label>Format</Label>
                  <div className="flex flex-wrap gap-3">
                    {ALL_ASPECT_RATIOS.map((ratio) => {
                      const on = draft.aspectRatio === ratio
                      const [w, h] = ratio.split(':').map(Number)
                      return (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => update({ aspectRatio: ratio })}
                          aria-pressed={on}
                          className={`w-28 rounded-2xl border p-3 text-center transition ${on ? 'border-ink bg-card shadow-[0_14px_30px_-18px_rgba(20,17,15,0.5)]' : 'border-ink/20 hover:border-ink'}`}
                        >
                          <span className={`mx-auto mb-2 block rounded-md ${on ? 'bg-vermilion' : 'bg-ink/15'}`} style={{ width: 36, aspectRatio: `${w} / ${h}`, maxHeight: 52 }} />
                          <span className="block font-mono text-xs">{ratio}</span>
                          <span className="block text-[10px] text-muted">{ASPECT_HINTS[ratio]}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <Label>Style</Label>
                  <Chips options={ALL_STYLE_TAGS} selected={draft.styleTags} onToggle={(v) => update({ styleTags: toggle(draft.styleTags, v) })} />
                </div>
                <div>
                  <Label hint="Creators who use all of these rank highest.">Tools you need</Label>
                  <Chips options={ALL_TOOLS} selected={draft.requiredTools} onToggle={(v) => update({ requiredTools: toggle(draft.requiredTools, v) })} />
                </div>
                <div>
                  <Label>Skills you need</Label>
                  <Chips options={ALL_SKILLS} selected={draft.requiredSkills} onToggle={(v) => update({ requiredSkills: toggle(draft.requiredSkills, v) })} />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="font-display text-5xl leading-none tracking-tight sm:text-6xl">
                  Budget, time and <em className="text-vermilion">rights</em>.
                </h1>
                <div className="grid gap-5 sm:grid-cols-3">
                  <label className="block"><Label>Minimum budget</Label><input type="number" min={0} className={field} value={draft.budgetMin} onChange={(e) => update({ budgetMin: Number(e.target.value) || 0 })} /></label>
                  <label className="block"><Label>Maximum budget</Label><input type="number" min={0} className={field} value={draft.budgetMax} onChange={(e) => update({ budgetMax: Number(e.target.value) || 0 })} /></label>
                  <label className="block"><Label>Deadline (days)</Label><input type="number" min={1} className={field} value={draft.deadlineDays} onChange={(e) => update({ deadlineDays: Number(e.target.value) || 0 })} /></label>
                </div>
                <div className="rounded-3xl border border-ink/10 bg-card p-5">
                  <label className="flex cursor-pointer items-center justify-between gap-4">
                    <span>
                      <span className="block font-display text-2xl">Commercial use</span>
                      <span className="text-sm text-muted">Will this content be used in ads or sold? Creators with non-commercial work get flagged.</span>
                    </span>
                    <input type="checkbox" checked={draft.commercialUse.required} onChange={(e) => updateRights({ required: e.target.checked })} className="h-5 w-5 accent-ink" />
                  </label>
                  {draft.commercialUse.required && (
                    <div className="mt-6 space-y-6 border-t border-ink/10 pt-6">
                      <div><Label>Where will it be used?</Label><Chips options={ALL_USAGE_CHANNELS} selected={draft.commercialUse.channels} onToggle={(v) => updateRights({ channels: toggle(draft.commercialUse.channels, v) })} /></div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block"><Label>For how many months?</Label><input type="number" min={1} className={field} value={draft.commercialUse.durationMonths} onChange={(e) => updateRights({ durationMonths: Number(e.target.value) || 1 })} /></label>
                        <div><Label>Territory</Label><Chips options={ALL_TERRITORIES} selected={[draft.commercialUse.territory]} onToggle={(v) => updateRights({ territory: v })} /></div>
                      </div>
                      <label className="flex cursor-pointer items-center gap-3 text-sm">
                        <input type="checkbox" checked={draft.commercialUse.exclusive} onChange={(e) => updateRights({ exclusive: e.target.checked })} className="h-5 w-5 accent-ink" />
                        Exclusive: the creator cannot reuse this work elsewhere
                      </label>
                    </div>
                  )}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h1 className="font-display text-5xl leading-none tracking-tight sm:text-6xl">
                  Ready to <em className="text-vermilion">post</em>?
                </h1>
                <dl className="divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-card px-6">
                  {[
                    ['Brand', draft.brandName],
                    ['Title', draft.title],
                    ['Content', `${MEDIA_TYPE_LABELS[draft.deliverableType]}, ${draft.aspectRatio}`],
                    ['Style', draft.styleTags.join(', ') || 'Not specified'],
                    ['Tools', draft.requiredTools.join(', ') || 'Any'],
                    ['Skills', draft.requiredSkills.join(', ') || 'Any'],
                    ['Budget', `${formatMoney(draft.budgetMin)} to ${formatMoney(draft.budgetMax)}`],
                    ['Deadline', `${draft.deadlineDays} days`],
                    ['Usage rights', draft.commercialUse.required ? `${draft.commercialUse.channels.join(', ')} / ${draft.commercialUse.durationMonths} months / ${draft.commercialUse.territory}${draft.commercialUse.exclusive ? ' / exclusive' : ''}` : 'Not commercial'],
                  ].map(([k, v]) => (
                    <div key={k} className="grid gap-1 py-3 sm:grid-cols-[140px_1fr]">
                      <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{k}</dt>
                      <dd className="text-sm">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-sm text-muted">{draft.description}</p>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p role="alert" className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
        )}

        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => { setError(null); setStep((s) => Math.max(s - 1, 0)) }}
            disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-6 py-3 text-sm font-semibold transition hover:border-ink disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-sm font-semibold text-paper transition hover:bg-vermilion">
              Continue <ArrowRight className="h-4 w-4 text-lime" aria-hidden />
            </button>
          ) : (
            <button type="button" onClick={submit} className="inline-flex items-center gap-2 rounded-full bg-vermilion px-7 py-3 text-sm font-semibold text-ink transition hover:bg-ink hover:text-lime">
              <Check className="h-4 w-4" aria-hidden /> Post brief
            </button>
          )}
        </div>
      </div>

      {/* Live panel: always visible and always complete */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl bg-ink p-6 text-paper">
          <p className="font-mono text-[11px] uppercase tracking-wider text-lime">&#9679; Live matches</p>

          <div className="mt-5 flex items-center gap-4">
            <span
              className="block shrink-0 rounded-lg bg-vermilion"
              style={{ width: 44, aspectRatio: draft.aspectRatio.replace(':', ' / '), maxHeight: 64 }}
              aria-hidden
            />
            <div className="min-w-0">
              <p className="truncate font-display text-2xl leading-tight">{draft.title || 'Untitled brief'}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-paper/60">
                {MEDIA_TYPE_LABELS[draft.deliverableType]} / {draft.aspectRatio} / {formatMoney(draft.budgetMin)}-{formatMoney(draft.budgetMax)}
              </p>
            </div>
          </div>

          <ul className="mt-6 space-y-5">
            {matches.map(({ match, creator }) => (
              <li key={creator.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate font-display text-xl">{creator.handle}</span>
                  <span className="font-display text-3xl text-lime">{match.score}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper/15">
                  <motion.div className="h-full rounded-full bg-lime" initial={false} animate={{ width: `${match.score}%` }} transition={{ type: 'spring', damping: 26, stiffness: 180 }} />
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-paper/70">
                  {match.matchedTools.length > 0 && <span className="text-lime">Has {match.matchedTools.join(', ')}. </span>}
                  {match.missingTools.length > 0 && <span>Missing {match.missingTools.join(', ')}. </span>}
                  {draft.requiredTools.length === 0 && 'Pick tools to sharpen the ranking.'}
                </p>
                {match.licenseConflict && (
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-300">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden /> Has non-commercial work of this type
                  </p>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-paper/15 pt-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-paper/60">Typical rate</p>
              <p className="mt-1 font-display text-2xl">
                {rates.length ? `${formatMoney(Math.min(...rates))}-${formatMoney(Math.max(...rates))}` : '-'}
                <span className="text-sm text-paper/60">/hr</span>
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-paper/60">Fast turnaround</p>
              <p className="mt-1 font-display text-2xl">
                {matches.length ? Math.min(...matches.map((m) => m.creator.turnaroundDays)) : '-'}
                <span className="text-sm text-paper/60"> days</span>
              </p>
            </div>
          </div>
        </div>
        <p className="mt-3 px-2 text-xs text-muted">Matches update as you change format, style, tools and skills.</p>
      </aside>
    </div>
  )
}
