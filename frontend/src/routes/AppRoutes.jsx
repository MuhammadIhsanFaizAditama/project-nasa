import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/pengunjung/Home';
import LandingPage from '../pages/pengunjung/LandingPage';
import ArtikelList from '../pages/pengunjung/ArtikelList';
import ArtikelDetail from '../pages/pengunjung/ArtikelDetail';
import ApodView from '../pages/pengunjung/ApodView';
import NasaLibrary from '../pages/pengunjung/NasaLibrary';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/admin/Dashboard';
import KelolaArtikel from '../pages/admin/KelolaArtikel';
import KelolaKategori from '../pages/admin/KelolaKategori';
import KelolaApod from '../pages/admin/KelolaApod';
import ProtectedRoute from '../routes/ProtectedRoute';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/artikel" element={<ArtikelList />} />
        <Route path="/artikel/:id" element={<ArtikelDetail />} />
        <Route path="/apod" element={<ApodView />} />
        <Route path="/nasa-gallery" element={<NasaLibrary />} />
        <Route path="/login" element={<Login />} />

        {/* Admin - Protected */}
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/artikel" element={<ProtectedRoute><KelolaArtikel /></ProtectedRoute>} />
        <Route path="/admin/kategori" element={<ProtectedRoute><KelolaKategori /></ProtectedRoute>} />
        <Route path="/admin/apod" element={<ProtectedRoute><KelolaApod /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}