import React, { useState } from 'react';
import { Button, Input } from '../../components/common';
import { authService } from '../../services/authService';
import './AuthScreen.css';

interface ForgotPasswordScreenProps {
  onSwitchToLogin: () => void;
  onForgotPasswordSuccess: (email: string) => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onSwitchToLogin,
  onForgotPasswordSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    try {
      const result = await authService.forgotPassword(email);
      if (result.success) {
        setSuccess(true);
        onForgotPasswordSuccess(email);
      } else {
        setError(result.error || 'Failed to send reset code');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setResendLoading(true);
    try {
      const result = await authService.forgotPassword(email);
      if (result.success) {
        // Show success message for resend
        setError(null);
      } else {
        setError(result.error || 'Failed to resend reset code');
      }
    } catch (err) {
      setError('An unexpected error occurred while resending');
    } finally {
      setResendLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!code) {
      setError('Reset code is required');
      return;
    }
    if (!newPassword) {
      setError('New password is required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setResetLoading(true);
    try {
      const result = await authService.resetPassword(email, code, newPassword);
      if (result.success) {
        setResetSuccess(true);
      } else {
        setError(result.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('An unexpected error occurred while resetting password');
    } finally {
      setResetLoading(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Password Reset Successful</h2>
          <div className="success-message">
            <p>Your password has been reset successfully!</p>
            <p>You can now sign in with your new password.</p>
          </div>
          <Button 
            type="button" 
            onClick={onSwitchToLogin} 
            className="auth-submit-btn"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password</h2>
        <p className="auth-subtitle">Enter your email to receive a reset code</p>
        {success ? (
          <div>
            <div className="success-message">
              <p>Password reset code sent successfully to <b>{email}</b></p>
              <p>Please check your email for the reset code.</p>
              <div className="resend-section">
                <p>Didn't receive the code?</p>
                <Button 
                  type="button" 
                  onClick={handleResendCode} 
                  loading={resendLoading}
                  disabled={resendLoading}
                  className="resend-btn"
                >
                  Resend Code
                </Button>
              </div>
            </div>
            <form onSubmit={handleResetPassword} className="auth-form">
              {error && <div className="error-message">{error}</div>}
              <Input
                type="text"
                label="Reset Code"
                value={code}
                onChange={setCode}
                required
                placeholder="Enter the reset code from your email"
              />
              <Input
                type="password"
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
                required
                placeholder="Enter your new password"
              />
              <Input
                type="password"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                required
                placeholder="Confirm your new password"
              />
              <Button 
                type="submit" 
                loading={resetLoading} 
                className="auth-submit-btn" 
                disabled={resetLoading}
              >
                Reset Password
              </Button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={setEmail}
              required
              placeholder="Enter your email"
            />
            <Button type="submit" loading={loading} className="auth-submit-btn" disabled={loading}>
              Send Reset Code
            </Button>
          </form>
        )}
        <div className="auth-divider">
          <span>or</span>
        </div>
        <div className="auth-switch">
          <span>Remembered your password? </span>
          <button type="button" onClick={onSwitchToLogin} className="auth-link">
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;