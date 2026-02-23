import { useEffect, useState } from 'react';
import { getLeaves, getPendingLeaves } from '../services/leaveService';

export const useLeave = () => {
  const [leaves, setLeaves] = useState({ data: [] });
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshLeaves = async () => {
    try {
      const response = await getLeaves();
      setLeaves(response);
    } catch {
      setLeaves({ data: [] });
    }
  };

  const refreshPending = async () => {
    try {
      const response = await getPendingLeaves();
      setPending(response);
    } catch {
      setPending([]);
    }
  };

  useEffect(() => {
    Promise.allSettled([refreshLeaves(), refreshPending()]).finally(() => setLoading(false));
  }, []);

  return { leaves, pending, loading, refreshLeaves, refreshPending };
};
