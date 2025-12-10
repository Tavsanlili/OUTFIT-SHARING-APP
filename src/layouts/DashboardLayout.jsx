import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function DashboardLayout() {
  const { logout, user, role } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Link aktif mi kontrolü
  const getLinkClass = (path) => {
    return location.pathname === path
      ? "block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
      : "block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700";
  };

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-gray-50">
      
      {/* --- SIDEBAR --- */}
      <div className="flex-none w-full md:w-64 bg-white border-r border-gray-200">
        <div className="flex h-screen flex-col justify-between px-6 py-8">
          
          <div>
            {/* LOGO */}
            <span className="grid h-10 w-32 place-content-center rounded-lg bg-indigo-100 text-xs text-indigo-600 font-bold tracking-widest uppercase">
              StylePoint
            </span>

            {/* MENÜ LİNKLERİ */}
            <ul className="mt-6 space-y-1">
              {role === 'user' && (
                <li>
                  <Link to="/explore" className={getLinkClass('/explore')}>
                    🔍 Keşfet
                  </Link>
                </li>
              )}
 

              {role === 'organization' && (
                <li>
                  <Link to="/organization/dashboard" className={getLinkClass('/organization/dashboard')}>
                    📊 Firma Paneli
                  </Link>
                </li>
              )}

              {role === 'user' && (
                <li>
                  <Link to="/my-outfits" className={getLinkClass('/my-outfits')}>
                    🧥 Dolabım
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* ÇIKIŞ BUTONU */}
          <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                 {user?.email?.[0].toUpperCase() || "U"}
              </div>
              <div className="text-xs">
                <p className="font-medium text-gray-900">{user?.email || "Kullanıcı"}</p>
                <button onClick={handleLogout} className="mt-1 text-red-500 hover:text-red-700">
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- SAĞ TARAF (SAYFA İÇERİĞİ) --- */}
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        <Outlet />
      </div>

    </div>
  );
}