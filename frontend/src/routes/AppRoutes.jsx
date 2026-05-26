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
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing & Login */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Public */}
        <Route path="/home" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/artikel" element={<PublicLayout><ArtikelList /></PublicLayout>} />
        <Route path="/artikel/:id" element={<PublicLayout><ArtikelDetail /></PublicLayout>} />
        <Route path="/apod" element={<PublicLayout><ApodView /></PublicLayout>} />
        <Route path="/nasa-library" element={<PublicLayout><NasaLibrary /></PublicLayout>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/artikel" element={<ProtectedRoute><AdminLayout><KelolaArtikel /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/kategori" element={<ProtectedRoute><AdminLayout><KelolaKategori /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/apod" element={<ProtectedRoute><AdminLayout><KelolaApod /></AdminLayout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}