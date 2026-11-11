'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Check, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useWorkspace } from '@/context/WorkspaceContext'
import { formatMoney } from '@/lib/format'
import { Creator } from '@/types'

type Row = {
  label: string
  render: (creator: Creator) => ReactNode
  best?: (creators: Creator[]) => string // returns the id of the "best" creator
}

function cleanWorks(creator: Creator) {
  return creator.featuredWork.filter((work) => work.commercialLicensed).length
}

const ROWS: Row[] = [
  {
    label: 'Rate',
    render: (c) => `${formatMoney(c.hourlyRate)}/hr`,
    best: (list) => [...list].sort((a, b) => a.hourlyRate - b.hourlyRate)[0].id,
  },
  {
    label: 'Turnaround',
    render: (c) => `${c.turnaroundDays} days`,
    best: (list) => [...list].sort((a, b) => a.turnaroundDays - b.turnaroundDays)[0].id,
  },
  {
    label: 'Rating',
    render: (c) => c.rating.toFixed(1),
    best: (list) => [...list].sort((a, b) => b.rating - a.rating)[0].id,
  },
  {
    label: 'Projects done',
    render: (c) => c.completedProjects,
    best: (list) => [...list].sort((a, b) => b.completedProjects - a.completedProjects)[0].id,
  },
  { label: 'Level', render: (c) => c.experienceLevel },
  {
    label: 'Commercial-safe work',
    render: (c) => `${cleanWorks(c)} of ${c.featuredWork.length} pieces`,
    best: (list) => [...list].sort((a, b) => cleanWorks(b) - cleanWorks(a))[0].id,
  },
  {
    label: 'Verified',
    render: (c) => {
      const v = c.verification
      const done = [v.toolsVerified && 'Tools', v.workflowVerified && 'Workflow', v.pastWorkVerified && 'Past work']
      return done.filter(Boolean).join(', ') || 'Not yet'
    },
  },
  { label: 'Tools', render: (c) => c.toolsUsed.join(', ') },
  { label: 'Skills', render: (c) => c.skills.join(', ') },
  { label: 'Content types', render: (c) => c.contentTypes.join(', ') },
]

export default function CompareDrawer({
  creators,
  open,
  onClose,
}: {
  creators: Creator[]
  open: boolean
  onClose: () => void
}) {
  const { toggleCompare, isShortlisted, toggleShortlist } = useWorkspace()

  useEffect(() => {
    if (!open) return
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
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && creators.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Compare creators">
          <motion.div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative max-h-[92vh] w-full max-w-5xl overflow-auto rounded-t-3xl bg-paper shadow-2xl sm:rounded-3xl"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="font-display text-4xl tracking-tight">Side by side</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close comparison"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 hover:bg-ink hover:text-paper"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="overflow-x-auto px-6 pb-6">
              <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left text-sm">
                <thead>
                  <tr>
                    <th className="w-40" />
                    {creators.map((creator) => (
                      <th key={creator.id} className="px-3 pb-4 align-bottom">
                        <p className="font-display text-2xl font-medium">{creator.handle}</p>
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => toggleShortlist(creator.id, creator.handle)}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                              isShortlisted(creator.id) ? 'bg-lime text-ink' : 'bg-ink text-paper hover:bg-vermilion'
                            }`}
                          >
                            {isShortlisted(creator.id) ? 'Saved' : 'Save'}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleCompare(creator.id)}
                            className="rounded-full border border-ink/20 px-3 py-1.5 text-xs font-semibold hover:border-ink"
                          >
                            Remove
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => {
                    const bestId = row.best && creators.length > 1 ? row.best(creators) : null
                    return (
                      <tr key={row.label}>
                        <th className="border-t border-ink/10 py-3 pr-3 font-mono text-[11px] font-medium uppercase tracking-wider text-muted">
                          {row.label}
                        </th>
                        {creators.map((creator) => (
                          <td key={creator.id} className="border-t border-ink/10 px-3 py-3 align-top">
                            <span
                              className={`inline-flex items-start gap-1.5 ${
                                bestId === creator.id ? 'rounded-lg bg-lime px-2 py-0.5 font-semibold' : ''
                              }`}
                            >
                              {bestId === creator.id && <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-label="Best in this row" />}
                              {row.render(creator)}
                            </span>
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <p className="mt-4 text-xs text-muted">Highlighted cells are the best value in that row.</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
