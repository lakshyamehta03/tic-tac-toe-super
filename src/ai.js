    const getAvailableMoves = (board) => {
        return board.reduce((moves, cell, index) => {
        if (!cell) {
            moves.push(index);
        }
        return moves;
        }, []);
    };

    const cardTypes = [
        { type: 'normal', name: 'Normal', rarity: 5 },
        { type: 'attack', name: 'Attack', directions: ['↖', '↑', '↗', '←', '→', '↙', '↓', '↘'], rarity: 3 },
        { type: 'lightning', name: 'Thunder', directions: ['↑', '↓', '←', '→'], rarity: 2 },
        { type: 'blam', name: 'BLAM!', rarity: 1 },
      ];
      
      const weightedCardTypes = cardTypes.flatMap(card => Array(card.rarity).fill(card));     

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
  
  const lightningBolt = (card, updatedBoard, index, player) => {
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
  
  const blam = (card, updatedBoard, player) => {
    const opponentSymbol = player === 'X' ? 'O' : 'X';
    updatedBoard.forEach((cell, index) => {
      if (cell?.playerSymbol === opponentSymbol) {
        updatedBoard[index] = null;
      }
    });
  };

const easyAI = (availableMoves, playerStash, player) => {
  const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  const cardIndex = Math.floor(Math.random() * playerStash.length);
  return { move, cardIndex };
};

const difficultAI = (board, availableMoves, playerStash, playerSymbol) => {
  const opponentSymbol = playerSymbol === 'X' ? 'O' : 'X';

  for (let move of availableMoves) {
    const tempBoard = [...board];
    tempBoard[move] = { playerSymbol: opponentSymbol };
    if (checkWinner(tempBoard) === opponentSymbol) {
      const cardIndex = Math.floor(Math.random() * playerStash.length);
      return { move, cardIndex };
    }
  }

  return easyAI(availableMoves, playerStash, playerSymbol);
};
  
  const checkWinner = (board) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6], // diagonals
    ];
  
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a].playerSymbol === board[b]?.playerSymbol && board[a].playerSymbol === board[c]?.playerSymbol) {
        return board[a].playerSymbol;
      }
    }
  
    return null; // No winner yet
  };
  
  const applyCardAbilities = (index, updatedBoard, player) => {
    const card = updatedBoard[index];
    if (card.type === 'attack') {
      attackOpponent(card, updatedBoard, index, player);
    } else if (card.type === 'lightning') {
      lightningBolt(card, updatedBoard, index, player);
    } else if (card.type === 'blam') {
      blam(card, updatedBoard, player);
    }
  };
  
  const getAIMove = (board, playerStash, playerSymbol, difficulty) => {
    const availableMoves = getAvailableMoves(board);
  
    let { move, cardIndex } = { move: -1, cardIndex: -1 };
  
    if (difficulty === 'Easy') {
      ({ move, cardIndex } = easyAI(availableMoves, playerStash, playerSymbol));
    } else if (difficulty === 'Difficult') {
      ({ move, cardIndex } = difficultAI(board, availableMoves, playerStash, playerSymbol));
    }
    return { move, cardIndex };
  };
  
  export { applyCardAbilities, getAIMove };  