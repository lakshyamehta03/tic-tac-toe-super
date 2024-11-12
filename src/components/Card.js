import React from 'react';
import './Card.css';

const Card = ({ type, name, direction, playerSymbol, isSelected, onClick }) => {
  return (
    <div className={`card ${type} ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <span className="player-symbol">{playerSymbol}</span>
      <div className="card-info">
        <span>{name}</span>
        {direction && <span>{direction}</span>}
      </div>
    </div>
  );
};

export default Card;
