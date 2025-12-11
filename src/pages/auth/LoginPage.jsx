import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import authService from '../../services/authService'; // ✅ API'yi import et

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // ✅ GERÇEK API'YE İSTEK YAP
      const response = await authService.login({
        email,
        password
      });
      
      // ✅ RESPONSE YAPISINI KONTROL ET (debug için)
      console.log('API Response:', response);
      
      // ✅ TOKEN'LARI AL (backend'in yapısına göre ayarla)
      const accessToken = response.accessToken || response.data?.accessToken;
      const refreshToken = response.refreshToken || response.data?.refreshToken;
      
      if (!accessToken) {
        throw new Error('Token alınamadı');
      }

      // ✅ STORE'A KAYDET
      login(accessToken, refreshToken);

      // ✅ TOKEN'I DECODE ETMEK İÇİN FONKSİYON
      const decodeToken = (token) => {
        try {
          const payload = token.split('.')[1];
          return JSON.parse(atob(payload));
        } catch {
          return { role: 'user' }; // fallback
        }
      };
      
      const decoded = decodeToken(accessToken);
      const userRole = decoded.role || 'user';
      
      // ✅ ROLE'E GÖRE YÖNLENDİR
      if (userRole === 'organization' || userRole === 'admin') {
        navigate('/organization/dashboard');
      } else {
        navigate('/explore');
      }

    } catch (err) {
      console.error('Login error:', err);
      
      // ✅ HATA MESAJINI BACKEND'DEN AL VEYA DEFAULT
      const errorMessage = err.response?.data?.message 
        || err.message 
        || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ✅ GERİ KALAN TÜM KOD AYNI KALIYOR
  return (
    <div className="fixed inset-0 flex w-full h-full bg-white">
      
      {/* SOL TARAF: GRADIENT ALAN */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-900 via-purple-900 to-black items-center justify-center overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 p-12 text-white">
          <div className="mb-6">
            <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
              Moda & Stil
            </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
            Tarzını<br/>Yeniden Keşfet.
          </h1>
          <p className="text-lg text-indigo-200 max-w-md leading-relaxed">
            SharingApp ile kombinlerini yönet, yeni trendleri yakala ve organizasyonunu güçlendir.
          </p>
        </div>
      </div>

      {/* SAĞ TARAF: FORM ALANI */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative z-20">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900">Hoş Geldiniz</h2>
            <p className="mt-2 text-sm text-gray-500">
              Devam etmek için lütfen giriş yapın.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg border-l-4 border-red-500">
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Adresi</label>
                <input
                  type="email"
                  required
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                <input
                  type="password"
                  required
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex justify-end mt-1">
                    <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Şifremi unuttum</a>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:-translate-y-0.5 disabled:opacity-70"
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
            
            <div className="text-center mt-6">
               <p className="text-sm text-gray-600">
                 Hesabın yok mu?{' '}
                 <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-500">
                   Hemen Kayıt Ol
                 </Link>
               </p>
            </div>
            
            {/* ✅ DEMO BİLGİSİNİ KALDIRABİLİRSİN ARTIK */}
            {/* <div className="mt-8 border-t border-gray-100 pt-6">
                <p className="text-xs text-center text-gray-400">
                    <strong>Demo Mod:</strong> Email'de "admin", "koray" veya "org" geçerse → Organization paneli<br/>
                    Diğer emailler → User paneli
                </p>
            </div> */}

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;