import React, { useState } from 'react';
import { Button, Input } from '../../components/common';
import { authService } from '../../services/authService';
import './AuthScreen.css';

interface ResetPasswordScreenProps {
  onSwitchToLogin: () => void;
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  onSwitchToLogin,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.code) newErrors.code = 'Reset code is required';
    if (!formData.newPassword) newErrors.newPassword = 'New password is required';
    if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const result = await authService.resetPassword(
        formData.email,
        formData.code,
        formData.newPassword
      );
      if (result.success) {
        setSuccess(true);
      } else {
        setErrors({ general: result.error || 'Failed to reset password' });
      }
    } catch (err) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">Enter your email, code, and new password</p>
        {success ? (
          <div className="success-message">
            Your password has been reset. You can now{' '}
            <button type="button" className="auth-link" onClick={onSwitchToLogin}>
              sign in
            </button>
            .
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {errors.general && <div className="error-message">{errors.general}</div>}
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
              label="Reset Code"
              value={formData.code}
              onChange={(value) => handleInputChange('code', value)}
              error={errors.code}
              required
              placeholder="Enter the code you received"
            />
            <Input
              type="password"
              label="New Password"
              value={formData.newPassword}
              onChange={(value) => handleInputChange('newPassword', value)}
              error={errors.newPassword}
              required
              placeholder="Enter your new password"
            />
            <Input
              type="password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={(value) => handleInputChange('confirmPassword', value)}
              error={errors.confirmPassword}
              required
              placeholder="Confirm your new password"
            />
            <Button type="submit" loading={loading} className="auth-submit-btn" disabled={loading}>
              Reset Password
            </Button>
          </form>
        )}
        <div className="auth-divider">
          <span>or</span>
        </div>
        <div className="auth-switch">
          <span>Back to </span>
          <button type="button" onClick={onSwitchToLogin} className="auth-link">
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;