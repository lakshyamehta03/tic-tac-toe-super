const getAvailableMoves = (board) => {
    return board.reduce((moves, cell, index) => {
      if (!cell) {
        moves.push(index);
      }
      return moves;
    }, []);
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
  
  const blam = (card, updatedBoard, player) => {
    const opponentSymbol = player === 'X' ? 'O' : 'X';
    updatedBoard.forEach((cell, index) => {
      if (cell?.playerSymbol === opponentSymbol) {
        updatedBoard[index] = null;  // Destroy all opponent's cards
      }
    });
  };
  
  // AI Logic for Easy Difficulty
  const easyAI = (availableMoves, playerStash, player) => {
    const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    const cardIndex = Math.floor(Math.random() * playerStash.length);
    return { move, cardIndex };
  };
  
  // AI Logic for Medium Difficulty
  const mediumAI = (board, availableMoves, playerStash, playerSymbol) => {
    const opponentSymbol = playerSymbol === 'X' ? 'O' : 'X';
  
    // Check if opponent has a winning move and block it, otherwise pick a random card and move
    for (let move of availableMoves) {
      const tempBoard = [...board];
      tempBoard[move] = { playerSymbol: opponentSymbol };
      if (checkWinner(tempBoard) === opponentSymbol) {
        const cardIndex = Math.floor(Math.random() * playerStash.length);
        return { move, cardIndex };
      }
    }
  
    // If no blocking move, pick a random move and card
    return easyAI(availableMoves, playerStash, playerSymbol);
  };
  
  // AI Logic for Hard Difficulty (Minimax with Card Usage)
  const hardAI = (board, availableMoves, playerStash, playerSymbol) => {
    const opponentSymbol = playerSymbol === 'X' ? 'O' : 'X';
  
    // Minimax function to evaluate the board state and return the best move
    const minimax = (board, depth, isMaximizingPlayer) => {
      const winner = checkWinner(board);
      if (winner === playerSymbol) return 10 - depth;
      if (winner === opponentSymbol) return depth - 10;
      if (board.every(cell => cell)) return 0; // Tie
  
      if (isMaximizingPlayer) {
        let best = -Infinity;
        for (let move of getAvailableMoves(board)) {
          const tempBoard = [...board];
          tempBoard[move] = { playerSymbol: playerSymbol };
          const score = minimax(tempBoard, depth + 1, false);
          best = Math.max(best, score);
        }
        return best;
      } else {
        let best = Infinity;
        for (let move of getAvailableMoves(board)) {
          const tempBoard = [...board];
          tempBoard[move] = { playerSymbol: opponentSymbol };
          const score = minimax(tempBoard, depth + 1, true);
          best = Math.min(best, score);
        }
        return best;
      }
    };
  
    // Minimax algorithm to get the best move
    let bestMove = -1;
    let bestCardIndex = -1;
    let bestVal = -Infinity;
  
    for (let move of availableMoves) {
      for (let cardIndex = 0; cardIndex < playerStash.length; cardIndex++) {
        const tempBoard = [...board];
        tempBoard[move] = { playerSymbol: playerSymbol };
  
        const moveVal = minimax(tempBoard, 0, false);
        if (moveVal > bestVal) {
          bestMove = move;
          bestCardIndex = cardIndex;
          bestVal = moveVal;
        }
      }
    }
  
    return { move: bestMove, cardIndex: bestCardIndex };
  };
  
  // Function to check if a player has won
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
  
  // Function to apply the card abilities (Attack, Lightning, Blam)
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
  
  // Function to get the AI's move based on difficulty
  const getAIMove = (board, playerStash, playerSymbol, difficulty) => {
    const availableMoves = getAvailableMoves(board);
  
    let { move, cardIndex } = { move: -1, cardIndex: -1 };
  
    if (difficulty === 'Easy') {
      ({ move, cardIndex } = easyAI(availableMoves, playerStash, playerSymbol));
    } else if (difficulty === 'Moderate') {
      ({ move, cardIndex } = mediumAI(board, availableMoves, playerStash, playerSymbol));
    } else if (difficulty === 'Expert') {
      ({ move, cardIndex } = hardAI(board, availableMoves, playerStash, playerSymbol));
    }
  
    return { move, cardIndex };
  };
  
  export { applyCardAbilities, getAIMove };  