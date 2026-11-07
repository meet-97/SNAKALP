'use client'

import type { Mode } from './theme'

const OPTIONS: { value: Mode; label: string }[] = [
  { value: 'brand', label: 'Brand' },
  { value: 'creator', label: 'Creator' },
]

export default function ModeSwitch({
  mode,
  onChange,
}: {
  mode: Mode
  onChange: (mode: Mode) => void
}) {
  return (
    <div
      role="radiogroup"
      aria-label="I am a"
      className="relative grid grid-cols-2 rounded-full bg-stone-900/5 p-1 text-sm font-medium"
    >
      <span
        aria-hidden
        className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-sm transition-transform duration-300 ease-out ${
          mode === 'creator' ? 'translate-x-full' : ''
        }`}
      />
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={mode === option.value}
          onClick={() => onChange(option.value)}
          className={`relative z-10 rounded-full px-7 py-2 transition-colors ${
            mode === option.value ? 'text-stone-900' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
