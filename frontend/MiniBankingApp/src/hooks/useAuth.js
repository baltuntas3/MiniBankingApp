import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { userAtom, isAuthenticatedAtom, loadingAtom, errorAtom } from '../store/atoms';
import { handlePostRequest } from '../api/axiosConfig';
import { setCookie, getCookie, deleteCookie } from '../utils/cookieUtils';

export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [error, setError] = useAtom(errorAtom);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    
    const [data, err] = await handlePostRequest('/api/users/login', { username, password });
    
    if (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
      return false;
    }
    
    if (data) {
      // Store token if provided
      if (data.token) {
        setCookie('authToken', data.token, 7);
      }
      
      // Store refresh token if provided
      if (data.refreshToken) {
        setCookie('refreshToken', data.refreshToken, 30);
      }
      
      // Store user data
      if (data.user) {
        setUser(data.user);
        setCookie('user', JSON.stringify(data.user), 7);
      } else {
        // If no user object, create one from response data
        const userData = {
          id: data.id,
          username: data.username || username,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        };
        setUser(userData);
        setCookie('user', JSON.stringify(userData), 7);
      }
    }
    
    setLoading(false);
    return true;
  }, [setLoading, setError, setUser]);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    const [, err] = await handlePostRequest('/api/users/register', userData);
    
    if (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
      return false;
    }
    
    setLoading(false);
    return true;
  }, [setLoading, setError]);

  const logout = useCallback(async () => {
    setLoading(true);
    
    await handlePostRequest('/api/users/logout');
    
    setUser(null);
    setError(null);
    deleteCookie('user');
    deleteCookie('authToken');
    deleteCookie('refreshToken');
    setLoading(false);
  }, [setLoading, setUser, setError]);

  const checkAuthStatus = useCallback(async () => {
    const storedUser = getCookie('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        deleteCookie('user');
      }
    }
  }, [setUser]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    checkAuthStatus
  };
};