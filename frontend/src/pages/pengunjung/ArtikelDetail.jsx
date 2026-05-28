import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtikel } from '../../services/artikelService';
import { fetchNasaImage } from '../../services/nasaService';

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="#09f" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 0l2.45 5.57L16 6.45l-4 3.9.95 5.55L8 12.9 3.05 15.9 4 9.85 0 5.9l5.55-.88L8 0z" />
  </svg>
);

export default function ArtikelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getArtikel(id)
      .then(async res => {
        const data = res.data;
        setArticle(data);
        if (data.image) {
          setImgSrc(data.image);
        } else {
          const nasaImg = await fetchNasaImage(data.title);
          setImgSrc(nasaImg);
        }
      })
      .catch(() => setError('Artikel tidak ditemukan.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border" style={{ color: '#09f' }} />
    </div>
  );

  if (error) return (
    <div className="d-flex flex-column justify-content-center align-items-center gap-3" style={{ minHeight: '60vh' }}>
      <p className="text-white-50">{error}</p>
      <button className="btn btn-sm rounded-0 px-4"
        style={{ border: '1px solid rgba(0,195,255,0.4)', color: '#09f', background: 'rgba(0,195,255,0.06)' }}
        onClick={() => navigate('/artikel')}>← Kembali</button>
    </div>
  );

  const paragraphs = (() => {
    const split = article.content.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
    return split.length > 1 ? split : [article.content];
  })();

  return (
    <article className="py-5 text-white"
      style={{ background: 'radial-gradient(circle at top, rgba(0,195,255,0.06), transparent 40%), #020305' }}>
      <div className="container" style={{ maxWidth: 740 }}>

        <button className="btn btn-sm rounded-0 mb-5 px-4 d-inline-flex align-items-center gap-2"
          style={{ border: '1px solid rgba(0,195,255,0.25)', color: '#09f', background: 'transparent', fontSize: '0.8rem', letterSpacing: '0.08em' }}
          onClick={() => navigate('/artikel')}>
          ← KEMBALI
        </button>

        <div className="d-flex align-items-center gap-2 mb-3">
          <StarIcon />
          <small className="text-white-50" style={{ letterSpacing: '0.08em' }}>
            {article.category} • {article.author} • {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </small>
        </div>

        <h1 className="fw-bold mb-4" style={{ letterSpacing: '0.05em', lineHeight: 1.3 }}>{article.title}</h1>

        <div className="mb-4" style={{ height: 1, background: 'linear-gradient(to right, rgba(0,195,255,0.4), transparent)' }} />

        {imgSrc && (
          <img src={imgSrc} alt={article.title} className="w-100 mb-4 d-block"
            style={{ maxHeight: 420, objectFit: 'cover', border: '1px solid rgba(0,195,255,0.15)' }} />
        )}

      <div style={{
          marginTop: '0.5rem',
          borderLeft: '2px solid rgba(0,195,255,0.3)',
          paddingLeft: '1.5rem',
      }}>
        {paragraphs.map((para, i) => (
           <p key={i} style={{
              lineHeight: 2,
              color: 'rgba(255,255,255,0.75)',
              fontSize: '1.05rem',
              marginBottom: '1.6rem',
              letterSpacing: '0.01em',
            }}>
              {para}
          </p>
        ))}
      </div>

        <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button className="btn btn-sm rounded-0 px-4"
            style={{ border: '1px solid rgba(0,195,255,0.25)', color: '#09f', background: 'transparent', fontSize: '0.8rem' }}
            onClick={() => navigate('/artikel')}>
            ← Kembali ke Daftar Artikel
          </button>
        </div>

      </div>
    </article>
  );
}