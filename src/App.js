import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GamePage from './GamePage';
import HomePage from './HomePage';
import { getAIMove } from './ai';

const cardTypes = [
  { type: 'normal', name: 'Normal', rarity: 5 },
  { type: 'attack', name: 'Attack', directions: ['↖', '↑', '↗', '←', '→', '↙', '↓', '↘'], rarity: 3 },
  { type: 'lightning', name: 'Thunder', directions: ['↑', '↓', '←', '→'], rarity: 2 },
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

  const handleDifficultyChange = (difficultyLevel) => {
    setDifficulty(difficultyLevel);
  };

  const aiMove = () => {
    setTimeout(() => {
      const { move, cardIndex } = getAIMove(board, playerOCards, "O", difficulty);

      const updatedBoard = [...board];

      const selectedCard = playerOCards[cardIndex];

      updatedBoard[move] = { ...selectedCard, playerSymbol: "O" };

      setBoard(updatedBoard);

      replaceUsedCard(cardIndex, "O");

      applyCardAbilities(move, updatedBoard);

      const gameResult = checkGameStatus(updatedBoard);

      if (!gameResult) {
          setPlayer(player === "X" ? "O" : "X");
      }
    }, 1000)
  };

  useEffect(() => {
    if (player === "O" && !winner) {
      aiMove();
    }
  }, [player, winner]);

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
  
    while (true) {
      row += rowChange;
      col += colChange;
  
      if (row < 0 || row > 2 || col < 0 || col > 2) break;
  
      const newIndex = row * 3 + col;
  
      if (!updatedBoard[newIndex]) break;
      if (updatedBoard[newIndex]?.playerSymbol !== opponentSymbol) break;
  
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
          updatedBoard[nextIndex] = null;
        }
        i += rowChange;
      }
    } else if (colChange !== 0) {
      // Horizontal direction
      let i = col;
      while (i >= 0 && i < 3) {
        const nextIndex = row * 3 + i;
        if (updatedBoard[nextIndex]?.playerSymbol === opponentSymbol) {
          updatedBoard[nextIndex] = null;
        }
        i += colChange;
      }
    }
  };

  const blam = (card, updatedBoard) => {
    const opponentSymbol = player === 'X' ? 'O' : 'X';
    updatedBoard.forEach((cell, index) => {
      if (cell?.playerSymbol === opponentSymbol) {
        updatedBoard[index] = null;
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
    <Router>
      <Routes>
        <Route
          path="/"
          element={<HomePage onDifficultyChange={handleDifficultyChange} />}
        />
        <Route
          path="/game"
          element={
            <GamePage
              board={board}
              player={player}
              playerXCards={playerXCards}
              playerOCards={playerOCards}
              selectedCard={selectedCard}
              onCardSelect={handleCardSelect}
              onCellClick={handleCellClick}
              resetGame={resetGame}
              winner={winner}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;