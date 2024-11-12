import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import PlayerStash from './components/PlayerStash';
import './App.css';

const cardTypes = [
  { type: 'normal', name: 'Normal', rarity: 5 },
  { type: 'attack', name: 'Attack', directions: ['↖', '↑', '↗', '←', '→', '↙', '↓', '↘'], rarity: 3 },
  { type: 'lightning', name: 'Lightning', directions: ['↑', '↓', '←', '→'], rarity: 2 },
  { type: 'blam', name: 'BLAM!', rarity: 1 },
];

const weightedCardTypes = cardTypes.flatMap(card => Array(card.rarity).fill(card));

function App() {
  const [difficulty, setDifficulty] = useState('Easy');
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState("X");
  const [playerXCards, setPlayerXCards] = useState([]);
  const [playerOCards, setPlayerOCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    drawCardsForPlayer("X");
    drawCardsForPlayer("O");
  }, []);

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const aiMove = () => {
    // AI logic based on difficulty
    if (difficulty === 'Easy') {
      // Easy difficulty logic
    } else if (difficulty === 'Medium') {
      // Medium difficulty logic
    } else if (difficulty === 'Hard') {
      // Hard difficulty logic
    }
    // Update game state after AI move
  };

  const drawRandomCard = (playerSymbol) => {
    const randomCard = weightedCardTypes[Math.floor(Math.random() * weightedCardTypes.length)];
    const randomDirection = randomCard.directions
      ? randomCard.directions[Math.floor(Math.random() * randomCard.directions.length)]
      : null;
    return { ...randomCard, direction: randomDirection, playerSymbol };
  };

  const drawCardsForPlayer = (playerSymbol) => {
    const newCards = Array(3).fill().map(() => drawRandomCard(playerSymbol));
    if (playerSymbol === "X") {
      setPlayerXCards(newCards);
    } else {
      setPlayerOCards(newCards);
    }
  };

  const checkGameStatus = (updatedBoard) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6], // diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (updatedBoard[a] && updatedBoard[a].playerSymbol === updatedBoard[b]?.playerSymbol && updatedBoard[a].playerSymbol === updatedBoard[c]?.playerSymbol) {
        setWinner(updatedBoard[a].playerSymbol);
        return updatedBoard[a].playerSymbol;
      }
    }

    if (updatedBoard.every(cell => cell !== null)) {
      setWinner("Tie");
      return "Tie";
    }

    return null;
  };

  const handleCardSelect = (card) => {
    if (card.playerSymbol === player && !winner) {
      setSelectedCard(card);
    }
  };

  const replaceUsedCard = (cardIndex, playerSymbol) => {
    const newCard = drawRandomCard(playerSymbol);
    if (playerSymbol === "X") {
      const newStash = [...playerXCards];
      newStash[cardIndex] = newCard;
      setPlayerXCards(newStash);
    } else {
      const newStash = [...playerOCards];
      newStash[cardIndex] = newCard;
      setPlayerOCards(newStash);
    }
  };

  const handleCellClick = (index) => {
    if (!board[index] && selectedCard && !winner) {
      const updatedBoard = [...board];
      updatedBoard[index] = { ...selectedCard };
      setBoard(updatedBoard);

      const currentPlayerStash = player === "X" ? playerXCards : playerOCards;
      replaceUsedCard(currentPlayerStash.indexOf(selectedCard), player);

      // Apply card abilities
      applyCardAbilities(index, updatedBoard);

      setSelectedCard(null);

      const gameResult = checkGameStatus(updatedBoard);

      if (!gameResult) {
        setPlayer(player === "X" ? "O" : "X");
      }
    }
  };

  const applyCardAbilities = (index, updatedBoard) => {
    const card = updatedBoard[index];
    if (card.type === 'attack') {
      attackOpponent(card, updatedBoard, index, player);
    } else if (card.type === 'lightning') {
      lightningBolt(card, updatedBoard, index);
    } else if (card.type === 'blam') {
      blam(card, updatedBoard);
    }
  };

  const attackOpponent = (card, updatedBoard, index, player) => {
    const directions = {
      '↖': [-1, -1], '↑': [-1, 0], '↗': [-1, 1],
      '←': [0, -1], '→': [0, 1], '↙': [1, -1],
      '↓': [1, 0], '↘': [1, 1]
    };
  
    const [rowChange, colChange] = directions[card.direction] || [0, 0];
    const opponentSymbol = player === 'X' ? 'O' : 'X';
  
    let row = Math.floor(index / 3);
    let col = index % 3;
  
    // Loop to find and destroy the next opponent's card in the given direction
    while (true) {
      row += rowChange;
      col += colChange;
  
      // Check if the new position is out of bounds
      if (row < 0 || row > 2 || col < 0 || col > 2) break;
  
      const newIndex = row * 3 + col;
  
      // Stop if the position is empty or not an opponent's card
      if (!updatedBoard[newIndex]) break;
      if (updatedBoard[newIndex]?.playerSymbol !== opponentSymbol) break;
  
      // Destroy the opponent's card (only the first one encountered in that direction)
      updatedBoard[newIndex] = null;
      break;
    }
  };
  

  const lightningBolt = (card, updatedBoard, index) => {
    const directions = {
      '↑': [-1, 0], '↓': [1, 0], '←': [0, -1], '→': [0, 1]
    };

    const [rowChange, colChange] = directions[card.direction] || [0, 0];
    const opponentSymbol = player === 'X' ? 'O' : 'X';

    let row = Math.floor(index / 3);
    let col = index % 3;

    if (rowChange !== 0) {
      // Vertical direction
      let i = row;
      while (i >= 0 && i < 3) {
        const nextIndex = i * 3 + col;
        if (updatedBoard[nextIndex]?.playerSymbol === opponentSymbol) {
          updatedBoard[nextIndex] = null;  // Destroy opponent's card
        }
        i += rowChange;
      }
    } else if (colChange !== 0) {
      // Horizontal direction
      let i = col;
      while (i >= 0 && i < 3) {
        const nextIndex = row * 3 + i;
        if (updatedBoard[nextIndex]?.playerSymbol === opponentSymbol) {
          updatedBoard[nextIndex] = null;  // Destroy opponent's card
        }
        i += colChange;
      }
    }
  };

  const blam = (card, updatedBoard) => {
    const opponentSymbol = player === 'X' ? 'O' : 'X';
    updatedBoard.forEach((cell, index) => {
      if (cell?.playerSymbol === opponentSymbol) {
        updatedBoard[index] = null;  // Destroy all opponent's cards
      }
    });
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setPlayer("X");
    setPlayerXCards([]);
    setPlayerOCards([]);
    drawCardsForPlayer("X");
    drawCardsForPlayer("O");
    setSelectedCard(null);
    setWinner(null);
  };

  return (
    <div className="App">
      <PlayerStash
        player="X"
        cards={playerXCards}
        onCardSelect={handleCardSelect}
        selectedCard={selectedCard}
        activePlayer={player === "X"}
      />
      <Board board={board} onCellClick={handleCellClick} />
      <PlayerStash
        player="O"
        cards={playerOCards}
        onCardSelect={handleCardSelect}
        selectedCard={selectedCard}
        activePlayer={player === "O"}
      />
      {winner && (
        <div>
          <p>{winner === "Tie" ? "It's a tie!" : `${winner} wins the game!`}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;