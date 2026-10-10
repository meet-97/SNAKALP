'use client';

import { VerificationSignals } from '@/types';

type BadgeSize = 'sm' | 'md';

interface VerificationBadgesProps {
  verification: VerificationSignals;
  size?: BadgeSize;
}

const BADGES: {
  key: keyof VerificationSignals;
  label: string;
  description: string;
}[] = [
  {
    key: 'toolsVerified',
    label: 'Tools verified',
    description: 'The AI tools listed on this profile have been checked.',
  },
  {
    key: 'workflowVerified',
    label: 'Workflow verified',
    description: 'The creator settings used for their work have been reviewed.',
  },
  {
    key: 'pastWorkVerified',
    label: 'Past work verified',
    description: 'The past projects shown on this profile have been checked.',
  },
];

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-3 py-1 text-sm gap-1.5',
};

const ICON_SIZE: Record<BadgeSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
};

export default function VerificationBadges({
  verification,
  size = 'sm',
}: VerificationBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {BADGES.map((badge) => {
        const isVerified = verification[badge.key];

        const stateClasses = isVerified
          ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400'
          : 'border-slate-700 bg-slate-800 text-slate-500 opacity-50';

        return (
          <span
            key={badge.key}
            title={badge.description}
            className={`inline-flex items-center rounded-full border font-medium ${SIZE_CLASSES[size]} ${stateClasses}`}
          >
            {isVerified ? (
              <svg
                className={ICON_SIZE[size]}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 5.296a1 1 0 010 1.408l-7.5 7.5a1 1 0 01-1.408 0l-3.5-3.5a1 1 0 111.408-1.408L8.5 11.59l6.796-6.795a1 1 0 011.408 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className={ICON_SIZE[size]}
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="10" cy="10" r="7" />
              </svg>
            )}
            <span>{badge.label}</span>
          </span>
        );
      })}
    </div>
  );
}