'use client';

import { useState } from 'react';
import Link from 'next/link';
import VerificationBadges from '@/components/VerificationBadges';
import { MEDIA_TYPE_LABELS } from '@/data/options';
import { formatMoney } from '@/lib/format';
import { Creator, MatchResult, PortfolioItem } from '@/types';

const MAX_VISIBLE_TOOLS = 4;
const MAX_VISIBLE_THUMBNAILS = 3;

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

function matchPillClass(score: number): string {
  if (score >= 70) {
    return 'border-emerald-400 bg-emerald-400/10 text-emerald-400';
  }
  if (score >= 40) {
    return 'border-amber-400 bg-amber-400/10 text-amber-400';
  }
  return 'border-slate-600 bg-slate-800 text-slate-300';
}

export default function CreatorCard({
  creator,
  matchResult,
  onOpenWork,
}: {
  creator: Creator;
  matchResult?: MatchResult;
  onOpenWork: (item: PortfolioItem, creator: Creator) => void;
}) {
  const [avatarFailed, setAvatarFailed] = useState<boolean>(false);

  const showAvatarImage = creator.avatarUrl !== '' && !avatarFailed;
  const visibleTools = creator.toolsUsed.slice(0, MAX_VISIBLE_TOOLS);
  const hiddenToolCount = creator.toolsUsed.length - visibleTools.length;
  const thumbnails = creator.featuredWork.slice(0, MAX_VISIBLE_THUMBNAILS);

  return (
    <article className="flex h-full flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start gap-4">
        {showAvatarImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={creator.avatarUrl}
            alt={`${creator.name} avatar`}
            onError={() => setAvatarFailed(true)}
            className="h-14 w-14 shrink-0 rounded-full border border-slate-700 object-cover"
          />
        ) : (
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-violet-500 bg-violet-500/20 text-lg font-semibold text-violet-300"
            aria-label={`${creator.name} initials`}
          >
            {getInitials(creator.name)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-semibold text-slate-100">{creator.name}</h2>
            <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300">
              {creator.experienceLevel}
            </span>
          </div>
          <p className="truncate text-sm text-slate-400">{creator.handle}</p>
        </div>
      </div>

      <p className="text-sm text-slate-300">{creator.headline}</p>

      <div className="flex flex-wrap items-center gap-2">
        <VerificationBadges verification={creator.verification} size="sm" />
        {matchResult ? (
          <>
            <span
              className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${matchPillClass(
                matchResult.score,
              )}`}
            >
              {matchResult.score}% match
            </span>
            {matchResult.licenseConflict ? (
              <span className="rounded-full border border-amber-400 bg-amber-400/10 px-3 py-0.5 text-xs font-semibold text-amber-400">
                Licence conflict
              </span>
            ) : null}
          </>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {visibleTools.map((tool) => (
          <span
            key={tool}
            className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-300"
          >
            {tool}
          </span>
        ))}
        {hiddenToolCount > 0 ? (
          <span className="rounded-full border border-violet-500 bg-violet-500/10 px-2.5 py-1 text-xs font-semibold text-violet-300">
            +{hiddenToolCount}
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">{formatMoney(creator.hourlyRate)}/hr</span>
        <span>
          <span className="text-amber-400" aria-hidden="true">
            ★
          </span>{' '}
          {creator.rating.toFixed(1)}
        </span>
        <span>{creator.completedProjects} projects</span>
        <span>{creator.turnaroundDays} days turnaround</span>
      </div>

      {thumbnails.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {thumbnails.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpenWork(item, creator)}
              aria-label={`Open workflow for ${item.title}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-slate-800 bg-slate-950 focus:border-violet-500 focus:outline-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.mediaUrl}
                alt={item.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <span className="absolute left-1.5 top-1.5 rounded-full bg-slate-950/80 px-2 py-0.5 text-[10px] font-semibold text-slate-100">
                {MEDIA_TYPE_LABELS[item.mediaType]}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-auto">
        <Link
          href={`/creator/${creator.id}`}
          className="inline-flex w-full items-center justify-center rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-400"
        >
          View profile
        </Link>
      </div>
    </article>
  );
}