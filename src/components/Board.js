import React from 'react';
import './Board.css';

const Board = ({ board, onCellClick }) => {
  return (
    <div className="game-board">
      {board.map((cell, i) => (
        <div key={i} className="cell" onClick={() => onCellClick(i)}>
          {cell ? (
            <div className={`card ${cell.type}`}>
              <span className="player-symbol">{cell.playerSymbol}</span>
              <div className="card-info">
                {/* Render the card's name, type, and direction only if they exist */}
                {cell.name && <span>{cell.name}</span>}
                {cell.direction && <span>{cell.direction}</span>}
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default Board;