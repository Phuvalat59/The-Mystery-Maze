const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tileSize = 30;

// แผนที่เขาวงกต (เหมือนเดิม แต่ปรับขนาดให้พอดีกับ Canvas 300x300)
const maze = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,2,1],
  [1,0,1,0,1,0,1,1,0,1],
  [1,0,1,0,0,0,1,0,0,1],
  [1,1,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,0,1,0,1],
  [1,0,0,0,1,0,0,1,0,1],
  [1,1,1,0,0,0,1,1,0,1],
  [1,1,1,1,1,1,1,1,1,1]
];

let player = { x: 1, y: 1 };

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            let posX = x * tileSize;
            let posY = y * tileSize;

            if (maze[y][x] === 1) {
                // วาดกำแพงแบบมีมิติ (Gradient)
                let wallGrad = ctx.createLinearGradient(posX, posY, posX + tileSize, posY + tileSize);
                wallGrad.addColorStop(0, "#444");
                wallGrad.addColorStop(1, "#111");
                ctx.fillStyle = wallGrad;
                ctx.fillRect(posX, posY, tileSize, tileSize);
                
                // เพิ่มเส้นขอบกำแพงเล็กน้อย
                ctx.strokeStyle = "#555";
                ctx.strokeRect(posX, posY, tileSize, tileSize);

            } else if (maze[y][x] === 2) {
                // วาดทางออกให้ดูเรืองแสง
                ctx.shadowBlur = 15;
                ctx.shadowColor = "#ff0000";
                ctx.fillStyle = "#ff4d4d";
                ctx.beginPath();
                ctx.arc(posX + tileSize/2, posY + tileSize/2, tileSize/3, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0; // reset shadow
            }
        }
    }

    drawPlayer();
}

function drawPlayer() {
    let px = player.x * tileSize + tileSize / 2;
    let py = player.y * tileSize + tileSize / 2;

    // ตัวผู้เล่น (ลูกบอลเรืองแสง)
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00f2fe";
    ctx.fillStyle = "#00f2fe";
    ctx.beginPath();
    ctx.arc(px, py, tileSize / 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;

    // ตรวจสอบขอบเขต Array เพื่อป้องกัน Error
    if (newY >= 0 && newY < maze.length && newX >= 0 && newX < maze[0].length) {
        if (maze[newY][newX] !== 1) {
            player.x = newX;
            player.y = newY;
            
            drawMaze(); // วาดใหม่ทุกครั้งที่ขยับ

            if (maze[newY][newX] === 2) {
                setTimeout(() => {
                    alert("✨ ยินดีด้วย! คุณพิชิต Mystery Maze ได้แล้ว!");
                    player = { x: 1, y: 1 }; // Reset เกม
                    drawMaze();
                }, 100);
            }
        }
    }
}

// ควบคุมด้วยปุ่มลูกศร
document.addEventListener("keydown", (e) => {
    // ป้องกันหน้าจอเลื่อนเวลาเล่นเกม
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }

    if (e.key === "ArrowUp") movePlayer(0, -1);
    if (e.key === "ArrowDown") movePlayer(0, 1);
    if (e.key === "ArrowLeft") movePlayer(-1, 0);
    if (e.key === "ArrowRight") movePlayer(1, 0);
});

// เริ่มวาดครั้งแรก
drawMaze();