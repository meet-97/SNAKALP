'use client';

import { useState } from 'react';
import ToolFilter from '@/components/ToolFilter';
import {
  ALL_EXPERIENCE_LEVELS,
  ALL_MEDIA_TYPES,
  ALL_SKILLS,
  ALL_SPECIALIZATIONS,
  MEDIA_TYPE_LABELS,
} from '@/data/options';
import { DEFAULT_FILTERS } from '@/lib/filters';
import { formatMoney } from '@/lib/format';
import { CreatorFilters, ExperienceLevel, MediaType, Skill, Specialization } from '@/types';

const RATE_SLIDER_MIN = 25;
const RATE_SLIDER_MAX = 150;
const RATE_SLIDER_STEP = 5;

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function chipClass(isSelected: boolean): string {
  return isSelected
    ? 'rounded-full border border-violet-500 bg-violet-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-violet-400'
    : 'rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-violet-500 hover:text-slate-100';
}

function ChipGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
  getLabel,
}: {
  label: string;
  options: T[];
  selected: T[];
  onToggle: (value: T) => void;
  getLabel?: (value: T) => string;
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-slate-100">{label}</h3>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(option)}
              className={chipClass(isSelected)}
            >
              {getLabel ? getLabel(option) : option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function FilterPanel({
  filters,
  onChange,
  resultCount,
}: {
  filters: CreatorFilters;
  onChange: (filters: CreatorFilters) => void;
  resultCount: number;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const hasRateLimit = filters.maxHourlyRate !== null;
  const sliderValue = filters.maxHourlyRate ?? RATE_SLIDER_MAX;
  const countText = `${resultCount} ${resultCount === 1 ? 'creator' : 'creators'} found`;

  return (
    <section
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
      aria-label="Creator filters"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-100" aria-live="polite">
          {countText}
        </p>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="filter-panel-body"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full border border-violet-500 px-4 py-1.5 text-sm font-semibold text-violet-300 transition-colors hover:bg-violet-500 hover:text-white md:hidden"
        >
          {isOpen ? 'Hide filters' : 'Filters'}
        </button>
      </div>

      <div
        id="filter-panel-body"
        className={`${isOpen ? 'block' : 'hidden'} mt-5 space-y-6 md:block`}
      >
        <div>
          <label htmlFor="creator-search" className="mb-2 block text-sm font-semibold text-slate-100">
            Search
          </label>
          <input
            id="creator-search"
            type="text"
            value={filters.searchText}
            onChange={(event) => onChange({ ...filters, searchText: event.target.value })}
            placeholder="Search creators, tools, skills..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
          />
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-100">Tools</h3>
          <ToolFilter
            selectedTools={filters.tools}
            onChange={(tools) => onChange({ ...filters, tools })}
          />
        </div>

        <ChipGroup<Skill>
          label="Skills"
          options={ALL_SKILLS}
          selected={filters.skills}
          onToggle={(skill) => onChange({ ...filters, skills: toggleValue(filters.skills, skill) })}
        />

        <ChipGroup<Specialization>
          label="Specializations"
          options={ALL_SPECIALIZATIONS}
          selected={filters.specializations}
          onToggle={(specialization) =>
            onChange({
              ...filters,
              specializations: toggleValue(filters.specializations, specialization),
            })
          }
        />

        <ChipGroup<MediaType>
          label="Content types"
          options={ALL_MEDIA_TYPES}
          selected={filters.contentTypes}
          getLabel={(type) => MEDIA_TYPE_LABELS[type]}
          onToggle={(type) =>
            onChange({ ...filters, contentTypes: toggleValue(filters.contentTypes, type) })
          }
        />

        <ChipGroup<ExperienceLevel>
          label="Experience levels"
          options={ALL_EXPERIENCE_LEVELS}
          selected={filters.experienceLevels}
          onToggle={(level) =>
            onChange({ ...filters, experienceLevels: toggleValue(filters.experienceLevels, level) })
          }
        />

        <div className="flex items-center justify-between gap-3">
          <span id="verified-switch-label" className="text-sm font-semibold text-slate-100">
            Verified workflow only
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={filters.verifiedOnly}
            aria-labelledby="verified-switch-label"
            onClick={() => onChange({ ...filters, verifiedOnly: !filters.verifiedOnly })}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              filters.verifiedOnly ? 'bg-emerald-400' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                filters.verifiedOnly ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="max-rate-slider" className="text-sm font-semibold text-slate-100">
              Max hourly rate
            </label>
            <span className="text-sm text-slate-300">
              {hasRateLimit ? `${formatMoney(sliderValue)}/hr` : 'No limit'}
            </span>
          </div>
          <input
            id="max-rate-slider"
            type="range"
            min={RATE_SLIDER_MIN}
            max={RATE_SLIDER_MAX}
            step={RATE_SLIDER_STEP}
            value={sliderValue}
            onChange={(event) => onChange({ ...filters, maxHourlyRate: Number(event.target.value) })}
            className="w-full accent-violet-500"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>{formatMoney(RATE_SLIDER_MIN)}</span>
            <span>{formatMoney(RATE_SLIDER_MAX)}</span>
          </div>
          <button
            type="button"
            aria-pressed={!hasRateLimit}
            onClick={() =>
              onChange({
                ...filters,
                maxHourlyRate: hasRateLimit ? null : RATE_SLIDER_MAX,
              })
            }
            className={`mt-3 ${chipClass(!hasRateLimit)}`}
          >
            No limit
          </button>
        </div>

        <button
          type="button"
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="w-full rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-rose-400 hover:text-rose-400"
        >
          Clear all filters
        </button>
      </div>
    </section>
  );
}