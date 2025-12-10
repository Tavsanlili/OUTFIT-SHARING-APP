import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PublicLayout = () => {
  return (
    // 1. 'overflow-x-hidden'ı buradan KALDIRDIK (Sadece index.css'te kalsın)
    // 2. 'flex-col' yapısını koruduk.
    <div className="flex flex-col min-h-screen w-full bg-white">
      
      <Navbar />
      
      {/* 3. 'pt-16' EKLEDİK: Navbar 16 birim yüksekliğinde olduğu için,
             içeriği 16 birim aşağı ittik ki Navbar'ın altında kalmasın. */}
      <main className="flex-grow w-full pt-16">
        <Outlet />
      </main>

      <Footer />
      
    </div>
  );
};

export default PublicLayout;