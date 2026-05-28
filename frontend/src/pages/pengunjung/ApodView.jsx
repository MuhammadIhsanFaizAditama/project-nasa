import React, { useState, useEffect } from 'react';
import { fetchApod, translateToIndonesian } from '../../services/nasaService';

export default function ApodView() {
  const [apod, setApod] = useState(null);
  const [translated, setTranslated] = useState(null);
  const [isTranslated, setIsTranslated] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApod()
      .then(data => setApod(data))
      .catch(() => setError('Gagal memuat APOD. Coba lagi nanti.'))
      .finally(() => setLoading(false));
  }, []);

  const handleTranslate = async () => {
    if (translated) { setIsTranslated(!isTranslated); return; }
    setTranslating(true);
    const result = await translateToIndonesian(apod.explanation);
    setTranslated(result);
    setIsTranslated(true);
    setTranslating(false);
  };

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
    <section className="py-5 text-white"
      style={{ background: 'radial-gradient(circle at top, rgba(0,195,255,0.07), transparent 40%), #020305' }}>
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
          <img src={apod.url} alt={apod.title} className="w-100 mb-4"
            style={{ maxHeight: 520, objectFit: 'cover', border: '1px solid rgba(0,195,255,0.15)', display: 'block' }} />
        ) : (
          <div className="ratio ratio-16x9 mb-4" style={{ border: '1px solid rgba(0,195,255,0.15)' }}>
            <iframe src={apod.url} title={apod.title} allowFullScreen />
          </div>
        )}

        {/* Title */}
        <h2 className="fw-bold mb-3" style={{ letterSpacing: '0.05em' }}>{apod.title}</h2>
        <div className="mb-4" style={{ height: 1, background: 'linear-gradient(to right, rgba(0,195,255,0.4), transparent)' }} />

        {/* Translate Toggle Button */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <small className="text-white-50" style={{ letterSpacing: '0.06em' }}>
            {isTranslated ? 'Bahasa Indonesia' : 'English (Original)'}
          </small>
          <button
            className="btn btn-sm rounded-0 px-3"
            style={{
              border: `1px solid ${isTranslated ? 'rgba(0,195,255,0.5)' : 'rgba(255,255,255,0.2)'}`,
              color: isTranslated ? '#09f' : 'rgba(255,255,255,0.5)',
              background: isTranslated ? 'rgba(0,195,255,0.08)' : 'transparent',
              fontSize: '0.75rem', letterSpacing: '0.08em',
            }}
            onClick={handleTranslate}
            disabled={translating}
          >
            {translating ? (
              <><span className="spinner-border spinner-border-sm me-1" style={{ width: 10, height: 10 }} /> Menerjemahkan...</>
            ) : isTranslated ? '🌐 Tampilkan Asli' : '🌐 Terjemahkan ke Indonesia'}
          </button>
        </div>

        {/* Explanation */}
        <p style={{ lineHeight: 2, color: 'rgba(255,255,255,0.7)', fontSize: '1.02rem' }}>
          {isTranslated && translated ? translated : apod.explanation}
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