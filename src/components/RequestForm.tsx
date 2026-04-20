import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { submitCompatibilityRequest } from '../lib/api';
import type { PartType } from '../types/database';

interface Props {
  deviceName?: string;
  onClose: () => void;
}

export default function RequestForm({ deviceName, onClose }: Props) {
  const [form, setForm] = useState({
    device_input: deviceName ?? '',
    part_input: '',
    type: 'battery' as PartType,
    comment: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.device_input.trim() || !form.part_input.trim()) {
      setError('Device and part fields are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await submitCompatibilityRequest(form);
      setSuccess(true);
    } catch {
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800">Suggest Compatibility</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        {success ? (
          <div className="px-5 py-8 text-center">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Send size={18} className="text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-gray-800 mb-1">Request submitted</p>
            <p className="text-xs text-gray-500 mb-4">Your suggestion will be reviewed by an admin.</p>
            <button onClick={onClose} className="text-xs text-blue-600 hover:underline">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Device</label>
              <input
                type="text"
                value={form.device_input}
                onChange={(e) => setForm({ ...form, device_input: e.target.value })}
                placeholder="e.g. POCO X3 Pro"
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Part Name / Model</label>
              <input
                type="text"
                value={form.part_input}
                onChange={(e) => setForm({ ...form, part_input: e.target.value })}
                placeholder="e.g. BN57"
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Part Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as PartType })}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white"
              >
                <option value="battery">Battery</option>
                <option value="glass">Screen Protector (Glass)</option>
                <option value="display">Display</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Comment <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                placeholder="Additional info..."
                rows={2}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 resize-none"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
