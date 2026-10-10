'use client';

import { useState } from 'react';
import CreatorCard from '@/components/CreatorCard';
import EmptyState from '@/components/EmptyState';
import FilterPanel from '@/components/FilterPanel';
import WorkflowModal from '@/components/WorkflowModal';
import { mockCreators } from '@/data/mockCreators';
import { DEFAULT_FILTERS, filterCreators, sortCreators } from '@/lib/filters';
import { Creator, CreatorFilters, CreatorSortKey, PortfolioItem } from '@/types';

const SORT_KEYS: CreatorSortKey[] = ['rating', 'rate-low', 'rate-high', 'projects'];

const SORT_LABELS: Record<CreatorSortKey, string> = {
  rating: 'Top rated',
  'rate-low': 'Rate: low to high',
  'rate-high': 'Rate: high to low',
  projects: 'Most projects',
};

interface SelectedWork {
  item: PortfolioItem;
  creator: Creator;
}

export default function HomePage() {
  const [filters, setFilters] = useState<CreatorFilters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<CreatorSortKey>('rating');
  const [selectedWork, setSelectedWork] = useState<SelectedWork | null>(null);

  const results = sortCreators(filterCreators(mockCreators, filters), sortBy);

  function handleOpenWork(item: PortfolioItem, creator: Creator) {
    setSelectedWork({ item, creator });
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-10">
        <h1 className="text-3xl font-semibold text-slate-100 sm:text-4xl">
          Find AI creators you can actually trust
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-400">
          Proof-of-Workflow shows the models, seeds and prompts behind every portfolio piece, so
          you can verify the work and ask for it to be re-created.
        </p>
      </section>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="w-full lg:w-80 lg:shrink-0">
          <FilterPanel filters={filters} onChange={setFilters} resultCount={results.length} />
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              {results.length} {results.length === 1 ? 'creator' : 'creators'}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="creator-sort" className="text-sm text-slate-400">
                Sort by
              </label>
              <select
                id="creator-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as CreatorSortKey)}
                className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-violet-500 focus:outline-none"
              >
                {SORT_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {SORT_LABELS[key]}
                  </option>
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} onOpenWork={handleOpenWork} />
              ))}
            </div>
          )}
        </main>
      </div>

      <WorkflowModal
        item={selectedWork ? selectedWork.item : null}
        creator={selectedWork ? selectedWork.creator : null}
        onClose={() => setSelectedWork(null)}
      />
    </div>
  );
}