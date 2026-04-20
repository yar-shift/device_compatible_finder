import type { Confidence } from '../types/database';

interface Props {
  confidence: Confidence;
}

const config: Record<Confidence, { label: string; className: string }> = {
  verified: {
    label: 'Verified',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  community: {
    label: 'Community',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  low: {
    label: 'Low',
    className: 'bg-gray-100 text-gray-500 border border-gray-200',
  },
};

export default function ConfidenceBadge({ confidence }: Props) {
  const { label, className } = config[confidence];
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
