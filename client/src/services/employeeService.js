import api from './api';

export const getEmployees = async (params = {}) => {
  const { data } = await api.get('/employees', { params });
  return data;
};

export const getEmployeeStats = async (employeeId) => {
  const { data } = await api.get(`/employees/${employeeId}/stats`);
  return data;
};

export const createEmployee = async (payload) => {
  const { data } = await api.post('/employees', payload);
  return data;
};
