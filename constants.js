const BOARD_SIZE = 600;
const CELL_SIZE = BOARD_SIZE / 3;
const CELL_PADDING = 25;
const STARTING_X = 100;
const STARTING_Y = 100;

const X = 'X';
const O = 'O';

const GAME_STATE = {
  PLAYING: 'PLAYING',
  X: 'X has won',
  O: 'O has won',
  TIE: "It's a tie",
  ENDED: 'ENDED',
};

const SCORES = {
  X: 10,
  O: -10,
  TIE: 0,
};
