import { create } from 'zustand';

// Token içindeki bilgiyi okuyan yardımcı fonksiyon
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  role: null,
  isAuthenticated: !!localStorage.getItem('accessToken'),

  login: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    const decoded = parseJwt(accessToken);
    const role = decoded ? decoded.role : 'user';

    set({
      accessToken,
      refreshToken,
      role: role,
      isAuthenticated: true,
      user: decoded
    });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({
      user: null,
      role: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },
}));

// Sayfa yenilenince rolü hatırlamak için
try {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const decoded = parseJwt(token);
    useAuthStore.setState({ role: decoded?.role || 'user' });
  }
} catch (e) {
  console.error("Token hatası:", e);
}

// ⬇️ İŞTE SENİN KODUNUN ÇALIŞMASI İÇİN GEREKEN SATIR BU:
export default useAuthStore;