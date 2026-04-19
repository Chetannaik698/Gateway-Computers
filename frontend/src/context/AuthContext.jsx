import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../utils/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('authUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));

  useEffect(() => {
    if (token && !user) {
      api
        .get('/auth/me')
        .then((response) => {
          if (response.data?.success) {
            setUser(response.data.user);
          } else {
            throw new Error('Session expired');
          }
        })
        .catch(() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          setToken(null);
          setUser(null);
        });
    }
  }, [token, user]);

  const saveAuth = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authUser', JSON.stringify(newUser));
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Login failed');
    }
    saveAuth(response.data.token, response.data.user);
    return response.data.user;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Registration failed');
    }
    saveAuth(response.data.token, response.data.user);
    return response.data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user && token),
      isAdmin: Boolean(user?.role === 'admin' || user?.role === 'superadmin'),
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
