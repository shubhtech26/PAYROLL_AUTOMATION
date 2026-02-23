import api from './api';

export const getDashboardStats = async () => {
  const { data } = await api.get('/reports/dashboard');
  return data;
};

export const getAttendanceReport = async (params = {}) => {
  const { data } = await api.get('/reports/attendance', { params });
  return data;
};

export const getLeaveReport = async (params = {}) => {
  const { data } = await api.get('/reports/leave', { params });
  return data;
};
