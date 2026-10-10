'use client';

import { useEffect, useRef, useState } from 'react';
import type { Creator, PortfolioItem } from '@/types';
import { LICENSE_TYPE_LABELS, MEDIA_TYPE_LABELS } from '@/data/options';

interface WorkflowModalProps {
  item: PortfolioItem | null;
  creator: Creator | null;
  onClose: () => void;
}

interface BlueprintRowProps {
  label: string;
  children: React.ReactNode;
}

function BlueprintRow({ label, children }: BlueprintRowProps) {
  return (
    <tr className="border-b border-slate-800 last:border-b-0 align-top">
      <th
        scope="row"
        className="w-2/5 py-3 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400"
      >
        {label}
      </th>
      <td className="py-3 text-sm text-slate-100 break-words">{children}</td>
    </tr>
  );
}

export default function WorkflowModal({ item, creator, onClose }: WorkflowModalProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Reset the "Copied" message when a different item is opened
  useEffect(() => {
    setCopied(false);
  }, [item]);

  // Hide the "Copied" message after 2 seconds
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  // Esc key, page scroll lock and first focus while the modal is open
  useEffect(() => {
    if (!item) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const { workflow } = item;
  const isPlayable =
    item.mediaType === 'video' || item.mediaType === 'audio' || item.mediaType === 'animation';
  const aspectRatioStyle = item.aspectRatio.replace(':', ' / ');

  const hasLoras = Array.isArray(workflow.loras) && workflow.loras.length > 0;
  const hasControlNets = Array.isArray(workflow.controlNets) && workflow.controlNets.length > 0;

  const handleCopySeed = async () => {
    try {
      await navigator.clipboard.writeText(String(workflow.seed));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer on desktop, full-height sheet on phone */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="workflow-modal-title"
        className="relative flex h-full w-full flex-col overflow-y-auto border-l border-slate-800 bg-slate-950 text-slate-100 shadow-2xl sm:max-w-xl"
      >
        {/* Sticky header with close button */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-950/95 px-5 py-4 backdrop-blur">
          <p className="text-sm font-semibold text-violet-500">Proof of Workflow</p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-semibold text-slate-100 hover:border-violet-500 hover:text-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
            Close
          </button>
        </div>

        <div className="flex flex-col gap-6 px-5 py-6">
          {/* Media */}
          <div
            className="relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
            style={{ aspectRatio: aspectRatioStyle, maxHeight: '60vh' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.mediaUrl}
              alt={item.title}
              className="h-full w-full object-contain"
            />
            <span className="absolute left-3 top-3 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-xs font-semibold text-slate-100">
              {MEDIA_TYPE_LABELS[item.mediaType]}
            </span>
            {isPlayable && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-950/70 ring-2 ring-violet-500">
                  <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 text-white" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </div>
            )}
          </div>

          {/* Title, creator, description, tools */}
          <div className="flex flex-col gap-3">
            <h2 id="workflow-modal-title" className="text-2xl font-semibold">
              {item.title}
            </h2>
            {creator && (
              <p className="text-sm text-slate-400">
                by <span className="font-semibold text-slate-100">{creator.name}</span>{' '}
                <span className="text-slate-500">{creator.handle}</span>
              </p>
            )}
            <p className="text-sm leading-relaxed text-slate-300">{item.description}</p>
            {item.toolsUsed.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="Tools used">
                {item.toolsUsed.map((tool) => (
                  <li
                    key={tool}
                    className="rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-500"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Workflow Blueprint */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <h3 className="text-lg font-semibold">Workflow Blueprint</h3>
              {workflow.revisionReady ? (
                <div className="flex flex-col gap-1">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Revision-ready
                  </span>
                  <p className="text-xs text-slate-400">Can be re-created with small changes</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <span className="inline-flex w-fit items-center rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                    Not revision-ready
                  </span>
                  <p className="text-xs text-slate-400">Re-creating it may need bigger changes</p>
                </div>
              )}
            </div>

            <table className="w-full border-collapse">
              <tbody>
                <BlueprintRow label="Model checkpoint">{workflow.modelCheckpoint}</BlueprintRow>
                <BlueprintRow label="Seed">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono">{workflow.seed}</span>
                    <button
                      type="button"
                      onClick={handleCopySeed}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-100 hover:border-violet-500 hover:text-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </BlueprintRow>
                {workflow.sampler !== undefined && workflow.sampler !== '' && (
                  <BlueprintRow label="Sampler">{workflow.sampler}</BlueprintRow>
                )}
                {workflow.steps !== undefined && (
                  <BlueprintRow label="Steps">{workflow.steps}</BlueprintRow>
                )}
                {workflow.cfgScale !== undefined && (
                  <BlueprintRow label="CFG scale">{workflow.cfgScale}</BlueprintRow>
                )}
                {hasLoras && (
                  <BlueprintRow label="LoRAs">
                    <ul className="flex flex-wrap gap-2">
                      {(workflow.loras ?? []).map((lora) => (
                        <li
                          key={lora}
                          className="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-xs"
                        >
                          {lora}
                        </li>
                      ))}
                    </ul>
                  </BlueprintRow>
                )}
                {hasControlNets && (
                  <BlueprintRow label="ControlNets">
                    <ul className="flex flex-wrap gap-2">
                      {(workflow.controlNets ?? []).map((net) => (
                        <li
                          key={net}
                          className="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-xs"
                        >
                          {net}
                        </li>
                      ))}
                    </ul>
                  </BlueprintRow>
                )}
                <BlueprintRow label="Prompt">
                  <p className="rounded-lg bg-slate-950 p-3 font-mono text-xs leading-relaxed text-slate-200">
                    {workflow.promptSnippet}
                  </p>
                </BlueprintRow>
                {workflow.negativePromptSnippet !== undefined && workflow.negativePromptSnippet !== '' && (
                  <BlueprintRow label="Negative prompt">
                    <p className="rounded-lg bg-slate-950 p-3 font-mono text-xs leading-relaxed text-slate-200">
                      {workflow.negativePromptSnippet}
                    </p>
                  </BlueprintRow>
                )}
              </tbody>
            </table>
          </section>

          {/* Licence */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="mb-3 text-lg font-semibold">Licence</h3>
            <p className="mb-3 text-sm text-slate-300">{LICENSE_TYPE_LABELS[item.licenseType]}</p>
            {item.commercialLicensed ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1.5 text-sm font-semibold text-emerald-400">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Commercial use cleared
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/40 bg-rose-400/10 px-3 py-1.5 text-sm font-semibold text-rose-400">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
                Not cleared for commercial use
              </span>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}