import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const AUTH_TOKEN_KEY = 'fresh_nest_auth_token_v1';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY) || null;
    } catch (e) {
      return null;
    }
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify token on initial load
  useEffect(() => {
    const verifySavedToken = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
          } else {
            logout();
          }
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Could not verify token with backend:', err);
      } finally {
        setLoading(false);
      }
    };

    verifySavedToken();
  }, [token]);

  const login = async (username, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      setToken(data.token);
      setUser(data.user);
      try {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      } catch (e) {}

      return { success: true, user: data.user, message: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (e) {}
  };

  const isOwner = user?.role === 'owner';
  const isStaff = user?.role === 'staff';
  const isAuthenticated = !!user;

  // Helper fetch with Authorization Bearer header
  const authFetch = async (url, options = {}) => {
    const headers = {
      ...(options.headers || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers
    });
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      loading,
      isAuthenticated,
      isOwner,
      isStaff,
      role: user?.role || 'customer',
      ownerName: 'Buddhadev Bera',
      login,
      logout,
      authFetch
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
