// Extract Items and Create Variables
let selectContainer = document.getElementById("select-container");
let currentSelectDisplay = document.getElementById("current-select-display");
let resetButton = document.getElementById("reset-button");
let scoreDisplay = document.getElementById("score-display");
let xScoreDisplay = document.getElementById("x-score-display");
let oScoreDisplay = document.getElementById("o-score-display");

let tiebreakerDisplay = document.getElementById("tie-breaker-display");
let tiebreakerDirections = document.getElementById("tie-breaker-directions");
let userGuessInput = document.getElementById("user-guess-input");
let readyPrompt = document.getElementById("ready-prompt");
let xGuess = document.getElementById("x-guess");
let oGuess = document.getElementById("o-guess");
let randomGuessDisplay = document.getElementById("random-guess-display");
let submitButton = document.getElementById("submit-button");
let beginTiebreakerButton = document.getElementById("begin-tiebreaker-button");

let player1Mark, player2Mark, winner;
let xScore = 0;
let oScore = 0;
let currentTurn = "";
let scoreIsShown = true;

currentSelectDisplay.style.display = "none";
scoreDisplay.style.display = "none";
resetButton.style.display = "none";
tiebreakerDisplay.style.display = "none";
readyPrompt.style.opacity = "0%";
beginTiebreakerButton.style.opacity = "0%";
userGuessInput.style.display = "none";


// Extract all squares
let squares = document.getElementsByClassName("square");

// Function for user mark selection
function selectMark(markName){
    
    // Assign
    if(markName == "X"){
        player1Mark = "X";
        player2Mark = "O";
        
    } else if(markName == "O"){
        player1Mark = "O";
        player2Mark = "X";
        
    }
    
    // Hide Selector and show current selected mark
    selectContainer.style.display = "none";
    currentSelectDisplay.style.display = "block";
    currentTurn = player1Mark;
    currentSelectDisplay.textContent = "Current Mark: " + currentTurn;
    
}

// Function to place mark on board
function placeMark(squareNumber){
    
    // Place Mark
    let squareVariable = squares[squareNumber];

    if(squareVariable.textContent == ""){
        squareVariable.textContent = currentTurn;

        // Switch Turns
        if(currentTurn == player1Mark){
            currentTurn = player2Mark;
            
        } else if(currentTurn == player2Mark){
            currentTurn = player1Mark;
        }
    }
    
    
    // Display Turn
    currentSelectDisplay.textContent = "Current Mark: " + currentTurn;
    
    // Check for win
    checkWin();
    
}

// Function to check if a player has won
function checkWin(){

    // Check
    let rowWin = checkRow();
    let columnWin = checkColumn();
    let diagonalWin = checkDiagonal();
    let fullBoard = checkFull();

    // Display Winner
    if(rowWin || columnWin || diagonalWin){
        currentSelectDisplay.textContent = winner + " won the game! ";
        resetButton.style.display = "block";
        scoreDisplay.style.display = "block";
        xScoreDisplay.textContent = "X Score: " + xScore;
        oScoreDisplay.textContent = "O Score: " + oScore;
        
    } else if(fullBoard == true){

        // Tiebreaker Round
        currentSelectDisplay.textContent = "It was a tie!";
        resetButton.style.display = "none";
        tiebreakerDisplay.style.display = "block";

        // Set timeout for the Ready Prompt
        setTimeout(function(){
            readyPrompt.style.opacity = "100%";
            readyPrompt.style.transition = "opacity 0.3s linear";
            beginTiebreakerButton.style.opacity = "100%";
            beginTiebreakerButton.style.transition = "opacity 0.3s linear";

        }, 3000);

        // Event listener to begin Tiebreaker Round
        document.addEventListener('keydown', enterPressed);

    }
    
    
    
}

// Function to start Tiebreaker
function beginTiebreaker(){

    // Display User Input Section
    userGuessInput.style.display = "block";
    tiebreakerDirections.style.display = "none";
    readyPrompt.style.display = "none";
    resetButton.style.display = "none";
    beginTiebreakerButton.style.display = "none";

}

// Function to start Tiebreaker if Enter is Pressed
function enterPressed(event){

    let keyPressed = event.key;

    if(keyPressed == "Enter"){

        beginTiebreaker();

        // Remove Event Listener
        document.removeEventListener('keydown', enterPressed);

    }
}

// Function to submit User Input
function submitGuess(){

    // Extract
    let xValue = xGuess.value;
    let oValue = oGuess.value;

    // Account for Bogus Input
    if(Number(xValue) != xGuess.value || Number(oValue) != oGuess.value){
        tiebreakerDirections.style.display = "block";
        tiebreakerDirections.textContent = "Please enter an integer between 1-10.";
        
    } else if(xValue == oValue) {

        // Prompt user to enter different numbers
        tiebreakerDirections.style.display = "block";
        tiebreakerDirections.textContent = "Please enter different numbers for the best experience.";
        
    } else {
        decipherInput();
        tiebreakerDirections.style.display = "none";
        
    }
}

// Function to Decipher User's Input (Tiebreaker)
function decipherInput(){

    // Extract user input
    let xInput = xGuess.value;
    let oInput = oGuess.value;

    // Generate Random Guess
    let randomNum = Math.floor(Math.random() * 10) + 1;

    // Determine difference
    let differenceX = Math.abs(randomNum - xInput);
    let differenceO = Math.abs(randomNum - oInput);

    // Decipher
    if(differenceX < differenceO){
        winner = "X";
        xScore = xScore + 1;
        
    } else if(differenceO < differenceX){
        winner = "O";
        oScore = oScore + 1;

    }
    
    // Display
    randomGuessDisplay.textContent = "The computer's chosen number was " + randomNum + "!";
    currentSelectDisplay.textContent = winner + " has won the tiebreaker! ";
    
    resetButton.style.display = "block";
    submitButton.style.display = "none";
    scoreDisplay.style.display = "block";
    xScoreDisplay.textContent = "X Score: " + xScore;
    oScoreDisplay.textContent = "O Score: " + oScore;

}

// Function to Check if All Spaces are Occupied
function checkFull(){

    // Create Variables
    let occupiedCount = 0;
    let isFull = false;

    // Check if all spaces are occupied
    for(let item = 0; item < squares.length; item++){

        if(squares[item].textContent != ""){
            occupiedCount = occupiedCount + 1;
        }

    }

    if(occupiedCount == 9){
        isFull = true;
    }

    // Return
    return isFull;
}

// Function to Check Rows for Win
function checkRow(){

    // Create Variable
    let initialSquare = 0;
    
    // Check
    for(let row = 0; row < 3; row++){
        
        if(squares[initialSquare].textContent == "X" && squares[initialSquare + 1].textContent == "X" && squares[initialSquare + 2].textContent == "X"){
            winner = "X";
            xScore = xScore + 1;
            return true;
            
        } else if(squares[initialSquare].textContent == "O" && squares[initialSquare + 1].textContent == "O" && squares[initialSquare + 2].textContent == "O"){
            winner = "O";
            oScore = oScore + 1;
            return true;
            
        }
        
        // Next Row
        initialSquare = initialSquare + 3;
        
    }
}

// Function to Check Columns for Win
function checkColumn(){
    
    // Create Variable
    let initialSquare = 0;
    
    // Check
    for(let column = 0; column < 3; column++){
        
        if(squares[initialSquare].textContent == "X" && squares[initialSquare + 3].textContent == "X" && squares[initialSquare + 6].textContent == "X"){
            winner = "X";
            xScore = xScore + 1;
            return true;
            
        } else if(squares[initialSquare].textContent == "O" && squares[initialSquare + 3].textContent == "O" && squares[initialSquare + 6].textContent == "O"){
            winner = "O";
            oScore = oScore + 1;
            return true;
            
        }
        
        // Next Column
        initialSquare = initialSquare + 1;
        
    }
}

// Function to Check Diagonals for Win
function checkDiagonal(){
    
    // Check
    if(squares[0].textContent == "X" && squares[4].textContent == "X" && squares[8].textContent == "X"){
        winner = "X";
        xScore = xScore + 1;
        return true;
        
    } else if(squares[0].textContent == "O" && squares[4].textContent == "O" && squares[8].textContent == "O"){
        winner = "O";
        oScore = oScore + 1;
        return true;
        
    } else if(squares[6].textContent == "X" && squares[4].textContent == "X" && squares[2].textContent == "X"){
        winner = "X";
        xScore = xScore + 1;
        return true;
        
    } else if(squares[6].textContent == "O" && squares[4].textContent == "O" && squares[2].textContent == "O"){
        winner = "O";
        oScore = oScore + 1;
        return true;
        
    }
}


// Function to reset game
function resetGame(){
    
    // Reset
    player1Mark = "";
    player2Mark = "";
    winner = "";
    currentTurn = "";

    selectContainer.style.display = "block";
    currentSelectDisplay.style.display = "none";
    resetButton.style.display = "none";

    tiebreakerDisplay.style.display = "none";
    tiebreakerDirections.style.display = "block";
    userGuessInput.style.display = "none"
    
    readyPrompt.style.display = "block";
    readyPrompt.style.opacity = "0%";
    
    submitButton.style.display = "block";
    randomGuessDisplay.textContent = "";
    
    beginTiebreakerButton.style.display = "block";
    beginTiebreakerButton.style.opacity = "0%";
    
    tiebreakerDirections.textContent = "The computer will generate a random integer between 1-10, inclusive. Whoever guesses the closest to the chosen number will win this round!";

    // Reset Squares
    for(let item = 0; item < squares.length; item++){
        squares[item].textContent = "";
    }

}


