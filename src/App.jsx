import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Sayfalar
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import LandingPage from './pages/public/LandingPage';

// Layoutlar
import DashboardLayout from './layouts/DashboardLayout';
import PublicLayout from './layouts/PublicLayout';

// Mock (Geçici) Sayfalar - İleride bunları gerçek dosyalarla değiştireceğiz
const ExplorePage = () => <div>🔍 Keşfet Sayfası</div>;
const OrgDashboard = () => <div>📊 Firma Paneli</div>;
const MyOutfits = () => <div>🧥 Dolabım</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- GRUP 1: HALKA AÇIK SAYFALAR (Navbar ve Footer GÖRÜNÜR) --- */}
        <Route element={<PublicLayout />}>
           {/* Ana sayfaya (/) girince LandingPage açılır */}
           <Route path="/" element={<LandingPage />} />
        </Route>


        {/* --- GRUP 2: GİRİŞ EKRANLARI (Navbar/Footer GÖRÜNMEZ) --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />


        {/* --- GRUP 3: PANEL SAYFALARI (Sidebar GÖRÜNÜR) --- */}
        <Route element={<DashboardLayout />}>
           <Route path="/explore" element={<ExplorePage />} />
           <Route path="/organization/dashboard" element={<OrgDashboard />} />
           <Route path="/my-outfits" element={<MyOutfits />} />
        </Route>

        {/* Hatalı link girilirse ana sayfaya yönlendir */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;