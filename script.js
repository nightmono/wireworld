
const states = {
    0: "empty",
    1: "head",
    2: "tail",
    3: "conductor"
};
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

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX-rect.left) / cellSize);
    const y = Math.floor((event.clientY-rect.top) / cellSize);

    grid[y][x] = (grid[y][x]+1) % 4;
    drawGrid();
});
