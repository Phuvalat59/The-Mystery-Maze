const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tileSize = 30;
let currentLevel = 0;
let player = { x: 1, y: 1 };

// ข้อมูลด่าน (1=กำแพง, 0=ทางเดิน, 2=ทางออก)
const levels = [
    [
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,2,1],
        [1,0,1,0,1,0,1,1,1,1],
        [1,0,1,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1]
    ],
    [
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,1,0,0,0,0,0,0,1],
        [1,0,1,0,1,1,1,1,0,1],
        [1,0,0,0,1,2,0,1,0,1],
        [1,1,1,0,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1]
    ],
    [
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,1,0,0,0,1],
        [1,1,1,1,0,1,0,1,0,1],
        [1,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,1],
        [1,0,1,0,1,1,1,1,1,1],
        [1,0,1,0,1,0,0,0,2,1],
        [1,0,0,0,0,0,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1]
    ]
];

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const maze = levels[currentLevel];

    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            let posX = x * tileSize;
            let posY = y * tileSize;

            if (maze[y][x] === 1) {
                // วาดกำแพงแบบมีมิติ
                let grad = ctx.createLinearGradient(posX, posY, posX+30, posY+30);
                grad.addColorStop(0, "#333");
                grad.addColorStop(1, "#111");
                ctx.fillStyle = grad;
                ctx.fillRect(posX, posY, tileSize, tileSize);
                ctx.strokeStyle = "#444";
                ctx.strokeRect(posX, posY, tileSize, tileSize);
            } else if (maze[y][x] === 2) {
                // ทางออกสีทองเรืองแสง
                ctx.shadowBlur = 15;
                ctx.shadowColor = "#FFD700";
                ctx.fillStyle = "#FFD700";
                ctx.fillRect(posX + 5, posY + 5, tileSize - 10, tileSize - 10);
                ctx.shadowBlur = 0;
            }
        }
    }

    // วาดตัวผู้เล่น
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00f2fe";
    ctx.fillStyle = "#00f2fe";
    ctx.beginPath();
    ctx.arc(player.x * tileSize + tileSize/2, player.y * tileSize + tileSize/2, tileSize/2.8, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function movePlayer(dx, dy) {
    const maze = levels[currentLevel];
    const newX = player.x + dx;
    const newY = player.y + dy;

    if (maze[newY] && maze[newY][newX] !== undefined && maze[newY][newX] !== 1) {
        player.x = newX;
        player.y = newY;

        if (maze[newY][newX] === 2) {
            nextLevel();
        }
    }
    draw();
}

function nextLevel() {
    if (currentLevel < levels.length - 1) {
        currentLevel++;
        player = { x: 1, y: 1 };
        showModal("LEVEL CLEAR! ✨", "เก่งมาก! คุณผ่านด่านที่ " + currentLevel + " แล้ว", "ลุยด่านต่อไป");
    } else {
        currentLevel = 0;
        player = { x: 1, y: 1 };
        showModal("VICTORY! 🏆", "คุณคือเจ้าแห่งเขาวงกต! ชนะครบทุกด่านแล้ว", "เริ่มใหม่อีกครั้ง");
    }
    document.getElementById("levelDisplay").innerText = "Level " + (currentLevel + 1);
}

function showModal(title, message, btnText) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalMessage").innerText = message;
    const modal = document.getElementById("levelModal");
    modal.querySelector("button").innerText = btnText;
    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById("levelModal").style.display = "none";
}

document.addEventListener("keydown", (e) => {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
    if (e.key === "ArrowUp") movePlayer(0, -1);
    if (e.key === "ArrowDown") movePlayer(0, 1);
    if (e.key === "ArrowLeft") movePlayer(-1, 0);
    if (e.key === "ArrowRight") movePlayer(1, 0);
});

// เริ่มต้นเกม
draw();