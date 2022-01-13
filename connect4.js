/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2

const board = []; // array of rows, each row is array of cells  (board[y][x])


/** makeBoard: create in-JS board model:
 * board is an array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
  for (let i = 0; i < HEIGHT; i++) {
    let row = [];
    for (let i = 0; i < WIDTH; i++) {
      row.push(null);
    }
    board.push(row);
  }
}


/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  // Get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById('board');

  // Create the header (top) row.
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Create HEIGHT table rows of WIDTH table cells.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}


/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (board[y][x] === null) {
      return y;
    }
  };
  return null;
}


/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  // make a div
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);

  // insert into correct table cell
  const cell = document.getElementById(`${y}-${x}`);
  cell.append(piece);
}



/** endGame: announce game end */
function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  if (checkForWin()) {
    alert("Game is Over!");
    return;
  }

  // Get x from ID of clicked cell
  let x = +evt.target.id;

  // Get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // Place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!!`)
  }

  // check for tie
  if (board.every(row => row.every(cell => cell))) {
    endGame("Tie!")
  }

  // TODO: check if all cells in board are filled; if so call, call endGame

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}


/** checkForWin: check board cell-by-cell for "does a win start here?" */
checkForWin = () => {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

// Set "board" to empty HEIGHT x WIDTH matrix array
makeBoard();

makeHtmlBoard();