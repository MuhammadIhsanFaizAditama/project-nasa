import api from './api';

export async function getArtikelList() {
  const res = await api.get('/artikel');
  return res.data;
}

export async function getArtikel(id) {
  const res = await api.get(`/artikel/${id}`);
  return res.data;
}

export async function createArtikel(payload) {
  const res = await api.post('/artikel', payload);
  return res.data;
}

export async function updateArtikel(id, payload) {
  const res = await api.put(`/artikel/${id}`, payload);
  return res.data;
}

export async function deleteArtikel(id) {
  const res = await api.delete(`/artikel/${id}`);
  return res.data;
}
