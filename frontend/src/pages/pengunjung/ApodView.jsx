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
    <div className="min-vh-100 bg-dark d-flex justify-content-center align-items-center">
      <div className="spinner-border text-light" />
    </div>
  );

  if (error) return (
    <div className="min-vh-100 bg-dark d-flex justify-content-center align-items-center">
      <div className="alert alert-danger">{error}</div>
    </div>
  );

  return (
    <section className="min-vh-100 bg-dark text-white py-5">
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 className="fw-bold mb-1">Astronomy Picture of the Day</h1>
        <small className="text-white-50 d-block mb-4">{apod.date}</small>

        {apod.media_type === 'image' ? (
          <img src={apod.url} alt={apod.title} className="w-100 rounded mb-4" style={{ maxHeight: 500, objectFit: 'cover' }} />
        ) : (
          <div className="ratio ratio-16x9 mb-4">
            <iframe src={apod.url} title={apod.title} allowFullScreen />
          </div>
        )}

        <h2 className="h4 fw-bold mb-3">{apod.title}</h2>
        <p className="text-white-50" style={{ lineHeight: 1.8 }}>{apod.explanation}</p>

        {apod.copyright && (
          <small className="text-white-50">© {apod.copyright}</small>
        )}
      </div>
    </section>
  );
}