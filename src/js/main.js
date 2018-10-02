// Collection of all the spots on the board
let spots = null;

// The currently active spot
let currentSpot = null;

// The reset button
let resetButton = null;

// The new game button
let newGameButton = null;

// The game message area
let gameMessage = null;

// Turn tracker. X always goes first. Save constants as the Unicode chars
// that will be displayed. For reference, the HTML entities are &times;
// for X and &#9675; for X.
const TURN_X = '×';
const TURN_O = '○';
let currentTurn = TURN_X;

document.onreadystatechange = function() {
    if (document.readyState == 'interactive') init();
}

function init() {
    // Grab all the spots
    spots = document.getElementsByClassName('spot');

    // Grab the buttons
    resetButton = document.getElementById('resetButton');
    newGameButton = document.getElementById('newGameButton');

    // Grab the game message area
    gameMessage = document.getElementById('game-message');

    // Set onclick events
    for (let spot of spots) {
        spot.onclick = processClick;
    }
    resetButton.onclick = resetBoard;
    newGameButton.onclick = startNewGame;
}

function processClick(event) {
    currentSpot = event.target;

    // Don't dop anything if a mark if this spot has already been taken.
    if (isOccupied(currentSpot)) return;

    // Draw the mark
    drawMark();

    // Check for win or draw
    if (checkForWin()) {
        endGame();
    } else if (checkForDraw()) {
        announceDraw();
        endGame();
    }

    // Toggle the turn
    toggleTurn();
}

function drawMark() {
    currentSpot.innerHTML = currentTurn;
}

function toggleTurn() {
    if (currentTurn === TURN_X) currentTurn = TURN_O;
    else currentTurn = TURN_X;
}

function resetBoard() {
    // Reset turn tracker
    currentTurn = TURN_X;

    // Erase board
    for (let spot of spots) {
        spot.innerHTML = '';
        spot.classList.remove('bg-success');
    }

    // Reset game message area
    gameMessage.innerHTML = '&nbsp;';
    gameMessage.style.visibility = 'hidden';
}

function checkForDraw() {
    // If every spot is full and no one has one, then we have a draw.
    let occupiedCount = 0;
    for (let spot of spots) {
        if (isOccupied(spot)) occupiedCount++
    }
    return (occupiedCount == spots.length);
}

function announceDraw() {
    gameMessage.innerHTML = 'Draw &#x2639;';
    gameMessage.style.visibility = 'visible';
}

function checkForWin() {

    // Check row
    let row = getRow();
    if (checkSpots(row)) {
        highlight(row);
        return true;
    }

    // Check column
    let col = getCol();
    if (checkSpots(col)) {
        highlight(col);
        return true;
    }

    // Check diagonals
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
    let win = true;
    for (let spot of spots) {
        if (spot.innerHTML != currentTurn) {
            win = false;
            break;
        }
    }
    return win;
}

function getRow() {
    // Returns an HTML collection of the spots in the current row
    let rowName = /top|middle|bottom/.exec(currentSpot.classList.value)[0];
    return document.getElementsByClassName(rowName);
}

function getCol() {
    // Returns an HTML collection of the spots in the current column
    let rowName = /left|center|right/.exec(currentSpot.classList.value)[0];
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
    return (/middle center/.test(currentSpot.classList.value));
}

function isOnForwardDiagonal() {
    return (/bottom left/.test(currentSpot.classList.value) ||
            /middle center/.test(currentSpot.classList.value) ||
            /top right/.test(currentSpot.classList.value));
}

function isOnBackwardDiagonal() {
    return (/bottom right/.test(currentSpot.classList.value) ||
            /middle center/.test(currentSpot.classList.value) ||
            /top left/.test(currentSpot.classList.value));
}

function highlight(spots) {
    // Highlight these spots to celebrate the win!
    for (let spot of spots) {
        spot.classList.add('bg-success', 'text-light');
    }
}

function isOccupied(spot) {
    return (spot.innerHTML);
}

function endGame() {
    // Don't reset the board until the "new game" button is clicked.
    resetButton.style.display = 'none';
    newGameButton.style.display = 'inline-block';
}

function startNewGame() {
    resetBoard();
    resetButton.style.display = 'inline-block';
    newGameButton.style.display = 'none';
}
