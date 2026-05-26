import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/authService';

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: '⊞' },
  { path: '/admin/artikel', label: 'Kelola Artikel', icon: '✦' },
  { path: '/admin/kategori', label: 'Kelola Kategori', icon: '◈' },
  { path: '/admin/apod', label: 'Kelola APOD', icon: '✺' },
];

export default function SidebarAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className="d-flex flex-column"
      style={{
        width: 240,
        minHeight: '100vh',
        background: 'rgba(2, 3, 15, 0.98)',
        borderRight: '1px solid rgba(0, 195, 255, 0.12)',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Logo */}
      <div className="px-4 py-4 border-bottom" style={{ borderColor: 'rgba(0,195,255,0.12) !important' }}>
        <div className="d-flex align-items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="#09f" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0l2.45 5.57L16 6.45l-4 3.9.95 5.55L8 12.9 3.05 15.9 4 9.85 0 5.9l5.55-.88L8 0z" />
          </svg>
          <span className="fw-bold text-white" style={{ fontSize: '0.85rem', letterSpacing: '0.12em' }}>
            ADMIN PANEL
          </span>
        </div>
        <div className="mt-2">
          <small className="text-white-50">{user.name}</small>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-grow-1 py-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              className="w-100 text-start px-4 py-3 border-0 d-flex align-items-center gap-3"
              style={{
                background: isActive ? 'rgba(0, 195, 255, 0.10)' : 'transparent',
                color: isActive ? '#09f' : 'rgba(255,255,255,0.55)',
                borderLeft: isActive ? '2px solid #09f' : '2px solid transparent',
                fontSize: '0.875rem',
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => navigate(item.path)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-top" style={{ borderColor: 'rgba(0,195,255,0.12) !important' }}>
        <button
          className="w-100 btn btn-sm rounded-0 py-2"
          style={{
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.5)',
            background: 'transparent',
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
          }}
          onClick={handleLogout}
        >
          LOGOUT
        </button>
      </div>
    </aside>
  );
}