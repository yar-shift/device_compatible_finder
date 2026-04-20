import { Cpu } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  onNavigate: (page: 'search' | 'admin') => void;
  currentPage: string;
}

export default function Layout({ children, onNavigate, currentPage }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-11 flex items-center justify-between">
          <button
            onClick={() => onNavigate('search')}
            className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors"
          >
            <Cpu size={16} className="text-blue-600" />
            <span className="text-sm font-semibold tracking-tight">Device Compatibility Finder</span>
          </button>
          <nav className="flex items-center gap-1">
            <button
              onClick={() => onNavigate('search')}
              className={`px-3 py-1.5 text-xs rounded transition-colors ${
                currentPage === 'search'
                  ? 'text-blue-600 bg-blue-50 font-medium'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Search
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className={`px-3 py-1.5 text-xs rounded transition-colors ${
                currentPage === 'admin'
                  ? 'text-blue-600 bg-blue-50 font-medium'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Admin
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
