import api from './api';

export async function getKategoriList() {
  const res = await api.get('/kategori');
  return res.data;
}

export async function createKategori(payload) {
  const res = await api.post('/kategori', payload);
  return res.data;
}

export async function updateKategori(id, payload) {
  const res = await api.put(`/kategori/${id}`, payload);
  return res.data;
}

export async function deleteKategori(id) {
  const res = await api.delete(`/kategori/${id}`);
  return res.data;
}