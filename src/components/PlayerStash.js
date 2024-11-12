import React from 'react';
import Card from './Card';
import './PlayerStash.css';

const PlayerStash = ({ player, cards, onCardPlay, onCardSelect, selectedCard, activePlayer }) => {
  return (
    <div className={`player-stash ${player}-stash`}>
      <h3>{player === 'X' ? "Player X's Cards" : "Player O's Cards"}</h3>
      <div className="card-container">
        {cards.map((card, index) => (
          <Card
            key={index}
            type={card.type}
            name={card.name}
            direction={card.direction}
            playerSymbol={card.playerSymbol}
            isSelected={selectedCard === card}
            onClick={() => activePlayer && onCardSelect(card)} // Only select if it’s the active player
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerStash;
