const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const coinsSpan = document.getElementById("coins");
const lvlText = document.getElementById("lvlText");

let tileSize = 20;
let gridSize = 11; 
let maze = [];
let player = { x: 1, y: 1 };
let coinsCount = 0;

// 1. ระบบสร้างเขาวงกตแบบสุ่ม
function createMaze(size) {
    let newMaze = Array(size).fill().map(() => Array(size).fill(1));
    
    function carve(x, y) {
        newMaze[y][x] = 0;
        let directions = [[0, 2], [0, -2], [2, 0], [-2, 0]].sort(() => Math.random() - 0.5);
        
        for (let [dx, dy] of directions) {
            let nx = x + dx, ny = y + dy;
            if (nx > 0 && nx < size - 1 && ny > 0 && ny < size - 1 && newMaze[ny][nx] === 1) {
                newMaze[y + dy / 2][x + dx / 2] = 0;
                carve(nx, ny);
            }
        }
    }
    carve(1, 1);
    newMaze[size - 2][size - 2] = 2; // Exit (ทางออก)

    // 2. เพิ่มเฉพาะ Coins (3)
    for (let i = 0; i < size * 1.5; i++) {
        let rx = Math.floor(Math.random() * size);
        let ry = Math.floor(Math.random() * size);
        // วางเหรียญเฉพาะบนทางเดิน (0) และไม่ใช่จุดเริ่ม
        if (newMaze[ry][rx] === 0 && !(rx === 1 && ry === 1)) {
            newMaze[ry][rx] = 3; 
        }
    }
    return newMaze;
}

function changeLevel(size) {
    gridSize = size;
    canvas.width = gridSize * tileSize;
    canvas.height = gridSize * tileSize;
    
    lvlText.innerText = size === 11 ? "Easy" : size === 21 ? "Medium" : "Hard";
    coinsCount = 0;
    coinsSpan.innerText = coinsCount;
    
    maze = createMaze(gridSize);
    player = { x: 1, y: 1 };
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            let xPos = x * tileSize;
            let yPos = y * tileSize;

            if (maze[y][x] === 1) { // กำแพง
                ctx.fillStyle = "#1e1e2f";
                ctx.fillRect(xPos, yPos, tileSize, tileSize);
                ctx.strokeStyle = "#333";
                ctx.strokeRect(xPos, yPos, tileSize, tileSize);
            } else if (maze[y][x] === 2) { // ทางออก
                ctx.fillStyle = "#ffcc00";
                ctx.shadowBlur = 10; ctx.shadowColor = "gold";
                ctx.fillRect(xPos + 4, yPos + 4, tileSize - 8, tileSize - 8);
                ctx.shadowBlur = 0;
            } else if (maze[y][x] === 3) { // เหรียญ (สีเขียวนีออน)
                ctx.fillStyle = "#00ff88";
                ctx.beginPath();
                ctx.arc(xPos + tileSize/2, yPos + tileSize/2, 4, 0, Math.PI*2);
                ctx.fill();
            }
        }
    }

    // วาดผู้เล่น
    ctx.fillStyle = "#00f2fe";
    ctx.shadowBlur = 10; ctx.shadowColor = "#00f2fe";
    ctx.fillRect(player.x * tileSize + 4, player.y * tileSize + 4, tileSize - 8, tileSize - 8);
    ctx.shadowBlur = 0;
}

function movePlayer(dx, dy) {
    let nx = player.x + dx;
    let ny = player.y + dy;

    if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
        if (maze[ny][nx] !== 1) {
            player.x = nx;
            player.y = ny;

            if (maze[ny][nx] === 2) {
                showModal("VICTORY!", `ยินดีด้วย! คุณหาทางออกพบและเก็บเหรียญได้ ${coinsCount} เหรียญ`);
            } else if (maze[ny][nx] === 3) {
                coinsCount++;
                coinsSpan.innerText = coinsCount;
                maze[ny][nx] = 0; // เก็บแล้วเปลี่ยนเป็นทางเดินปกติ
            }
        }
    }
    draw();
}

function showModal(title, desc) {
    document.getElementById("mTitle").innerText = title;
    document.getElementById("mDesc").innerText = desc;
    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
    changeLevel(gridSize); 
}

window.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }
    if (e.key === "ArrowUp") movePlayer(0, -1);
    if (e.key === "ArrowDown") movePlayer(0, 1);
    if (e.key === "ArrowLeft") movePlayer(-1, 0);
    if (e.key === "ArrowRight") movePlayer(1, 0);
});

changeLevel(11);