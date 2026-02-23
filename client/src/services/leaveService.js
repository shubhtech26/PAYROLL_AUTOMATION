import api from './api';

export const getLeaves = async (params = {}) => {
  const { data } = await api.get('/leaves', { params });
  return data;
};

export const createLeave = async (payload) => {
  const { data } = await api.post('/leaves', payload);
  return data;
};

export const getPendingLeaves = async () => {
  const { data } = await api.get('/leaves/pending');
  return data;
};

export const approveLeave = async (id) => {
  const { data } = await api.put(`/leaves/${id}/approve`);
  return data;
};

export const rejectLeave = async (id, rejectionReason) => {
  const { data } = await api.put(`/leaves/${id}/reject`, { rejectionReason });
  return data;
};
