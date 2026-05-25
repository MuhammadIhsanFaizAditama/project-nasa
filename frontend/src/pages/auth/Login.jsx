import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) return setError('Email wajib diisi.');
    if (!password.trim()) return setError('Password wajib diisi.');

    try {
      setLoading(true);
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="min-vh-100 vw-100 m-0 p-0 d-flex justify-content-center align-items-center"
      style={{
        background: 'radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 20%), linear-gradient(180deg, #020305 0%, #000 100%)',
      }}
    >
      <div className="container-fluid px-5">
        <div className="d-flex justify-content-center align-items-center min-vh-100 py-5">
          <div
            className="card bg-dark text-white shadow-sm"
            style={{
              maxWidth: '420px',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              boxShadow: '0 18px 34px rgba(255, 255, 255, 0.06)',
              background: 'rgba(10, 14, 24, 0.96)',
            }}
          >
            <div className="card-body p-4">
              <h2 className="card-title text-center fw-bold mb-3" style={{ letterSpacing: '0.20em', color: '#ffffff' }}>
                LOGIN
              </h2>
              <p className="text-center text-white-50 mb-4">
                Masuk untuk mengakses konten edukasi atau mengelola artikel.
              </p>

              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button type="button" className="btn-close btn-close-white" onClick={() => setError('')} />
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label text-white">Email</label>
                  <input
                    type="email"
                    className="form-control bg-white bg-opacity-10 border border-white border-opacity-10 text-white rounded-0"
                    id="email"
                    placeholder="Masukkan email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label text-white">Password</label>
                  <input
                    type="password"
                    className="form-control bg-white bg-opacity-10 border border-white border-opacity-10 text-white rounded-0"
                    id="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-light w-100 mb-3 rounded-0 fw-bold"
                  style={{ color: '#02030c' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Sedang Login...
                    </>
                  ) : 'MASUK'}
                </button>

                <Link to="/artikel" className="btn btn-outline-light w-100 mb-3 rounded-0">
                  Masuk sebagai Pengunjung
                </Link>
                <div className="text-center text-white-50 small">
                  <Link to="/" className="text-white text-decoration-underline">Kembali ke Beranda</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}