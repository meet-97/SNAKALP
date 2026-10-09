'use client';

import type { AITool } from '@/types';

export default function ToolFilter(props: { selectedTools: AITool[]; onChange: (tools: AITool[]) => void }) {
  void props;
  return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-100">ToolFilter stub</div>;
}
