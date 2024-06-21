let counter = 0;

class TicTacToe {
  constructor() {
    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];

    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');

    this.gameState = GAME_STATE.PLAYING;
    this.ai = O;
    this.human = X;

    this.currentPlayer = X;

    this.drawBoard();

    this.aiMove();
    console.log(counter);

    this.canvas.addEventListener('click', this.makeMove.bind(this));
  }

  drawBoard = () => {
    this.context.beginPath();

    for (let i = 1; i <= 2; i++) {
      this.context.moveTo(STARTING_X + i * CELL_SIZE, STARTING_Y);
      this.context.lineTo(STARTING_X + i * CELL_SIZE, STARTING_Y + BOARD_SIZE);

      this.context.moveTo(STARTING_X, STARTING_Y + i * CELL_SIZE);
      this.context.lineTo(STARTING_X + BOARD_SIZE, STARTING_Y + i * CELL_SIZE);
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] === X) {
          this.context.moveTo(
            STARTING_X + j * CELL_SIZE + CELL_PADDING,
            STARTING_Y + i * CELL_SIZE + CELL_PADDING
          );
          this.context.lineTo(
            STARTING_X + (j + 1) * CELL_SIZE - CELL_PADDING,
            STARTING_Y + (i + 1) * CELL_SIZE - CELL_PADDING
          );

          this.context.moveTo(
            STARTING_X + (j + 1) * CELL_SIZE - CELL_PADDING,
            STARTING_Y + i * CELL_SIZE + CELL_PADDING
          );
          this.context.lineTo(
            STARTING_X + j * CELL_SIZE + CELL_PADDING,
            STARTING_Y + (i + 1) * CELL_SIZE - CELL_PADDING
          );
        } else if (this.board[i][j]) {
          this.context.moveTo(
            STARTING_X + j * CELL_SIZE + CELL_SIZE / 2,
            STARTING_Y + i * CELL_SIZE + CELL_SIZE / 2
          );

          this.context.arc(
            STARTING_X + j * CELL_SIZE + CELL_SIZE / 2,
            STARTING_Y + i * CELL_SIZE + CELL_SIZE / 2,
            (CELL_SIZE - 2 * CELL_PADDING) / 2,
            0,
            2 * Math.PI
          );
        }
      }
    }

    this.context.stroke();
  };

  checkWinner() {
    for (let i = 0; i < 3; i++) {
      if (
        this.board[i][0] &&
        this.board[i][0] === this.board[i][1] &&
        this.board[i][1] === this.board[i][2]
      ) {
        return this.board[i][0];
      }

      if (
        this.board[0][i] &&
        this.board[0][i] === this.board[1][i] &&
        this.board[1][i] === this.board[2][i]
      ) {
        return this.board[0][i];
      }
    }

    if (
      this.board[1][1] &&
      ((this.board[0][0] === this.board[1][1] &&
        this.board[1][1] === this.board[2][2]) ||
        (this.board[0][2] === this.board[1][1] &&
          this.board[1][1] === this.board[2][0]))
    ) {
      return this.board[1][1];
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!this.board[i][j]) {
          return null;
        }
      }
    }

    return 'TIE';
  }

  makeMove(e) {
    if (
      this.gameState !== GAME_STATE.PLAYING ||
      this.currentPlayer !== this.human
    ) {
      return;
    }

    if (
      !(
        e.offsetX > STARTING_X &&
        e.offsetX < STARTING_X + BOARD_SIZE &&
        e.offsetY > STARTING_Y &&
        e.offsetY < STARTING_Y + BOARD_SIZE
      )
    ) {
      return;
    }

    const i = Math.floor((e.offsetX - STARTING_X) / CELL_SIZE);
    const j = Math.floor((e.offsetY - STARTING_Y) / CELL_SIZE);

    if (this.board[j][i]) {
      return;
    }

    this.board[j][i] = this.human;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBoard();

    this.currentPlayer = this.ai;

    const winner = this.checkWinner();

    if (winner) {
      this.endGame(winner);

      return;
    }

    this.aiMove();
  }

  miniMax(isMaximizing, depth, alpha, beta) {
    let alphaScore = alpha;
    let betaScore = beta;

    const result = this.checkWinner();

    if (result) {
      counter++;
      return SCORES[result] + (isMaximizing ? -1 : 1) * depth;
    }

    let bestScore = (isMaximizing ? -1 : 1) * Infinity;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!this.board[i][j]) {
          this.board[i][j] = isMaximizing ? X : O;

          const score = this.miniMax(
            !isMaximizing,
            depth + 1,
            alphaScore,
            betaScore
          );

          this.board[i][j] = '';

          bestScore = isMaximizing
            ? Math.max(score, bestScore)
            : Math.min(score, bestScore);

          if (isMaximizing) {
            alphaScore = Math.max(alphaScore, bestScore);
          } else {
            betaScore = Math.min(betaScore, bestScore);
          }

          if (betaScore <= alphaScore) {
            return bestScore;
          }
        }
      }
    }

    return bestScore;
  }

  aiMove() {
    if (this.currentPlayer === this.human) {
      return;
    }

    const isMaximizing = this.ai === X;

    let bestScore = (isMaximizing ? -1 : 1) * Infinity;
    let bestMove = {};

    let alpha = -Infinity;
    let beta = Infinity;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (beta <= alpha) {
          break;
        }

        if (!this.board[i][j]) {
          this.board[i][j] = this.ai;

          const score = this.miniMax(!isMaximizing, 0, alpha, beta);

          this.board[i][j] = '';

          if (
            (isMaximizing && score > bestScore) ||
            (!isMaximizing && score < bestScore)
          ) {
            bestScore = score;
            bestMove = { i, j };
          }

          if (isMaximizing) {
            alpha = Math.max(alpha, bestScore);
          } else {
            beta = Math.min(beta, bestScore);
          }
        }
      }
    }

    this.board[bestMove.i][bestMove.j] = this.ai;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBoard();

    this.currentPlayer = this.human;

    const winner = this.checkWinner();

    if (winner) {
      this.endGame(winner);
    }
  }

  endGame(winner) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBoard();

    this.gameState = GAME_STATE.ENDED;
    this.context.font = '75px Arial';
    this.context.fillText(GAME_STATE[winner], 250, 80);
  }
}
