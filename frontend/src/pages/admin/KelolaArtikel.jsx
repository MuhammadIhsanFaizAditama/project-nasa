import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArtikelList, createArtikel, updateArtikel, deleteArtikel } from '../../services/artikelService';
import { logout } from '../../services/authService';
import api from '../../services/api';

export default function KelolaArtikel() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', category_id: '' });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [artikelRes, kategoriRes] = await Promise.all([
        getArtikelList(),
        api.get('/kategori'),
      ]);
      setArticles(artikelRes.data);
      setCategories(kategoriRes.data.data);
    } catch {
      setError('Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim() || !form.category_id) {
      setError('Semua field wajib diisi.');
      return;
    }
    try {
      setFormLoading(true);
      if (editId) {
        await updateArtikel(editId, form);
        setSuccess('Artikel berhasil diupdate.');
      } else {
        await createArtikel(form);
        setSuccess('Artikel berhasil ditambah.');
      }
      setForm({ title: '', content: '', category_id: '' });
      setEditId(null);
      setShowForm(false);
      fetchData();
    } catch {
      setError('Gagal menyimpan artikel.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (article) => {
    setEditId(article.id);
    setForm({
      title: article.title,
      content: article.content,
      category_id: categories.find(c => c.nama_kategori === article.category)?.id || '',
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin hapus artikel ini?')) return;
    try {
      await deleteArtikel(id);
      setSuccess('Artikel berhasil dihapus.');
      fetchData();
    } catch {
      setError('Gagal menghapus artikel.');
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-vh-100 bg-dark text-white p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/admin')}>← Dashboard</button>
          <h2 className="fw-bold mb-0">Kelola Artikel</h2>
        </div>
        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
      </div>

      {/* Alert */}
      {error && <div className="alert alert-danger alert-dismissible"><button className="btn-close btn-close-white" onClick={() => setError('')} />{error}</div>}
      {success && <div className="alert alert-success alert-dismissible"><button className="btn-close" onClick={() => setSuccess('')} />{success}</div>}

      {/* Tombol Tambah */}
      {!showForm && (
        <button className="btn btn-light text-dark mb-4" onClick={() => { setShowForm(true); setEditId(null); setForm({ title: '', content: '', category_id: '' }); }}>
          + Tambah Artikel
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="card bg-secondary text-white mb-4">
          <div className="card-body">
            <h5 className="mb-3">{editId ? 'Edit Artikel' : 'Tambah Artikel'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Judul</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  disabled={formLoading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Kategori</label>
                <select
                  className="form-select bg-dark text-white border-secondary"
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  disabled={formLoading}
                >
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.nama_kategori}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Konten</label>
                <textarea
                  className="form-control bg-dark text-white border-secondary"
                  rows={5}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  disabled={formLoading}
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-light text-dark" disabled={formLoading}>
                  {formLoading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                  {editId ? 'Update' : 'Simpan'}
                </button>
                <button type="button" className="btn btn-outline-light" onClick={() => { setShowForm(false); setEditId(null); setError(''); }}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabel */}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-light" /></div>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Judul</th>
                <th>Kategori</th>
                <th>Penulis</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 && (
                <tr><td colSpan={6} className="text-center text-white-50">Belum ada artikel.</td></tr>
              )}
              {articles.map((a, i) => (
                <tr key={a.id}>
                  <td>{i + 1}</td>
                  <td>{a.title}</td>
                  <td>{a.category}</td>
                  <td>{a.author}</td>
                  <td>{new Date(a.created_at).toLocaleDateString('id-ID')}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-light btn-sm" onClick={() => handleEdit(a)}>Edit</button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(a.id)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}