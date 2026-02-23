import { format } from 'date-fns';

export const formatDate = (value) => {
  if (!value) return '-';
  return format(new Date(value), 'yyyy-MM-dd');
};

export const formatDateTime = (value) => {
  if (!value) return '-';
  return format(new Date(value), 'yyyy-MM-dd HH:mm');
};
