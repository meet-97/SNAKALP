'use client';

import { BriefStatus } from '@/types';
import { BRIEF_STATUS_ORDER, BRIEF_STATUS_LABELS } from '@/data/options';

interface BriefTrackerProps {
  status: BriefStatus;
}

export default function BriefTracker({ status }: BriefTrackerProps) {
  const currentIndex = BRIEF_STATUS_ORDER.indexOf(status);

  return (
    <div className="overflow-x-auto">
      <ol className="flex min-w-max items-center gap-2 py-2">
        {BRIEF_STATUS_ORDER.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;

          const stateClasses = isCurrent
            ? 'border-violet-500 bg-violet-500 text-white'
            : isDone
              ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400'
              : 'border-slate-700 bg-slate-800 text-slate-500';

          return (
            <li key={step} className="flex items-center gap-2">
              <span
                aria-current={isCurrent ? 'step' : undefined}
                className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${stateClasses}`}
              >
                {BRIEF_STATUS_LABELS[step]}
              </span>
              {index < BRIEF_STATUS_ORDER.length - 1 && (
                <span className="h-px w-4 bg-slate-700" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}