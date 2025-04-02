// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

// Create the context
const AuthContext = createContext();

// AuthProvider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (token && storedRole) {
      setUser({ role: storedRole });
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Login request:', { email, password });
      const response = await api.post('/auth/signin', { email, password });
      console.log('Login response:', response.data);
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ role });
      setLoading(false);
      return role;
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      throw err;
    }
  };

  const signup = async (name, email, password) => {
    try {
      console.log('Signup request:', { name, email, password });
      const response = await api.post('/auth/signup', { name, email, password });
      console.log('Signup response:', response.data);
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ role });
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Signup error:', err.response ? JSON.stringify(err.response.data) : err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setLoading(false);
  };

  const isAuthenticated = !!user;
  const role = user ? user.role : null;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, isAuthenticated, role }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth hook (named export)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};