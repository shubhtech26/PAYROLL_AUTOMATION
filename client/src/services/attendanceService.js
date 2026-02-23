import api from './api';

export const getTodayAttendance = async () => {
  const { data } = await api.get('/attendance/today');
  return data;
};

export const getAttendance = async (params = {}) => {
  const { data } = await api.get('/attendance', { params });
  return data;
};

export const markAttendance = async (payload) => {
  const { data } = await api.post('/attendance', payload);
  return data;
};
