import { useEffect, useState } from 'react';
import { getAttendance, getTodayAttendance } from '../services/attendanceService';

export const useAttendance = () => {
  const [today, setToday] = useState({ summary: { present: 0, absent: 0, leave: 0 }, data: [] });
  const [history, setHistory] = useState({ data: [] });
  const [loading, setLoading] = useState(true);

  const refreshToday = async () => {
    try {
      const response = await getTodayAttendance();
      setToday(response);
    } catch {
      setToday({ summary: { present: 0, absent: 0, leave: 0 }, data: [] });
    }
  };

  const loadHistory = async (params = {}) => {
    try {
      const response = await getAttendance(params);
      setHistory(response);
    } catch {
      setHistory({ data: [] });
    }
  };

  useEffect(() => {
    Promise.allSettled([refreshToday(), loadHistory()]).finally(() => setLoading(false));
  }, []);

  return { today, history, loading, refreshToday, loadHistory };
};
