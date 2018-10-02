"use strict";

// Collection of all the spots on the board
var spots = null; // The currently active spot

var currentSpot = null; // The reset button

var resetButton = null; // The new game button

var newGameButton = null; // Turn tracker. X always goes first. Save constants as the Unicode chars
// that will be displayed. For reference, the HTML entities are &times;
// for X and &#9675; for X.

var TURN_X = '×';
var TURN_O = '○';
var currentTurn = TURN_X;

document.onreadystatechange = function () {
  if (document.readyState == 'interactive') init();
};

function init() {
  // Grab all the spots
  spots = document.getElementsByClassName('spot'); // Grab the buttons

  resetButton = document.getElementById('resetButton');
  newGameButton = document.getElementById('newGameButton'); // Set onclick events

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
  currentSpot = event.target; // Don't dop anything if a mark if this spot has already been taken.

  if (isOccupied()) return; // Draw the mark

  drawMark(); // Check for win

  if (checkForWin()) {
    endGame();
  } // Toggle the turn


  toggleTurn();
}

function drawMark() {
  currentSpot.innerHTML = currentTurn;
}

function toggleTurn() {
  if (currentTurn === TURN_X) currentTurn = TURN_O;else currentTurn = TURN_X;
}

function isOccupied() {
  return currentSpot.innerHTML;
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
    }
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
}

function checkForWin() {
  // Function for checking just one spot
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
  // if we're on a diagonal, check the other spots on the diagonal


  if (isCenterSpot()) {
    // If we're in the center, we have to check both diagonals
    var forwardDiagonalWin = checkSpots(getForwardDiagonal());
    var backwardDiagonalWin = checkSpots(getBackwardDiagonal());
    if (forwardDiagonalWin) highlight(getForwardDiagonal());
    if (backwardDiagonalWin) highlight(getBackwardDiagonal());
    return forwardDiagonalWin || backwardDiagonalWin;
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
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = spots[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var spot = _step3.value;

      if (spot.innerHTML != currentTurn) {
        win = false;
        break;
      }
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

function isCenterSpot() {
  return /middle center/.test(currentSpot.classList.value);
}

function isOnForwardDiagonal() {
  return /bottom left/.test(currentSpot.classList.value) || /middle center/.test(currentSpot.classList.value) || /top right/.test(currentSpot.classList.value);
}

function isOnBackwardDiagonal() {
  return /bottom right/.test(currentSpot.classList.value) || /middle center/.test(currentSpot.classList.value) || /top left/.test(currentSpot.classList.value);
}

function getForwardDiagonal() {
  return document.querySelectorAll(".bottom.left, .middle.center, .top.right");
}

function getBackwardDiagonal() {
  return document.querySelectorAll(".bottom.right, .middle.center, .top.left");
}

function highlight(spots) {
  // highlight these spots to celebrate the win!
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = spots[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var spot = _step4.value;
      spot.classList.add('bg-success');
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
}

function endGame() {
  resetButton.style.display = 'none';
  newGameButton.style.display = 'inline-block';
}

function startNewGame() {
  resetBoard();
  resetButton.style.display = 'inline-block';
  newGameButton.style.display = 'none';
}