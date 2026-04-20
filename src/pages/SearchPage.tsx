import { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { searchDevices } from '../lib/api';
import type { Device } from '../types/database';

interface Props {
  onSelectDevice: (id: string) => void;
}

export default function SearchPage({ onSelectDevice }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const data = await searchDevices(query);
      setResults(data);
      setLoading(false);
    }, 220);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className="max-w-2xl mx-auto pt-10 pb-16">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold text-gray-800 mb-1">Device Compatibility Finder</h1>
        <p className="text-sm text-gray-500">Look up compatible batteries, glass, and displays for any smartphone model.</p>
      </div>

      <div className="relative">
        <div className={`flex items-center border rounded-lg bg-white shadow-sm transition-shadow ${focused ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}`}>
          <Search size={16} className="ml-3.5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Enter device model (e.g. POCO X3 Pro)"
            className="flex-1 px-3 py-3 text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
            autoComplete="off"
          />
          {loading && (
            <div className="mr-3 w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          )}
          {query && !loading && (
            <button
              onClick={() => setQuery('')}
              className="mr-3 text-gray-400 hover:text-gray-600 text-xs transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {query.trim() && !loading && results.length === 0 && (
          <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-sm px-4 py-3">
            <p className="text-sm text-gray-500">No devices found matching <span className="font-medium text-gray-700">"{query}"</span>.</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">{results.length} result{results.length !== 1 ? 's' : ''}</span>
            </div>
            <ul>
              {results.map((device, idx) => (
                <li key={device.id}>
                  <button
                    onClick={() => onSelectDevice(device.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-50 transition-colors group ${idx < results.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center shrink-0 text-xs font-bold text-gray-500 group-hover:bg-blue-100 transition-colors">
                        {device.brand[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">{device.brand} {device.model}</div>
                        {device.model_code && (
                          <div className="text-xs text-gray-400 font-mono">{device.model_code}</div>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-400 transition-colors shrink-0 ml-2" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {!query.trim() && (
        <div className="mt-10 border border-gray-200 rounded-lg bg-white overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Try searching for</span>
          </div>
          <div className="divide-y divide-gray-100">
            {['POCO X3 Pro', 'Redmi Note 10', 'iPhone 11'].map((hint) => (
              <button
                key={hint}
                onClick={() => setQuery(hint)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors group"
              >
                <Search size={13} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
                <span className="text-sm text-gray-600">{hint}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
