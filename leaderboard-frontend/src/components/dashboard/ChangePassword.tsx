import React, { useState } from 'react';
import { Button, Input } from '../common';
import { apiService } from '../../services/api';
import './ChangePassword.css';

interface ChangePasswordProps {
  onPasswordChanged?: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onPasswordChanged }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) {
      setError(null);
    }
    if (success) {
      setSuccess(null);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.oldPassword.trim()) {
      setError('Current password is required');
      return false;
    }
    if (!formData.newPassword.trim()) {
      setError('New password is required');
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }
    if (formData.oldPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      
      if (response.success) {
        setSuccess('Password changed successfully!');
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        onPasswordChanged?.();
      } else {
        setError(response.error || 'Failed to change password');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password">
      <h3>Change Password</h3>
      <form onSubmit={handleSubmit} className="change-password-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <Input
          type="password"
          label="Current Password"
          value={formData.oldPassword}
          onChange={(value) => handleInputChange('oldPassword', value)}
          placeholder="Enter your current password"
          required
        />
        
        <Input
          type="password"
          label="New Password"
          value={formData.newPassword}
          onChange={(value) => handleInputChange('newPassword', value)}
          placeholder="Enter your new password"
          required
        />
        
        <Input
          type="password"
          label="Confirm New Password"
          value={formData.confirmPassword}
          onChange={(value) => handleInputChange('confirmPassword', value)}
          placeholder="Confirm your new password"
          required
        />
        
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="change-password-btn"
        >
          Change Password
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword; 