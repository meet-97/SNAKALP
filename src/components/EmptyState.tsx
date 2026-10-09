'use client';

export default function EmptyState(props: { title: string; message: string; actionLabel?: string; onAction?: () => void }) {
  void props;
  return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-100">EmptyState stub</div>;
}
