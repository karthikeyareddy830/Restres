import api from '../api/axios';

export const reservationService = {
  // Customer methods
  getMyReservations: async () => {
    const response = await api.get('/reservations/my');
    return response.data;
  },
  
  createReservation: async (data) => {
    const response = await api.post('/reservations', data);
    return response.data;
  },
  
  cancelReservation: async (id) => {
    const response = await api.delete(`/reservations/${id}`);
    return response.data;
  },
};
