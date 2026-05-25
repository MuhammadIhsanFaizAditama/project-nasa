import api from './api';

/**
 * Fetch Astronomy Picture of the Day (APOD) from the secure backend proxy.
 *
 * @returns {Promise<Object>}
 */
export async function fetchApod() {
  const res = await api.get('/apod');
  return res.data;
}

/**
 * Search NASA Image and Video Library through secure backend proxy.
 *
 * @param {string} query
 * @param {string} mediaType
 * @returns {Promise<Object>}
 */
export async function searchNasaLibrary(query, mediaType = 'image,video') {
  const res = await api.get('/nasa-search', {
    params: { q: query, media_type: mediaType }
  });
  return res.data;
}

/**
 * Fetch manifest media asset from secure backend proxy.
 *
 * @param {string} nasaId
 * @returns {Promise<Object>}
 */
export async function getNasaAsset(nasaId) {
  const res = await api.get(`/nasa-asset/${nasaId}`);
  return res.data;
}