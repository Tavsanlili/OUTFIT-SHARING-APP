import API from './api';

const itemService = {
  // Outfit Ekle
  addItem: async (data) => {
    try {
      const response = await API.post('/items/add-item', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Outfit'e Fotoğraf Ekle
  addItemPhoto: async (itemId, photoData) => {
    try {
      const response = await API.post('/items/add-item-photo', {
        itemId,
        ...photoData
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Outfit'leri Getir (filtreleme, sıralama, sayfalama)
  getItems: async (params = {}) => {
    try {
      // Örnek params: { sort: 'a-z', page: 1, limit: 20, search: 'casual' }
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
  }
};

export default itemService;