import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 16 16" fill="#09f" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 0l2.45 5.57L16 6.45l-4 3.9.95 5.55L8 12.9 3.05 15.9 4 9.85 0 5.9l5.55-.88L8 0z" />
  </svg>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);
  // phase 0: mulai, 1: teks muncul, 2: fade out, 3: redirect

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);   // teks muncul
    const t2 = setTimeout(() => setPhase(2), 2800);  // mulai fade out
    const t3 = setTimeout(() => navigate('/home'), 3600); // redirect
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [navigate]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'radial-gradient(circle at top, rgba(0,195,255,0.12), transparent 22%), linear-gradient(180deg, #020305 0%, #02030c 55%, #000 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        opacity: phase === 2 ? 0 : 1,
        transition: phase === 2 ? 'opacity 0.8s ease' : 'none',
      }}
    >
      {/* Stars background dots */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(40)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            borderRadius: '50%',
            background: 'white',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.6 + 0.2,
            animation: `twinkle ${Math.random() * 3 + 2}s infinite alternate`,
          }} />
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          textAlign: 'center',
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* Icon */}
        <div style={{ marginBottom: 24, opacity: 0.9 }}>
          <StarIcon />
        </div>

        {/* Selamat Datang */}
        <p style={{
          color: '#09f', fontSize: '0.75rem', letterSpacing: '0.4em',
          textTransform: 'uppercase', marginBottom: 16,
        }}>
          Selamat Datang
        </p>

        {/* Title */}
        <h1 style={{
          color: '#fff', fontWeight: 700,
          fontSize: 'clamp(1.4rem, 4vw, 2.5rem)',
          letterSpacing: '0.25em', marginBottom: 16,
          textTransform: 'uppercase',
        }}>
          Sistem Edukasi Astronomi
        </h1>

        {/* Divider */}
        <div style={{
          width: 60, height: 1, margin: '0 auto 20px',
          background: 'linear-gradient(to right, transparent, #09f, transparent)',
        }} />

        {/* Tagline */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', letterSpacing: '0.08em' }}>
          Menjelajahi alam semesta melalui pengetahuan
        </p>

        {/* Loading dots */}
        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 8 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#09f', opacity: 0.5,
              animation: `pulse 1.2s ${i * 0.2}s infinite alternate`,
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          from { opacity: 0.2; }
          to { opacity: 0.8; }
        }
        @keyframes pulse {
          from { opacity: 0.2; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}