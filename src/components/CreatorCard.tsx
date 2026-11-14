'use client'

import { ArrowUpRight, Bookmark, BookmarkCheck, Check, Clock, Eye, Scale, Star } from 'lucide-react'
import Link from 'next/link'
import VerificationBadges from '@/components/VerificationBadges'
import { useWorkspace } from '@/context/WorkspaceContext'
import { LICENSE_TYPE_LABELS, MEDIA_TYPE_LABELS } from '@/data/options'
import { formatMoney } from '@/lib/format'
import { Creator, MatchResult, PortfolioItem } from '@/types'

const MAX_TOOLS = 3

export default function CreatorCard({
  creator,
  matchResult,
  onOpenWork,
  onQuickView,
  index = 0,
}: {
  creator: Creator
  matchResult?: MatchResult
  onOpenWork: (item: PortfolioItem, creator: Creator) => void
  onQuickView?: (creator: Creator) => void
  index?: number
}) {
  const { isShortlisted, toggleShortlist, isComparing, toggleCompare } = useWorkspace()
  const cover = creator.featuredWork[0]
  const saved = isShortlisted(creator.id)
  const comparing = isComparing(creator.id)
  const extraTools = creator.toolsUsed.length - MAX_TOOLS

  return (
    <article
      className="anim-rise group relative flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-card transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_40px_60px_-34px_rgba(20,17,15,0.45)]"
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
    >
      <div className="relative h-60 overflow-hidden bg-ink/5">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.mediaUrl}
            alt={cover.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.1)_0_1px,transparent_1px_16px)]" />

        {cover && (
          <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider">
            {MEDIA_TYPE_LABELS[cover.mediaType]}
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleShortlist(creator.id, creator.handle)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${creator.handle} from shortlist` : `Save ${creator.handle} to shortlist`}
          className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full transition ${
            saved ? 'bg-lime text-ink' : 'bg-paper/90 text-ink hover:bg-ink hover:text-paper'
          }`}
        >
          {saved ? <BookmarkCheck className="h-4 w-4" aria-hidden /> : <Bookmark className="h-4 w-4" aria-hidden />}
        </button>

        <button
          type="button"
          onClick={() => toggleCompare(creator.id)}
          aria-pressed={comparing}
          aria-label={comparing ? `Remove ${creator.handle} from compare` : `Add ${creator.handle} to compare`}
          className={`absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            comparing ? 'bg-ink text-lime' : 'bg-paper/90 text-ink hover:bg-ink hover:text-paper'
          }`}
        >
          {comparing ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Scale className="h-3.5 w-3.5" aria-hidden />} Compare
        </button>

        {/* Hover: reveal the proof behind the first piece of work */}
        {cover && (
          <div className="absolute inset-0 flex flex-col justify-between bg-ink/95 p-5 text-lime opacity-0 transition duration-300 focus-within:opacity-100 group-hover:opacity-100">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider">Proof of workflow</p>
              <dl className="mt-3 space-y-1.5 font-mono text-[11px] uppercase tracking-wide text-paper">
                <div className="flex justify-between gap-3"><dt className="text-lime">Model</dt><dd className="truncate">{cover.workflow.modelCheckpoint}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-lime">Seed</dt><dd>{cover.workflow.seed}</dd></div>
                {cover.workflow.cfgScale !== undefined && (
                  <div className="flex justify-between gap-3"><dt className="text-lime">CFG</dt><dd>{cover.workflow.cfgScale}</dd></div>
                )}
                <div className="flex justify-between gap-3"><dt className="text-lime">Licence</dt><dd className="truncate">{LICENSE_TYPE_LABELS[cover.licenseType]}</dd></div>
              </dl>
            </div>
            <button
              type="button"
              onClick={() => onOpenWork(cover, creator)}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-lime px-4 py-2.5 text-sm font-semibold text-ink"
            >
              Inspect full proof <ArrowUpRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        )}

        {matchResult && (
          <span className="absolute bottom-3 left-3 rounded-full bg-lime px-3 py-1 font-mono text-[11px] font-semibold text-ink">
            {matchResult.score}% match
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-3xl leading-none tracking-tight">{creator.handle}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted">{creator.headline}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 font-mono text-xs">
            <Star className="h-3.5 w-3.5 fill-vermilion text-vermilion" aria-hidden />
            {creator.rating.toFixed(1)}
          </span>
        </div>

        <div className="mt-3">
          <VerificationBadges verification={creator.verification} size="sm" />
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {creator.toolsUsed.slice(0, MAX_TOOLS).map((tool) => (
            <span key={tool} className="rounded-full border border-ink/15 px-2.5 py-1 text-xs">{tool}</span>
          ))}
          {extraTools > 0 && (
            <span className="rounded-full bg-ink/5 px-2.5 py-1 text-xs text-muted">+{extraTools}</span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4 font-mono text-[11px] uppercase tracking-wide text-muted">
          <span className="text-ink">{formatMoney(creator.hourlyRate)}/hr</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden />{creator.turnaroundDays} days</span>
          <span>{creator.completedProjects} projects</span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => (onQuickView ? onQuickView(creator) : undefined)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition hover:bg-vermilion"
          >
            <Eye className="h-4 w-4" aria-hidden /> Quick view
          </button>
          <Link
            href={`/creator/${creator.id}`}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-ink/20 px-5 py-2.5 text-sm font-semibold transition hover:border-ink"
          >
            Profile
          </Link>
        </div>
      </div>
    </article>
  )
}
