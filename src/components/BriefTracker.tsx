'use client';

import type { BriefStatus } from '@/types';

interface BriefTrackerProps {
  status: BriefStatus;
}

export default function BriefTracker(props: BriefTrackerProps) {
  void props;
  return (
    <div className="border border-dashed border-slate-700 bg-slate-900 p-3 text-sm text-slate-300">
      BriefTracker stub
    </div>
  );
}