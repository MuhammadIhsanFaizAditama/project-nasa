import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtikel } from '../../services/artikelService';
import hero from '../../assets/hero.svg';

export default function ArtikelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getArtikel(id)
      .then(res => setArticle(res.data))
      .catch(() => setError('Artikel tidak ditemukan.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-vh-100 bg-dark d-flex justify-content-center align-items-center">
      <div className="spinner-border text-light" />
    </div>
  );

  if (error) return (
    <div className="min-vh-100 bg-dark d-flex justify-content-center align-items-center">
      <div className="text-center text-white">
        <p>{error}</p>
        <button className="btn btn-outline-light" onClick={() => navigate('/artikel')}>Kembali</button>
      </div>
    </div>
  );

  return (
    <article className="min-vh-100 bg-dark text-white py-5">
      <div className="container" style={{ maxWidth: 720 }}>
        <button className="btn btn-outline-light btn-sm mb-4" onClick={() => navigate('/artikel')}>
          ← Kembali
        </button>
        <img
          src={article.image || hero}
          alt={article.title}
          className="w-100 rounded mb-4"
          style={{ maxHeight: 360, objectFit: 'cover' }}
        />
        <small className="text-white-50">{article.category} • {article.author} • {new Date(article.created_at).toLocaleDateString('id-ID')}</small>
        <h1 className="mt-2 mb-4">{article.title}</h1>
        <p className="text-white-50" style={{ lineHeight: 1.8 }}>{article.content}</p>
      </div>
    </article>
  );
}