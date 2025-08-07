import React, { useState } from 'react';
import { Button, Input } from '../../components/common';
import { authService } from '../../services/authService';
import './AuthScreen.css';

interface ConfirmEmailScreenProps {
  onSwitchToLogin: () => void;
  onConfirmSuccess: () => void;
  email?: string;
}

const ConfirmEmailScreen: React.FC<ConfirmEmailScreenProps> = ({
  onSwitchToLogin,
  onConfirmSuccess,
  email: initialEmail = '',
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!confirmationCode) {
      setError('Confirmation code is required');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.confirmEmail(email, confirmationCode);
      if (result.success) {
        setSuccess(true);
        onConfirmSuccess();
      } else {
        setError(result.error || 'Email confirmation failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Email Confirmed!</h2>
          <div className="success-message">
            <p>Account confirmed successfully.</p>
            <p>You can now sign in with your email and password.</p>
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
        <h2 className="auth-title">Confirm Your Email</h2>
        <p className="auth-subtitle">Enter the confirmation code sent to your email</p>

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

          <Input
            type="text"
            label="Confirmation Code"
            value={confirmationCode}
            onChange={setConfirmationCode}
            required
            placeholder="Enter the confirmation code"
          />

          <Button
            type="submit"
            loading={loading}
            className="auth-submit-btn"
            disabled={loading}
          >
            Confirm Email
          </Button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="auth-switch">
          <span>Already confirmed? </span>
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

export default ConfirmEmailScreen; 