import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchNasaLibrary, getNasaAsset } from '../../services/nasaService';
import 'bootstrap/dist/css/bootstrap.min.css';

const StarBadge = () => (
  <span className="badge-icon d-inline-flex align-items-center justify-content-center me-2">
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0l2.45 5.57L16 6.45l-4 3.9.95 5.55L8 12.9 3.05 15.9 4 9.85 0 5.9l5.55-.88L8 0z" />
    </svg>
  </span>
);

export default function NasaLibrary() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('Mars Rover');
  const [mediaType, setMediaType] = useState('image,video');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal states
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [modalError, setModalError] = useState('');

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError('');
      const data = await searchNasaLibrary(query.trim(), mediaType);
      
      const libraryItems = data.collection?.items || [];
      // Clean and format items
      const formatted = libraryItems.map(item => {
        const itemData = item.data?.[0] || {};
        const linkData = item.links?.[0] || {};
        return {
          nasa_id: itemData.nasa_id,
          title: itemData.title,
          description: itemData.description,
          media_type: itemData.media_type,
          date_created: itemData.date_created,
          photographer: itemData.photographer || itemData.secondary_creator,
          thumb: linkData.href
        };
      }).filter(item => item.nasa_id && item.thumb);

      setItems(formatted);
    } catch (err) {
      setError('Gagal memuat data dari NASA Library. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Run initial search
  useEffect(() => {
    handleSearch();
  }, [mediaType]);

  const openAssetModal = async (asset) => {
    setSelectedAsset(asset);
    setVideoUrl('');
    setModalError('');
    
    if (asset.media_type === 'video') {
      try {
        setModalLoading(true);
        const manifest = await getNasaAsset(asset.nasa_id);
        const manifestItems = manifest.collection?.items || [];
        // Find MP4 item
        const mp4Item = manifestItems.find(i => i.href.endsWith('~orig.mp4') || i.href.endsWith('.mp4'));
        if (mp4Item) {
          // Replace secure protocol if needed and bypass local verification or use asset directly
          setVideoUrl(mp4Item.href);
        } else {
          setModalError('Video tidak dapat diputar karena format video tidak didukung.');
        }
      } catch {
        setModalError('Gagal memuat file manifest video dari NASA.');
      } finally {
        setModalLoading(false);
      }
    }
  };

  const closeAssetModal = () => {
    setSelectedAsset(null);
    setVideoUrl('');
    setModalError('');
  };

  return (
    <section
      className="min-vh-100 vw-100 m-0 p-0"
      style={{
        background: 'radial-gradient(circle at top left, rgba(0, 195, 255, 0.08), transparent 26%), radial-gradient(circle at bottom right, rgba(3, 45, 99, 0.18), transparent 30%), #000',
        color: '#fff'
      }}
    >
      <div className="container-fluid px-5 py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">

            {/* Back to Home & Title */}
            <div className="pb-4 mb-4 border-bottom border-2 border-primary border-opacity-25">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-outline-neon btn-sm rounded-0 px-3" onClick={() => navigate('/home')}>
                  ← Kembali ke Beranda
                </button>
                <div className="d-flex align-items-center text-primary">
                  <StarBadge />
                  <span className="text-uppercase small letter-spacing-2 fw-semibold">NASA Image & Video Library</span>
                </div>
              </div>
              <h1 className="display-5 fw-bold text-white mb-2" style={{ letterSpacing: '0.22em' }}>
                Perpustakaan Media NASA
              </h1>
              <p className="text-white-50 mb-0" style={{ maxWidth: '800px' }}>
                Temukan dan jelajahi arsip ribuan foto menakjubkan dan klip video bersejarah yang didokumentasikan langsung oleh NASA.
              </p>
            </div>

            {/* Search Box & Filters */}
            <div className="p-4 mb-5 card rounded-0 border border-1 border-secondary" style={{ background: 'rgba(13, 25, 46, 0.65)' }}>
              <form onSubmit={handleSearch} className="row g-3 align-items-end">
                <div className="col-12 col-md-6">
                  <label className="form-label text-white-50 small mb-2">Masukkan Kata Kunci Pencarian</label>
                  <input
                    type="search"
                    className="form-control rounded-0 bg-black border border-secondary text-white px-3"
                    placeholder="Contoh: Nebula, Apollo, Saturn, Space Station..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ minHeight: '48px' }}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label text-white-50 small mb-2">Tipe Media</label>
                  <select
                    className="form-select rounded-0 bg-black border border-secondary text-white"
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value)}
                    style={{ minHeight: '48px' }}
                  >
                    <option value="image,video">Semua Media (Gambar & Video)</option>
                    <option value="image">Hanya Gambar (Foto)</option>
                    <option value="video">Hanya Klip Video</option>
                  </select>
                </div>
                <div className="col-12 col-md-2">
                  <button className="btn btn-primary-neon rounded-0 w-100" type="submit" style={{ minHeight: '48px' }}>
                    Cari Media
                  </button>
                </div>
              </form>
            </div>

            {/* Status / Loading */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary-neon" role="status" style={{ width: '3rem', height: '3rem' }} />
                <p className="text-white-50 mt-3 small letter-spacing-2">Mengunduh dari arsip NASA...</p>
              </div>
            )}

            {error && (
              <div className="alert alert-danger rounded-0 border-0 bg-danger bg-opacity-10 text-danger p-4 mb-5" role="alert">
                <div className="d-flex align-items-center gap-2">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044 10.396a.81.81 0 1 0-1.62 0 .81.81 0 0 0 1.62 0zm.047-1.921a.5.5 0 0 0-.988 0l-.135 2.7a.5.5 0 0 0 .988 0l-.135-2.7z"/></svg>
                  <span className="fw-semibold">{error}</span>
                </div>
              </div>
            )}

            {/* Media Grid */}
            {!loading && !error && (
              <div className="row g-4">
                {items.length === 0 ? (
                  <div className="col-12 text-center py-5">
                    <p className="text-white-50 fs-5 mb-0">Tidak ada media yang ditemukan. Coba gunakan kata kunci lainnya.</p>
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={item.nasa_id + '-' + idx}>
                      <div
                        className="media-card h-100 bg-black border border-1 border-secondary rounded-0 overflow-hidden cursor-pointer position-relative d-flex flex-column"
                        onClick={() => openAssetModal(item)}
                      >
                        {/* Media Type Badge */}
                        <span
                          className={`position-absolute top-0 end-0 m-3 badge rounded-0 text-uppercase small ${item.media_type === 'video' ? 'bg-danger' : 'bg-primary'}`}
                          style={{ letterSpacing: '0.1em', zIndex: 2 }}
                        >
                          {item.media_type}
                        </span>

                        <div className="ratio ratio-4x3 overflow-hidden position-relative border-bottom border-secondary">
                          <img
                            src={item.thumb}
                            alt={item.title}
                            className="w-100 h-100 object-fit-cover transition-transform"
                            style={{ display: 'block' }}
                          />
                          <div className="overlay-hover position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-40 d-flex justify-content-center align-items-center">
                            <span className="btn btn-outline-light rounded-0 btn-sm">Lihat Detail</span>
                          </div>
                        </div>

                        <div className="p-3 d-flex flex-column flex-grow-1">
                          <h3 className="h6 fw-semibold text-white mb-2 line-clamp-2">{item.title}</h3>
                          <div className="mt-auto pt-2 border-top border-secondary border-opacity-50 d-flex justify-content-between align-items-center text-white-50 small">
                            <span>{new Date(item.date_created).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })}</span>
                            {item.photographer && (
                              <span className="text-truncate ps-2" style={{ maxWidth: '120px' }}>{item.photographer}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0, 0, 0, 0.85)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-black rounded-0 border border-1 border-secondary text-white shadow-lg overflow-hidden">
              
              {/* Modal Header */}
              <div className="modal-header border-bottom border-secondary p-3 d-flex justify-content-between align-items-center">
                <span className={`badge rounded-0 text-uppercase ${selectedAsset.media_type === 'video' ? 'bg-danger' : 'bg-primary'}`}>
                  NASA {selectedAsset.media_type}
                </span>
                <button type="button" className="btn-close btn-close-white" onClick={closeAssetModal} aria-label="Close" />
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4 overflow-y-auto" style={{ maxHeight: '75vh' }}>
                
                {/* Media Container */}
                <div className="bg-dark border border-secondary mb-4 overflow-hidden position-relative">
                  {selectedAsset.media_type === 'image' ? (
                    <img
                      src={selectedAsset.thumb}
                      alt={selectedAsset.title}
                      className="w-100 h-auto object-fit-contain"
                      style={{ maxHeight: '420px', display: 'block', margin: '0 auto' }}
                    />
                  ) : (
                    <div className="ratio ratio-16x9 bg-black">
                      {modalLoading ? (
                        <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
                          <div className="spinner-border text-primary-neon" role="status" />
                          <small className="text-white-50 mt-2">Menyiapkan video...</small>
                        </div>
                      ) : modalError ? (
                        <div className="w-100 h-100 d-flex justify-content-center align-items-center p-3 text-center">
                          <p className="text-danger small mb-0">{modalError}</p>
                        </div>
                      ) : videoUrl ? (
                        <video src={videoUrl} controls autoPlay className="w-100 h-100" style={{ display: 'block' }} />
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Details Content */}
                <h4 className="fw-bold mb-2 text-white">{selectedAsset.title}</h4>
                <div className="d-flex flex-wrap gap-3 mb-4 text-white-50 small">
                  <span><strong>NASA ID:</strong> {selectedAsset.nasa_id}</span>
                  <span><strong>Tanggal:</strong> {new Date(selectedAsset.date_created).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
                  {selectedAsset.photographer && (
                    <span><strong>Kredit:</strong> {selectedAsset.photographer}</span>
                  )}
                </div>

                <div className="border-top border-secondary pt-3">
                  <h5 className="h6 fw-semibold text-primary mb-2">Deskripsi Aset:</h5>
                  <p className="text-white-50 small mb-0" style={{ lineHeight: 1.7, textAlign: 'justify' }}>
                    {selectedAsset.description}
                  </p>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-top border-secondary p-3">
                <button type="button" className="btn btn-outline-light rounded-0" onClick={closeAssetModal}>
                  Tutup
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      <style>{`
        .letter-spacing-2 { letter-spacing: 0.30em; }
        .badge-icon {
          width: 32px; height: 32px; border-radius: 50%;
          border: 1px solid rgba(0, 195, 255, 0.35);
          color: #09f; background: rgba(0, 195, 255, 0.08);
        }
        .btn-outline-neon {
          color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.02);
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .btn-outline-neon:hover {
          background: rgba(255, 255, 255, 0.10);
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.12);
          transform: translateY(-2px); color: #ffffff;
        }
        .btn-primary-neon {
          color: #000; font-weight: bold; background: #00c3ff;
          border: 1px solid #00c3ff;
          box-shadow: 0 0 10px rgba(0, 195, 255, 0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
        }
        .btn-primary-neon:hover {
          transform: translateY(-2px); filter: brightness(1.05);
          box-shadow: 0 0 14px rgba(0, 195, 255, 0.40);
        }
        .text-primary-neon {
          color: #00c3ff !important;
        }
        .spinner-border.text-primary-neon {
          border-color: #00c3ff transparent #00c3ff transparent;
        }
        .media-card {
          background: #07101b; border-color: rgba(255, 255, 255, 0.12);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .media-card:hover {
          transform: translateY(-4px); border-color: rgba(0, 195, 255, 0.45);
          box-shadow: 0 0 16px rgba(0, 195, 255, 0.15);
        }
        .media-card img {
          transition: transform 0.3s ease;
        }
        .media-card:hover img {
          transform: scale(1.08);
        }
        .overlay-hover {
          opacity: 0; transition: opacity 0.2s ease;
        }
        .media-card:hover .overlay-hover {
          opacity: 1;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
