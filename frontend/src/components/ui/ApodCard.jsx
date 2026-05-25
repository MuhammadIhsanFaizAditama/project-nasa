import React from 'react';

export default function ApodCard({imageUrl, title, explanation}) {
  return (
    <div style={{borderRadius: 8, overflow: 'hidden', background: '#081229', color: '#fff'}}>
      {imageUrl && <img src={imageUrl} alt={title} style={{width: '100%', display: 'block'}} />}
      <div style={{padding: '0.75rem'}}>
        <h4>{title || 'APOD Title'}</h4>
        <p style={{fontSize: 14}}>{explanation || 'Deskripsi singkat APOD.'}</p>
      </div>
    </div>
  );
}
