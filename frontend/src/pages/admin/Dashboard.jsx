// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArtikelList } from '../../services/artikelService';
import { logout } from '../../services/authService';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ artikel: 0 });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    getArtikelList()
      .then(res => setStats({ artikel: res.data.length }))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-vh-100 bg-dark text-white p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Dashboard Admin</h2>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white-50">Halo, {user.name}</span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Nav ke halaman lain */}
        <div className="d-flex gap-2 mb-4">
          <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/admin/artikel')}>Kelola Artikel</button>
          <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/admin/kategori')}>Kelola Kategori</button>
          <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/admin/apod')}>Kelola APOD</button>
        </div>

      {/* Stats */}
      <div className="row g-3">
        <div className="col-md-3">
          <div className="card bg-secondary text-white">
            <div className="card-body">
              <h6 className="card-title text-white-50">Total Artikel</h6>
              <h2 className="fw-bold">{stats.artikel}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}