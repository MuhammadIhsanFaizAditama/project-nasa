import React, { useState, useEffect } from 'react';
import { getArtikelList, createArtikel, updateArtikel, deleteArtikel } from '../../services/artikelService';
import { fetchNasaImage } from '../../services/nasaService';
import api from '../../services/api';

export default function KelolaArtikel() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', category_id: '', image: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [fetchingImg, setFetchingImg] = useState(false);

  useEffect(() => { fetchData(); }, []);

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

  const handleFetchNasaImage = async () => {
    if (!form.title.trim()) { setError('Isi judul dulu sebelum cari gambar NASA.'); return; }
    setFetchingImg(true);
    const url = await fetchNasaImage(form.title);
    if (url) {
      setForm({ ...form, image: url });
      setPreviewImg(url);
    } else {
      setError('Gambar NASA tidak ditemukan untuk judul ini.');
    }
    setFetchingImg(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim() || !form.category_id) {
      setError('Judul, konten, dan kategori wajib diisi.');
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
      setForm({ title: '', content: '', category_id: '', image: '' });
      setPreviewImg(null);
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
      image: article.image || '',
    });
    setPreviewImg(article.image || null);
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

  return (
    <div className="text-white">
      <h2 className="fw-bold mb-4">Kelola Artikel</h2>

      {error && <div className="alert alert-danger alert-dismissible"><button className="btn-close btn-close-white" onClick={() => setError('')} />{error}</div>}
      {success && <div className="alert alert-success alert-dismissible"><button className="btn-close" onClick={() => setSuccess('')} />{success}</div>}

      {!showForm && (
        <button className="btn btn-sm rounded-0 mb-4 px-4"
          style={{ border: '1px solid rgba(0,195,255,0.4)', color: '#09f', background: 'rgba(0,195,255,0.06)' }}
          onClick={() => { setShowForm(true); setEditId(null); setForm({ title: '', content: '', category_id: '', image: '' }); setPreviewImg(null); }}>
          + Tambah Artikel
        </button>
      )}

      {showForm && (
        <div className="mb-4 p-4" style={{ background: 'rgba(0,195,255,0.04)', border: '1px solid rgba(0,195,255,0.15)' }}>
          <h5 className="mb-3">{editId ? 'Edit Artikel' : 'Tambah Artikel'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-white-50 small">JUDUL</label>
              <input type="text" className="form-control rounded-0 bg-transparent text-white"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                disabled={formLoading} />
            </div>
            <div className="mb-3">
              <label className="form-label text-white-50 small">KATEGORI</label>
              <select className="form-select rounded-0 bg-transparent text-white"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                disabled={formLoading}>
                <option value="" className="bg-dark">-- Pilih Kategori --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id} className="bg-dark">{c.nama_kategori}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label text-white-50 small">KONTEN</label>
              <textarea className="form-control rounded-0 bg-transparent text-white"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                rows={5} value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                disabled={formLoading} />
            </div>

            {/* Image field */}
            <div className="mb-3">
              <label className="form-label text-white-50 small">URL GAMBAR <span style={{ color: 'rgba(255,255,255,0.3)' }}>(opsional)</span></label>
              <div className="d-flex gap-2">
                <input type="text" className="form-control rounded-0 bg-transparent text-white"
                  style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                  placeholder="https://... atau kosongkan untuk cari otomatis dari NASA"
                  value={form.image}
                  onChange={(e) => { setForm({ ...form, image: e.target.value }); setPreviewImg(e.target.value || null); }}
                  disabled={formLoading} />
                <button type="button" className="btn btn-sm rounded-0 px-3 flex-shrink-0"
                  style={{ border: '1px solid rgba(0,195,255,0.4)', color: '#09f', background: 'rgba(0,195,255,0.06)', whiteSpace: 'nowrap' }}
                  onClick={handleFetchNasaImage} disabled={fetchingImg || formLoading}>
                  {fetchingImg ? <span className="spinner-border spinner-border-sm" /> : '🔍 Cari NASA'}
                </button>
              </div>
              {previewImg && (
                <div className="mt-2">
                  <img src={previewImg} alt="preview" style={{ height: 120, objectFit: 'cover', border: '1px solid rgba(0,195,255,0.2)', display: 'block' }}
                    onError={() => setPreviewImg(null)} />
                </div>
              )}
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-sm rounded-0 px-4"
                style={{ background: '#09f', color: '#02030c', border: 'none' }}
                disabled={formLoading}>
                {formLoading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                {editId ? 'Update' : 'Simpan'}
              </button>
              <button type="button" className="btn btn-sm rounded-0 px-4"
                style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', background: 'transparent' }}
                onClick={() => { setShowForm(false); setEditId(null); setError(''); setPreviewImg(null); }}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-light" /></div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <thead>
              <tr>
                {['#', 'Gambar', 'Judul', 'Kategori', 'Penulis', 'Tanggal', 'Aksi'].map(h => (
                  <th key={h} className="text-white-50 fw-normal small"
                    style={{ letterSpacing: '0.08em', background: 'rgba(0,195,255,0.04)', borderColor: 'rgba(0,195,255,0.15)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 && (
                <tr><td colSpan={7} className="text-center text-white-50 py-4">Belum ada artikel.</td></tr>
              )}
              {articles.map((a, i) => (
                <tr key={a.id} style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <td className="text-white-50">{i + 1}</td>
                  <td>
                    {a.image ? (
                      <img src={a.image} alt={a.title} style={{ width: 60, height: 40, objectFit: 'cover', border: '1px solid rgba(0,195,255,0.15)' }} />
                    ) : (
                      <div style={{ width: 60, height: 40, background: 'rgba(0,195,255,0.05)', border: '1px solid rgba(0,195,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <small style={{ color: 'rgba(0,195,255,0.3)', fontSize: '0.6rem' }}>NASA</small>
                      </div>
                    )}
                  </td>
                  <td className="text-white">{a.title}</td>
                  <td className="text-white-50">{a.category}</td>
                  <td className="text-white-50">{a.author}</td>
                  <td className="text-white-50">{new Date(a.created_at).toLocaleDateString('id-ID')}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm rounded-0 px-3"
                        style={{ border: '1px solid rgba(0,195,255,0.35)', color: '#09f', background: 'transparent', fontSize: '0.8rem' }}
                        onClick={() => handleEdit(a)}>Edit</button>
                      <button className="btn btn-sm rounded-0 px-3"
                        style={{ border: '1px solid rgba(255,80,80,0.35)', color: '#f55', background: 'transparent', fontSize: '0.8rem' }}
                        onClick={() => handleDelete(a.id)}>Hapus</button>
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