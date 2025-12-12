import API from './api';

const itemService = {
  // Outfit Ekle
  addItem: async (data) => {
    try {
      console.log('📤 Sending to API:', data);
      console.log('📤 API Base URL:', API.defaults.baseURL);
      console.log('📤 Full URL:', API.defaults.baseURL + '/items/add-item');
      
      const response = await API.post('/items/add-item', data);
      
      console.log('✅ API Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ addItem error:', error);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      throw error;
    }
  },

  // Outfit'e Fotoğraf Ekle - DEBUG VERSİYON
  addItemPhoto: async (itemId, formData) => {
    try {
      console.log("📤 Fotoğraf yükleme başlıyor...");
      console.log("📤 itemId:", itemId);
      console.log("📤 Endpoint: /items/add-item-photo");
      
      // FormData içeriğini göster
      console.log("📦 FormData içeriği:");
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? 
          `File: ${value.name}, ${value.size} bytes, ${value.type}` : value);
      }

      const response = await API.post('/items/add-item-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("✅ Fotoğraf yükleme başarılı:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Fotoğraf yükleme hatası:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      throw error;
    }
  },

  // Outfit'leri Getir
  getItems: async (params = {}) => {
    try {
      const response = await API.get('/items/get-items', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tek Outfit Getir
  getItem: async (itemId) => {
    try {
      const response = await API.get(`/items/get-item/${itemId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Outfit Sil
  deleteItem: async (itemId) => {
    try {
      const response = await API.delete(`/items/delete-item/${itemId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Outfit Güncelle
  updateItem: async (itemId, data) => {
    try {
      const response = await API.put(`/items/update-item/${itemId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Outfit Fotoğrafı Sil
  deleteItemPhoto: async (itemId, photoId) => {
    try {
      const response = await API.delete(`/items/delete-item-photo/${itemId}/${photoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default itemService;