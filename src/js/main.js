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
    // Check row
    let win = true;
    let rowSpots = document.getElementsByClassName(getRow());
    for (let spot of rowSpots) {
        if (spot.innerHTML !== currentTurn) {
            win = false;
            break;
        }
    }
    console.log('A win?', win);
    if (win) {
        highlight(rowSpots);
        return true;
    }

    // Check diagonals

    // return win;
    return false;
}

function getRow() {
    if (currentSpot.classList.value.match(/top/)) return 'top';
    if (currentSpot.classList.value.match(/middle/)) return 'middle';
    if (currentSpot.classList.value.match(/bottom/)) return 'bottom';
}

function getCol() {
    if (currentSpot.classList.value.match(/left/)) return 'left';
    if (currentSpot.classList.value.match(/center/)) return 'center';
    if (currentSpot.classList.value.match(/right/)) return 'right';
}

function highlight(spots) {
    // highlight these spots to celebrate the win!
    for (let spot of spots) {
        spot.classList.add('highlighted');
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
