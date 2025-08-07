import React, { useState } from 'react';
import { Button, Input } from '../../components/common';
import { authService } from '../../services/authService';
import './AuthScreen.css';

interface SignUpScreenProps {
  onSwitchToLogin: () => void;
  onSignUpSuccess: (email: string) => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSwitchToLogin,
  onSignUpSuccess,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
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

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await authService.signUp({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        name: formData.name,
      });
      
      if (result.success) {
        onSignUpSuccess(formData.email);
      } else {
        setErrors({ general: result.error || 'Sign up failed' });
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
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join our community today</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}

          <Input
            type="text"
            label="Name"
            value={formData.name}
            onChange={(value) => handleInputChange('name', value)}
            error={errors.name}
            required
            placeholder="Enter your name"
          />

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
            type="text"
            label="Username"
            value={formData.username}
            onChange={(value) => handleInputChange('username', value)}
            error={errors.username}
            required
            placeholder="Choose a username"
          />

          <Input
            type="password"
            label="Password"
            value={formData.password}
            onChange={(value) => handleInputChange('password', value)}
            error={errors.password}
            required
            placeholder="Create a password"
          />

          <Input
            type="password"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={(value) => handleInputChange('confirmPassword', value)}
            error={errors.confirmPassword}
            required
            placeholder="Confirm your password"
          />

          <Button
            type="submit"
            loading={loading}
            className="auth-submit-btn"
            disabled={loading}
          >
            Create Account
          </Button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="auth-switch">
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="auth-link"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen; 