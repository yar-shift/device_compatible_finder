import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { getCompatibilityRequests, updateRequestStatus } from '../lib/api';
import type { CompatibilityRequest, RequestStatus } from '../types/database';

const statusConfig: Record<RequestStatus, { label: string; className: string; icon: React.ReactNode }> = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
    icon: <Clock size={11} />,
  },
  approved: {
    label: 'Approved',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    icon: <CheckCircle size={11} />,
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-50 text-red-600 border border-red-200',
    icon: <XCircle size={11} />,
  },
};

const typeLabels: Record<string, string> = {
  battery: 'Battery',
  glass: 'Glass',
  display: 'Display',
};

function StatusBadge({ status }: { status: RequestStatus }) {
  const { label, className, icon } = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${className}`}>
      {icon}
      {label}
    </span>
  );
}

export default function AdminPage() {
  const [requests, setRequests] = useState<CompatibilityRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const data = await getCompatibilityRequests();
    setRequests(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAction(id: string, status: 'approved' | 'rejected') {
    setUpdating(id);
    await updateRequestStatus(id, status);
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    setUpdating(null);
  }

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);
  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-base font-semibold text-gray-800">Compatibility Requests</h1>
          <p className="text-xs text-gray-500 mt-0.5">Review and moderate user-submitted compatibility suggestions.</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="flex items-center gap-1 mb-3">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-xs rounded transition-colors capitalize ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            <span className={`ml-1.5 px-1 py-0.5 rounded text-xs ${filter === f ? 'bg-blue-500' : 'bg-gray-100 text-gray-500'}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-gray-400">No requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Device</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Part</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Comment</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((req, idx) => (
                  <tr
                    key={req.id}
                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'} border-b border-gray-100 last:border-0`}
                  >
                    <td className="px-4 py-2.5 font-medium text-gray-800">{req.device_input}</td>
                    <td className="px-4 py-2.5 font-mono text-gray-700">{req.part_input}</td>
                    <td className="px-4 py-2.5 text-gray-600">{typeLabels[req.type] ?? req.type}</td>
                    <td className="px-4 py-2.5 text-gray-500 max-w-48">
                      <span className="truncate block">{req.comment ?? <span className="italic text-gray-300">—</span>}</span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-400 whitespace-nowrap text-xs">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-4 py-2.5">
                      {req.status === 'pending' ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleAction(req.id, 'approved')}
                            disabled={updating === req.id}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-emerald-700 border border-emerald-200 rounded hover:bg-emerald-50 transition-colors disabled:opacity-50"
                          >
                            <CheckCircle size={11} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(req.id, 'rejected')}
                            disabled={updating === req.id}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <XCircle size={11} />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300 italic">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
