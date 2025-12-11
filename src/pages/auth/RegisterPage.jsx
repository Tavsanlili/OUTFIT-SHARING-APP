import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import authService from '../../services/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',        // ✅ SADECE BUNLAR VAR
    password: '',     // ✅
    organizationId: '' // ✅ organization veya user için
  });
  
  const [userType, setUserType] = useState('user'); // ✅ Ayrı state tut
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // ⚠️ ÖNEMLİ SORU: Organization ID nasıl alınacak?
      // 1. Mağaza için kullanıcı kendi ID'sini mi girecek?
      // 2. Yoksa backend otomatik mi oluşturuyor?
      
      // ŞİMDİLİK BASİT ÇÖZÜM:
      const registerData = {
        email: formData.email,
        password: formData.password,
        organizationId: userType === 'organization' 
          ? formData.organizationId || `org-${Date.now()}` // Geçici ID
          : 'user-default' // User'lar için default
      };

      console.log('📤 Gönderilen data:', registerData);
      
      const response = await authService.register(registerData);
      
      console.log('🔍 Register response:', response);
      
      // Token'ları al
      const accessToken = response.accessToken || response.data?.accessToken;
      const refreshToken = response.refreshToken || response.data?.refreshToken;
      
      if (accessToken) {
        login(accessToken, refreshToken);
      }
      
      // Başarılıysa login sayfasına yönlendir
      navigate('/login', { 
        state: { 
          message: 'Kayıt başarılı! Lütfen giriş yapın.',
          email: formData.email 
        } 
      });
      
    } catch (err) {
      console.error('❌ Register error:', err);
      
      const errorMessage = err.response?.data?.message 
        || err.message 
        || 'Kayıt işlemi başarısız. Lütfen bilgilerinizi kontrol edin.';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-fuchsia-700 to-indigo-900 px-4 py-12">
      
      <div className="max-w-md w-full bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/30">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Hesap Oluştur</h2>
          <p className="mt-2 text-sm text-gray-600">StylePoint dünyasına katılın.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg border-l-4 border-red-500">
              {error}
            </div>
          )}
          
          {/* HESAP TÜRÜ SEÇİMİ - İLK SIRADA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hesap Türü</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('user')}
                className={`py-3 px-4 border rounded-lg text-sm font-bold transition-all ${
                  userType === 'user' 
                    ? 'bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500 shadow-sm' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                👤 Kullanıcı
              </button>
              <button
                type="button"
                onClick={() => setUserType('organization')}
                className={`py-3 px-4 border rounded-lg text-sm font-bold transition-all ${
                  userType === 'organization' 
                    ? 'bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500 shadow-sm' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                🏢 Mağaza
              </button>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              placeholder="ornek@email.com"
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
              className="mt-1 block w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* SADECE ORGANIZATION İÇİN ORGANIZATION ID */}
          {userType === 'organization' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Organization ID
                <span className="text-xs text-gray-500 ml-1">(Opsiyonel - backend otomatik oluşturabilir)</span>
              </label>
              <input
                name="organizationId"
                type="text"
                className="mt-1 block w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                placeholder="org-123 veya boş bırakın"
                value={formData.organizationId}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Eğer boş bırakırsanız, sistem otomatik bir ID oluşturacaktır.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Zaten hesabın var mı? </span>
            <Link to="/login" className="font-bold text-purple-600 hover:text-purple-500 transition-colors">
              Giriş Yap
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RegisterPage;