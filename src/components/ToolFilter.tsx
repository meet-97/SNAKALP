'use client';

import type { AITool } from '@/types';

interface ToolFilterProps {
  selectedTools: AITool[];
  onChange: (tools: AITool[]) => void;
}

export default function ToolFilter(props: ToolFilterProps) {
  void props;
  return (
    <div className="border border-dashed border-slate-700 bg-slate-900 p-3 text-sm text-slate-300">
      ToolFilter stub
    </div>
  );
}