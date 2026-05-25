import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getKategoriList, createKategori, updateKategori, deleteKategori } from '../../services/kategoriService';
import { logout } from '../../services/authService';

export default function KelolaKategori() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
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
    if (!form.nama_kategori.trim()) {
      setError('Nama kategori wajib diisi.');
      return;
    }
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

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-vh-100 bg-dark text-white p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/admin')}>← Dashboard</button>
          <h2 className="fw-bold mb-0">Kelola Kategori</h2>
        </div>
        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
      </div>

      {/* Alert */}
      {error && <div className="alert alert-danger alert-dismissible"><button className="btn-close btn-close-white" onClick={() => setError('')} />{error}</div>}
      {success && <div className="alert alert-success alert-dismissible"><button className="btn-close" onClick={() => setSuccess('')} />{success}</div>}

      {/* Tombol Tambah */}
      {!showForm && (
        <button className="btn btn-light text-dark mb-4" onClick={() => { setShowForm(true); setEditId(null); setForm({ nama_kategori: '', deskripsi: '' }); }}>
          + Tambah Kategori
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="card bg-secondary text-white mb-4">
          <div className="card-body">
            <h5 className="mb-3">{editId ? 'Edit Kategori' : 'Tambah Kategori'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nama Kategori</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  value={form.nama_kategori}
                  onChange={(e) => setForm({ ...form, nama_kategori: e.target.value })}
                  disabled={formLoading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Deskripsi <span className="text-white-50">(opsional)</span></label>
                <textarea
                  className="form-control bg-dark text-white border-secondary"
                  rows={3}
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
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
                <th>Nama Kategori</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && (
                <tr><td colSpan={4} className="text-center text-white-50">Belum ada kategori.</td></tr>
              )}
              {categories.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>
                  <td>{c.nama_kategori}</td>
                  <td className="text-white-50">{c.deskripsi || '-'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-light btn-sm" onClick={() => handleEdit(c)}>Edit</button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(c.id)}>Hapus</button>
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