// defines the click behavior for the buttons
var startBtn = document.getElementById("start");
startBtn.addEventListener("click", function() {
	btnClicked("start");
});
var pauseResetBtn = document.getElementById("pauseReset");
pauseResetBtn.style.display = "none";
pauseResetBtn.addEventListener("click", function() {
	btnClicked("pauseReset");
});
var submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", function() {
	btnClicked("submitBtn");
});
var timer = document.getElementById("timerDisplay"); // gets the timer from the document

// Define UI behaviors
const submitUI = document.getElementById("input");
submitUI.style.display = "none";

const iframe = document.getElementById("ARframe");
console.log(iframe);
const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
console.log(innerDoc);

class Stopwatch {
	constructor() {
		this.reset();
		this.running = false;
		console.log("watch created");
	}

	// increments the stopwatch by 100 milliseconds and returns the time as a string
	tick(tickMillis) {
		// increments the stopwatch by the number of milliseconds passed
		this.millis += tickMillis;

		/* check if seconds or millisecs have overflowed, and increment higher value. (mins just go to infinity) */
		if (this.millis === 1000) {
			this.millis = 0;
			this.secs++;
		}
		if (this.secs === 60) {
			this.secs = 0;
			this.mins++;
		}

		/* update the strings for the timer values */
		this.milStr = "" + this.millis / 100;
		this.secStr = this.secs < 10 ? "0" + this.secs + "." : this.secs + ".";
		this.minStr = this.mins < 10 ? "0" + this.mins + ":" : this.mins + ":";

		this.running = true;
		return this.timeStr();
	}

	// sets all the values to 0 and false
	reset() {
		this.millis = 0;
		this.secs = 0;
		this.mins = 0;
		this.milStr = "0";
		this.secStr = "00.";
		this.minStr = "00:";

		return this.timeStr();
	}

	// functions for starting, pausing, and checking whether the stopwatch is running
	pause() {
		this.running = false;
	}
	start() {
		this.running = true;
	}
	isRunning() {
		return this.running;
	}

	// returns the formatted time string from the stopwatch
	timeStr() {
		return "" + this.minStr + this.secStr + this.milStr;
	}
}

//class for holding the stopwatch and other game variables
class arGame {
	constuctor() {
		this.gameOver = true;
		this.completed = false;
		resetScores();
        this.running = null;
	}

	// says whether the puzzle is completed
	isRunning() {
		if(this.running == null)
            return false;
        else
            return true;
	}

	getScores() {
		return this.scores;
	}
    
    resetScores() {
        this.scores = [[], [], []];
        for(var i = 0; i < 5; ++i){
            this.scores[0].push("EMPTY");
            this.scores[1].push("00:00.0");
            this.scores[2].push(0);
        }
    }

	// sets the game state to currently being solved
	startGame() {
		this.completed = false;
		this.gameOver = false;
	}

	// takes in a list of distances and a minimum distance. If any of the distances are greater than the minimum
	// distance, the game is not completed.
	checkCompleted() {
        distances = getDistances()
        
		this.completed = false;
		for (dist in newDists)
			if (dist > minDist) {
				this.completed = true;
				break;
			}

		return this.completed;
	}
    
    // sets all of the game variables 
    reset() {
        this.gameOver = true;
        this.completed = false;
        this.running = null;
    }

	// inserts a new score into the list of scores
	tryToAddScore(name, timeStr, totalMillis) {
        var scoresLen = this.scores.length;
        
        var i = 0;
        for(; i < scoresLen; ++i)
            if(totalMillis <= this.scores[2][i])
                break;
        
        this.scores[0].splice(i, 0, name)
        this.scores[1].splice(i, 0, timeStr)
        this.scores[2].splice(i, 0, totalMillis)
        
        if(this.scores[0].length == 6){
            this.scores[0].splice(5, 1)
            this.scores[1].splice(5, 1)
            this.scores[2].splice(5, 1)
        }
            
    }

	// progresses the game state and calculates game information from the current state
	continue() {}
}

// function that progresses the game
var gameLoop = function() {
	if (watch.isRunning()) timer.innerHTML = watch.tick(100); // updates the time in the UI
	if (game.checkCompleted())
		// gets the current distances and checks if the puzzle is completed.
		endGame(); // ends the game if the puzzle is completed
};

// starts the game
function startGame() {
	// hides the start button after it is called and changes the Reset text to Pause
	startBtn.style.display = "none";
	pauseResetBtn.style.display = "inline";
	pauseResetBtn.innerHTML = "Pause";

	// starts the watch
	watch.start();

	// !!TODO!! use clearInterval(gameInterval) somewhere to end the game loop
	gameInterval = setInterval(gameLoop, 100);
}

// pauses the game
function pauseGame() {
	clearInterval(gameInterval); // stops the game loop
	startBtn.style.display = "none"; // makes the start button visible
	pauseResetBtn.innerHTML = "Reset";
	watch.pause(); // pauses the watch
}

// completely resets the game
function resetGame() {
    if(game.running != null)
        clearInterval(game.running);
    game.reset;
    
	timer.innerHTML = watch.reset();
	startBtn.style.display = "inline";
	pauseResetBtn.style.display = "none";
    
    const gameSection = document.getElementById("game");
	const ARFrame = document.getElementById("ARframe");
    gameSection.className = "game";
    ARFrame.className = "frame";
    submitUI.style.display = "none";
}

function endGame() {
	clearInterval(gameInterval); // stops the game loop
	watch.pause();
	displayEndScreen();
}

function displayEndScreen() {
	const gameSection = document.getElementById("game");
	const ARFrame = document.getElementById("ARframe");
	gameSection.className = "game-end";
	ARFrame.className = "frame-end";
	submitUI.style.display = "inline";
}

var btnClicked = function(btnName) {
	switch (btnName) {
		case "start":
			startGame();
			break;
		case "pauseReset":
			if (watch.isRunning()) pauseGame();
			else resetGame();
			break;
		case "submitBtn":
			break;
		default:
			console.log("DEFAULT STATEMENT REACHED");
			break;
	}
};

// defines the global game variables
var watch = new Stopwatch();
var game = new arGame();
