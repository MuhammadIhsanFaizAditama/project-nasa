import React from 'react';
import SidebarAdmin from './SidebarAdmin';

export default function AdminLayout({ children }) {
  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#02030c' }}>
      <SidebarAdmin />
      <main className="flex-grow-1 p-4 admin-area" style={{ overflowY: 'auto', color: 'white' }}>
        {children}
      </main>

      <style>{`
        .admin-area .table {
          --bs-table-bg: transparent;
          --bs-table-color: rgba(255,255,255,0.85);
          --bs-table-hover-bg: rgba(0,195,255,0.05);
          --bs-table-border-color: rgba(255,255,255,0.08);
        }
      `}</style>
    </div>
  );
}