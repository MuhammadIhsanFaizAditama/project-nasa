import React from 'react';

export default function Footer() {
  return (
    <footer style={{padding: '1rem', textAlign: 'center', background: '#071529', color: '#9fb0d3'}}>
      © {new Date().getFullYear()} Sistem Edukasi Astronomi
    </footer>
  );
}
