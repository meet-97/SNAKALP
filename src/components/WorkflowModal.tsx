'use client';

import type { Creator, PortfolioItem } from '@/types';

interface WorkflowModalProps {
  item: PortfolioItem | null;
  creator: Creator | null;
  onClose: () => void;
}

export default function WorkflowModal(props: WorkflowModalProps) {
  if (props.item === null) {
    return null;
  }
  return (
    <div className="border border-dashed border-slate-700 bg-slate-900 p-3 text-sm text-slate-300">
      WorkflowModal stub
    </div>
  );
}