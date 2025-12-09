import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import PrivateRoute from '../components/auth/PrivateRoute';
import RoleRoute from '../components/auth/RoleRoute';

// Şimdilik test için boş componentler (Daha sonra gerçek sayfalarla değişecek)
const OrgDashboard = () => <h1>Organization Paneli</h1>;
const UserDashboard = () => <h1>User Paneli (Explore)</h1>;

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Herkese Açık Sayfalar */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Sadece Giriş Yapanlar Görebilir */}
        <Route element={<PrivateRoute />}>
          {/* Buraya profil ayarları vb. gelebilir */}
        </Route>

        {/* SADECE ORGANIZATION Rolü Olanlar */}
        <Route element={<RoleRoute allowedRoles={['organization']} />}>
          <Route path="/organization/dashboard" element={<OrgDashboard />} />
          {/* İleride: /organization/outfits, /organization/tags */}
        </Route>

        {/* SADECE USER Rolü Olanlar */}
        <Route element={<RoleRoute allowedRoles={['user']} />}>
          <Route path="/explore" element={<UserDashboard />} />
          {/* İleride: /my-outfits */}
        </Route>

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;