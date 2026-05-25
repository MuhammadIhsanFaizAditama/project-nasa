import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArtikelList } from '../../services/artikelService';
import { fetchApod } from '../../services/nasaService';
import 'bootstrap/dist/css/bootstrap.min.css';

const StarBadge = () => (
  <span className="badge-icon d-inline-flex align-items-center justify-content-center me-2">
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0l2.45 5.57L16 6.45l-4 3.9.95 5.55L8 12.9 3.05 15.9 4 9.85 0 5.9l5.55-.88L8 0z" />
    </svg>
  </span>
);

export default function Home() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [apod, setApod] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      getArtikelList(),
      fetchApod(),
    ]).then(([artikelRes, apodRes]) => {
      setArticles(artikelRes.data);
      setApod(apodRes);
    }).catch(() => setError('Gagal memuat data.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(query.trim().toLowerCase()) ||
    a.content.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section
      className="min-vh-100 vw-100 m-0 p-0"
      style={{
        background: 'radial-gradient(circle at top left, rgba(0, 195, 255, 0.08), transparent 26%), radial-gradient(circle at bottom right, rgba(3, 45, 99, 0.18), transparent 30%), #000',
      }}
    >
      <div className="container-fluid px-5 py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">

            {/* APOD Section */}
            {apod && (
              <div className="mb-5">
                <div className="d-flex align-items-center text-primary mb-3">
                  <StarBadge />
                  <span className="text-uppercase small letter-spacing-2">Astronomy Picture of the Day</span>
                </div>
                <div
                  className="position-relative rounded-0 overflow-hidden border border-1 cursor-pointer"
                  style={{ borderColor: 'rgba(0,195,255,0.25)', cursor: 'pointer' }}
                  onClick={() => navigate('/apod')}
                >
                  {apod.media_type === 'image' ? (
                    <img
                      src={apod.url}
                      alt={apod.title}
                      className="w-100"
                      style={{ maxHeight: 420, objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div className="ratio ratio-16x9">
                      <iframe src={apod.url} title={apod.title} allowFullScreen />
                    </div>
                  )}
                  <div
                    className="position-absolute bottom-0 start-0 end-0 p-4"
                    style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))' }}
                  >
                    <small className="text-white-50">{apod.date}</small>
                    <h2 className="h4 fw-bold text-white mb-1">{apod.title}</h2>
                    <p className="text-white-50 mb-0 small">{apod.explanation.substring(0, 120)}...</p>
                  </div>
                </div>
              </div>
            )}

            {/* NASA Gallery Banner */}
            <div className="mb-5 p-4 border border-1 rounded-0" style={{ borderColor: 'rgba(0, 195, 255, 0.35)', background: 'linear-gradient(135deg, rgba(0, 195, 255, 0.08) 0%, rgba(3, 45, 99, 0.15) 100%)' }}>
              <div className="row align-items-center">
                <div className="col-12 col-md-8 mb-3 mb-md-0">
                  <div className="d-flex align-items-center text-primary mb-2">
                    <StarBadge />
                    <span className="text-uppercase small letter-spacing-2">Fitur Eksplorasi</span>
                  </div>
                  <h3 className="h4 fw-bold text-white mb-2">NASA Image & Video Library</h3>
                  <p className="text-white-50 small mb-0">Jelajahi ribuan dokumentasi foto spektakuler dan rekaman video bersejarah perjalanan antariksa resmi dari NASA.</p>
                </div>
                <div className="col-12 col-md-4 text-md-end">
                  <button className="btn btn-outline-neon px-4 py-2 rounded-0 w-100 w-md-auto" onClick={() => navigate('/nasa-gallery')}>
                    Mulai Jelajah Galeri →
                  </button>
                </div>
              </div>
            </div>

            {/* Header Artikel */}
            <div className="pb-4 mb-4 border-bottom border-2 border-primary border-opacity-25">
              <div className="d-flex align-items-center text-primary mb-2">
                <StarBadge />
                <span className="text-uppercase small letter-spacing-2">Daftar Artikel</span>
              </div>
              <h1 className="display-5 fw-bold text-white" style={{ letterSpacing: '0.28em' }}>
                Koleksi Artikel Astronomi
              </h1>
              <p className="text-white-50 mb-0" style={{ maxWidth: '760px' }}>
                Jelajahi artikel edukatif dengan gaya modern, garis neon, dan struktur yang jelas.
              </p>
            </div>

            {/* Search */}
            <div className="row justify-content-center mb-5">
              <div className="col-12 col-md-7">
                <div className="input-group bg-black rounded-0 border border-2 border-primary p-1 shadow-sm">
                  <input
                    type="search"
                    className="form-control rounded-0 bg-transparent border-0 text-white"
                    placeholder="Cari artikel astronomi..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ minHeight: '56px' }}
                  />
                  <button className="btn btn-outline-neon rounded-0 px-4" type="button" onClick={() => setQuery('')}>
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {loading && <div className="text-center py-5"><div className="spinner-border text-light" /></div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Artikel Grid */}
            <div className="row g-4">
              {!loading && filtered.length === 0 && (
                <div className="col-12">
                  <p className="text-white-50 text-center">Tidak ada artikel ditemukan.</p>
                </div>
              )}
              {filtered.map((artikel) => (
                <div className="col-12 col-md-6 col-lg-4" key={artikel.id}>
                  <div className="article-card h-100 p-4 bg-black text-white rounded-0 border border-1 border-secondary">
                    <div className="d-flex align-items-center mb-2 text-primary">
                      <StarBadge />
                      <h3 className="h5 mb-0 fw-semibold">{artikel.title}</h3>
                    </div>
                    <small className="text-white-50 d-block mb-2">{artikel.category} • {artikel.author}</small>
                    <p className="text-white-50 mb-4">{artikel.content.substring(0, 100)}...</p>
                    <div className="mt-auto">
                      <button
                        className="btn btn-outline-neon btn-sm rounded-0 px-4"
                        onClick={() => navigate(`/artikel/${artikel.id}`)}
                      >
                        Baca Selengkapnya
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .letter-spacing-2 { letter-spacing: 0.30em; }
        .badge-icon {
          width: 32px; height: 32px; border-radius: 50%;
          border: 1px solid rgba(0, 195, 255, 0.35);
          color: #09f; background: rgba(0, 195, 255, 0.08);
        }
        .btn-outline-neon {
          color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.02);
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .btn-outline-neon:hover {
          background: rgba(255, 255, 255, 0.10);
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.12);
          transform: translateY(-2px); color: #ffffff;
        }
        .article-card {
          background: #07101b; border-color: rgba(255, 255, 255, 0.12);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .article-card:hover {
          transform: translateY(-4px); border-color: rgba(255, 255, 255, 0.35);
          box-shadow: 0 0 14px rgba(255, 255, 255, 0.10);
        }
      `}</style>
    </section>
  );
}