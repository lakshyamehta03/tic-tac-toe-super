import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ onDifficultyChange }) => {
  const [difficulty, setDifficulty] = useState('Easy');
  const navigate = useNavigate();

  const handlePlayButtonClick = () => {
    onDifficultyChange(difficulty);  // Pass the selected difficulty to App.js
    navigate('/game');
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  return (
    <div className="home-page">
      <h1>Welcome to Tic-Tac-Toe</h1>
      
      {/* Difficulty dropdown */}
      <div>
        <label htmlFor="difficulty">Select AI Difficulty: </label>
        <select id="difficulty" value={difficulty} onChange={handleDifficultyChange}>
          <option value="Easy">Easy</option>
          <option value="Moderate">Moderate</option>
          <option value="Expert">Expert</option>
        </select>
      </div>

      {/* Play button */}
      <button onClick={handlePlayButtonClick}>Play</button>
    </div>
  );
};

export default HomePage;