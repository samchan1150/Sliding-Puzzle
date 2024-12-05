// script.js
document.getElementById('start-game').addEventListener('click', startGame);

function startGame() {
    const gridSizeInput = document.getElementById('grid-size');
    let gridSize = parseInt(gridSizeInput.value);
    if (isNaN(gridSize) || gridSize < 3 || gridSize > 5) {
        alert('Please enter a grid size between 3 and 5.');
        return;
    }
    createPuzzle(gridSize);
}

function createPuzzle(size) {
    const puzzleContainer = document.getElementById('puzzle-container');
    puzzleContainer.innerHTML = ''; // Clear any existing tiles

    puzzleContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    puzzleContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    // Generate tile numbers from 1 to size*size - 1
    let tileNumbers = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
    tileNumbers.push(0); // 0 will represent the empty space

    // Shuffle the tiles until we get a solvable puzzle
    do {
        shuffleArray(tileNumbers);
    } while (!isSolvable(tileNumbers, size));

    // Create tile elements
    tileNumbers.forEach((number, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        if (number === 0) {
            tile.classList.add('empty');
        } else {
            tile.textContent = number;
            tile.addEventListener('click', () => moveTile(index, size));
        }
        puzzleContainer.appendChild(tile);
    });
}

function shuffleArray(array) {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function moveTile(index, size) {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const emptyIndex = tiles.findIndex(tile => tile.classList.contains('empty'));

    if (isAdjacent(index, emptyIndex, size)) {
        // Swap the clicked tile with the empty tile
        swapTiles(index, emptyIndex);
        if (checkWin(tiles, size)) {
            setTimeout(() => alert('Congratulations! You solved the puzzle!'), 100);
        }
    }
}

function isAdjacent(index1, index2, size) {
    const x1 = index1 % size;
    const y1 = Math.floor(index1 / size);
    const x2 = index2 % size;
    const y2 = Math.floor(index2 / size);

    return (
        (x1 === x2 && Math.abs(y1 - y2) === 1) ||
        (y1 === y2 && Math.abs(x1 - x2) === 1)
    );
}

function swapTiles(index1, index2) {
    const tiles = document.querySelectorAll('.tile');
    const tile1 = tiles[index1];
    const tile2 = tiles[index2];

    // Swap text content and classes
    [tile1.textContent, tile2.textContent] = [tile2.textContent, tile1.textContent];
    tile1.classList.toggle('empty');
    tile2.classList.toggle('empty');

    // Update event listeners
    if (tile1.classList.contains('empty')) {
        tile1.removeEventListener('click', moveTile);
        tile2.addEventListener('click', () => moveTile(index2, Math.sqrt(tiles.length)));
    } else {
        tile1.addEventListener('click', () => moveTile(index1, Math.sqrt(tiles.length)));
        tile2.removeEventListener('click', moveTile);
    }
}

function checkWin(tiles, size) {
    for (let i = 0; i < tiles.length - 1; i++) {
        const tileNumber = parseInt(tiles[i].textContent);
        if (tileNumber !== i + 1) {
            return false;
        }
    }
    return true;
}

function isSolvable(tileNumbers, size) {
    const inversions = countInversions(tileNumbers);
    if (size % 2 !== 0) {
        // If grid size is odd, puzzle is solvable if number of inversions is even
        return inversions % 2 === 0;
    } else {
        // If grid size is even, puzzle is solvable if:
        // - the blank is on an even row counting from the bottom and inversions is odd
        // - the blank is on an odd row counting from the bottom and inversions is even
        const blankRowFromBottom = size - Math.floor(tileNumbers.indexOf(0) / size);
        if (blankRowFromBottom % 2 === 0) {
            return inversions % 2 !== 0;
        } else {
            return inversions % 2 === 0;
        }
    }
}

function countInversions(array) {
    const arr = array.slice();
    arr.splice(arr.indexOf(0), 1); // Remove the empty tile (0)
    let inversions = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) inversions++;
        }
    }
    return inversions;
}
