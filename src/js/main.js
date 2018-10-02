// Collection of all the spots on the board
let spots = null;

// The currently active spot
let currentSpot = null;

// The reset button
let resetButton = null;

// The new game button
let newGameButton = null;

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
    if (isOccupied()) return;

    // Draw the mark
    drawMark();

    // Check for win
    if (checkForWin()) {
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

function isOccupied() {
    return (currentSpot.innerHTML);
}

function resetBoard() {
    // Reset turn tracker
    currentTurn = TURN_X;

    // Erase board
    for (let spot of spots) {
        spot.innerHTML = '';
    }
}

function checkForWin() {
    // Function for checking just one spot

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

    // if we're on a diagonal, check the other spots on the diagonal
    if (isCenterSpot()) {
        // If we're in the center, we have to check both diagonals
        let forwardDiagonalWin = checkSpots(getForwardDiagonal());
        let backwardDiagonalWin = checkSpots(getBackwardDiagonal());

        if (forwardDiagonalWin) highlight(getForwardDiagonal());
        if (backwardDiagonalWin) highlight(getBackwardDiagonal());

        return (forwardDiagonalWin || backwardDiagonalWin);

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

function isCenterSpot() {
    return /middle center/.test(currentSpot.classList.value);
}

function isOnForwardDiagonal() {
    return /bottom left/.test(currentSpot.classList.value) ||
           /middle center/.test(currentSpot.classList.value) ||
           /top right/.test(currentSpot.classList.value);
}

function isOnBackwardDiagonal() {
    return /bottom right/.test(currentSpot.classList.value) ||
           /middle center/.test(currentSpot.classList.value) ||
           /top left/.test(currentSpot.classList.value);
}

function getForwardDiagonal() {
    return document.querySelectorAll(".bottom.left, .middle.center, .top.right");
}

function getBackwardDiagonal() {
    return document.querySelectorAll(".bottom.right, .middle.center, .top.left");
}

function highlight(spots) {
    // highlight these spots to celebrate the win!
    for (let spot of spots) {
        spot.classList.add('bg-success');
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
