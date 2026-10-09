'use client';

import type { CreatorFilters } from '@/types';

export default function FilterPanel(props: { filters: CreatorFilters; onChange: (filters: CreatorFilters) => void; resultCount: number }) {
  void props;
  return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-100">FilterPanel stub</div>;
}
