'use client';

import type { Creator, MatchResult, PortfolioItem } from '@/types';

interface CreatorCardProps {
  creator: Creator;
  matchResult?: MatchResult;
  onOpenWork: (item: PortfolioItem, creator: Creator) => void;
}

export default function CreatorCard(props: CreatorCardProps) {
  void props;
  return (
    <div className="border border-dashed border-slate-700 bg-slate-900 p-3 text-sm text-slate-300">
      CreatorCard stub
    </div>
  );
}