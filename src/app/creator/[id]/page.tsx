'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import type { PortfolioItem } from '@/types';
import { getCreatorById } from '@/data/mockCreators';
import { useAppState } from '@/context/AppContext';
import { ALL_MEDIA_TYPES, MEDIA_TYPE_LABELS } from '@/data/options';
import { formatMoney } from '@/lib/format';
import VerificationBadges from '@/components/VerificationBadges';
import EmptyState from '@/components/EmptyState';
import WorkflowModal from '@/components/WorkflowModal';

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter((part) => part.length > 0)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function CreatorProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { briefs, shortlistCreator } = useAppState();

  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [selectedBriefId, setSelectedBriefId] = useState<string>('');
  const [confirmation, setConfirmation] = useState<string>('');
  const [failedAvatarId, setFailedAvatarId] = useState<string>('');

  const handleCloseModal = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const creator = getCreatorById(params.id);

  if (!creator) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
        <div className="mx-auto max-w-3xl">
          <EmptyState
            title="Creator not found"
            message="We could not find this creator. The link may be wrong."
            actionLabel="Back to Discover"
            onAction={() => router.push('/')}
          />
        </div>
      </main>
    );
  }

  const openBriefs = briefs.filter((brief) => brief.status === 'open');
  const showInitials = creator.avatarUrl === '' || failedAvatarId === creator.id;

  const handleShortlist = () => {
    const brief = openBriefs.find((b) => b.id === selectedBriefId);
    if (!brief) return;
    shortlistCreator(brief.id, creator.id);
    setConfirmation(`${creator.name} was shortlisted for "${brief.title}".`);
    setSelectedBriefId('');
  };

  const stats: { label: string; value: string }[] = [
    { label: 'Rating', value: `${creator.rating.toFixed(1)} / 5` },
    { label: 'Projects done', value: String(creator.completedProjects) },
    { label: 'Turnaround', value: `${creator.turnaroundDays} days` },
    { label: 'Hourly rate', value: `${formatMoney(creator.hourlyRate)} / hr` },
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <Link
          href="/"
          className="w-fit text-sm font-semibold text-slate-400 hover:text-violet-500"
        >
          &larr; Back to Discover
        </Link>

        {/* Header */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            {showInitials ? (
              <div
                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-2xl font-semibold text-violet-500"
                aria-label={`${creator.name} initials`}
              >
                {getInitials(creator.name)}
              </div>
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={creator.avatarUrl}
                  alt={`${creator.name} avatar`}
                  onError={() => setFailedAvatarId(creator.id)}
                  className="h-24 w-24 shrink-0 rounded-full border border-slate-700 object-cover"
                />
              </>
            )}

            <div className="flex flex-col gap-3">
              <div>
                <h1 className="text-2xl font-semibold">{creator.name}</h1>
                <p className="text-sm text-slate-400">{creator.handle}</p>
              </div>
              <p className="text-base font-semibold text-slate-200">{creator.headline}</p>
              <VerificationBadges verification={creator.verification} size="md" />
              <p className="text-sm leading-relaxed text-slate-300">{creator.bio}</p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section aria-label="Creator stats" className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {stat.label}
              </p>
              <p className="mt-1 text-xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </section>

        {/* Tools, skills, specializations */}
        <section className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:grid-cols-3">
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Tools
            </h2>
            <ul className="flex flex-wrap gap-2">
              {creator.toolsUsed.map((tool) => (
                <li
                  key={tool}
                  className="rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-500"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Skills
            </h2>
            <ul className="flex flex-wrap gap-2">
              {creator.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Specializations
            </h2>
            <ul className="flex flex-wrap gap-2">
              {creator.specializations.map((spec) => (
                <li
                  key={spec}
                  className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200"
                >
                  {spec}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Shortlist box */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-1 text-lg font-semibold">Shortlist for a brief</h2>
          {openBriefs.length === 0 ? (
            <p className="text-sm text-slate-400">
              You have no open briefs yet. Post a brief first, then shortlist this creator.
            </p>
          ) : (
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <label htmlFor="shortlist-brief" className="sr-only">
                Choose an open brief
              </label>
              <select
                id="shortlist-brief"
                value={selectedBriefId}
                onChange={(event) => {
                  setSelectedBriefId(event.target.value);
                  setConfirmation('');
                }}
                className="w-full flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Choose an open brief...</option>
                {openBriefs.map((brief) => (
                  <option key={brief.id} value={brief.id}>
                    {brief.brandName} - {brief.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleShortlist}
                disabled={selectedBriefId === ''}
                className="rounded-xl bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Shortlist
              </button>
            </div>
          )}
          {confirmation !== '' && (
            <p role="status" className="mt-3 text-sm font-semibold text-emerald-400">
              {confirmation}
            </p>
          )}
        </section>

        {/* Portfolio grouped by media type */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Portfolio</h2>

          {creator.featuredWork.length === 0 ? (
            <p className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-400">
              This creator has not added any work yet.
            </p>
          ) : (
            ALL_MEDIA_TYPES.map((mediaType) => {
              const items = creator.featuredWork.filter((work) => work.mediaType === mediaType);
              if (items.length === 0) return null;
              return (
                <div key={mediaType} className="flex flex-col gap-3">
                  <h3 className="text-base font-semibold text-slate-200">
                    {MEDIA_TYPE_LABELS[mediaType]}
                  </h3>
                  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((work) => (
                      <li key={work.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedItem(work)}
                          className="group w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-left hover:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                          <div className="relative aspect-square w-full bg-slate-950">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={work.mediaUrl}
                              alt={work.title}
                              className="h-full w-full object-cover"
                            />
                            {mediaType !== 'image' && mediaType !== 'prompt-pack' && (
                              <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950/70 ring-2 ring-violet-500">
                                  <svg
                                    viewBox="0 0 24 24"
                                    className="ml-0.5 h-5 w-5 text-white"
                                    fill="currentColor"
                                    aria-hidden="true"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </span>
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1 p-4">
                            <p className="font-semibold group-hover:text-violet-500">
                              {work.title}
                            </p>
                            <p className="text-xs text-slate-400">View workflow</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </section>
      </div>

      <WorkflowModal item={selectedItem} creator={creator} onClose={handleCloseModal} />
    </main>
  );
}