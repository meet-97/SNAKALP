'use client'

import { AnimatePresence, motion } from 'motion/react'
import { LayoutGrid, List, Scale, X } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import CompareDrawer from '@/components/CompareDrawer'
import CreatorCard from '@/components/CreatorCard'
import EmptyState from '@/components/EmptyState'
import FilterPanel from '@/components/FilterPanel'
import QuickViewDrawer from '@/components/QuickViewDrawer'
import WorkflowModal from '@/components/WorkflowModal'
import { MAX_COMPARE, useWorkspace } from '@/context/WorkspaceContext'
import { mockCreators } from '@/data/mockCreators'
import { MEDIA_TYPE_LABELS } from '@/data/options'
import { DEFAULT_FILTERS, filterCreators, sortCreators } from '@/lib/filters'
import { Creator, CreatorFilters, CreatorSortKey, MediaType, PortfolioItem } from '@/types'

const SORT_KEYS: CreatorSortKey[] = ['rating', 'rate-low', 'rate-high', 'projects']

const SORT_LABELS: Record<CreatorSortKey, string> = {
  rating: 'Top rated',
  'rate-low': 'Rate: low to high',
  'rate-high': 'Rate: high to low',
  projects: 'Most projects',
}

const QUICK_TYPES: MediaType[] = ['video', 'image', 'audio', 'animation']

interface SelectedWork {
  item: PortfolioItem
  creator: Creator
}

export default function DiscoverPage() {
  const [filters, setFilters] = useState<CreatorFilters>(DEFAULT_FILTERS)
  const [sortBy, setSortBy] = useState<CreatorSortKey>('rating')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [selectedWork, setSelectedWork] = useState<SelectedWork | null>(null)
  const [quickView, setQuickView] = useState<Creator | null>(null)
  const [compareOpen, setCompareOpen] = useState(false)
  const { compare, clearCompare, toggleCompare } = useWorkspace()

  const results = useMemo(
    () => sortCreators(filterCreators(mockCreators, filters), sortBy),
    [filters, sortBy]
  )
  const compareCreators = compare
    .map((id) => mockCreators.find((creator) => creator.id === id))
    .filter((creator): creator is Creator => Boolean(creator))

  const closeQuickView = useCallback(() => setQuickView(null), [])
  const closeCompare = useCallback(() => setCompareOpen(false), [])

  function toggleQuickType(type: MediaType) {
    const has = filters.contentTypes.includes(type)
    setFilters({
      ...filters,
      contentTypes: has ? filters.contentTypes.filter((t) => t !== type) : [...filters.contentTypes, type],
    })
  }

  return (
    <div>

      {/* Results */}
      <section id="creators" className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Discover</p>
            <h2 className="mt-3 font-display text-5xl leading-none tracking-tight sm:text-7xl">
              Meet the makers.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Quick filters">
            <button
              type="button"
              onClick={() => setFilters({ ...filters, contentTypes: [] })}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                filters.contentTypes.length === 0 ? 'border-ink bg-ink text-paper' : 'border-ink/25 hover:border-ink'
              }`}
            >
              All
            </button>
            {QUICK_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleQuickType(type)}
                aria-pressed={filters.contentTypes.includes(type)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  filters.contentTypes.includes(type) ? 'border-ink bg-ink text-paper' : 'border-ink/25 hover:border-ink'
                }`}
              >
                {MEDIA_TYPE_LABELS[type]}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly })}
              aria-pressed={filters.verifiedOnly}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                filters.verifiedOnly ? 'border-ink bg-lime text-ink' : 'border-ink/25 hover:border-ink'
              }`}
            >
              Verified only
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <aside className="w-full lg:sticky lg:top-24 lg:w-80 lg:shrink-0">
            <FilterPanel filters={filters} onChange={setFilters} resultCount={results.length} />
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
                {results.length} {results.length === 1 ? 'creator' : 'creators'}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex rounded-full border border-ink/20 p-0.5" role="group" aria-label="Layout">
                  {(
                    [
                      { key: 'grid', Icon: LayoutGrid, label: 'Grid view' },
                      { key: 'list', Icon: List, label: 'List view' },
                    ] as const
                  ).map(({ key, Icon, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setView(key)}
                      aria-label={label}
                      aria-pressed={view === key}
                      className={`flex h-8 w-9 items-center justify-center rounded-full transition ${
                        view === key ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </button>
                  ))}
                </div>
                <label htmlFor="creator-sort" className="sr-only">Sort by</label>
                <select
                  id="creator-sort"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as CreatorSortKey)}
                  className="rounded-full border border-ink/20 bg-card px-4 py-2 text-sm focus:border-ink focus:outline-none"
                >
                  {SORT_KEYS.map((key) => (
                    <option key={key} value={key}>{SORT_LABELS[key]}</option>
                  ))}
                </select>
              </div>
            </div>

            {results.length === 0 ? (
              <EmptyState
                title="No creators match these filters"
                message="Try removing a tool or skill, or clear all filters."
                actionLabel="Clear filters"
                onAction={() => setFilters(DEFAULT_FILTERS)}
              />
            ) : (
              <div
                className={
                  view === 'grid'
                    ? 'grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3'
                    : 'grid grid-cols-1 gap-6'
                }
              >
                {results.map((creator, index) => (
                  <CreatorCard
                    key={creator.id}
                    creator={creator}
                    index={index}
                    onOpenWork={(item, owner) => setSelectedWork({ item, creator: owner })}
                    onQuickView={setQuickView}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>


      {/* Compare bar */}
      <AnimatePresence>
        {compareCreators.length > 0 && (
          <motion.div
            className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div className="flex w-full max-w-xl items-center gap-3 rounded-full border border-ink/10 bg-ink py-2 pl-5 pr-2 text-paper shadow-[0_30px_60px_-20px_rgba(20,17,15,0.6)]">
              <Scale className="h-4 w-4 shrink-0 text-lime" aria-hidden />
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                {compareCreators.map((creator) => (
                  <button
                    key={creator.id}
                    type="button"
                    onClick={() => toggleCompare(creator.id)}
                    aria-label={`Remove ${creator.handle} from compare`}
                    className="inline-flex items-center gap-1 rounded-full bg-paper/10 px-2.5 py-1 text-xs hover:bg-paper/20"
                  >
                    {creator.handle} <X className="h-3 w-3" aria-hidden />
                  </button>
                ))}
                <span className="font-mono text-[10px] uppercase tracking-wider text-paper/60">
                  {compareCreators.length}/{MAX_COMPARE}
                </span>
              </div>
              <button
                type="button"
                onClick={clearCompare}
                className="rounded-full px-3 py-2 text-xs text-paper/70 hover:text-paper"
              >
                Clear
              </button>
              <button
                type="button"
                disabled={compareCreators.length < 2}
                onClick={() => setCompareOpen(true)}
                className="rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                {compareCreators.length < 2 ? 'Pick 2+' : 'Compare'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <QuickViewDrawer
        creator={quickView}
        onClose={closeQuickView}
        onOpenWork={(item, owner) => setSelectedWork({ item, creator: owner })}
      />
      <CompareDrawer creators={compareCreators} open={compareOpen} onClose={closeCompare} />
      <WorkflowModal
        item={selectedWork ? selectedWork.item : null}
        creator={selectedWork ? selectedWork.creator : null}
        onClose={() => setSelectedWork(null)}
      />
    </div>
  )
}
