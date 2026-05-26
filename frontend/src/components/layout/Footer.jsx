import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      className="w-100 py-4 px-5"
      style={{
        background: 'rgba(2, 3, 12, 0.95)',
        borderTop: '1px solid rgba(0, 195, 255, 0.10)',
      }}
    >
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div className="d-flex align-items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#09f" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0l2.45 5.57L16 6.45l-4 3.9.95 5.55L8 12.9 3.05 15.9 4 9.85 0 5.9l5.55-.88L8 0z" />
          </svg>
          <span className="text-white-50 small">© {new Date().getFullYear()} Sistem Edukasi Astronomi</span>
        </div>
        <div className="d-flex gap-4">
          <Link to="/home" className="text-white-50 text-decoration-none small">Beranda</Link>
          <Link to="/artikel" className="text-white-50 text-decoration-none small">Artikel</Link>
          <Link to="/apod" className="text-white-50 text-decoration-none small">APOD</Link>
        </div>
      </div>
    </footer>
  );
}