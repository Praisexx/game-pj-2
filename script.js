const game = document.getElementById('game');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart');
const modeButton = document.getElementById('mode');
let currentPlayer = 'X';
let gameState = Array(9).fill(null);
let currentMode = 'human'; 

const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const handleCellClick = (event) => {
    const index = event.target.dataset.index;
    if (!gameState[index]) {
        gameState[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        if (checkWin()) {
            alert(`${currentPlayer} wins!`);
            resetGame();
        } else if (gameState.every(cell => cell)) {
            alert('It\'s a draw!');
            resetGame();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if(currentMode === 'computer' && currentPlayer === 'O') {
                computerMove();
            }
        }
    }
};

const computerMove = () => {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < gameState.length; i++) {
        if (!gameState[i]) {
            gameState[i] = 'O';
            let score = minimax(gameState, 0, false, -Infinity, Infinity);
            gameState[i] = null;
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    gameState[bestMove] = 'O';
    cells[bestMove].textContent = 'O';
    if (checkWin()) {
        alert('Computer wins!');
        resetGame();
    } else if (gameState.every(cell => cell)) {
        alert('It\'s a draw!');
        resetGame();
    } else {
        currentPlayer = 'X';
    }
};

const checkWin = () => {
    return winPatterns.some(pattern => {
        return pattern.every(index => gameState[index] === currentPlayer);
    });
};

const resetGame = () => {
    gameState.fill(null);
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
};

const switchMode = () => {
    currentMode = currentMode === 'human' ? 'computer' : 'human';
    resetGame();
    alert(`Switched to ${currentMode} mode!`);
};

const minimax = (newGameState, depth, isMaximizing, alpha, beta) => {
    let scores = { 'X': -10, 'O': 10, 'draw': 0 };
    let result = evaluateBoard(newGameState);
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < newGameState.length; i++) {
            if (newGameState[i] === null) {
                newGameState[i] = 'O';
                let eval = minimax(newGameState, depth + 1, false, alpha, beta);
                newGameState[i] = null;
                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < newGameState.length; i++) {
            if (newGameState[i] === null) {
                newGameState[i] = 'X';
                let eval = minimax(newGameState, depth + 1, true, alpha, beta);
                newGameState[i] = null;
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return minEval;
    }
};

const evaluateBoard = (board) => {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    if (board.every(cell => cell !== null)) {
        return 'draw';
    }
    return null;
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', resetGame);
modeButton.addEventListener('click', switchMode)