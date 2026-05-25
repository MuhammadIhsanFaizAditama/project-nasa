import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApod } from '../../services/nasaService';
import { logout } from '../../services/authService';

export default function KelolaApod() {
  const navigate = useNavigate();
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApod()
      .then(data => setApod(data))
      .catch(() => setError('Gagal memuat APOD.'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-vh-100 bg-dark text-white p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/admin')}>← Dashboard</button>
          <h2 className="fw-bold mb-0">Kelola APOD</h2>
        </div>
        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
      </div>

      {/* Info API Key */}
      <div className="card text-white mb-4 border-0" style={{ background: 'linear-gradient(135deg, #0d1e3d, #07101b)', border: '1px solid rgba(0, 195, 255, 0.25)' }}>
        <div className="card-body">
          <h5 className="mb-2 text-primary fw-bold">Konfigurasi NASA API (Backend Proxy)</h5>
          <p className="text-white-50 mb-2">
            Astronomy Picture of the Day (APOD) sekarang dikelola secara terpusat dan aman melalui <strong>Backend Laravel REST API</strong>.
          </p>
          <small className="text-white-50 d-block">
            Semua request menggunakan API Key resmi yang disimpan aman di server backend, mencegah kebocoran credentials ke client-side.
          </small>
        </div>
      </div>

      {/* Preview APOD */}
      <h5 className="mb-3">Preview APOD Hari Ini</h5>

      {loading && <div className="text-center py-5"><div className="spinner-border text-light" /></div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {apod && (
        <div className="card bg-secondary text-white">
          <div className="card-body">
            <small className="text-white-50">{apod.date}</small>
            <h5 className="mt-1 mb-3">{apod.title}</h5>
            {apod.media_type === 'image' ? (
              <img src={apod.url} alt={apod.title} className="w-100 rounded mb-3" style={{ maxHeight: 400, objectFit: 'cover' }} />
            ) : (
              <div className="ratio ratio-16x9 mb-3">
                <iframe src={apod.url} title={apod.title} allowFullScreen />
              </div>
            )}
            <p className="text-white-50 small">{apod.explanation}</p>
            {apod.copyright && <small className="text-white-50">© {apod.copyright}</small>}
          </div>
        </div>
      )}
    </div>
  );
}