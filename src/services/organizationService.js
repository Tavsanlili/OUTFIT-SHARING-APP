import API from './api';

const organizationService = {
  // Organization Oluştur
  createOrganization: async (data) => {
    try {
      const response = await API.post('/organizations/create-organization', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tüm Organization'ları Getir
  getAllOrganizations: async () => {
    try {
      const response = await API.get('/organizations/get-all-organizations');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default organizationService;