import React, { useState } from 'react';
import { Button, Input } from '../common';
import { apiService } from '../../services/api';
import { ScoreResponse } from '../../types';
import './ScoreSubmission.css';

interface ScoreSubmissionProps {
  onScoreSubmitted?: (score: ScoreResponse) => void;
}

const ScoreSubmission: React.FC<ScoreSubmissionProps> = ({ onScoreSubmitted }) => {
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const scoreNumber = parseInt(score, 10);
    if (isNaN(scoreNumber) || scoreNumber < 0) {
      setError('Please enter a valid positive number');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.submitScore({ score: scoreNumber });
      
      if (response.success && response.data) {
        setSuccess(`Score ${scoreNumber} submitted successfully!`);
        setScore('');
        onScoreSubmitted?.(response.data);
      } else {
        setError(response.error || 'Failed to submit score');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="score-submission">
      <h3>Submit Score</h3>
      <form onSubmit={handleSubmit} className="score-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <Input
          type="number"
          label="Score"
          value={score}
          onChange={setScore}
          placeholder="Enter your score"
          required
          min="0"
        />
        
        <Button
          type="submit"
          loading={loading}
          disabled={loading || !score.trim()}
          className="submit-score-btn"
        >
          Submit Score
        </Button>
      </form>
    </div>
  );
};

export default ScoreSubmission; 