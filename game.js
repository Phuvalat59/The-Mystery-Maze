const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const coinDisplay = document.getElementById("coinCount");

let tileSize = 20;
let maze = [];
let player = { x: 1, y: 1 };
let coins = 0;
let gridSize = 21;

// 1. ระบบสร้างเขาวงกตแบบสุ่ม (Recursive Backtracking)
function generateMaze(size) {
    let m = Array(size).fill().map(() => Array(size).fill(1));
    
    function walk(x, y) {
        m[y][x] = 0;
        let dirs = [[0,2],[0,-2],[2,0],[-2,0]].sort(() => Math.random() - 0.5);
        
        for (let [dx, dy] of dirs) {
            let nx = x + dx, ny = y + dy;
            if (nx > 0 && nx < size-1 && ny > 0 && ny < size-1 && m[ny][nx] === 1) {
                m[y + dy/2][x + dx/2] = 0;
                walk(nx, ny);
            }
        }
    }
    walk(1, 1);
    m[size-2][size-2] = 2; // Exit

    // เพิ่ม Objects (3 = Coin, 4 = Trap)
    for(let i=0; i < size*1.5; i++) {
        let rx = Math.floor(Math.random() * size);
        let ry = Math.floor(Math.random() * size);
        if(m[ry][rx] === 0 && !(rx===1 && ry===1)) {
            m[ry][rx] = (Math.random() > 0.3) ? 3 : 4;
        }
    }
    return m;
}

function startGame(size) {
    gridSize = size;
    canvas.width = canvas.height = size * tileSize;
    maze = generateMaze(size);
    player = { x: 1, y: 1 };
    coins = 0;
    coinDisplay.innerText = coins;
    document.getElementById("lvlName").innerText = size < 15 ? "Easy" : size < 25 ? "Medium" : "Hard";
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            let px = x * tileSize, py = y * tileSize;
            if (maze[y][x] === 1) {
                ctx.fillStyle = "#2c3e50";
                ctx.fillRect(px, py, tileSize, tileSize);
            } else if (maze[y][x] === 2) {
                ctx.fillStyle = "#FFD700"; // Exit
                ctx.shadowBlur = 10; ctx.shadowColor = "gold";
                ctx.fillRect(px+2, py+2, tileSize-4, tileSize-4);
                ctx.shadowBlur = 0;
            } else if (maze[y][x] === 3) {
                ctx.fillStyle = "#ff0"; // Coin
                ctx.beginPath(); ctx.arc(px+tileSize/2, py+tileSize/2, 4, 0, Math.PI*2); ctx.fill();
            } else if (maze[y][x] === 4) {
                ctx.fillStyle = "#ff4d4d"; // Trap
                ctx.beginPath(); ctx.moveTo(px+2, py+tileSize-2); ctx.lineTo(px+tileSize/2, py+2); ctx.lineTo(px+tileSize-2, py+tileSize-2); ctx.fill();
            }
        }
    }
    // Player
    ctx.fillStyle = "#00f2fe";
    ctx.shadowBlur = 8; ctx.shadowColor = "#00f2fe";
    ctx.fillRect(player.x*tileSize+4, player.y*tileSize+4, tileSize-8, tileSize-8);
    ctx.shadowBlur = 0;
}

function movePlayer(dx, dy) {
    let nx = player.x + dx, ny = player.y + dy;
    if (maze[ny] && maze[ny][nx] !== undefined && maze[ny][nx] !== 1) {
        player.x = nx; player.y = ny;
        
        if (maze[ny][nx] === 2) {
            showModal("VICTORY!", `คุณทำสำเร็จ! เก็บเหรียญได้: ${coins} เหรียญ`);
        } else if (maze[ny][nx] === 3) {
            coins++; maze[ny][nx] = 0; coinDisplay.innerText = coins;
        } else if (maze[ny][nx] === 4) {
            player = { x: 1, y: 1 }; // Reset position on trap
            alert("โดนกับดัก! เริ่มใหม่นะ");
        }
    }
    draw();
}

function showModal(title, msg) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalMessage").innerText = msg;
    document.getElementById("levelModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("levelModal").style.display = "none";
    startGame(gridSize);
}

window.addEventListener("keydown", e => {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
    if (e.key === "ArrowUp") movePlayer(0, -1);
    if (e.key === "ArrowDown") movePlayer(0, 1);
    if (e.key === "ArrowLeft") movePlayer(-1, 0);
    if (e.key === "ArrowRight") movePlayer(1, 0);
});

// Start initial game
startGame(21);