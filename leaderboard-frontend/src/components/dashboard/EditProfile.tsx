import React, { useState, useEffect } from 'react';
import { Button, Input } from '../common';
import { apiService } from '../../services/api';
import { UserProfile } from '../../types';
import './EditProfile.css';

interface EditProfileProps {
  user: UserProfile | null;
  onProfileUpdated?: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    preferred_username: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.attributes.name || '',
        preferred_username: user.attributes.preferred_username || '',
      });
    }
  }, [user]);

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
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.preferred_username.trim()) {
      setError('Username is required');
      return false;
    }
    if (formData.preferred_username.length < 3) {
      setError('Username must be at least 3 characters');
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
      const response = await apiService.updateProfile({
        name: formData.name.trim(),
        preferred_username: formData.preferred_username.trim(),
      });
      
      if (response.success) {
        setSuccess('Profile updated successfully!');
        onProfileUpdated?.();
      } else {
        setError(response.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="edit-profile">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="edit-profile">
      <h3>Edit Profile</h3>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <Input
          type="text"
          label="Name"
          value={formData.name}
          onChange={(value) => handleInputChange('name', value)}
          placeholder="Enter your full name"
          required
        />
        
        <Input
          type="text"
          label="Username"
          value={formData.preferred_username}
          onChange={(value) => handleInputChange('preferred_username', value)}
          placeholder="Enter your preferred username"
          required
        />
        
        <div className="readonly-field">
          <label className="input-label">Email</label>
          <input
            type="email"
            value={user.attributes.email}
            disabled
            className="input-field"
          />
          <small>Email cannot be changed</small>
        </div>
        
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="update-profile-btn"
        >
          Update Profile
        </Button>
      </form>
    </div>
  );
};

export default EditProfile; 