import React, { useState, useEffect } from 'react';
import LoginScreen from './screens/auth/LoginScreen';
import SignUpScreen from './screens/auth/SignUpScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/auth/ResetPasswordScreen';
import ConfirmEmailScreen from './screens/auth/ConfirmEmailScreen';
import DashboardScreen from './screens/dashboard/DashboardScreen';
import { authService } from './services/authService';
import { apiService } from './services/api';
import './App.css';

type AuthScreen = 'login' | 'signup' | 'forgot' | 'reset' | 'confirm';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAuthScreen, setCurrentAuthScreen] = useState<AuthScreen>('login');
  const [loading, setLoading] = useState(true);
  const [signupEmail, setSignupEmail] = useState('');

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Set up token expiration callback
    const handleTokenExpired = () => {
      console.log('Token expired, logging out user');
      authService.logout();
      setIsAuthenticated(false);
      setCurrentAuthScreen('login');
    };

    apiService.setTokenExpiredCallback(handleTokenExpired);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleSignUpSuccess = (email: string) => {
    setSignupEmail(email);
    setCurrentAuthScreen('confirm');
  };

  const handleConfirmSuccess = () => {
    setCurrentAuthScreen('login');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentAuthScreen('login');
  };

  const switchToSignUp = () => {
    setCurrentAuthScreen('signup');
  };

  const switchToLogin = () => {
    setCurrentAuthScreen('login');
  };

  const switchToForgot = () => {
    setCurrentAuthScreen('forgot');
  };

  const switchToReset = () => {
    setCurrentAuthScreen('reset');
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="App">
        {currentAuthScreen === 'login' && (
          <LoginScreen
            onSwitchToSignUp={switchToSignUp}
            onSwitchToForgotPassword={switchToForgot}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        {currentAuthScreen === 'signup' && (
          <SignUpScreen
            onSwitchToLogin={switchToLogin}
            onSignUpSuccess={handleSignUpSuccess}
          />
        )}
        {currentAuthScreen === 'confirm' && (
          <ConfirmEmailScreen
            onSwitchToLogin={switchToLogin}
            onConfirmSuccess={handleConfirmSuccess}
            email={signupEmail}
          />
        )}
        {currentAuthScreen === 'forgot' && (
          <ForgotPasswordScreen
            onSwitchToLogin={switchToLogin}
            onForgotPasswordSuccess={() => switchToReset()}
          />
        )}
        {currentAuthScreen === 'reset' && (
          <ResetPasswordScreen
            onSwitchToLogin={switchToLogin}
          />
        )}
      </div>
    );
  }

  return (
    <div className="App">
      <DashboardScreen onLogout={handleLogout} />
    </div>
  );
};

export default App; 