import axios from 'axios';
import useAuthStore from '../store/authStore';

// 1. Temel Ayarlar
const axiosInstance = axios.create({
  baseURL: 'https://api.example.com', // Burası gerçek backend URL'i olacak (şimdilik örnek)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor (İstek Atılmadan Önce)
// Her isteğin içine otomatik token ekler.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor (Cevap Geldikten Sonra)
// Eğer 401 hatası gelirse (Token süresi dolmuş), refresh token ile yenilemeye çalışır.
axiosInstance.interceptors.response.use(
  (response) => response, // Başarılıysa aynen devam et
  async (error) => {
    const originalRequest = error.config;

    // Eğer hata 401 ise ve daha önce denenmediyse (_retry)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        
        // Refresh token yoksa kullanıcıyı at
        if (!refreshToken) {
          useAuthStore.getState().logout();
          throw new Error('Refresh token yok');
        }

        // Yeni token isteği (Backend endpointine göre değişebilir)
        const response = await axios.post('https://api.example.com/auth/refresh', {
          refreshToken: refreshToken,
        });

        const { accessToken } = response.data;

        // Yeni token'ı kaydet
        useAuthStore.getState().login(accessToken, refreshToken);

        // Başarısız olan isteği yeni token ile tekrarla
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Yenileme başarısızsa çıkış yap
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;