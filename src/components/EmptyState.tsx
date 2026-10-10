'use client';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-400">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-400"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}