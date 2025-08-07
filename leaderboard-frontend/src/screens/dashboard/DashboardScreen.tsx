import React, { useState, useEffect } from 'react';
import { Button } from '../../components/common';
import ScoreSubmission from '../../components/dashboard/ScoreSubmission';
import EditProfile from '../../components/dashboard/EditProfile';
import ChangePassword from '../../components/dashboard/ChangePassword';
import { authService } from '../../services/authService';
import { apiService } from '../../services/api';
import { UserProfile, ScoreResponse } from '../../types';
import './DashboardScreen.css';

interface DashboardScreenProps {
  onLogout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onLogout }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topScore, setTopScore] = useState<ScoreResponse | null>(null);
  const [recentScore, setRecentScore] = useState<ScoreResponse | null>(null);

  useEffect(() => {
    loadUserProfile();
    loadTopScore();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await apiService.getUserProfile();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setError(response.error || 'Failed to load profile');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadTopScore = async () => {
    try {
      const response = await apiService.getTopScore();
      if (response.success && response.data) {
        setTopScore(response.data);
      }
    } catch (error) {
      console.error('Failed to load top score:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  const handleScoreSubmitted = (score: ScoreResponse) => {
    setRecentScore(score);
    // Refresh top score after submitting a new score
    loadTopScore();
  };

  const handleProfileUpdated = () => {
    // Refresh user profile after update
    loadUserProfile();
  };

  const handlePasswordChanged = () => {
    // Could show a notification or refresh something if needed
    console.log('Password changed successfully');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{error}</div>
        <Button onClick={loadUserProfile}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Leaderboard Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.attributes?.name || user?.attributes?.preferred_username || 'User'}!</span>
            <Button variant="outline" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Profile Information</h3>
            <div className="profile-info">
              <p><strong>Username:</strong> {user?.attributes?.preferred_username || user?.username}</p>
              <p><strong>Email:</strong> {user?.attributes?.email}</p>
              <p><strong>Name:</strong> {user?.attributes?.name}</p>
              <p><strong>Email Verified:</strong> {user?.attributes?.email_verified === 'true' ? 'Yes' : 'No'}</p>
              <p><strong>User ID:</strong> {user?.attributes?.sub}</p>
            </div>
          </div>

          <div className="dashboard-card">
            <EditProfile user={user} onProfileUpdated={handleProfileUpdated} />
          </div>

          <div className="dashboard-card">
            <ChangePassword onPasswordChanged={handlePasswordChanged} />
          </div>

          <div className="dashboard-card">
            <ScoreSubmission onScoreSubmitted={handleScoreSubmitted} />
          </div>

          {topScore && (
            <div className="dashboard-card">
              <h3>Top Score</h3>
              <div className="top-score">
                <p><strong>Score:</strong> {topScore.score}</p>
                <p><strong>Player:</strong> {topScore.user_name}</p>
                <p><strong>Achieved:</strong> {new Date(topScore.timestamp).toLocaleString()}</p>
                <p><strong>Score ID:</strong> {topScore.id}</p>
              </div>
            </div>
          )}

          {recentScore && (
            <div className="dashboard-card">
              <h3>Your Recent Score</h3>
              <div className="recent-score">
                <p><strong>Score:</strong> {recentScore.score}</p>
                <p><strong>Submitted:</strong> {new Date(recentScore.timestamp).toLocaleString()}</p>
                <p><strong>Score ID:</strong> {recentScore.id}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardScreen; 