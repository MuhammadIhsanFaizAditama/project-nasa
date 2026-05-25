import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import hero from '../../assets/hero.svg';
import { getArtikelList } from '../../services/artikelService';

export default function ArtikelList() {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getArtikelList()
      .then(res => setArticles(res.data))
      .catch(() => setError('Gagal memuat artikel.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(query.trim().toLowerCase()) ||
    a.content.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section className="container-fluid py-5 px-3 px-lg-5 bg-dark text-white" style={{ minHeight: '100vh', width: '100%' }}>
      <header className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between mb-5 gap-3">
        <div className="me-lg-4 flex-grow-1">
          <h1 className="display-6 mb-2">Edukasi Astronomi</h1>
          <p className="text-muted mb-0">Kumpulan artikel singkat dan informatif seputar astronomi.</p>
        </div>
        <form className="w-100" onSubmit={(e) => e.preventDefault()} style={{ maxWidth: 520 }}>
          <div className="input-group">
            <input
              type="search"
              className="form-control"
              placeholder="Cari artikel..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-outline-light" type="button" onClick={() => setQuery('')}>Clear</button>
          </div>
        </form>
      </header>

      {loading && <div className="text-center py-5"><div className="spinner-border text-light" /></div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
        {!loading && filtered.length === 0 && (
          <div className="col-12">
            <div className="alert alert-secondary text-white">Tidak ada artikel ditemukan.</div>
          </div>
        )}
        {filtered.map(article => (
          <div key={article.id} className="col d-flex">
            <div className="card bg-secondary text-white h-100 shadow-sm w-100">
              <div className="ratio ratio-16x9">
                <img src={article.image || hero} className="card-img-top img-fluid rounded-top" alt={article.title} style={{ objectFit: 'cover' }} />
              </div>
              <div className="card-body d-flex flex-column">
                <small className="text-white-50 mb-1">{article.category} • {article.author}</small>
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text text-white-50">{article.content.substring(0, 100)}...</p>
                <div className="mt-auto">
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => navigate(`/artikel/${article.id}`)}
                  >
                    Baca Selengkapnya
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}