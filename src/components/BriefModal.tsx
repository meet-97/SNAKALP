'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/context/AppContext';
import { formatMoney } from '@/lib/format';
import {
  ALL_ASPECT_RATIOS,
  ALL_MEDIA_TYPES,
  ALL_SKILLS,
  ALL_STYLE_TAGS,
  ALL_TERRITORIES,
  ALL_TOOLS,
  ALL_USAGE_CHANNELS,
  MEDIA_TYPE_LABELS,
} from '@/data/options';
import type {
  AITool,
  AspectRatio,
  BriefBuilderResponse,
  BriefDraft,
  MediaType,
  Skill,
  StyleTag,
  Territory,
  UsageChannel,
} from '@/types';

// ---------- Local helpers (not exported) ----------

const ASPECT_HINTS: Record<AspectRatio, string> = {
  '1:1': 'Square: feed posts, product shots',
  '4:5': 'Portrait: Instagram feed',
  '9:16': 'Reels / Shorts / Stories',
  '16:9': 'YouTube / Website / Banner',
  '21:9': 'Cinematic widescreen',
};

interface FormState {
  brandName: string;
  title: string;
  description: string;
  deliverableType: MediaType;
  styleTags: StyleTag[];
  aspectRatio: AspectRatio;
  requiredTools: AITool[];
  requiredSkills: Skill[];
  budgetMin: string;
  budgetMax: string;
  deadlineDays: string;
  commercialRequired: boolean;
  channels: UsageChannel[];
  durationMonths: string;
  territory: Territory;
  exclusive: boolean;
}

const EMPTY_FORM: FormState = {
  brandName: '',
  title: '',
  description: '',
  deliverableType: 'image',
  styleTags: [],
  aspectRatio: '1:1',
  requiredTools: [],
  requiredSkills: [],
  budgetMin: '200',
  budgetMax: '800',
  deadlineDays: '7',
  commercialRequired: false,
  channels: [],
  durationMonths: '6',
  territory: 'India',
  exclusive: false,
};

function draftToForm(draft: BriefDraft): FormState {
  return {
    brandName: draft.brandName,
    title: draft.title,
    description: draft.description,
    deliverableType: draft.deliverableType,
    styleTags: [...draft.styleTags],
    aspectRatio: draft.aspectRatio,
    requiredTools: [...draft.requiredTools],
    requiredSkills: [...draft.requiredSkills],
    budgetMin: String(draft.budgetMin),
    budgetMax: String(draft.budgetMax),
    deadlineDays: String(draft.deadlineDays),
    commercialRequired: draft.commercialUse.required,
    channels: [...draft.commercialUse.channels],
    durationMonths: String(draft.commercialUse.durationMonths),
    territory: draft.commercialUse.territory,
    exclusive: draft.commercialUse.exclusive,
  };
}

function toNumber(value: string): number {
  return value.trim() === '' ? NaN : Number(value);
}

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function validate(form: FormState): Record<string, string> {
  const errors: Record<string, string> = {};
  if (form.brandName.trim() === '') errors.brandName = 'Brand name is required.';
  if (form.title.trim() === '') errors.title = 'Title is required.';
  if (form.description.trim().length < 20) {
    errors.description = 'Description must be at least 20 characters.';
  }

  const min = toNumber(form.budgetMin);
  const max = toNumber(form.budgetMax);
  if (Number.isNaN(min) || min < 0) errors.budgetMin = 'Enter a valid minimum budget.';
  if (Number.isNaN(max) || max < 0) errors.budgetMax = 'Enter a valid maximum budget.';
  if (!errors.budgetMin && !errors.budgetMax && min > max) {
    errors.budgetMin = 'Minimum budget must be less than or equal to maximum budget.';
  }

  const days = toNumber(form.deadlineDays);
  if (Number.isNaN(days) || days < 1) errors.deadlineDays = 'Deadline must be at least 1 day.';

  if (form.commercialRequired) {
    if (form.channels.length === 0) errors.channels = 'Pick at least one usage channel.';
    const months = toNumber(form.durationMonths);
    if (Number.isNaN(months) || months < 1) {
      errors.durationMonths = 'Duration must be at least 1 month.';
    }
  }
  return errors;
}

// ---------- Small UI pieces (local to this file) ----------

const inputClass =
  'w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-violet-500';

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
        active
          ? 'bg-violet-500 border-violet-500 text-white'
          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
      }`}
    >
      {label}
    </button>
  );
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-slate-200">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-violet-500' : 'bg-slate-700'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-200">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}

// ---------- Component ----------

export default function BriefModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { addBrief } = useAppState();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [idea, setIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const [source, setSource] = useState<'ai' | 'fallback' | null>(null);

  // Reset everything each time the modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
      setIdea('');
      setIsGenerating(false);
      setGenerateError('');
      setSource(null);
    }
  }, [isOpen]);

  // Close with the Esc key
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleGenerate() {
    if (idea.trim() === '') {
      setGenerateError('Describe your idea first, even a rough one-liner works.');
      return;
    }
    setIsGenerating(true);
    setGenerateError('');
    try {
      const response = await fetch('/api/brief-builder', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ idea: idea.trim() }),
      });
      if (!response.ok) throw new Error('Request failed');
      const data = (await response.json()) as BriefBuilderResponse;
      if (!data || !data.draft) throw new Error('Invalid response');
      setForm(draftToForm(data.draft));
      setErrors({});
      setSource(data.source);
    } catch {
      setGenerateError(
        'Sorry, we could not generate a brief right now. Please try again, or fill in the form below yourself.'
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const draft: BriefDraft = {
      brandName: form.brandName.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      deliverableType: form.deliverableType,
      styleTags: form.styleTags,
      aspectRatio: form.aspectRatio,
      requiredTools: form.requiredTools,
      requiredSkills: form.requiredSkills,
      budgetMin: toNumber(form.budgetMin),
      budgetMax: toNumber(form.budgetMax),
      deadlineDays: toNumber(form.deadlineDays),
      commercialUse: {
        required: form.commercialRequired,
        channels: form.commercialRequired ? form.channels : [],
        durationMonths: form.commercialRequired ? toNumber(form.durationMonths) : 0,
        territory: form.territory,
        exclusive: form.commercialRequired ? form.exclusive : false,
      },
    };

    addBrief(draft);
    onClose();
    router.push('/briefs');
  }

  const minPreview = toNumber(form.budgetMin);
  const maxPreview = toNumber(form.budgetMax);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="brief-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[95vh] w-full max-w-2xl flex-col rounded-t-2xl border border-slate-800 bg-slate-900 text-slate-100 sm:rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <h2 id="brief-modal-title" className="text-lg font-semibold">
            Post a Brief
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
            {/* AI Brief Builder */}
            <section className="space-y-3 rounded-2xl border border-violet-500/40 bg-slate-950 p-4">
              <h3 className="font-semibold text-violet-300">AI Brief Builder</h3>
              <p className="text-xs text-slate-400">
                Type a rough idea and we will fill the form for you. You can edit everything
                afterwards.
              </p>
              <textarea
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
                rows={3}
                placeholder="e.g. A 15-second Instagram reel for our new coffee brand, warm and cinematic"
                aria-label="Your rough idea"
                className={inputClass}
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGenerating ? 'Generating…' : 'Generate brief'}
                </button>
                {source && !isGenerating && (
                  <span className="text-xs text-emerald-400">
                    {source === 'ai' ? 'Generated by AI' : 'Generated by smart templates'}
                  </span>
                )}
              </div>
              {isGenerating && (
                <p className="text-xs text-slate-400" role="status">
                  Building your brief, one moment…
                </p>
              )}
              {generateError && (
                <p className="text-xs text-rose-400" role="alert">
                  {generateError}
                </p>
              )}
            </section>

            {/* Basics */}
            <section className="space-y-4">
              <h3 className="font-semibold">Project details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Brand name" htmlFor="brandName" error={errors.brandName}>
                  <input
                    id="brandName"
                    type="text"
                    value={form.brandName}
                    onChange={(event) => setField('brandName', event.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Title" htmlFor="title" error={errors.title}>
                  <input
                    id="title"
                    type="text"
                    value={form.title}
                    onChange={(event) => setField('title', event.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field
                label="Description"
                htmlFor="description"
                error={errors.description}
                hint="At least 20 characters. What should the creator make?"
              >
                <textarea
                  id="description"
                  rows={4}
                  value={form.description}
                  onChange={(event) => setField('description', event.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Content type" htmlFor="deliverableType">
                <select
                  id="deliverableType"
                  value={form.deliverableType}
                  onChange={(event) =>
                    setField('deliverableType', event.target.value as MediaType)
                  }
                  className={inputClass}
                >
                  {ALL_MEDIA_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {MEDIA_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Style tags">
                <div className="flex flex-wrap gap-2">
                  {ALL_STYLE_TAGS.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      active={form.styleTags.includes(tag)}
                      onClick={() => setField('styleTags', toggleValue(form.styleTags, tag))}
                    />
                  ))}
                </div>
              </Field>

              <Field label="Aspect ratio" htmlFor="aspectRatio" hint={ASPECT_HINTS[form.aspectRatio]}>
                <select
                  id="aspectRatio"
                  value={form.aspectRatio}
                  onChange={(event) => setField('aspectRatio', event.target.value as AspectRatio)}
                  className={inputClass}
                >
                  {ALL_ASPECT_RATIOS.map((ratio) => (
                    <option key={ratio} value={ratio}>
                      {ratio} ({ASPECT_HINTS[ratio]})
                    </option>
                  ))}
                </select>
              </Field>
            </section>

            {/* Requirements */}
            <section className="space-y-4">
              <h3 className="font-semibold">Requirements</h3>
              <Field label="Required tools">
                <div className="flex flex-wrap gap-2">
                  {ALL_TOOLS.map((tool) => (
                    <Chip
                      key={tool}
                      label={tool}
                      active={form.requiredTools.includes(tool)}
                      onClick={() =>
                        setField('requiredTools', toggleValue(form.requiredTools, tool))
                      }
                    />
                  ))}
                </div>
              </Field>
              <Field label="Required skills">
                <div className="flex flex-wrap gap-2">
                  {ALL_SKILLS.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      active={form.requiredSkills.includes(skill)}
                      onClick={() =>
                        setField('requiredSkills', toggleValue(form.requiredSkills, skill))
                      }
                    />
                  ))}
                </div>
              </Field>
            </section>

            {/* Budget and deadline */}
            <section className="space-y-4">
              <h3 className="font-semibold">Budget and deadline</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field
                  label="Minimum budget"
                  htmlFor="budgetMin"
                  error={errors.budgetMin}
                  hint={Number.isNaN(minPreview) ? undefined : formatMoney(minPreview)}
                >
                  <input
                    id="budgetMin"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={form.budgetMin}
                    onChange={(event) => setField('budgetMin', event.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field
                  label="Maximum budget"
                  htmlFor="budgetMax"
                  error={errors.budgetMax}
                  hint={Number.isNaN(maxPreview) ? undefined : formatMoney(maxPreview)}
                >
                  <input
                    id="budgetMax"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={form.budgetMax}
                    onChange={(event) => setField('budgetMax', event.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Deadline (days)" htmlFor="deadlineDays" error={errors.deadlineDays}>
                  <input
                    id="deadlineDays"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={form.deadlineDays}
                    onChange={(event) => setField('deadlineDays', event.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
            </section>

            {/* Commercial use */}
            <section className="space-y-4">
              <h3 className="font-semibold">Commercial use</h3>
              <Switch
                label="This work will be used commercially"
                checked={form.commercialRequired}
                onChange={(value) => setField('commercialRequired', value)}
              />

              {form.commercialRequired && (
                <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <Field label="Usage channels" error={errors.channels}>
                    <div className="flex flex-wrap gap-2">
                      {ALL_USAGE_CHANNELS.map((channel) => (
                        <Chip
                          key={channel}
                          label={channel}
                          active={form.channels.includes(channel)}
                          onClick={() =>
                            setField('channels', toggleValue(form.channels, channel))
                          }
                        />
                      ))}
                    </div>
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Duration (months)"
                      htmlFor="durationMonths"
                      error={errors.durationMonths}
                    >
                      <input
                        id="durationMonths"
                        type="number"
                        min={1}
                        inputMode="numeric"
                        value={form.durationMonths}
                        onChange={(event) => setField('durationMonths', event.target.value)}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Territory" htmlFor="territory">
                      <select
                        id="territory"
                        value={form.territory}
                        onChange={(event) => setField('territory', event.target.value as Territory)}
                        className={inputClass}
                      >
                        {ALL_TERRITORIES.map((territory) => (
                          <option key={territory} value={territory}>
                            {territory}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Switch
                    label="Exclusive rights"
                    checked={form.exclusive}
                    onChange={(value) => setField('exclusive', value)}
                  />
                </div>
              )}
            </section>

            {Object.keys(errors).length > 0 && (
              <p className="text-sm text-rose-400" role="alert">
                Please fix the highlighted fields above and try again.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-800 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-violet-500 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-400"
            >
              Post brief
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}