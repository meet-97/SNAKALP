'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Bookmark, BookmarkCheck, Scale, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import VerificationBadges from '@/components/VerificationBadges'
import { MAX_COMPARE, useWorkspace } from '@/context/WorkspaceContext'
import { MEDIA_TYPE_LABELS } from '@/data/options'
import { formatMoney } from '@/lib/format'
import { Creator, PortfolioItem } from '@/types'

export default function QuickViewDrawer({
  creator,
  onClose,
  onOpenWork,
}: {
  creator: Creator | null
  onClose: () => void
  onOpenWork: (item: PortfolioItem, creator: Creator) => void
}) {
  const { isShortlisted, toggleShortlist, isComparing, toggleCompare, compare } = useWorkspace()

  useEffect(() => {
    if (!creator) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [creator, onClose])

  return (
    <AnimatePresence>
      {creator && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`${creator.handle} quick view`}>
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-y-auto bg-paper shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted">Quick view</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 hover:bg-ink hover:text-paper"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <h2 className="font-display text-5xl leading-none tracking-tight">{creator.handle}</h2>
                <p className="mt-3 text-muted">{creator.headline}</p>
                <div className="mt-3"><VerificationBadges verification={creator.verification} size="md" /></div>
              </div>

              <p className="text-sm leading-relaxed">{creator.bio}</p>

              <dl className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Rate', value: `${formatMoney(creator.hourlyRate)}/hr` },
                  { label: 'Turnaround', value: `${creator.turnaroundDays} days` },
                  { label: 'Rating', value: creator.rating.toFixed(1) },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-ink/10 bg-card p-3">
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">{stat.label}</dt>
                    <dd className="mt-1 font-display text-2xl">{stat.value}</dd>
                  </div>
                ))}
              </dl>

              <div>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted">Tools</p>
                <div className="flex flex-wrap gap-1.5">
                  {creator.toolsUsed.map((tool) => (
                    <span key={tool} className="rounded-full border border-ink/15 px-2.5 py-1 text-xs">{tool}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {creator.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-ink/5 px-2.5 py-1 text-xs">{skill}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted">
                  Featured work: tap to inspect the proof
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {creator.featuredWork.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onOpenWork(item, creator)}
                      className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-ink/5"
                      aria-label={`Inspect ${item.title}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.mediaUrl} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
                      <span className="absolute inset-x-0 bottom-0 bg-ink/80 px-2 py-1 text-left font-mono text-[9px] uppercase tracking-wide text-paper">
                        {MEDIA_TYPE_LABELS[item.mediaType]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 mt-auto flex gap-2 border-t border-ink/10 bg-paper p-4">
              <button
                type="button"
                onClick={() => toggleShortlist(creator.id, creator.handle)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-3 text-sm font-semibold transition ${
                  isShortlisted(creator.id) ? 'bg-lime text-ink' : 'bg-ink text-paper hover:bg-vermilion'
                }`}
              >
                {isShortlisted(creator.id) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                {isShortlisted(creator.id) ? 'Saved' : 'Save to shortlist'}
              </button>
              <button
                type="button"
                onClick={() => toggleCompare(creator.id)}
                aria-pressed={isComparing(creator.id)}
                title={`Compare (${compare.length}/${MAX_COMPARE})`}
                className={`flex items-center justify-center gap-1.5 rounded-full border px-4 py-3 text-sm font-semibold ${
                  isComparing(creator.id) ? 'border-ink bg-ink text-lime' : 'border-ink/20 hover:border-ink'
                }`}
              >
                <Scale className="h-4 w-4" aria-hidden /> Compare
              </button>
              <Link
                href={`/creator/${creator.id}`}
                aria-label="Open full profile"
                className="flex items-center justify-center rounded-full border border-ink/20 px-4 py-3 hover:border-ink"
              >
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
