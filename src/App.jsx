import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Sayfalar
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';

// User sayfaları
import ExplorePage from './pages/user/ExplorePage'; 
import MyOutfits from './pages/user/MyOutfits';
import AddOutfit from './pages/user/AddOutfit';
import EditOutfit from './pages/user/EditOutfit';
import OutfitDetail from './pages/user/OutfitDetail';

// Organization sayfaları
import OrgDashboard from './pages/organization/OrgDashboard';
import OrganizationOutfitList from './pages/organization/OrganizationOutfitList';
import TagManagement from './pages/organization/TagManagement';

// Layoutlar
import DashboardLayout from './layouts/DashboardLayout';
import PublicLayout from './layouts/PublicLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- GRUP 1: HALKA AÇIK SAYFALAR --- */}
        <Route element={<PublicLayout />}>
           <Route path="/" element={<LandingPage />} />
           <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* --- GRUP 2: GİRİŞ EKRANLARI --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- GRUP 3: PANEL SAYFALARI --- */}
        <Route element={<DashboardLayout />}>
           {/* User Routes */}
           <Route path="/explore" element={<ExplorePage />} />
           
           <Route path="/my-outfits" element={<MyOutfits />} />
           <Route path="/my-outfits/add" element={<AddOutfit />} />
           <Route path="/my-outfits/edit/:id" element={<EditOutfit />} />
           
           {/* 👇 EKSİK OLAN VE DOLABIM HATASINI ÇÖZECEK SATIR BU 👇 */}
           <Route path="/my-outfits/:id" element={<OutfitDetail />} />
           
           {/* Eski linkler de çalışsın diye bu da kalsın */}
           <Route path="/outfit/:id" element={<OutfitDetail />} />
           
           {/* Organization Routes */}
           <Route path="/organization/dashboard" element={<OrgDashboard />} />
           <Route path="/organization/outfits" element={<OrganizationOutfitList />} />
           <Route path="/organization/tags" element={<TagManagement />} />
        </Route>

        {/* Hatalı link yönlendirmesi */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;