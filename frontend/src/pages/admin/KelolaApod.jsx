import React, { useState, useEffect } from 'react';
import { fetchApod, translateToIndonesian } from '../../services/nasaService';

export default function KelolaApod() {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [translated, setTranslated] = useState(null);
  const [isTranslated, setIsTranslated] = useState(false);
  const [translating, setTranslating] = useState(false);

  // Date picker
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [dateInput, setDateInput] = useState(today);

  const loadApod = (date) => {
    setLoading(true);
    setError('');
    setApod(null);
    setTranslated(null);
    setIsTranslated(false);
    fetchApod(null, date)
      .then(data => setApod(data))
      .catch(() => setError('Gagal memuat APOD untuk tanggal ini.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadApod(today); }, []);

  const handleSearch = () => {
    if (!dateInput) return;
    setSelectedDate(dateInput);
    loadApod(dateInput);
  };

  const handleTranslate = async () => {
    if (translated) { setIsTranslated(!isTranslated); return; }
    setTranslating(true);
    const result = await translateToIndonesian(apod.explanation);
    setTranslated(result);
    setIsTranslated(true);
    setTranslating(false);
  };

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

      {/* Date Picker */}
      <div className="p-4 mb-4" style={{ background: 'rgba(0,195,255,0.04)', border: '1px solid rgba(0,195,255,0.15)' }}>
        <h6 className="mb-3" style={{ letterSpacing: '0.1em', fontSize: '0.8rem' }}>📅 CARI APOD BERDASARKAN TANGGAL</h6>
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <input
            type="date"
            className="form-control form-control-sm rounded-0 bg-transparent text-white"
            style={{ border: '1px solid rgba(255,255,255,0.15)', maxWidth: 200 }}
            value={dateInput}
            min="1995-06-16"
            max={today}
            onChange={e => setDateInput(e.target.value)}
          />
          <button
            className="btn btn-sm rounded-0 px-4"
            style={{ background: 'rgba(0,195,255,0.08)', border: '1px solid rgba(0,195,255,0.35)', color: '#09f', fontSize: '0.78rem' }}
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? <span className="spinner-border spinner-border-sm" /> : 'Tampilkan'}
          </button>
          {selectedDate !== today && (
            <button
              className="btn btn-sm rounded-0 px-3"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', background: 'transparent', fontSize: '0.78rem' }}
              onClick={() => { setDateInput(today); setSelectedDate(today); loadApod(today); }}
            >
              Kembali ke Hari Ini
            </button>
          )}
        </div>
        <small className="text-white-50 mt-2 d-block" style={{ fontSize: '0.7rem' }}>
          APOD tersedia mulai 16 Juni 1995 hingga hari ini
        </small>
      </div>

      {/* Preview */}
      <h6 className="mb-3 text-white-50" style={{ letterSpacing: '0.1em' }}>
        PREVIEW APOD — {selectedDate === today ? 'HARI INI' : selectedDate}
      </h6>

      {loading && <div className="text-center py-5"><div className="spinner-border text-light" /></div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {apod && (
        <div style={{ border: '1px solid rgba(0,195,255,0.15)' }}>
          {apod.media_type === 'image' ? (
            <img src={apod.url} alt={apod.title} className="w-100"
              style={{ maxHeight: 400, objectFit: 'cover', display: 'block' }} />
          ) : (
            <div className="ratio ratio-16x9">
              <iframe src={apod.url} title={apod.title} allowFullScreen />
            </div>
          )}
          <div className="p-4" style={{ background: 'rgba(0,195,255,0.04)' }}>
            <small className="text-white-50">{apod.date}</small>
            <h5 className="mt-1 mb-3 text-white">{apod.title}</h5>

            {/* Translate Toggle */}
            <div className="d-flex align-items-center gap-2 mb-2">
              <small className="text-white-50" style={{ fontSize: '0.75rem' }}>
                {isTranslated ? '🇮🇩 Bahasa Indonesia' : '🇺🇸 English (Original)'}
              </small>
              <button
                className="btn btn-sm rounded-0 px-2 py-0"
                style={{
                  border: `1px solid ${isTranslated ? 'rgba(0,195,255,0.5)' : 'rgba(255,255,255,0.2)'}`,
                  color: isTranslated ? '#09f' : 'rgba(255,255,255,0.5)',
                  background: 'transparent', fontSize: '0.7rem',
                }}
                onClick={handleTranslate}
                disabled={translating}
              >
                {translating
                  ? <><span className="spinner-border spinner-border-sm me-1" style={{ width: 8, height: 8 }} />Menerjemahkan</>
                  : isTranslated ? 'Tampilkan Asli' : 'Terjemahkan'}
              </button>
            </div>

            <p className="text-white-50 small mb-2">
              {isTranslated && translated ? translated : apod.explanation}
            </p>

            {apod.copyright && <small className="text-white-50">© {apod.copyright}</small>}
          </div>
        </div>
      )}
    </div>
  );
}