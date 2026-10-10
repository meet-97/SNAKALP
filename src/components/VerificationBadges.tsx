'use client';

import type { VerificationSignals } from '@/types';

interface VerificationBadgesProps {
  verification: VerificationSignals;
  size?: 'sm' | 'md';
}

export default function VerificationBadges(props: VerificationBadgesProps) {
  void props;
  return (
    <div className="border border-dashed border-slate-700 bg-slate-900 p-3 text-sm text-slate-300">
      VerificationBadges stub
    </div>
  );
}