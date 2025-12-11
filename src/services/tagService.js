import API from './api';

const tagService = {
  // Tag Oluştur
  createTag: async (data) => {
    try {
      const response = await API.post('/tags/create-tag', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tag'leri Getir
  getTags: async () => {
    try {
      const response = await API.get('/tags/get-tags');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tag Güncelle
  updateTag: async (tagId, data) => {
    try {
      const response = await API.put(`/tags/update-tag/${tagId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tag Sil
  deleteTag: async (tagId) => {
    try {
      const response = await API.delete(`/tags/delete-tag/${tagId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default tagService;