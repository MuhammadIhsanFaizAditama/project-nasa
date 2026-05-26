import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArtikelList } from '../../services/artikelService';
import { fetchApod, fetchNasaImage } from '../../services/nasaService';

const StarBadge = () => (
  <span className="d-inline-flex align-items-center justify-content-center me-2 flex-shrink-0"
    style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(0,195,255,0.35)', background: 'rgba(0,195,255,0.08)' }}>
    <svg width="14" height="14" viewBox="0 0 16 16" fill="#09f" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0l2.45 5.57L16 6.45l-4 3.9.95 5.55L8 12.9 3.05 15.9 4 9.85 0 5.9l5.55-.88L8 0z" />
    </svg>
  </span>
);

const ArticleCard = ({ article, onClick }) => {
  const [imgSrc, setImgSrc] = useState(article.image || null);
  const [imgLoading, setImgLoading] = useState(!article.image);

  useEffect(() => {
    if (!article.image) {
      fetchNasaImage(article.title)
        .then(url => setImgSrc(url))
        .finally(() => setImgLoading(false));
    }
  }, [article]);

  return (
    <div
      className="d-flex flex-column h-100"
      style={{
        background: '#07101b',
        border: '1px solid rgba(255,255,255,0.08)',
        transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
        cursor: 'pointer',
      }}
      onClick={onClick}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(0,195,255,0.3)';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(0,195,255,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div style={{ height: 180, overflow: 'hidden', background: 'rgba(0,195,255,0.05)', position: 'relative' }}>
        {imgLoading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="spinner-border spinner-border-sm" style={{ color: '#09f' }} />
          </div>
        ) : imgSrc ? (
          <img src={imgSrc} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div className="d-flex justify-content-center align-items-center h-100">
            <svg width="32" height="32" viewBox="0 0 16 16" fill="rgba(0,195,255,0.2)" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0l2.45 5.57L16 6.45l-4 3.9.95 5.55L8 12.9 3.05 15.9 4 9.85 0 5.9l5.55-.88L8 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="d-flex flex-column flex-grow-1 p-4">
        <div className="d-flex align-items-start mb-2">
          <StarBadge />
          <h5 className="mb-0 text-white fw-semibold" style={{ fontSize: '0.95rem', lineHeight: 1.4 }}>
            {article.title}
          </h5>
        </div>
        <small className="text-white-50 d-block mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          {article.category} • {article.author}
        </small>
        <p className="text-white-50 mb-0 flex-grow-1" style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
          {article.content.substring(0, 100)}...
        </p>
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ color: '#09f', fontSize: '0.8rem', letterSpacing: '0.08em' }}>
            Baca Selengkapnya →
          </span>
        </div>
      </div>
    </div>
  );
};

export default function ArtikelList() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getArtikelList(), fetchApod()])
      .then(([artikelRes, apodRes]) => {
        setArticles(artikelRes.data);
        setApod(apodRes);
      })
      .catch(() => setError('Gagal memuat data.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(query.trim().toLowerCase()) ||
    a.content.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section
      className="py-5 px-4 px-lg-5"
      style={{ minHeight: '100vh', background: 'radial-gradient(circle at top left, rgba(0,195,255,0.06), transparent 30%), #020305' }}
    >
      <div className="container-fluid" style={{ maxWidth: 1200 }}>

        {/* APOD Banner */}
        {apod && (
          <div className="mb-5">
            <div className="d-flex align-items-center mb-3" style={{ color: '#09f' }}>
              <StarBadge />
              <span className="text-uppercase small" style={{ letterSpacing: '0.3em' }}>Astronomy Picture of the Day</span>
            </div>
            <div
              className="position-relative overflow-hidden"
              style={{ border: '1px solid rgba(0,195,255,0.25)', cursor: 'pointer' }}
              onClick={() => navigate('/apod')}
            >
              {apod.media_type === 'image' ? (
                <img src={apod.url} alt={apod.title} className="w-100 d-block" style={{ maxHeight: 380, objectFit: 'cover' }} />
              ) : (
                <div className="ratio ratio-16x9"><iframe src={apod.url} title={apod.title} allowFullScreen /></div>
              )}
              <div className="position-absolute bottom-0 start-0 end-0 p-4"
                style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.88))' }}>
                <small className="text-white-50 d-block">{apod.date}</small>
                <h2 className="h5 fw-bold text-white mb-1">{apod.title}</h2>
                <p className="text-white-50 mb-0 small">{apod.explanation.substring(0, 100)}...</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="pb-4 mb-5" style={{ borderBottom: '1px solid rgba(0,195,255,0.15)' }}>
          <div className="d-flex align-items-center mb-2" style={{ color: '#09f' }}>
            <StarBadge />
            <span className="text-uppercase small" style={{ letterSpacing: '0.3em' }}>Daftar Artikel</span>
          </div>
          <h1 className="fw-bold text-white mb-2" style={{ letterSpacing: '0.2em' }}>Edukasi Astronomi</h1>
          <p className="text-white-50 mb-0">Kumpulan artikel informatif seputar astronomi dan luar angkasa.</p>
        </div>

        {/* Search */}
        <div className="row mb-5">
          <div className="col-12 col-md-6">
            <div className="d-flex" style={{ border: '1px solid rgba(0,195,255,0.25)', background: 'rgba(0,195,255,0.03)' }}>
              <input type="search"
                className="form-control rounded-0 border-0 bg-transparent text-white"
                placeholder="Cari artikel..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ minHeight: 48 }} />
              <button className="btn rounded-0 px-4"
                style={{ border: 'none', borderLeft: '1px solid rgba(0,195,255,0.25)', color: 'rgba(255,255,255,0.5)', background: 'transparent', fontSize: '0.8rem' }}
                onClick={() => setQuery('')}>Clear</button>
            </div>
          </div>
        </div>

        {loading && <div className="text-center py-5"><div className="spinner-border" style={{ color: '#09f' }} /></div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Grid */}
        <div className="row g-4">
          {!loading && filtered.length === 0 && (
            <div className="col-12 text-center text-white-50 py-5">Tidak ada artikel ditemukan.</div>
          )}
          {filtered.map(article => (
            <div key={article.id} className="col-12 col-md-6 col-lg-4">
              <ArticleCard article={article} onClick={() => navigate(`/artikel/${article.id}`)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}