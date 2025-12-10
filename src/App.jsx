import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Sayfalar
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import LandingPage from './pages/public/LandingPage';

// 👇 YENİ EKLEME: Gerçek ExplorePage dosyasını buraya çağırıyoruz
// (Dosyayı nereye kaydettiysen yolu ona göre düzelt, genelde pages klasöründedir)
import ExplorePage from './pages/user/ExplorePage'; 

// Layoutlar
import DashboardLayout from './layouts/DashboardLayout';
import PublicLayout from './layouts/PublicLayout';

// Mock (Geçici) Sayfalar - ExplorePage'i sildik çünkü gerçeğini yukarıda import ettik
const OrgDashboard = () => <div>📊 Firma Paneli</div>;
const MyOutfits = () => <div>🧥 Dolabım</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- GRUP 1: HALKA AÇIK SAYFALAR --- */}
        <Route element={<PublicLayout />}>
           <Route path="/" element={<LandingPage />} />
        </Route>

        {/* --- GRUP 2: GİRİŞ EKRANLARI --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- GRUP 3: PANEL SAYFALARI --- */}
        <Route element={<DashboardLayout />}>
           {/* Artık burası gerçek ExplorePage'i açacak */}
           <Route path="/explore" element={<ExplorePage />} />
           
           <Route path="/organization/dashboard" element={<OrgDashboard />} />
           <Route path="/my-outfits" element={<MyOutfits />} />
        </Route>

        {/* Hatalı link yönlendirmesi */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;