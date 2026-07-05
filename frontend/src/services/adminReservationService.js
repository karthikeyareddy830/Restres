import api from '../api/axios';

export const adminReservationService = {
  getReservations: async (params) => {
    const response = await api.get('/admin/reservations', { params });
    return response.data;
  },
  
  getStatistics: async () => {
    const response = await api.get('/admin/reservations/stats');
    return response.data;
  },
  
  getReservationById: async (id) => {
    const response = await api.get(`/admin/reservations/${id}`);
    return response.data;
  },
  
  updateReservation: async (id, data) => {
    const response = await api.put(`/admin/reservations/${id}`, data);
    return response.data;
  },
  
  cancelReservation: async (id) => {
    const response = await api.delete(`/admin/reservations/${id}`);
    return response.data;
  }
};
