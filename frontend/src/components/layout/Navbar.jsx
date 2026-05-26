import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { to: '/home', label: 'Beranda' },
    { to: '/artikel', label: 'Artikel' },
    { to: '/apod', label: 'APOD' },
    { to: '/nasa-library', label: 'NASA Library' },
  ];

  return (
    <nav
      className="w-100 px-5 py-3 d-flex justify-content-between align-items-center"
      style={{
        background: 'rgba(2, 3, 12, 0.92)',
        borderBottom: '1px solid rgba(0, 195, 255, 0.12)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 16 16" fill="#09f" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 0l2.45 5.57L16 6.45l-4 3.9.95 5.55L8 12.9 3.05 15.9 4 9.85 0 5.9l5.55-.88L8 0z" />
        </svg>
        <span className="fw-bold text-white" style={{ letterSpacing: '0.15em', fontSize: '0.95rem' }}>
          EDUKASI ASTRONOMI
        </span>
      </Link>

      {/* Nav Links */}
      <div className="d-flex align-items-center gap-4">
        {links.map(link => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className="text-decoration-none small"
              style={{
                letterSpacing: '0.08em',
                color: isActive ? '#09f' : 'rgba(255,255,255,0.5)',
                borderBottom: isActive ? '1px solid #09f' : '1px solid transparent',
                paddingBottom: '2px',
                transition: 'color 0.2s ease',
              }}
            >
              {link.label}
            </Link>
          );
        })}
        <button
          className="btn btn-sm rounded-0 px-3"
          style={{
            border: '1px solid rgba(0, 195, 255, 0.4)',
            color: '#09f',
            background: 'rgba(0, 195, 255, 0.06)',
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
          }}
          onClick={() => navigate('/login')}
        >
          LOGIN
        </button>
      </div>
    </nav>
  );
}