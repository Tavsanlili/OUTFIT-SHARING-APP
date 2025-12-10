import axios from 'axios';
import useAuthStore from '../store/authStore'; // Süslü parantez OLMADAN import ettik

// 1. Temel Ayarlar
const axiosInstance = axios.create({
  // Simülasyon sırasında hata almamak için localhost kullanıyoruz
  baseURL: 'http://localhost:3000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. İstek Gönderilmeden Önce (Request Interceptor)
axiosInstance.interceptors.request.use(
  (config) => {
    // Auth Store'dan token'ı alıyoruz
    // Eğer useAuthStore doğru import edilmezse burası hata verir
    const token = useAuthStore.getState().accessToken;
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Cevap Geldikten Sonra (Response Interceptor)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Eğer 401 (Yetkisiz) hatası geldiyse ve daha önce denemediyssek
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        
        if (!refreshToken) {
          useAuthStore.getState().logout();
          throw new Error('Refresh token yok');
        }

        // --- Simülasyon Notu ---
        // Gerçek backend olmadığı için burası hata verebilir ama yapı doğrudur.
        // Normalde burada refresh token ile yeni token istenir.
        const response = await axios.post('http://localhost:3000/api/auth/refresh', {
          refreshToken: refreshToken,
        });

        const { accessToken } = response.data;
        
        // Yeni token'ı kaydet
        useAuthStore.getState().login(accessToken, refreshToken);
        
        // İsteği yeni token ile tekrarla
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;