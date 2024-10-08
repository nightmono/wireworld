const directions = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
];
const stateColors = {
    0: "black",
    1: "#2A7BDE",
    2: "#F66151",
    3: "#E9AD0C"
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const cellSize = 20;
const gridWidth = Math.ceil(window.screen.availWidth / cellSize);
const gridHeight = Math.ceil(window.screen.availHeight / cellSize);

canvas.height = cellSize * gridHeight;
canvas.width = cellSize * gridWidth;

// To avoid shallow copies, make an array of undefined and map each undefined
// to its own row
let grid = Array(gridHeight).fill().map(() => Array(gridWidth).fill(0));
drawGrid();

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#171421";
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            ctx.fillStyle = stateColors[grid[y][x]];
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function clearGrid() {
    grid = Array(gridHeight).fill().map(() => Array(gridWidth).fill(0));
    drawGrid();
}

function tick() {
    let nextGen = Array(gridHeight).fill().map(() => Array(gridWidth).fill(0));

    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
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

let ticking = false
let tickingIntervalID = null;

function toggleTicking() {
    const togglePath = document.getElementById("togglePath");
    if (ticking) {
        clearInterval(tickingIntervalID);
        ticking = false;
        togglePath.setAttribute("d", "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z");
    } else {
        tickingIntervalID = setInterval(tick, 100);
        ticking = true;
        togglePath.setAttribute("d", "M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z");
    }
}

function tickConductor(cellX, cellY, nextGen) {
    let electronNeighbours = 0;
    for (let i = 0; i < directions.length; i++) {
        x = cellX + directions[i][0];
        y = cellY + directions[i][1];
        if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) {
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
changeBrush(3);

function changeBrush(newBrush) {
    for (let i = 0; i < 4; i++) {
        document.getElementById(`selector${i}`).style.borderRadius = "0px";
    }
    currentBrush = newBrush;
    document.getElementById(`selector${newBrush}`).style.borderRadius = "8px";
}

function mouseToPos(event) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    return [x, y];
}

function drawCell(event) {
    const [x, y] = mouseToPos(event);
    grid[y][x] = currentBrush;
    drawGrid();
}

let mouseDown = false;

canvas.addEventListener("mousedown", (event) => {
    mouseDown = true;
    drawCell(event);
});
canvas.addEventListener("mouseup", (event) => { mouseDown = false; });
canvas.addEventListener("mousemove", (event) => {
    if (event.button == 0 && mouseDown) {
        drawCell(event);
    } else {
        // Draw placement preview
        // TODO: Broken when ticking is toggled
        drawGrid();
        const [x, y] = mouseToPos(event); 
        ctx.fillStyle = stateColors[currentBrush];
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
});
