"use strict";

// Collection of all the spots on the board
var spots = null; // The currently active spot

var currentSpot = null; // The "whose move" message

var whoseMove = null; // The reset button

var resetButton = null; // The new game button

var newGameButton = null; // The game message area

var gameMessage = null; // Keep track of when the game has ended so users can't continue to click

var gameIsOver = false; // Turn tracker. X always goes first. Save constants as the Unicode chars
// that will be displayed, to make comparison easy.

var TURN_X = '×'; // HTML entity &times;

var TURN_O = '○'; // HTML entity &#9675;

var currentTurn = TURN_X;

document.onreadystatechange = function () {
  if (document.readyState == 'interactive') init();
};

function init() {
  // Grab all the spots
  spots = document.getElementsByClassName('spot'); // Grab the buttons

  resetButton = document.getElementById('resetButton');
  newGameButton = document.getElementById('newGameButton'); // Grab the message areas

  gameMessage = document.getElementById('game-message');
  whoseMove = document.getElementById('whose-move'); // Set onclick events

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = spots[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var spot = _step.value;
      spot.onclick = processClick;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  resetButton.onclick = resetBoard;
  newGameButton.onclick = startNewGame;
}

function processClick(event) {
  // Copy over the last spot played
  var oldSpot = currentSpot; // Update the current spot to the spot that was just clicked.

  currentSpot = event.target; // Don't do anything if there's already a mark in this spot,
  // or if the game is over.

  if (isOccupied(currentSpot) || gameIsOver) return; // Reset styling on the last spot

  if (oldSpot) oldSpot.classList.remove('current-mark-x', 'current-mark-o'); // Draw the mark

  drawMark(); // Display the reset button

  resetButton.style.display = 'inline-block'; // Check for win or draw

  if (checkForWin()) {
    endGame();
  } else if (checkForDraw()) {
    announceDraw();
    endGame();
  } // Toggle the turn


  toggleTurn();
}

function drawMark() {
  currentSpot.innerHTML = currentTurn;
  var className = currentTurn == TURN_X ? "current-mark-x" : "current-mark-o";
  currentSpot.classList.add(className);
}

function toggleTurn() {
  if (currentTurn === TURN_X) currentTurn = TURN_O;else currentTurn = TURN_X;
  whoseMove.innerHTML = currentTurn + "'s move";
}

function resetBoard() {
  // Reset turn tracker
  currentTurn = TURN_X; // Erase board

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = spots[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var spot = _step2.value;
      spot.innerHTML = '';
      spot.classList.remove('bg-success', 'text-light');
    } // Hide the reset button at the start of the game

  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  resetButton.style.display = 'none'; // Reset game message areas

  whoseMove.innerHTML = currentTurn + "'s move";
  gameMessage.innerHTML = '&nbsp;';
  gameMessage.style.visibility = 'hidden';
}

function checkForDraw() {
  // If every spot is full and no one has one, then we have a draw.
  var occupiedCount = 0;
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = spots[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var spot = _step3.value;
      if (isOccupied(spot)) occupiedCount++;
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return occupiedCount == spots.length;
}

function announceDraw() {
  gameMessage.innerHTML = 'Draw. &#x1F611;';
  gameMessage.style.visibility = 'visible';
}

function checkForWin() {
  // Check row
  var row = getRow();

  if (checkSpots(row)) {
    highlight(row);
    return true;
  } // Check column


  var col = getCol();

  if (checkSpots(col)) {
    highlight(col);
    return true;
  } // Check diagonals


  if (isCenterSpot()) {
    // If we're in the center, we have to check both diagonals
    if (checkSpots(getForwardDiagonal())) {
      highlight(getForwardDiagonal());
      return true;
    }

    if (checkSpots(getBackwardDiagonal())) {
      highlight(getBackwardDiagonal());
      return true;
    }
  } else if (isOnForwardDiagonal() && checkSpots(getForwardDiagonal())) {
    highlight(getForwardDiagonal());
    return true;
  } else if (isOnBackwardDiagonal() && checkSpots(getBackwardDiagonal())) {
    highlight(getBackwardDiagonal());
    return true;
  }

  return false;
}

function checkSpots(spots) {
  // Check some spots to see if they all contain the current mark
  var win = true;
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = spots[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var spot = _step4.value;

      if (spot.innerHTML != currentTurn) {
        win = false;
        break;
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  return win;
}

function getRow() {
  // Returns an HTML collection of the spots in the current row
  var rowName = /top|middle|bottom/.exec(currentSpot.classList.value)[0];
  return document.getElementsByClassName(rowName);
}

function getCol() {
  // Returns an HTML collection of the spots in the current column
  var rowName = /left|center|right/.exec(currentSpot.classList.value)[0];
  return document.getElementsByClassName(rowName);
}

function getForwardDiagonal() {
  // Returns an HTML collection of the spots in the forward diagonal
  return document.querySelectorAll(".bottom.left, .middle.center, .top.right");
}

function getBackwardDiagonal() {
  // Returns an HTML collection of the spots in the backward diagonal
  return document.querySelectorAll(".bottom.right, .middle.center, .top.left");
}

function isCenterSpot() {
  return /middle center/.test(currentSpot.classList.value);
}

function isOnForwardDiagonal() {
  return /bottom left/.test(currentSpot.classList.value) || /middle center/.test(currentSpot.classList.value) || /top right/.test(currentSpot.classList.value);
}

function isOnBackwardDiagonal() {
  return /bottom right/.test(currentSpot.classList.value) || /middle center/.test(currentSpot.classList.value) || /top left/.test(currentSpot.classList.value);
}

function highlight(spots) {
  // Highlight these spots to celebrate the win!
  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = spots[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var spot = _step5.value;
      spot.classList.add('bg-success', 'text-light');
    }
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
        _iterator5.return();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }
}

function isOccupied(spot) {
  return spot.innerHTML;
}

function endGame() {
  // Don't reset the board until the "new game" button is clicked.
  gameIsOver = true;
  whoseMove.style.visibility = 'hidden';
  resetButton.style.display = 'none';
  newGameButton.style.display = 'inline-block';
}

function startNewGame() {
  resetBoard();
  gameIsOver = false;
  whoseMove.style.visibility = 'visible';
  newGameButton.style.display = 'none';
}