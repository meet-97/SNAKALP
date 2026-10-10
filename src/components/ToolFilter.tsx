'use client';

import { ALL_TOOLS } from '@/data/options';
import { AITool } from '@/types';

export default function ToolFilter({
  selectedTools,
  onChange,
}: {
  selectedTools: AITool[];
  onChange: (tools: AITool[]) => void;
}) {
  function toggleTool(tool: AITool) {
    if (selectedTools.includes(tool)) {
      onChange(selectedTools.filter((selected) => selected !== tool));
    } else {
      onChange([...selectedTools, tool]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by AI tool">
      {ALL_TOOLS.map((tool) => {
        const isSelected = selectedTools.includes(tool);
        return (
          <button
            key={tool}
            type="button"
            aria-pressed={isSelected}
            onClick={() => toggleTool(tool)}
            className={
              isSelected
                ? 'rounded-full border border-violet-500 bg-violet-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-violet-400'
                : 'rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-violet-500 hover:text-slate-100'
            }
          >
            {tool}
          </button>
        );
      })}
    </div>
  );
}