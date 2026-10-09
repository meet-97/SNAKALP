'use client';

import type { VerificationSignals } from '@/types';

export default function VerificationBadges(props: { verification: VerificationSignals; size?: 'sm' | 'md' }) {
  void props;
  return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-100">VerificationBadges stub</div>;
}
