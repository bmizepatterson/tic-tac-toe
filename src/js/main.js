// Game mode. If twoPlayerMode is true, then there are two human players.
// If false, then one of the players is the computer.
let twoPlayerMode    = true;
let twoPlayerButton  = null;
let vsComputerButton = null;

// Collection of all the spots on the board
let spots = null;

// The currently active spot
let currentSpot = null;

// The "whose move" message
let whoseMove = null;

// The reset button
let resetButton = null;

// The new game button
let newGameButton = null;

// The game message area
let gameMessage = null;

// Keep track of when the game has ended so users can't continue to click
let gameIsOver = false;

// Turn tracker. X always goes first. Save constants as the Unicode chars
// that will be displayed, to make comparison easy.
const TURN_X = '×'; // HTML entity &times;
const TURN_O = '○'; // HTML entity &#9675;
let currentTurn = TURN_X;

document.onreadystatechange = function() {
    if (document.readyState == 'interactive') init();
}

function init() {
    // Mode buttons
    twoPlayerButton = document.getElementById('mode-twoplayer');
    vsComputerButton = document.getElementById('mode-computer');

    // Grab all the spots
    spots = document.getElementsByClassName('spot');

    // Grab the buttons
    resetButton = document.getElementById('resetButton');
    newGameButton = document.getElementById('newGameButton');

    // Grab the message areas
    gameMessage = document.getElementById('game-message');
    whoseMove = document.getElementById('whose-move');

    // Set onclick events
    for (let spot of spots) {
        spot.onclick = processClick;
    }
    resetButton.onclick = resetBoard;
    newGameButton.onclick = startNewGame;
    twoPlayerButton.onclick = setMode;
    vsComputerButton.onclick = setMode;
}

function setMode() {
    this.checked = true;
    if (this.id == 'mode-twoplayer') {
        vsComputerButton.parentElement.classList.remove('active');
        twoPlayerButton.parentElement.classList.add('active');
        vsComputerButton.checked = false;
        twoPlayerMode = true;
    } else {
        twoPlayerButton.parentElement.classList.remove('active');
        vsComputerButton.parentElement.classList.add('active');
        twoPlayerButton.checked = false;
        twoPlayerMode = false;
    }
    resetBoard();
}

function processClick(event) {
    // Copy over the last spot played
    let oldSpot = currentSpot;

    // Update the current spot to the spot that was just clicked.
    currentSpot = event.target;

    // Don't do anything if there's already a mark in this spot,
    // if it's the computer's turn, or if the game is over.
    if (isOccupied(currentSpot) ||
        (!twoPlayerMode && currentTurn == TURN_O) ||
        gameIsOver) {

        return;
    }

    // Reset styling on the last spot
    if (oldSpot) oldSpot.classList.remove('current-mark-x', 'current-mark-o');

    playSpot();
}

function drawMark() {
    currentSpot.innerHTML = currentTurn;
    let className = currentTurn == TURN_X ? "current-mark-x" : "current-mark-o";
    currentSpot.classList.add(className);
}

function toggleTurn() {
    if (currentTurn === TURN_X) currentTurn = TURN_O;
    else currentTurn = TURN_X;

    whoseMove.innerHTML = currentTurn + "'s move";
    if (!twoPlayerMode && currentTurn == TURN_O) {
        computerMove();
    }
}

function computerMove() {
    console.log('The computer is thinking.');
    // Reset the last played spot
    currentSpot.classList.remove('current-mark-x', 'current-mark-o');

    // METHOD ONE: RANDOM

    // Gather list of available spots
    let openSpots = [];
    for (let spot of spots) {
        if (spot.innerHTML == '') openSpots.push(spot);
    }

    // Choose one at random
    currentSpot = openSpots[Math.floor(Math.random() * openSpots.length)];
    playSpot();
}

function playSpot() {
    // Draw the mark
    drawMark();

    // Display the reset button
    resetButton.style.display = 'inline-block';

    // Check for win or draw
    if (checkForWin()) {
        endGame();
    } else if (checkForDraw()) {
        announceDraw();
        endGame();
    } else {
        toggleTurn();
    }
}

function resetBoard() {
    // Reset turn tracker
    currentTurn = TURN_X;

    // Erase board
    for (let spot of spots) {
        spot.innerHTML = '';
        spot.classList.remove('bg-success', 'text-light');
    }

    // Hide the reset button at the start of the game
    resetButton.style.display = 'none';

    // Reset game message areas
    whoseMove.innerHTML = currentTurn + "'s move";
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
    gameMessage.innerHTML = 'Draw. &#x1F611;';
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
