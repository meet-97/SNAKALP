'use client';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState(props: EmptyStateProps) {
  void props;
  return (
    <div className="border border-dashed border-slate-700 bg-slate-900 p-3 text-sm text-slate-300">
      EmptyState stub
    </div>
  );
}