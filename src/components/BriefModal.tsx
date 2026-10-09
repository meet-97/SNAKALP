'use client';

export default function BriefModal(props: { isOpen: boolean; onClose: () => void }) {
  void props;
  if (!props.isOpen) return null;
  return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-100">BriefModal stub</div>;
}
