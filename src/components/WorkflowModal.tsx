'use client';

import type { PortfolioItem, Creator } from '@/types';

export default function WorkflowModal(props: { item: PortfolioItem | null; creator: Creator | null; onClose: () => void }) {
  void props;
  if (!props.item) return null;
  return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-100">WorkflowModal stub</div>;
}
