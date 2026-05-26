import React, { useState, useEffect } from 'react';
import { getKategoriList, createKategori, updateKategori, deleteKategori } from '../../services/kategoriService';

export default function KelolaKategori() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nama_kategori: '', deskripsi: '' });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getKategoriList();
      setCategories(res.data);
    } catch {
      setError('Gagal memuat kategori.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama_kategori.trim()) { setError('Nama kategori wajib diisi.'); return; }
    try {
      setFormLoading(true);
      if (editId) {
        await updateKategori(editId, form);
        setSuccess('Kategori berhasil diupdate.');
      } else {
        await createKategori(form);
        setSuccess('Kategori berhasil ditambah.');
      }
      setForm({ nama_kategori: '', deskripsi: '' });
      setEditId(null);
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan kategori.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditId(category.id);
    setForm({ nama_kategori: category.nama_kategori, deskripsi: category.deskripsi || '' });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin hapus kategori ini?')) return;
    try {
      await deleteKategori(id);
      setSuccess('Kategori berhasil dihapus.');
      fetchData();
    } catch {
      setError('Gagal menghapus kategori. Mungkin masih ada artikel yang menggunakan kategori ini.');
    }
  };

  return (
    <div className="text-white">
      <h2 className="fw-bold mb-4">Kelola Kategori</h2>

      {error && <div className="alert alert-danger alert-dismissible"><button className="btn-close btn-close-white" onClick={() => setError('')} />{error}</div>}
      {success && <div className="alert alert-success alert-dismissible"><button className="btn-close" onClick={() => setSuccess('')} />{success}</div>}

      {!showForm && (
        <button className="btn btn-sm rounded-0 mb-4 px-4"
          style={{ border: '1px solid rgba(0,195,255,0.4)', color: '#09f', background: 'rgba(0,195,255,0.06)' }}
          onClick={() => { setShowForm(true); setEditId(null); setForm({ nama_kategori: '', deskripsi: '' }); }}>
          + Tambah Kategori
        </button>
      )}

      {showForm && (
        <div className="mb-4 p-4" style={{ background: 'rgba(0,195,255,0.04)', border: '1px solid rgba(0,195,255,0.15)' }}>
          <h5 className="mb-3">{editId ? 'Edit Kategori' : 'Tambah Kategori'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-white-50 small">NAMA KATEGORI</label>
              <input type="text"
                className="form-control rounded-0 bg-transparent text-white"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                value={form.nama_kategori}
                onChange={(e) => setForm({ ...form, nama_kategori: e.target.value })}
                disabled={formLoading} />
            </div>
            <div className="mb-3">
              <label className="form-label text-white-50 small">DESKRIPSI <span className="text-white-25">(opsional)</span></label>
              <textarea
                className="form-control rounded-0 bg-transparent text-white"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                rows={3}
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                disabled={formLoading} />
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
                onClick={() => { setShowForm(false); setEditId(null); setError(''); }}>
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
                {['#', 'Nama Kategori', 'Deskripsi', 'Aksi'].map(h => (
                  <th key={h} className="text-white-50 fw-normal small" style={{ letterSpacing: '0.08em', background: 'rgba(0,195,255,0.04)', borderColor: 'rgba(0,195,255,0.15)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && (
                <tr><td colSpan={4} className="text-center text-white-50 py-4">Belum ada kategori.</td></tr>
              )}
              {categories.map((c, i) => (
                <tr key={c.id} style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <td className="text-white-50">{i + 1}</td>
                  <td className="text-white">{c.nama_kategori}</td>
                  <td className="text-white-50">{c.deskripsi || '-'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm rounded-0 px-3"
                        style={{ border: '1px solid rgba(0,195,255,0.35)', color: '#09f', background: 'transparent', fontSize: '0.8rem' }}
                        onClick={() => handleEdit(c)}>Edit</button>
                      <button className="btn btn-sm rounded-0 px-3"
                        style={{ border: '1px solid rgba(255,80,80,0.35)', color: '#f55', background: 'transparent', fontSize: '0.8rem' }}
                        onClick={() => handleDelete(c.id)}>Hapus</button>
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