import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" className="me-2" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 0l2.45 5.57L16 6.45l-4 3.9.95 5.55L8 12.9 3.05 15.9 4 9.85 0 5.9l5.55-.88L8 0z" />
  </svg>
);

export default function LandingPage() {
  return (
    <section
      className="min-vh-100 vw-100 m-0 p-0 d-flex justify-content-center align-items-center"
      style={{
        background: 'radial-gradient(circle at top, rgba(0, 195, 255, 0.12), transparent 22%), linear-gradient(180deg, #020305 0%, #02030c 55%, #000 100%)',
      }}
    >
      <div className="container-fluid px-5">
        <div className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100">
          <div className="landing-panel p-5 rounded-4 mx-auto" style={{ maxWidth: '820px' }}>
            <div className="mb-4 text-uppercase text-primary text-opacity-75 letter-spacing-2 fw-semibold">
              <span className="d-inline-flex align-items-center justify-content-center gap-2">
                <StarIcon /> Galaksi Edukasi
              </span>
            </div>
            <h1 className="display-4 fw-bold text-white mb-3" style={{ letterSpacing: '0.35em' }}>
              SISTEM EDUKASI ASTRONOMI
            </h1>
            <p className="lead text-white-50 mb-4" style={{ maxWidth: '720px', margin: '0 auto' }}>
              Masuki antariksa pengetahuan dengan antarmuka futuristik, garis neon lembut, dan teks yang mudah dibaca.
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <Link to="/login" className="btn btn-neon btn-lg px-4 py-2 rounded-0">
                Login
              </Link>
              <Link to="/Home" className="btn btn-outline-neon btn-lg px-4 py-2 rounded-0">
                Masuk sebagai Pengunjung
              </Link>
            </div>
            <div className="mt-5 border-top border-primary border-1 pt-4 text-white-50 small d-flex flex-column flex-md-row justify-content-center gap-3 align-items-center">
              <span>Eksplorasi materi astronomi</span>
              <span className="text-primary">Cerah, Futuristik, dan Elegan</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="position-absolute bottom-0 start-0 end-0">
        <div className="w-100 py-3 text-center text-white-50 small" style={{ background: 'rgba(0, 0, 0, 0.55)' }}>
          © 2026 Sistem Edukasi Astronomi • Desain Sci-Fi hitam-biru tanpa gambar latar.
        </div>
      </footer>

      <style>{`
        .landing-panel {
          background: rgba(15, 20, 34, 0.96);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 0 24px rgba(255, 255, 255, 0.07), 0 12px 28px rgba(0, 195, 255, 0.10);
        }

        .btn-neon {
          background: #09f;
          color: #02030c;
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
        }

        .btn-neon:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
          box-shadow: 0 0 16px rgba(255, 255, 255, 0.12), 0 0 18px rgba(0, 195, 255, 0.18);
        }

        .btn-outline-neon {
          color: #fff;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.22);
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .btn-outline-neon:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.10);
          transform: translateY(-2px);
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.10);
        }

        .letter-spacing-2 {
          letter-spacing: 0.35em;
        }
      `}</style>
    </section>
  );
}
