import React, { useState, useEffect } from 'react';
import { fetchApod } from '../../services/nasaService';

export default function ApodView() {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApod()
      .then(data => setApod(data))
      .catch(() => setError('Gagal memuat APOD. Coba lagi nanti.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '60vh' }}>
      <div className="spinner-border" style={{ color: '#09f' }} />
    </div>
  );

  if (error) return (
    <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '60vh' }}>
      <div className="alert alert-danger">{error}</div>
    </div>
  );

  return (
    <section
      className="py-5 text-white"
      style={{ background: 'radial-gradient(circle at top, rgba(0,195,255,0.07), transparent 40%), #020305' }}
    >
      <div className="container" style={{ maxWidth: 860 }}>

        {/* Header */}
        <div className="mb-4" style={{ borderBottom: '1px solid rgba(0,195,255,0.15)', paddingBottom: '1.5rem' }}>
          <small className="text-uppercase d-block mb-2" style={{ color: '#09f', letterSpacing: '0.3em', fontSize: '0.75rem' }}>
            NASA • Astronomy Picture of the Day
          </small>
          <h1 className="fw-bold mb-1" style={{ letterSpacing: '0.08em' }}>APOD</h1>
          <small className="text-white-50">{apod.date}</small>
        </div>

        {/* Media */}
        {apod.media_type === 'image' ? (
          <img
            src={apod.url}
            alt={apod.title}
            className="w-100 mb-4"
            style={{ maxHeight: 520, objectFit: 'cover', border: '1px solid rgba(0,195,255,0.15)', display: 'block' }}
          />
        ) : (
          <div className="ratio ratio-16x9 mb-4" style={{ border: '1px solid rgba(0,195,255,0.15)' }}>
            <iframe src={apod.url} title={apod.title} allowFullScreen />
          </div>
        )}

        {/* Title & Content */}
        <h2 className="fw-bold mb-3" style={{ letterSpacing: '0.05em' }}>{apod.title}</h2>
        <div className="mb-4" style={{ height: 1, background: 'linear-gradient(to right, rgba(0,195,255,0.4), transparent)' }} />
        <p style={{ lineHeight: 2, color: 'rgba(255,255,255,0.7)', fontSize: '1.02rem' }}>
          {apod.explanation}
        </p>

        {apod.copyright && (
          <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <small className="text-white-50">© {apod.copyright}</small>
          </div>
        )}
      </div>
    </section>
  );
}