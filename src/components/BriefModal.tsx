'use client';

interface BriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BriefModal(props: BriefModalProps) {
  if (!props.isOpen) {
    return null;
  }
  return (
    <div className="border border-dashed border-slate-700 bg-slate-900 p-3 text-sm text-slate-300">
      BriefModal stub
    </div>
  );
}