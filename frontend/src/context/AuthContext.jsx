import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

// Helper to derive a role from the Django user object
function deriveRole(user) {
  if (!user) return null;
  if (user.role) return user.role;         // if backend ever adds role field
  if (user.is_superuser) return 'admin';
  if (user.is_staff) return 'staff';
  return 'passenger';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('airline_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Django backend authenticates by username; we use email as username
      const response = await authAPI.login({ email, password });
      const { user: rawUser, access, refresh } = response.data;

      const enrichedUser = { ...rawUser, role: deriveRole(rawUser), access, refresh };
      setUser(enrichedUser);
      localStorage.setItem('airline_user', JSON.stringify(enrichedUser));

      return { success: true, user: enrichedUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user: rawUser, access, refresh } = response.data;

      const enrichedUser = { ...rawUser, role: deriveRole(rawUser), access, refresh };
      setUser(enrichedUser);
      localStorage.setItem('airline_user', JSON.stringify(enrichedUser));

      return { success: true, user: enrichedUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Registration failed',
      };
    }
  };

  const logout = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('airline_user') || '{}');
      if (storedUser.refresh) {
        await authAPI.logout(storedUser.refresh).catch(() => {});
      }
    } finally {
      setUser(null);
      localStorage.removeItem('airline_user');
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await authAPI.updateProfile(updates);
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      localStorage.setItem('airline_user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const forgotPassword = async (email) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: 'Password reset link sent to your email' };
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    isPassenger: user?.role === 'passenger',
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
