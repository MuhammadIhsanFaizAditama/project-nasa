import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArtikelList } from '../../services/artikelService';
import { getKategoriList } from '../../services/kategoriService';

export default function Dashboard() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState({ artikel: 0, kategori: 0, user: 1 });
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getArtikelList(), getKategoriList()])
      .then(([artikelRes, kategoriRes]) => {
        setArticles(artikelRes.data);
        setStats({
          artikel: artikelRes.data.length,
          kategori: kategoriRes.data.length,
          user: 1,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'TOTAL ARTIKEL', value: stats.artikel, icon: '✦' },
    { label: 'TOTAL KATEGORI', value: stats.kategori, icon: '◈' },
    { label: 'TOTAL USER', value: stats.user, icon: '◉' },
  ];

  return (
    <div className="text-white">
      <h2 className="fw-bold mb-1">Dashboard</h2>
      <p className="text-white-50 mb-5">Selamat datang, {user.name}</p>

      {/* Stat Cards */}
      <div className="row g-3 mb-5">
        {statCards.map((s) => (
          <div key={s.label} className="col-12 col-md-4">
            <div className="p-4"
              style={{ background: 'rgba(0,195,255,0.05)', border: '1px solid rgba(0,195,255,0.15)' }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <small className="text-white-50" style={{ letterSpacing: '0.1em', fontSize: '0.75rem' }}>{s.label}</small>
                <span style={{ color: '#09f', fontSize: '1.1rem' }}>{s.icon}</span>
              </div>
              <h2 className="fw-bold text-white mb-0" style={{ fontSize: '2rem' }}>{s.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Tabel Artikel Terbaru */}
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 text-white" style={{ letterSpacing: '0.08em' }}>Artikel Terbaru</h5>
          <button className="btn btn-sm rounded-0 px-3"
            style={{ border: '1px solid rgba(0,195,255,0.3)', color: '#09f', background: 'transparent', fontSize: '0.8rem' }}
            onClick={() => navigate('/admin/artikel')}>
            Lihat Semua →
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4"><div className="spinner-border spinner-border-sm" style={{ color: '#09f' }} /></div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <thead>
                <tr>
                  {['#', 'Judul', 'Kategori', 'Penulis', 'Tanggal', 'Aksi'].map(h => (
                    <th key={h} className="text-white-50 fw-normal small"
                      style={{ letterSpacing: '0.08em', background: 'rgba(0,195,255,0.04)', borderColor: 'rgba(0,195,255,0.15)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {articles.slice(0, 5).map((a, i) => (
                  <tr key={a.id} style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <td className="text-white-50">{i + 1}</td>
                    <td className="text-white">{a.title}</td>
                    <td className="text-white-50">{a.category}</td>
                    <td className="text-white-50">{a.author}</td>
                    <td className="text-white-50">{new Date(a.created_at).toLocaleDateString('id-ID')}</td>
                    <td>
                      <button className="btn btn-sm rounded-0 px-3"
                        style={{ border: '1px solid rgba(0,195,255,0.35)', color: '#09f', background: 'transparent', fontSize: '0.75rem' }}
                        onClick={() => navigate('/admin/artikel')}>
                        Kelola
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}