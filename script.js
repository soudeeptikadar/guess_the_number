const startButton = document.getElementById('startGame');
const difficultySelect = document.getElementById('difficulty');
const roundsInput = document.getElementById('rounds');
const guessInput = document.getElementById('guess');
const resultDiv = document.getElementById('result');
const attemptsDiv = document.getElementById('attempts');
const hintsDiv = document.getElementById('hints');
const timerDiv = document.getElementById('timer');
const switchPlayerButton = document.getElementById('switchPlayer');
const playersSelect = document.getElementById('players');
const timeDiv = document.getElementById('time');

const winModal = document.getElementById('winModal');
const winMessage = document.getElementById('winMessage');
const closeModal = document.getElementsByClassName('close')[0];

let currentPlayer = 'Player 1';
let gameActive = false;
let numberToGuess;
let minRange, maxRange, totalRounds, currentRound;
let attempts = 0;
let timer;
let playerMode; // 1 for player vs. player, 2 for player vs. AI

function setRange(difficulty) {
    switch (difficulty) {
        case 'easy':
            minRange = 1;
            maxRange = 50;
            break;
        case 'medium':
            minRange = 1;
            maxRange = 100;
            break;
        case 'hard':
            minRange = 1;
            maxRange = 200;
            break;
        default:
            minRange = 1;
            maxRange = 100;
    }
}

function startGame() {
    const difficulty = difficultySelect.value;
    setRange(difficulty);
    totalRounds = parseInt(roundsInput.value);
    currentRound = 1;
    attempts = 0;
    playerMode = playersSelect.value;
    
    numberToGuess = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
    hintsDiv.textContent = '';
    resultDiv.textContent = '';
    attemptsDiv.textContent = `Attempts: ${attempts}`;
    timeDiv.style.display = 'block';

    startTimer();
    gameActive = true;
}

function startTimer() {
    let timeLeft = 30;
    timerDiv.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerDiv.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            gameActive = false;
            hintsDiv.textContent = `Time's up! The number was ${numberToGuess}.`;
        }
    }, 1000);
}

startButton.addEventListener('click', startGame);

switchPlayerButton.addEventListener('click', () => {
    currentPlayer = currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1';
    resultDiv.textContent = `${currentPlayer}'s turn`;
});

function showWinningModal(message) {
    winMessage.textContent = message;
    winModal.style.display = 'block';
}

function checkGuess(userGuess) {
    attempts++;
    if (userGuess === numberToGuess) {
        showWinningModal(`${currentPlayer} guessed the number in ${attempts} attempts!`);
        gameActive = false;
        hintsDiv.textContent = '';
        clearInterval(timer);
        if (currentRound < totalRounds) {
            currentRound++;
            setTimeout(startGame, 2000); // Start new round after 2 seconds
        } else {
            resultDiv.textContent += ` Game over! You completed ${totalRounds} rounds.`;
            timeDiv.style.display = 'none';
        }
    } else if (userGuess < numberToGuess) {
        hintsDiv.textContent = 'Too low! Try again.';
    } else {
        hintsDiv.textContent = 'Too high! Try again.';
    }
    attemptsDiv.textContent = `Attempts: ${attempts}`;
}

document.getElementById('submitGuess').addEventListener('click', () => {
    if (gameActive) {
        const userGuess = parseInt(guessInput.value);

        // Check if the guess is a valid number and within range
        if (isNaN(userGuess) || userGuess < minRange || userGuess > maxRange) {
            hintsDiv.textContent = `Please enter a number between ${minRange} and ${maxRange}.`;
            return;
        }

        // Check guess
        if (playerMode === 'ai' && currentPlayer === 'Player 1') {
            // Simulate AI turn
            let aiGuess = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
            checkGuess(aiGuess);
            currentPlayer = 'Player 2';
        } else {
            checkGuess(userGuess);
            currentPlayer = currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1';
            resultDiv.textContent = `${currentPlayer}'s turn`;
        }

        // Clear the input field after guess
        guessInput.value = '';
    }
});

// Close the modal when the user clicks on <span> (x)
closeModal.onclick = () => {
    winModal.style.display = 'none';
};

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = (event) => {
    if (event.target === winModal) {
        winModal.style.display = 'none';
    }
};
