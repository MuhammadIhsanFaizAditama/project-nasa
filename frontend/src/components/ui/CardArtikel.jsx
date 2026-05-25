import React from 'react';

export default function CardArtikel({title, excerpt}) {
  return (
    <article style={{border: '1px solid #2b3a4a', padding: '1rem', borderRadius: 8}}>
      <h3>{title || 'Judul Artikel'}</h3>
      <p>{excerpt || 'Ringkasan singkat artikel astronomi...'}</p>
    </article>
  );
}
