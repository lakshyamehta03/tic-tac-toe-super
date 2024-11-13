import React from 'react';
import Board from './components/Board'; // Ensure Board component exists
import PlayerStash from './components/PlayerStash'; // Ensure PlayerStash component exists

const GamePage = ({
  board,
  player,
  playerXCards,
  playerOCards,
  selectedCard,
  onCardSelect,
  onCellClick,
  resetGame,
  winner, // Receive winner as a prop
}) => {
  return (
    <div className="game-page">
      <h1>Tic-Tac-Toe Game</h1>

      {/* Turn/Result Message */}
      <div className="status">
        {winner ? (
          <h2>{winner === "Tie" ? "It's a Tie!" : `Player ${winner} Wins!`}</h2>
        ) : (
          <h2>Current Turn: Player {player}</h2>
        )}
      </div>

      {/* Board Component */}
      <Board board={board} onCellClick={onCellClick} />

      {/* Player Stashes */}
      <PlayerStash
        player="X"
        cards={playerXCards}
        selectedCard={selectedCard}
        onCardSelect={onCardSelect}
        activePlayer={player === "X"}
      />
      <PlayerStash
        player="O"
        cards={playerOCards}
        selectedCard={selectedCard}
        onCardSelect={onCardSelect}
        activePlayer={player === "O"}
      />

      {/* Reset Button */}
      <button onClick={resetGame}>Reset Game</button>
    </div>
  );
};

export default GamePage;