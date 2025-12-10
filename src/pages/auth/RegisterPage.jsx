import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore'; // Store yolunu klasör yapına göre düzeltmen gerekebilir

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' // Varsayılan rol
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // --- KAYIT SİMÜLASYONU ---
    setTimeout(() => {
      console.log('Kayıt Verileri:', formData);
      
      // Kayıt başarılı gibi davranıp direkt giriş yaptıralım
      const fakeToken = "new-user-token";
      const fakeRefreshToken = "new-user-refresh";
      
      login(fakeToken, fakeRefreshToken); 

      // Rolüne göre yönlendir
      if (formData.role === 'organization') {
        navigate('/organization/dashboard');
      } else {
        navigate('/explore');
      }
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Hesap Oluştur</h2>
          <p className="mt-2 text-sm text-gray-600">StylePoint dünyasına katılın.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Ad Soyad */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
            <input
              name="name"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Şifre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Şifre</label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* HESAP TÜRÜ SEÇİMİ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hesap Türü</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'user'})}
                className={`py-2 px-4 border rounded-md text-sm font-medium ${
                  formData.role === 'user' 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Kullanıcı
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'organization'})}
                className={`py-2 px-4 border rounded-md text-sm font-medium ${
                  formData.role === 'organization' 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Mağaza
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Zaten hesabın var mı? </span>
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Giriş Yap
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RegisterPage;