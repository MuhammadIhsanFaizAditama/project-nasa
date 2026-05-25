import React from 'react';

export default function SidebarAdmin() {
  return (
    <aside style={{width: 220, padding: '1rem', background: '#061426', color: '#fff'}}>
      <h3>Admin Menu</h3>
      <ul>
        <li>Dashboard</li>
        <li>Kelola Artikel</li>
        <li>Kelola Kategori</li>
        <li>Kelola APOD</li>
      </ul>
    </aside>
  );
}
