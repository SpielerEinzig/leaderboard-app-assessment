import React, { useState } from 'react';
import { Button, Input } from '../../components/common';
import { authService } from '../../services/authService';
import './AuthScreen.css';

interface LoginScreenProps {
  onSwitchToSignUp: () => void;
  onSwitchToForgotPassword: () => void;
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onSwitchToSignUp,
  onSwitchToForgotPassword,
  onLoginSuccess,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await authService.login(formData.email, formData.password);
      
      if (result.success) {
        onLoginSuccess();
      } else {
        setErrors({ general: result.error || 'Login failed' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}

          <Input
            type="email"
            label="Email"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            error={errors.email}
            required
            placeholder="Enter your email"
          />

          <Input
            type="password"
            label="Password"
            value={formData.password}
            onChange={(value) => handleInputChange('password', value)}
            error={errors.password}
            required
            placeholder="Enter your password"
          />

          <Button
            type="submit"
            loading={loading}
            className="auth-submit-btn"
            disabled={loading}
          >
            Sign In
          </Button>
        </form>

        <div className="auth-links">
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="auth-link"
          >
            Forgot your password?
          </button>
        </div>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="auth-switch">
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="auth-link"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen; 