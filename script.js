const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const message = document.getElementById('message');
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');

let p1Position = { x: 0, y: 0 };
let p2Position = { x: 470, y: 470 };
let p1Hits = 0;
let p2Hits = 0;
let p1Score = 0;
let p2Score = 0;

let p1Moving = { up: false, down: false, left: false, right: false };
let p2Moving = { w: false, s: false, a: false, d: false };

let p1Direction = { x: 0, y: 0 };
let p2Direction = { x: 0, y: 0 };

let p1Bullets = [];
let p2Bullets = [];
const MAX_BULLETS = 5;

function updatePositions() {
    player1.style.left = p1Position.x + 'px';
    player1.style.top = p1Position.y + 'px';
    player2.style.left = p2Position.x + 'px';
    player2.style.top = p2Position.y + 'px';
}

function movePlayers() {
    if (p1Moving.up && p1Position.y > 0) p1Position.y -= 5;
    if (p1Moving.down && p1Position.y < 470) p1Position.y += 5;
    if (p1Moving.left && p1Position.x > 0) p1Position.x -= 5;
    if (p1Moving.right && p1Position.x < 470) p1Position.x += 5;

    if (p2Moving.w && p2Position.y > 0) p2Position.y -= 5;
    if (p2Moving.s && p2Position.y < 470) p2Position.y += 5;
    if (p2Moving.a && p2Position.x > 0) p2Position.x -= 5;
    if (p2Moving.d && p2Position.x < 470) p2Position.x += 5;

    updatePositions();
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            p1Moving.up = true;
            p1Direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            p1Moving.down = true;
            p1Direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            p1Moving.left = true;
            p1Direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            p1Moving.right = true;
            p1Direction = { x: 1, y: 0 };
            break;
        case 'Enter':
            if (p1Bullets.length < MAX_BULLETS) {
                shoot(p1Position, p1Direction, 1);
            }
            break;
        case 'w':
            p2Moving.w = true;
            p2Direction = { x: 0, y: -1 };
            break;
        case 's':
            p2Moving.s = true;
            p2Direction = { x: 0, y: 1 };
            break;
        case 'a':
            p2Moving.a = true;
            p2Direction = { x: -1, y: 0 };
            break;
        case 'd':
            p2Moving.d = true;
            p2Direction = { x: 1, y: 0 };
            break;
        case ' ':
            if (p2Bullets.length < MAX_BULLETS) {
                shoot(p2Position, p2Direction, 2);
            }
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            p1Moving.up = false;
            break;
        case 'ArrowDown':
            p1Moving.down = false;
            break;
        case 'ArrowLeft':
            p1Moving.left = false;
            break;
        case 'ArrowRight':
            p1Moving.right = false;
            break;
        case 'w':
            p2Moving.w = false;
            break;
        case 's':
            p2Moving.s = false;
            break;
        case 'a':
            p2Moving.a = false;
            break;
        case 'd':
            p2Moving.d = false;
            break;
    }
});

function shoot(position, direction, shooter) {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = position.x + 12.5 + 'px';
    bullet.style.top = position.y + 12.5 + 'px';

    // Define a cor da bala com base no jogador que disparou
    bullet.style.backgroundColor = shooter === 1 ? 'red' : 'blue';

    document.getElementById('gameArea').appendChild(bullet);
    (shooter === 1 ? p1Bullets : p2Bullets).push(bullet);

    const length = Math.sqrt(direction.x ** 2 + direction.y ** 2);
    if (length !== 0) {
        direction.x /= length;
        direction.y /= length;
    }

    const moveBullet = setInterval(() => {
        bullet.style.left = (parseInt(bullet.style.left) + direction.x * 7) + 'px';
        bullet.style.top = (parseInt(bullet.style.top) + direction.y * 7) + 'px';

        if (checkCollision(bullet, player2) && shooter === 1) {
            p2Hits++;
            p1Score++;
            bullet.remove();
            checkWin();
            clearInterval(moveBullet);
            removeBullet(bullet, shooter);
        } else if (checkCollision(bullet, player1) && shooter === 2) {
            p1Hits++;
            p2Score++;
            bullet.remove();
            checkWin();
            clearInterval(moveBullet);
            removeBullet(bullet, shooter);
        }

        if (parseInt(bullet.style.left) > 500 || parseInt(bullet.style.left) < 0 ||
            parseInt(bullet.style.top) > 500 || parseInt(bullet.style.top) < 0) {
            clearInterval(moveBullet);
            bullet.remove();
            removeBullet(bullet, shooter);
        }
    }, 30);

    setTimeout(() => {
        bullet.remove();
        clearInterval(moveBullet);
        removeBullet(bullet, shooter);
    }, 5000);
}

function removeBullet(bullet, shooter) {
    const bulletArray = shooter === 1 ? p1Bullets : p2Bullets;
    const index = bulletArray.indexOf(bullet);
    if (index > -1) {
        bulletArray.splice(index, 1);
    }
}

function checkCollision(bullet, player) {
    const bulletRect = bullet.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    return !(bulletRect.right < playerRect.left || 
             bulletRect.left > playerRect.right || 
             bulletRect.bottom < playerRect.top || 
             bulletRect.top > playerRect.bottom);
}

function checkWin() {
    if (p1Hits >= 3) {
        message.textContent = 'WIN (Jogador 2)';
        p2Score++;
        updateScores();
        resetGame();
    } else if (p2Hits >= 3) {
        message.textContent = 'WIN (Jogador 1)';
        p1Score++;
        updateScores();
        resetGame();
    }
}

function updateScores() {
    score1.textContent = p1Score;
    score2.textContent = p2Score;
}

function resetGame() {
    p1Position = { x: 0, y: 0 };
    p2Position = { x: 470, y: 470 };
    p1Hits = 0;
    p2Hits = 0;
    p1Bullets = [];
    p2Bullets = [];
    updatePositions();
    setTimeout(() => {
        message.textContent = '';
    }, 2000);
}

// Chama movePlayers a cada 30ms
setInterval(movePlayers, 30);
