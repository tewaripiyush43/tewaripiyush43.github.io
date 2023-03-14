import {
  createBoard,
  markTile,
  TILE_STATUSES,
  revealTile,
  checkWin,
  checkLose,
} from "./minesweeper.js";

let BOARD_SIZE = 10;
let NUMBER_OF_MINES = 10;

document.querySelector("[data-slides]").addEventListener("click", function () {
  document.querySelector(".popup").style.display = "none";
  let difficulty = document
    .querySelector("[data-slides]")
    .querySelector("[data-active]").innerHTML;

  const level = difficulty === "Easy" ? 0 : difficulty === "Medium" ? 1 : 2;
  updateLevel(level);

  document.querySelector(".title-board").style.display = "block";
});

const boardElement = document.querySelector(".board");
function updateLevel(level) {
  let tileSize;
  if (level == 0) {
    console.log("yo1");
    BOARD_SIZE = 9;
    NUMBER_OF_MINES = 10;
    tileSize = "40px";
  } else if (level == 1) {
    console.log("yo2");
    BOARD_SIZE = 16;
    NUMBER_OF_MINES = 40;
    tileSize = "25px";
  } else {
    BOARD_SIZE = 20;
    NUMBER_OF_MINES = 70;
    tileSize = "25px";
  }

  const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
  fillBoard(board);
  boardElement.style.setProperty("--tileSize", tileSize);
}

// console.log(createBoard(BOARD_SIZE, NUMBER_OF_MINES));
const minesLeftText = document.querySelector("[data-mine-count]");
const messageText = document.querySelector(".subtext");

function fillBoard(board) {
  board.forEach((row) => {
    row.forEach((tile) => {
      boardElement.append(tile.element);
      tile.element.addEventListener("click", () => {
        revealTile(board, tile);
        checkGameEnd(board);
      });
      tile.element.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        markTile(tile);
        listMinesLeft(board);
      });
    });
  });
  boardElement.style.setProperty("--size", BOARD_SIZE);
  minesLeftText.textContent = NUMBER_OF_MINES;
}

function listMinesLeft(board) {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === TILE_STATUSES.MARKED).length
    );
  }, 0);

  minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount;
}

function checkGameEnd(board) {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    boardElement.addEventListener("click", stopProp, { capture: true });
    boardElement.addEventListener("contextmenu", stopProp, { capture: true });
  }

  if (win) {
    messageText.textContent = "You Win";
  }
  if (lose) {
    messageText.textContent = "You Lose";
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile);
        if (tile.mine) revealTile(board, tile);
      });
    });
  }
}

function stopProp(e) {
  e.stopImmediatePropagation();
}
