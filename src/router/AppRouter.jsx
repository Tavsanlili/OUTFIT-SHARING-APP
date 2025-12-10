import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import PrivateRoute from '../components/auth/PrivateRoute';
import RoleRoute from '../components/auth/RoleRoute';

// ÖNEMLİ: Layout'u buraya import etmelisin!
// Dosya yolunu kendi klasör yapına göre düzelt (örn: ../layouts/DashboardLayout)
import DashboardLayout from '../layouts/DashboardLayout'; 

// Test sayfaların
const OrgDashboard = () => <h1>Organization Paneli (İçerik)</h1>;
const UserDashboard = () => <h1>User Paneli (Explore İçerik)</h1>;

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC (HERKESE AÇIK) --- */}
        {/* Bu sayfalarda sol menü (Sidebar) GÖZÜKMEZ */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* --- PRIVATE (GİRİŞ YAPMIŞ) --- */}
        <Route element={<PrivateRoute />}>
          
          {/* İŞTE BURASI: Bütün korumalı sayfaları DashboardLayout içine alıyoruz */}
          <Route element={<DashboardLayout />}>
            
            {/* 1. FİRMA SAYFALARI */}
            <Route element={<RoleRoute allowedRoles={['organization']} />}>
              <Route path="/organization/dashboard" element={<OrgDashboard />} />
            </Route>

            {/* 2. KULLANICI SAYFALARI */}
            <Route element={<RoleRoute allowedRoles={['user']} />}>
              <Route path="/explore" element={<UserDashboard />} />
            </Route>

            {/* Profil vb. ortak sayfalar buraya eklenebilir */}
            {/* <Route path="/profile" element={<ProfilePage />} /> */}

          </Route> 
          {/* DashboardLayout Bitişi */}

        </Route>
        {/* PrivateRoute Bitişi */}

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;