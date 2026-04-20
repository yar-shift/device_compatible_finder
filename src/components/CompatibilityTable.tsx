import ConfidenceBadge from './ConfidenceBadge';
import type { CompatibilityRow } from '../types/database';

interface Props {
  title: string;
  rows: CompatibilityRow[];
  icon: React.ReactNode;
}

export default function CompatibilityTable({ title, rows, icon }: Props) {
  return (
    <div className="border border-gray-200 rounded bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <span className="text-gray-500">{icon}</span>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <span className="ml-auto text-xs text-gray-400">{rows.length} item{rows.length !== 1 ? 's' : ''}</span>
      </div>
      {rows.length === 0 ? (
        <div className="px-4 py-3 text-sm text-gray-400 italic">No compatible parts found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Brand</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-blue-50/40 transition-colors`}
                >
                  <td className="px-4 py-2.5 font-mono text-gray-800 font-medium">{row.name}</td>
                  <td className="px-4 py-2.5 text-gray-600">{row.brand}</td>
                  <td className="px-4 py-2.5">
                    <ConfidenceBadge confidence={row.confidence} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
