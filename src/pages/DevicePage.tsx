import { useEffect, useState } from 'react';
import { ArrowLeft, Battery, Shield, Monitor, AlertCircle, PlusCircle } from 'lucide-react';
import { getDevice } from '../lib/api';
import CompatibilityTable from '../components/CompatibilityTable';
import RequestForm from '../components/RequestForm';
import type { DeviceWithCompatibilities } from '../types/database';

interface Props {
  deviceId: string;
  onBack: () => void;
}

export default function DevicePage({ deviceId, onBack }: Props) {
  const [device, setDevice] = useState<DeviceWithCompatibilities | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRequest, setShowRequest] = useState(false);
  const [requestMode, setRequestMode] = useState<'suggest' | 'report'>('suggest');

  useEffect(() => {
    setLoading(true);
    getDevice(deviceId).then((d) => {
      setDevice(d);
      setLoading(false);
    });
  }, [deviceId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!device) {
    return (
      <div className="text-center py-16">
        <AlertCircle size={20} className="mx-auto text-gray-300 mb-2" />
        <p className="text-sm text-gray-500">Device not found.</p>
        <button onClick={onBack} className="mt-3 text-xs text-blue-600 hover:underline">Go back</button>
      </div>
    );
  }

  const totalParts = device.batteries.length + device.glasses.length + device.displays.length;

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors mb-4"
      >
        <ArrowLeft size={13} />
        Back to search
      </button>

      <div className="bg-white border border-gray-200 rounded-lg px-5 py-4 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{device.brand}</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">{device.model}</h1>
            <div className="flex items-center gap-3 mt-1">
              {device.model_code && (
                <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{device.model_code}</span>
              )}
              <span className="text-xs text-gray-400">{totalParts} compatible part{totalParts !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => { setRequestMode('suggest'); setShowRequest(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              <PlusCircle size={12} />
              Suggest compatibility
            </button>
            <button
              onClick={() => { setRequestMode('report'); setShowRequest(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              <AlertCircle size={12} />
              Report issue
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <CompatibilityTable
          title="Batteries"
          rows={device.batteries}
          icon={<Battery size={14} />}
        />
        <CompatibilityTable
          title="Screen Protectors (Glass)"
          rows={device.glasses}
          icon={<Shield size={14} />}
        />
        <CompatibilityTable
          title="Displays"
          rows={device.displays}
          icon={<Monitor size={14} />}
        />
      </div>

      {showRequest && (
        <RequestForm
          deviceName={`${device.brand} ${device.model}`}
          onClose={() => setShowRequest(false)}
        />
      )}

      <div className="mt-6 border border-gray-100 rounded bg-gray-50 px-4 py-3">
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <span className="font-medium text-gray-600">Confidence levels:</span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <strong className="text-emerald-700">Verified</strong> — confirmed by technician
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
            <strong className="text-amber-700">Community</strong> — reported by users
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-gray-400"></span>
            <strong className="text-gray-600">Low</strong> — unconfirmed
          </span>
        </div>
      </div>
    </div>
  );
}
