import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handlePlayButtonClick = () => {
    navigate('/game');
  };

  return (
    <div className="home-page">
      <h1>Welcome to Tic-Tac-Toe</h1>
      <button onClick={handlePlayButtonClick}>Play</button>
    </div>
  );
};

export default HomePage;

