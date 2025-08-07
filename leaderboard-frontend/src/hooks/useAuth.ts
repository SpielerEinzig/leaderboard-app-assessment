import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { User } from "../types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();

      setIsAuthenticated(authenticated);
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (result.success) {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    return result;
  };

  const signUp = async (userData: {
    email: string;
    username: string;
    password: string;
    name: string;
  }) => {
    const result = await authService.signUp(userData);
    if (result.success) {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser: User) => {
    authService.updateUser(updatedUser);
    setUser(updatedUser);
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    signUp,
    logout,
    updateUser,
  };
};
