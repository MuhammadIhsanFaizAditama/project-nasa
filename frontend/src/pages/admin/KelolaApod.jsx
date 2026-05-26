import React, { useState, useEffect } from 'react';
import { fetchApod } from '../../services/nasaService';

export default function KelolaApod() {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApod()
      .then(data => setApod(data))
      .catch(() => setError('Gagal memuat APOD.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="text-white">
      <h2 className="fw-bold mb-4">Kelola APOD</h2>

      {/* Info API Key */}
      <div className="p-4 mb-4" style={{ background: 'rgba(0,195,255,0.04)', border: '1px solid rgba(0,195,255,0.15)' }}>
        <h6 className="mb-2" style={{ letterSpacing: '0.1em' }}>KONFIGURASI NASA API</h6>
        <p className="text-white-50 mb-2 small">
          Saat ini menggunakan:{' '}
          <code style={{ color: '#09f' }}>{import.meta.env.VITE_NASA_KEY ? 'Custom API Key ✓' : 'DEMO_KEY (limit 30 req/jam)'}</code>
        </p>
        <small className="text-white-50">
          Tambahkan <code>VITE_NASA_KEY=your_key</code> di file <code>.env</code> frontend.
          Dapatkan key gratis di{' '}
          <a href="https://api.nasa.gov" target="_blank" rel="noreferrer" style={{ color: '#09f' }}>api.nasa.gov</a>
        </small>
      </div>

      <h6 className="mb-3 text-white-50" style={{ letterSpacing: '0.1em' }}>PREVIEW APOD HARI INI</h6>

      {loading && <div className="text-center py-5"><div className="spinner-border text-light" /></div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {apod && (
        <div style={{ border: '1px solid rgba(0,195,255,0.15)' }}>
          {apod.media_type === 'image' ? (
            <img src={apod.url} alt={apod.title} className="w-100" style={{ maxHeight: 400, objectFit: 'cover', display: 'block' }} />
          ) : (
            <div className="ratio ratio-16x9">
              <iframe src={apod.url} title={apod.title} allowFullScreen />
            </div>
          )}
          <div className="p-4" style={{ background: 'rgba(0,195,255,0.04)' }}>
            <small className="text-white-50">{apod.date}</small>
            <h5 className="mt-1 mb-2 text-white">{apod.title}</h5>
            <p className="text-white-50 small mb-2">{apod.explanation}</p>
            {apod.copyright && <small className="text-white-50">© {apod.copyright}</small>}
          </div>
        </div>
      )}
    </div>
  );
}