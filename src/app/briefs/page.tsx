'use client';

import { useState } from 'react';
import { useAppState } from '@/context/AppContext';
import { rankCreatorsForBrief } from '@/lib/filters';
import { mockCreators, getCreatorById } from '@/data/mockCreators';
import { formatMoney } from '@/lib/format';
import {
  BRIEF_STATUS_LABELS,
  BRIEF_STATUS_ORDER,
  MEDIA_TYPE_LABELS,
} from '@/data/options';
import BriefTracker from '@/components/BriefTracker';
import EmptyState from '@/components/EmptyState';
import BriefModal from '@/components/BriefModal';
import type { ProjectBrief } from '@/types';

// ---------- Local helpers (not exported) ----------

function describeCommercialUse(brief: ProjectBrief): string {
  const use = brief.commercialUse;
  if (!use.required) return 'Not for commercial use';
  const channels = use.channels.length > 0 ? use.channels.join(', ') : 'No channels chosen';
  const months = `${use.durationMonths} ${use.durationMonths === 1 ? 'month' : 'months'}`;
  const exclusivity = use.exclusive ? 'Exclusive' : 'Non-exclusive';
  return `${channels} · ${months} · ${use.territory} · ${exclusivity}`;
}

function Pill({ label, tone }: { label: string; tone: 'violet' | 'slate' | 'emerald' | 'rose' }) {
  const tones = {
    violet: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
    slate: 'border-slate-700 bg-slate-800 text-slate-300',
    emerald: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400',
    rose: 'border-rose-400/40 bg-rose-400/10 text-rose-400',
  };
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs ${tones[tone]}`}>{label}</span>
  );
}

function PillRow({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'violet' | 'slate';
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{title}</p>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">None specified</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <Pill key={item} label={item} tone={tone} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Brief card ----------

function BriefCard({ brief }: { brief: ProjectBrief }) {
  const { shortlistCreator, assignCreator, setBriefStatus } = useAppState();

  const topMatches = rankCreatorsForBrief(mockCreators, brief).slice(0, 3);
  const statusIndex = BRIEF_STATUS_ORDER.indexOf(brief.status);
  const previousStatus = statusIndex > 0 ? BRIEF_STATUS_ORDER[statusIndex - 1] : null;
  const nextStatus =
    statusIndex >= 0 && statusIndex < BRIEF_STATUS_ORDER.length - 1
      ? BRIEF_STATUS_ORDER[statusIndex + 1]
      : null;
  const assignedCreator = brief.assignedCreatorId
    ? getCreatorById(brief.assignedCreatorId)
    : undefined;

  return (
    <article className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5">
      {/* Heading */}
      <header className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-violet-300">
          {brief.brandName}
        </p>
        <h2 className="text-lg font-semibold">{brief.title}</h2>
        <p className="text-sm text-slate-300">{brief.description}</p>
      </header>

      {/* Key facts */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Content type and format
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Pill label={MEDIA_TYPE_LABELS[brief.deliverableType]} tone="violet" />
            <Pill label={brief.aspectRatio} tone="slate" />
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Budget and deadline
          </p>
          <p className="text-sm text-slate-200">
            {formatMoney(brief.budgetMin)} – {formatMoney(brief.budgetMax)} ·{' '}
            {brief.deadlineDays} {brief.deadlineDays === 1 ? 'day' : 'days'}
          </p>
        </div>
      </div>

      <PillRow title="Style tags" items={brief.styleTags} tone="slate" />
      <PillRow title="Required tools" items={brief.requiredTools} tone="violet" />
      <PillRow title="Required skills" items={brief.requiredSkills} tone="slate" />

      <div className="space-y-1.5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Commercial use
        </p>
        <p className="text-sm text-slate-200">{describeCommercialUse(brief)}</p>
      </div>

      {/* Tracker and demo controls */}
      <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
        <BriefTracker status={brief.status} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-300">
            Status:{' '}
            <span className="font-semibold text-slate-100">
              {BRIEF_STATUS_LABELS[brief.status]}
            </span>
            {assignedCreator && (
              <span className="text-slate-400"> · Assigned to {assignedCreator.name}</span>
            )}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={previousStatus === null}
              onClick={() => previousStatus && setBriefStatus(brief.id, previousStatus)}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {previousStatus ? `← ${BRIEF_STATUS_LABELS[previousStatus]}` : '← Back'}
            </button>
            <button
              type="button"
              disabled={nextStatus === null}
              onClick={() => nextStatus && setBriefStatus(brief.id, nextStatus)}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {nextStatus ? `${BRIEF_STATUS_LABELS[nextStatus]} →` : 'Forward →'}
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 matched creators */}
      <section className="space-y-3">
        <h3 className="font-semibold">Top matched creators</h3>
        {topMatches.length === 0 ? (
          <p className="text-sm text-slate-400">No creators available to match yet.</p>
        ) : (
          <ul className="space-y-3">
            {topMatches.map((match) => {
              const creator = getCreatorById(match.creatorId);
              if (!creator) return null;
              const isShortlisted = brief.shortlistedCreatorIds.includes(match.creatorId);
              const isAssigned = brief.assignedCreatorId === match.creatorId;

              return (
                <li
                  key={match.creatorId}
                  className="space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{creator.name}</p>
                      <p className="truncate text-xs text-slate-400">{creator.handle}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xl font-semibold text-emerald-400">{match.score}%</p>
                      <p className="text-xs text-slate-400">match</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-400">Matched tools</p>
                    {match.matchedTools.length === 0 ? (
                      <p className="text-xs text-slate-500">None</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {match.matchedTools.map((tool) => (
                          <Pill key={tool} label={tool} tone="emerald" />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-400">Missing tools</p>
                    {match.missingTools.length === 0 ? (
                      <p className="text-xs text-slate-500">None, full toolkit covered</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {match.missingTools.map((tool) => (
                          <Pill key={tool} label={tool} tone="rose" />
                        ))}
                      </div>
                    )}
                  </div>

                  {match.licenseConflict && (
                    <p
                      role="alert"
                      className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs text-amber-400"
                    >
                      Licence warning: this creator has non-commercial work of this content type,
                      but your brief needs commercial use. Please confirm licensing with them.
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={isShortlisted}
                      onClick={() => shortlistCreator(brief.id, match.creatorId)}
                      className="rounded-lg border border-violet-500 px-3 py-1.5 text-sm font-medium text-violet-300 hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                    </button>
                    <button
                      type="button"
                      disabled={isAssigned}
                      onClick={() => assignCreator(brief.id, match.creatorId)}
                      className="rounded-lg bg-violet-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isAssigned ? 'Assigned' : 'Assign'}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </article>
  );
}

// ---------- Page ----------

export default function BriefsPage() {
  const { briefs } = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Newest first (copy before sorting so the shared state is never changed)
  const sortedBriefs = [...briefs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Briefs</h1>
            <p className="text-sm text-slate-400">
              Track every brief and see which creators fit best.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400"
          >
            Post a Brief
          </button>
        </div>

        {sortedBriefs.length === 0 ? (
          <EmptyState
            title="No briefs yet"
            message="Post your first brief and we will match you with the best AI creators."
            actionLabel="Post a Brief"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="space-y-6">
            {sortedBriefs.map((brief) => (
              <BriefCard key={brief.id} brief={brief} />
            ))}
          </div>
        )}
      </div>

      <BriefModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}