const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 新增提示弹窗元素
const gameInstructions = document.createElement('div');
gameInstructions.style.position = 'absolute';
gameInstructions.style.top = '50%';
gameInstructions.style.left = '50%';
gameInstructions.style.transform = 'translate(-50%, -50%)';
gameInstructions.style.backgroundColor = 'white';
gameInstructions.style.padding = '20px';
gameInstructions.style.border = '1px solid black';
gameInstructions.style.zIndex = '100';
// 修改游戏说明弹窗里的按键说明
gameInstructions.innerHTML = `
    <h2>贪吃蛇游戏玩法说明</h2>
    <p>游戏目标：控制贪吃蛇在地图上移动，吃到红色的食物，每吃到一次食物，蛇的身体会变长，分数会增加。</p>
    <p>按键功能：</p>
    <ul>
        <li>方向键（上、下、左、右）：P1 玩家控制蛇的移动方向。</li>
        <li>W、S、A、D 键：P2 玩家控制蛇的移动方向。</li>
        <li>空格键：按下时 P2 蛇会加速移动。</li>
        <li>Shift 键：按下时 P1 蛇会加速移动。</li>
        <li>g 键：开始游戏。</li>
        <li>r 键：进入双人模式，并在控制台输出“已进入双人模式”提示</li>
    </ul>
    <p>注意：蛇撞到边界或自己的身体时，游戏结束。</p>
`;
document.body.appendChild(gameInstructions);

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake1 = [{ x: 10, y: 10 }];
let snake2 = [{ x: 20, y: 20 }];
let food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
let direction1 = 'right';
let direction2 = 'left';
let score1 = 0;
let score2 = 0;
let gameStarted = false; // 新增标志，控制游戏是否开始
let gamePaused = false; // 新增标志，控制游戏是否暂停
let baseSpeed = 100; // 基础速度
let currentSpeed = baseSpeed; // 当前速度
let isTwoPlayerMode = false; // 新增标志，控制是否为双人模式

function draw() {
    ctx.fillStyle = isTwoPlayerMode ? '#808080' : '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制 P1 的蛇
    ctx.fillStyle = 'green';
    snake1.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // 绘制 P2 的蛇
    if (isTwoPlayerMode) {
        ctx.fillStyle = 'blue';
        snake2.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
    }

    // 绘制食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // 显示分数
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`P1 分数: ${score1}`, 10, 30);
    if (isTwoPlayerMode) {
        ctx.fillText(`P2 分数: ${score2}`, 10, 60);
    }
}

// 修改游戏说明弹窗里的按键说明
gameInstructions.innerHTML = `
    <h2>贪吃蛇游戏玩法说明</h2>
    <p>游戏目标：控制贪吃蛇在地图上移动，吃到红色的食物，每吃到一次食物，蛇的身体会变长，分数会增加。</p>
    <p>按键功能：</p>
    <ul>
        <li>方向键（上、下、左、右）：P1 玩家控制蛇的移动方向。</li>
        <li>W、S、A、D 键：P2 玩家控制蛇的移动方向。</li>
        <li>空格键：按下时 P2 蛇会加速移动。</li>
        <li>Shift 键：按下时 P1 蛇会加速移动。</li>
        <li>g 键：开始游戏。</li>
        <li>r 键：进入双人模式，并在控制台输出“已进入双人模式”提示</li>
    </ul>
    <p>注意：蛇撞到边界或自己的身体时，游戏结束。</p>
`;

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction1 !== 'down') {
                direction1 = 'up';
            }
            break;
        case 'ArrowDown':
            if (direction1 !== 'up') {
                direction1 = 'down';
            }
            break;
        case 'ArrowLeft':
            if (direction1 !== 'right') {
                direction1 = 'left';
            }
            break;
        case 'ArrowRight':
            if (direction1 !== 'left') {
                direction1 = 'right';
            }
            break;
        case 'w':
            if (isTwoPlayerMode && direction2 !== 'down') {
                direction2 = 'up';
            }
            break;
        case 's':
            if (isTwoPlayerMode && direction2 !== 'up') {
                direction2 = 'down';
            }
            break;
        case 'a':
            if (isTwoPlayerMode && direction2 !== 'right') {
                direction2 = 'left';
            }
            break;
        case 'd':
            if (isTwoPlayerMode && direction2 !== 'left') {
                direction2 = 'right';
            }
            break;
        case ' ': // 空格键 P2 蛇加速
            if (isTwoPlayerMode) {
                currentSpeed = baseSpeed / 2;
            }
            break;
        case 'Shift': // Shift 键 P1 蛇加速
            if (gameStarted) {
                currentSpeed = baseSpeed / 2;
            }
            break;
        case 'g': // g 键开始游戏
            if (!gameStarted) {
                gameStarted = true;
                // 游戏开始后移除提示弹窗
                document.body.removeChild(gameInstructions);
                gameLoop();
            }
            break;
        case 'r': // r 键进入双人模式
            if (!isTwoPlayerMode) {
                isTwoPlayerMode = true;
                // 确保 P2 蛇在进入双人模式时正确初始化
                snake2 = [{ x: 20, y: 20 }]; 
                direction2 = 'left';
                console.log('已进入双人模式');
            }
            break;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === ' ' || event.key === 'Shift') { // 松开空格键或 Shift 键恢复正常速度
        currentSpeed = baseSpeed;
    }
});

// 创建自定义提示框元素
const customAlert = document.createElement('div');
customAlert.style.display = 'none';
customAlert.style.position = 'absolute';
customAlert.style.top = '50%';
customAlert.style.left = '50%';
customAlert.style.transform = 'translate(-50%, -50%)';
customAlert.style.backgroundColor = 'white';
customAlert.style.padding = '20px';
customAlert.style.border = '1px solid black';
customAlert.style.zIndex = '1000';
document.body.appendChild(customAlert);

// 创建关闭按钮
const closeButton = document.createElement('button');
closeButton.textContent = '关闭';
closeButton.addEventListener('click', () => {
    customAlert.style.display = 'none';
});
customAlert.appendChild(closeButton);

// 新增标志位，记录玩家是否被淘汰
let player1Eliminated = false;
let player2Eliminated = false;

function update() {
    if (gamePaused) return;

    // 如果两个玩家都被淘汰，游戏结束
    if (isTwoPlayerMode && player1Eliminated && player2Eliminated) {
        alert(`游戏结束！P1 分数: ${score1}，P2 分数: ${score2}`);
        location.reload();
        return;
    }

    // 单玩家模式下，如果玩家被淘汰，游戏结束
    if (!isTwoPlayerMode && player1Eliminated) {
        alert(`游戏结束！P1 分数: ${score1}`);
        location.reload();
        return;
    }

    function updateSnake(snake, direction, score, playerIndex) {
        if ((playerIndex === 1 && player1Eliminated) || (playerIndex === 2 && player2Eliminated)) {
            return score;
        }

        const head = { ...snake[0] };
        switch (direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }

        // 检查是否吃到食物
        if (head.x === food.x && head.y === food.y) {
            score++;
            food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
        } else {
            snake.pop();
        }

        // 检查是否撞到边界或自己
        const isGameOver = head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount ||
            snake.some((segment, index) => index > 0 && segment.x === head.x && segment.y === head.y);

        if (isGameOver) {
            if (playerIndex === 1) {
                player1Eliminated = true;
            } else {
                player2Eliminated = true;
            }
            return score;
        }

        snake.unshift(head);
        return score;
    }

    if (!player1Eliminated) {
        score1 = updateSnake(snake1, direction1, score1, 1);
    }
    if (isTwoPlayerMode && !player2Eliminated) {
        score2 = updateSnake(snake2, direction2, score2, 2);
    }
}

function gameLoop() {
    if (gameStarted) {
        update();
        draw();
        setTimeout(gameLoop, currentSpeed);
    }
}

// 移除原有的自动启动游戏循环
// gameLoop();