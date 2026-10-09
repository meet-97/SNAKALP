'use client';

import type { Creator, MatchResult, PortfolioItem } from '@/types';

export default function CreatorCard(props: { creator: Creator; matchResult?: MatchResult; onOpenWork: (item: PortfolioItem, creator: Creator) => void }) {
  void props;
  return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-100">CreatorCard stub</div>;
}
