import api from '../api/axios';

export const tableService = {
  // Admin methods
  getTables: async (params) => {
    const response = await api.get('/tables', { params });
    return response.data;
  },
  
  createTable: async (data) => {
    const response = await api.post('/tables', data);
    return response.data;
  },
  
  updateTable: async (id, data) => {
    const response = await api.put(`/tables/${id}`, data);
    return response.data;
  },
  
  deleteTable: async (id) => {
    const response = await api.delete(`/tables/${id}`);
    return response.data;
  }
};
