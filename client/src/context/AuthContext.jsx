import { createContext, useEffect, useMemo, useState } from 'react';
import { loginRequest, logoutRequest, meRequest } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    meRequest()
      .then((response) => setUser(response.user))
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const response = await loginRequest(credentials);
    localStorage.setItem('token', response.token);
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    await logoutRequest();
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, logout, isAuthenticated: Boolean(user) }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
