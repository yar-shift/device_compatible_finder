import { useState } from 'react';
import Layout from './components/Layout';
import SearchPage from './pages/SearchPage';
import DevicePage from './pages/DevicePage';
import AdminPage from './pages/AdminPage';

type Page = 'search' | 'device' | 'admin';

export default function App() {
  const [page, setPage] = useState<Page>('search');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  function handleSelectDevice(id: string) {
    setSelectedDeviceId(id);
    setPage('device');
  }

  function handleNavigate(target: 'search' | 'admin') {
    setPage(target);
    if (target === 'search') setSelectedDeviceId(null);
  }

  const currentPageKey = page === 'device' ? 'search' : page;

  return (
    <Layout onNavigate={handleNavigate} currentPage={currentPageKey}>
      {page === 'search' && (
        <SearchPage onSelectDevice={handleSelectDevice} />
      )}
      {page === 'device' && selectedDeviceId && (
        <DevicePage
          deviceId={selectedDeviceId}
          onBack={() => setPage('search')}
        />
      )}
      {page === 'admin' && <AdminPage />}
    </Layout>
  );
}
