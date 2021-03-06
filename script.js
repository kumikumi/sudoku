//a 2d array that contains the text input fields
var grid;

//gather the elements into 2d array for quick and easy access
window.onload = function() {
	grid = Array();
	var rows = document.getElementById("grid").children;
	for (var y = 0; y < 9; y++) {
		grid[y] = Array();
		var columns = rows[y].children;
		for (var x = 0; x < 9; x++) {
			grid[y][x] = columns[x].children[0];
		}
	}
}

function solve() {
	clearMarkers();

	if (hasInvalidInputs()) {
		console.log("does not compute");
		return;
	}
	if (hasConflicts()) {
		console.log("has conflicts");
		return;
	}

	disableGridInputs();

	if (!solveFrom(0, 0)) {
		console.log("could not solve");
	}
}

function clearMarkers() {
	for (var y = 0; y<9; y++) {
		for (var x = 0; x<9; x++) {
			grid[y][x].className = "";
		}
	}
}

function clearGrid() {
	for (var y = 0; y<9; y++) {
		for (var x = 0; x<9; x++) {
			grid[y][x].value = "";
			grid[y][x].className = "";
			grid[y][x].disabled = false;
		}
	}
}

function clearSolution() {
	for (var y = 0; y<9; y++) {
		for (var x = 0; x<9; x++) {
			if (!grid[y][x].provided) {
				grid[y][x].value = "";
				grid[y][x].className = "";
			}
			grid[y][x].disabled = false;
		}
	}
}

function disableGridInputs() {
	for (var y = 0; y<9; y++) {
		for (var x = 0; x<9; x++) {
			grid[y][x].disabled = true;
		}
	}
}

//detects and highlights invalid input values in the grid
function hasInvalidInputs() {
	var hasInvalid = false;
	for (var y = 0; y<9; y++) {
		for (var x = 0; x<9; x++) {
			if (!isValid(grid[y][x].value)) {
				grid[y][x].className = "invalid";
				hasInvalid = true;
			}

			if (grid[y][x].value == "") {
				grid[y][x].provided = false;
				grid[y][x].className = "solution";
			} else {
				grid[y][x].provided = true;
			}
		}
	}
	return hasInvalid;
}

//return true or false depending on whether the given 'value' is valid (ie. a number between 1-9 or an empty string)
function isValid(value) {
	return value === "" || value % 1 == 0 && value >= 1 && value <= 9;
}

//recursive solve function, attempts to solve from (x, y) onwards. returns true if successful and false if unsuccessful.
function solveFrom(x, y) {
	//If we are over the grid already, we can call this solved
	if (y == 9) {
		return true;
	}

	//Figure out the coordinates for the next place
	var next_x;
	var next_y;
	if (x+1 < 9) {
		next_x = x+1;
		next_y = y;
	} else {
		next_x = 0;
		next_y = y+1;
	}

	//If the value for this place has been provided, skip it
	if (grid[y][x].provided) {
		return solveFrom(next_x, next_y);
	}

	//Iterate through numbers that fit here until one that leads to a solution is found
	for (var n = 1; n<=9; n++) {
		if(!numberFitsInPosition(x, y, n)) {
			continue;
		}
		grid[y][x].value = n;
		if (solveFrom(next_x, next_y)) {
			return true;
		}
	}
	
	//If no solution was found, this attempt failed
	grid[y][x].value = "";
	return false;
}

//detects and marks conflicts in grid
function hasConflicts() {
	var conflictsDetected = false;
	for (var y = 0; y<9; y++) {
		for (var x = 0; x<9; x++) {
			if (!numberFitsInPosition(x, y, grid[y][x].value)) {
				grid[y][x].className = "invalid";
				conflictsDetected = true;
			}
		}
	}
	return conflictsDetected;
}

//returns whether a number 'n' fits into position (pos_x, pos_y)
function numberFitsInPosition(pos_x, pos_y, n) {
	//empty string fits in any position
	if (n == "") {
		return true;
	}
	//conflict in row
	for (var x = 0; x<9; x++) {
		if (x == pos_x) {
			continue;
		}
		if (grid[pos_y][x].value == n) {
			return false;
		}
	}
	//conflict in column
	for (var y = 0; y<9; y++) {
		if (y == pos_y) {
			continue;
		}
		if (grid[y][pos_x].value == n) {
			return false;
		}
	}
	//conflict in cell
	var begin_x = cellNumber(pos_x)*3;
	var begin_y = cellNumber(pos_y)*3;
	for (var x = begin_x; x<begin_x+3; x++) {
		for (var y = begin_y; y<begin_y+3; y++) {
			if (x == pos_x && y == pos_y) {
				continue;
			}
			if (grid[y][x].value == n) {
				return false;
			}
		}
	}
	return true;
}

//returns the cell number for a given row or column (indexing starts from 0)
function cellNumber(n) {
	return Math.floor(n/3);
}