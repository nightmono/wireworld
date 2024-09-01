const directions = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
];
const stateColors = {
    0: "black",
    1: "blue",
    2: "red",
    3: "yellow"
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const cellSize = 20;
const gridSize = 40;

canvas.height = cellSize * gridSize;
canvas.width = cellSize * gridSize;

// To avoid shallow copies, make an array of undefined and map each undefined
// to its own row
let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
drawGrid();

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "grey";
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            ctx.fillStyle = stateColors[grid[y][x]];
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function tick() {
    let width = grid[0].length;
    let height = grid.length;
    let nextGen = Array(height).fill().map(() => Array(width).fill(0));

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cellState = grid[y][x];
            if (cellState == 1) {
                nextGen[y][x] = 2;
            } else if (cellState == 2) {
                nextGen[y][x] = 3;
            } else if (cellState == 3) {
                tickConductor(x, y, nextGen);
            }
        }
    }

    grid = nextGen;
    drawGrid();
}

function tickConductor(cellX, cellY, nextGen) {
    let electronNeighbours = 0;
    for (let i = 0; i < directions.length; i++) {
        x = cellX + directions[i][0];
        y = cellY + directions[i][1];
        if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
            continue;
        } else if (grid[y][x] == 1) {
            electronNeighbours++;
        }
    }

    if (electronNeighbours == 1 || electronNeighbours == 2) {
        nextGen[cellY][cellX] = 1;
    } else {
        nextGen[cellY][cellX] = 3;
    }
}

let currentBrush = 3;

function changeBrush(newBrush) {
    currentBrush = newBrush;
}

let mouseDown = false;

canvas.addEventListener("mousedown", (event) => {mouseDown = true;});
canvas.addEventListener("mouseup", (event) => {mouseDown = false;});
canvas.addEventListener("mousemove", (event) => {
    if (event.button == 0 && mouseDown) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / cellSize);
        const y = Math.floor((event.clientY - rect.top) / cellSize);

        grid[y][x] = currentBrush;
        drawGrid();
    }
});
