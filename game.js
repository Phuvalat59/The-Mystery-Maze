const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tileSize = 30;

// แผนที่เขาวงกต
// 1 = กำแพง, 0 = ทางเดิน, 2 = จุดจบ
const maze = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,2,1],
  [1,0,1,0,1,0,1,0,1,1],
  [1,0,1,0,0,0,1,0,0,1],
  [1,0,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1]
];

let player = { x: 1, y: 1 };

function drawMaze() {
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 1) {
                ctx.fillStyle = "black"; // กำแพง
            } else if (maze[y][x] === 2) {
                ctx.fillStyle = "green"; // ทางออก
            } else {
                ctx.fillStyle = "white"; // ทางเดิน
            }
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }

    // ตัวผู้เล่น
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;

    if (maze[newY][newX] !== 1) {
        player.x = newX;
        player.y = newY;

        if (maze[newY][newX] === 2) {
            alert("🎉 ยินดีด้วย! คุณออกจากเขาวงกตได้แล้ว");
        }
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") movePlayer(0, -1);
    if (e.key === "ArrowDown") movePlayer(0, 1);
    if (e.key === "ArrowLeft") movePlayer(-1, 0);
    if (e.key === "ArrowRight") movePlayer(1, 0);
    drawMaze();
});

drawMaze();
