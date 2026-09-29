import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { User } from '../types/asset';

// Extend the User interface to match our backend structure if necessary
// But we'll try to map it to the frontend's User type
interface AuthContextType {
  token: string | null;
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  currentUser: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('qm_asset_control_center_user_v1');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (newToken: string, user: any) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    
    // Map backend user to frontend User format
    const mappedUser: User = {
      id: user.id.toString(),
      name: user.username || user.employee_id,
      email: user.email || '',
      role: user.role_id === 2 ? 'Level 2 Admin' : 'Level 1 Owner',
      department: 'QM',
    };

    localStorage.setItem('qm_asset_control_center_user_v1', JSON.stringify(mappedUser));
    setCurrentUser(mappedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('qm_asset_control_center_user_v1');
    setToken(null);
    setCurrentUser(null);
  };

  // If token is in localStorage but no user, we could potentially fetch user /api/auth/me
  // For now, we trust the localStorage

  return (
    <AuthContext.Provider value={{ token, currentUser, isAuthenticated: !!token && !!currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
